from pydantic import BaseModel
from typing import Optional

class StudySetBase(BaseModel):
    user_id: int

class StudySetCreate(StudySetBase):
    pass

class StudySet(StudySetBase):
    id: int
    
    class Config:
        from_attributes = True