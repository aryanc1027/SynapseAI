from sqlalchemy import Column, Integer, String, ForeignKey, Float, DateTime
from sqlalchemy.orm import relationship
from ...database import Base
from datetime import datetime

class StudyHistory(Base):
    __tablename__ = "study_histories"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    study_set_id = Column(Integer, ForeignKey("study_sets.id"), nullable=False)
    score = Column(Float, nullable=False)
    completed_at = Column(DateTime, default=datetime.utcnow)
    user = relationship("User", back_populates="study_histories")
    study_set = relationship("StudySet", back_populates="study_histories")

    __table_args__ = {"extend_existing": True}