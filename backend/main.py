from fastapi import FastAPI
from .database import engine, Base
from backend.app.routes import user, study

app = FastAPI()

app.include_router(user.router, prefix="/users")
app.include_router(study.router, prefix="/study")

Base.metadata.create_all(bind=engine)