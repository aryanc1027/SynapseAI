from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models.user import User
from ..schemas.user import UserCreate
from ..utils.auth import get_password_hash

router = APIRouter(
    prefix="/api/users",
    tags=["users"]
)

@router.post("")
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    # Check if user exists
    db_user = db.query(User).filter(
        (User.username == user.username) | (User.email == user.email)
    ).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username or email already registered")
    
    # Create new user
    hashed_pw = get_password_hash(user.password)
    new_user = User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_pw
    )
    
    try:
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        return {"id": new_user.id, "username": new_user.username, "email": new_user.email}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

