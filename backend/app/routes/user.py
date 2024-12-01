from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from ...database import db_session
from ..models.user import User
from ..utils import hash_password, verify_password
from pydantic import BaseModel

router = APIRouter()

class UserCreate(BaseModel):
    username: str
    password: str

@router.post("/register")
def register_user(user: UserCreate, db: Session = Depends(db_session)):
    hashed_pw = hash_password(user.password)
    new_user = User(username=user.username, hashed_password=hashed_pw)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "User created successfully"}

class UserLogin(BaseModel):
    username: str
    password: str

@router.post("/login")
def login_user(user: UserLogin, db: Session = Depends(db_session)):
    db_user = db.query(User).filter(User.username == user.username).first()
    if not db_user or not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=400, detail="Invalid credentials")
    return {"message": "Login successful", "user_id": db_user.id}
