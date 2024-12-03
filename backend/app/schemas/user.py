from pydantic import BaseModel, EmailStr  # Use EmailStr for validation
from typing import List, Optional

# Base User schema with common attributes
class UserBase(BaseModel):
    username: str
    email: EmailStr  # Add email field with validation

# Schema for creating a user
class UserCreate(UserBase):
    password: str  # Plain password for creation only

# Schema for returning user data
class User(UserBase):
    id: int
    
    class Config:
        from_attributes = True  # Allows conversion from ORM model
