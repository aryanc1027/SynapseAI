from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from ..database import Base

class StudySet(Base):
    __tablename__ = "study_sets"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    description = Column(String)
    user_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="study_sets")
    study_histories = relationship("StudyHistory", back_populates="study_set")