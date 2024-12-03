from datetime import datetime
from pydantic import BaseModel
from typing import List

class FlashcardBase(BaseModel):
    front: str
    back: str

class FlashcardCreate(FlashcardBase):
    pass

class FlashcardResponse(FlashcardBase):
    id: int

    class Config:
        from_attributes = True

class StudySetBase(BaseModel):
    title: str
    description: str

class StudySetCreate(StudySetBase):
    user_id: int
    flashcards: List[FlashcardCreate]  # Include flashcards when creating a study set

class StudySetResponse(StudySetBase):
    id: int
    user_id: int
    created_at: datetime
    flashcards: List[FlashcardResponse]

    class Config:
        from_attributes = True
