from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "postgres"
    POSTGRES_HOST: str = "localhost"
    POSTGRES_PORT: str = "5432"
    POSTGRES_DATABASE: str = "qt_db"
    SECRET_KEY: str

    class Config:
        env_file = ".env"


settings = Settings()
