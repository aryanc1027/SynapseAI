from pydantic import BaseModel
from datetime import datetime

class StudyHistoryBase(BaseModel):
    user_id: int
    study_set_id: int
    score: float

class StudyHistoryCreate(StudyHistoryBase):
    pass

class StudyHistory(StudyHistoryBase):
    id: int
    completed_at: datetime
    
    class Config:
        from_attributes = True