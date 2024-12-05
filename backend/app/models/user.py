from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from ..database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)  
    hashed_password = Column(String)
    
    
    study_sets = relationship("StudySet", back_populates="user")
    study_histories = relationship("StudyHistory", back_populates="user")
