from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ...database import db_session
from ..models.study_set import StudySet
from ..models.study_history import StudyHistory
from pydantic import BaseModel

router = APIRouter()

class StudySetCreate(BaseModel):
    title: str
    description: str
    user_id: int

@router.post("/study_sets")
def create_study_set(study_set: StudySetCreate, db: Session = Depends(db_session)):
    new_set = StudySet(**study_set.dict())
    db.add(new_set)
    db.commit()
    db.refresh(new_set)
    return new_set

class StudyHistoryCreate(BaseModel):
    user_id: int
    study_set_id: int
    score: float

@router.post("/study_histories")
def log_study_history(history: StudyHistoryCreate, db: Session = Depends(db_session)):
    new_history = StudyHistory(**history.dict())
    db.add(new_history)
    db.commit()
    db.refresh(new_history)
    return new_history