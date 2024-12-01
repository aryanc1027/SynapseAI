import sqlalchemy
from sqlalchemy.orm import Session
from .env import getenv
from sqlalchemy.orm import declarative_base

def _engine_str(database: str = getenv("POSTGRES_DATABASE")) -> str:
    dialect = "postgresql+psycopg2"
    user = getenv("POSTGRES_USER")
    password = getenv("POSTGRES_PASSWORD")
    host = getenv("POSTGRES_HOST")
    port = getenv("POSTGRES_PORT")
    return f"{dialect}://{user}:{password}@{host}:{port}/{database}"

engine = sqlalchemy.create_engine(_engine_str(), echo=True)
Base = declarative_base()


def db_session():
    session = Session(engine)
    try:
        yield session
    finally:
        session.close()