from datetime import datetime
from pydantic import BaseModel
from typing import List

class FlashcardBase(BaseModel):
    front: str
    back: str


class FlashcardResponse(FlashcardBase):
    id: int

    class Config:
        from_attributes = True

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
    flashcards: List[FlashcardCreate]  # Include flashcards when creating a study set
    progress: int = 0  # Default progress value

class StudySetResponse(StudySetBase):
    id: int
    user_id: int
    created_at: datetime
    flashcards: List[FlashcardResponse]

    class Config:
        from_attributes = True
