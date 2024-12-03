from fastapi import FastAPI
from backend.app.database import engine, Base
from backend.app.routes import user, study, auth

Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(user.router)
app.include_router(study.router)
app.include_router(auth.router)
Base.metadata.create_all(bind=engine)
