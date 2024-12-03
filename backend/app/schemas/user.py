from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

# Base User schema with common attributes
class UserBase(BaseModel):
    username: str

# Schema for creating a user
class UserCreate(UserBase):
    password: str  # Plain password for creation only

# Schema for returning user data
class User(UserBase):
    id: int
    
    class Config:
        from_attributes = True  # Allows conversion from ORM model
