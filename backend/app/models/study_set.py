from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from ..database import Base

class StudySet(Base):
    __tablename__ = "study_sets"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    progress = Column(Integer, default=0)

    user = relationship("User", back_populates="study_sets")
    study_histories = relationship("StudyHistory", back_populates="study_set")
    flashcards = relationship("Flashcard", back_populates="study_set", cascade="all, delete-orphan")

class Flashcard(Base):
    __tablename__ = "flashcards"

    id = Column(Integer, primary_key=True, index=True)
    front = Column(String, nullable=False)
    back = Column(String, nullable=False)
    study_set_id = Column(Integer, ForeignKey("study_sets.id"), nullable=False)

    study_set = relationship("StudySet", back_populates="flashcards")