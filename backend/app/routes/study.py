from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from datetime import datetime, timedelta
from ..database import get_db
from ..models.study_set import Flashcard, StudySet
from ..models.study_history import StudyHistory
from ..models.user import User
from pydantic import BaseModel
from ..schemas.study_set import FlashcardCreate, FlashcardResponse

router = APIRouter(
    prefix="/api/study",
    tags=["study"]
)

class StudySetBase(BaseModel):
    title: str
    description: str

class FlashcardCreate(BaseModel):
    front: str
    back: str

class StudySetCreate(BaseModel):
    title: str
    description: str
    user_id: int
    flashcards: List[FlashcardCreate] 
    progress: int = 0  


class StudySetUpdate(StudySetBase):
    pass

class StudySetResponse(StudySetBase):
    id: int
    user_id: int
    created_at: datetime
    flashcards: List[FlashcardResponse]
    progress: int  

    class Config:
        from_attributes = True
        
class StudyHistoryStats(BaseModel):
    total_sessions: int
    average_score: float
    best_score: float
    recent_improvement: float 

@router.get("/users/{user_id}/study_sets", response_model=List[StudySetResponse])
def get_user_study_sets(user_id: int, db: Session = Depends(get_db)):
    """Get all study sets for a specific user"""
    study_sets = db.query(StudySet).filter(StudySet.user_id == user_id).all()
    if not study_sets:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No study sets found for this user"
        )
    return study_sets

@router.get("/study_sets/{study_set_id}", response_model=StudySetResponse)
def get_study_set(study_set_id: int, db: Session = Depends(get_db)):
    """Get a specific study set by ID"""
    study_set = db.query(StudySet).filter(StudySet.id == study_set_id).first()
    if not study_set:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Study set not found"
        )
    return study_set

@router.get("/users/{user_id}/study_history")
def get_user_study_history(
    user_id: int, 
    time_period: Optional[str] = "all",
    db: Session = Depends(get_db)
):
    """Get study history with optional time filtering"""
    query = db.query(StudyHistory).filter(StudyHistory.user_id == user_id)
    
    if time_period == "week":
        week_ago = datetime.utcnow() - timedelta(days=7)
        query = query.filter(StudyHistory.completed_at >= week_ago)
    elif time_period == "month":
        month_ago = datetime.utcnow() - timedelta(days=30)
        query = query.filter(StudyHistory.completed_at >= month_ago)
    
    history = query.order_by(StudyHistory.completed_at.desc()).all()
    return history

@router.get("/users/{user_id}/study_stats")
def get_user_study_stats(user_id: int, db: Session = Depends(get_db)):
    """Get comprehensive study statistics for a user"""
    stats = db.query(
        func.count(StudyHistory.id).label('total_sessions'),
        func.avg(StudyHistory.score).label('average_score'),
        func.max(StudyHistory.score).label('best_score')
    ).filter(StudyHistory.user_id == user_id).first()

    recent_scores = db.query(StudyHistory.score)\
        .filter(StudyHistory.user_id == user_id)\
        .order_by(StudyHistory.completed_at.desc())\
        .limit(2)\
        .all()

    improvement = 0
    if len(recent_scores) >= 2:
        improvement = recent_scores[0][0] - recent_scores[1][0]

    return {
        "total_sessions": stats[0],
        "average_score": float(stats[1]) if stats[1] else 0,
        "best_score": float(stats[2]) if stats[2] else 0,
        "recent_improvement": improvement,
        "total_study_sets": db.query(StudySet)\
            .filter(StudySet.user_id == user_id)\
            .count()
    }

@router.put("/study_sets/{study_set_id}", response_model=StudySetResponse)
def update_study_set(
    study_set_id: int,
    study_set_update: StudySetUpdate,
    db: Session = Depends(get_db)
):
    """Update a study set's information"""
    db_study_set = db.query(StudySet).filter(StudySet.id == study_set_id).first()
    if not db_study_set:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Study set not found"
        )
    
    for key, value in study_set_update.dict().items():
        setattr(db_study_set, key, value)
    
    db.commit()
    db.refresh(db_study_set)
    return db_study_set

@router.get("/users/{user_id}/progress")
def get_user_progress(user_id: int, db: Session = Depends(get_db)):
    """Get user's learning progress over time"""
    weekly_progress = db.query(
        func.date_trunc('week', StudyHistory.completed_at).label('week'),
        func.avg(StudyHistory.score).label('average_score')
    ).filter(StudyHistory.user_id == user_id)\
     .group_by(func.date_trunc('week', StudyHistory.completed_at))\
     .order_by(func.date_trunc('week', StudyHistory.completed_at))\
     .all()

    return {
        "weekly_progress": [
            {
                "week": week.strftime("%Y-%m-%d"),
                "average_score": float(avg)
            }
            for week, avg in weekly_progress
        ]
    }

class StudyHistoryCreate(BaseModel):
    user_id: int
    study_set_id: int
    score: float

@router.post("/study_histories")
def log_study_history(history: StudyHistoryCreate, db: Session = Depends(get_db)):
    new_history = StudyHistory(**history.dict())
    db.add(new_history)
    db.commit()
    db.refresh(new_history)
    return new_history

@router.post("/study_sets")
def create_study_set(study_set: StudySetCreate, db: Session = Depends(get_db)):
    new_set = StudySet(**study_set.dict())
    db.add(new_set)
    db.commit()
    db.refresh(new_set)
    return new_set

@router.get("/study-sets/{user_id}", response_model=List[StudySetResponse])
def get_study_sets(user_id: int, db: Session = Depends(get_db)):
    study_sets = db.query(StudySet).filter(StudySet.user_id == user_id).all()
    return study_sets

@router.get("/study-history/{user_id}", response_model=List[StudyHistoryStats])
def get_study_history(user_id: int, db: Session = Depends(get_db)):
    study_histories = (
        db.query(StudyHistory)
        .filter(StudyHistory.user_id == user_id)
        .all()
    )
    return study_histories

class ProgressUpdate(BaseModel):
    progress: int

@router.put("/progress/{study_set_id}")
def update_study_set_progress(
    study_set_id: int,
    progress_update: ProgressUpdate,
    db: Session = Depends(get_db)
):
    study_set = db.query(StudySet).filter(StudySet.id == study_set_id).first()

    if not study_set:
        raise HTTPException(status_code=404, detail="Study set not found")

    study_set.progress = progress_update.progress
    db.commit()
    db.refresh(study_set)  

    return {"message": "Progress updated successfully", "study_set": study_set}

@router.post("/users/{user_id}/study_sets", response_model=StudySetResponse)
def create_study_set(
    user_id: int,
    study_set_data: StudySetCreate,
    db: Session = Depends(get_db),
):
    """Create a study set with associated flashcards for a specific user."""
    new_study_set = StudySet(
        title=study_set_data.title,
        description=study_set_data.description,
        user_id=user_id,
        progress=study_set_data.progress   
    )
    print(study_set_data)
    new_study_set.flashcards = [
        Flashcard(front=flashcard.front, back=flashcard.back)
       
        for flashcard in study_set_data.flashcards  
    ]
   


    db.add(new_study_set)
    db.commit()
    db.refresh(new_study_set)

    return new_study_set