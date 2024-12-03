from fastapi import FastAPI
from backend.app.database import engine, Base
from backend.app.routes import user, study, auth
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user.router)
app.include_router(study.router)
app.include_router(auth.router)
Base.metadata.create_all(bind=engine)
