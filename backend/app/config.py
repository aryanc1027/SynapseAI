import sys
from typing import Optional

from pydantic import model_validator
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "postgres"
    POSTGRES_HOST: str = "localhost"
    POSTGRES_PORT: str = "5432"
    POSTGRES_DATABASE: str = "qt_db"
    JWT_TOKEN: Optional[str] = None

    @model_validator(mode="after")
    def validate_jwt_token(self) -> "Settings":
        if not self.JWT_TOKEN or self.JWT_TOKEN.strip() == "":
            raise ValueError(
                "JWT_TOKEN environment variable is required but not set. "
                "Please set it in your .env file or environment variables. "
                "Generate a secure key with: python -c 'import secrets; print(secrets.token_hex(32))'"
            )
        if len(self.JWT_TOKEN) < 32:
            raise ValueError(
                f"JWT_TOKEN must be at least 32 characters long for security. "
                f"Current length: {len(self.JWT_TOKEN)}. "
                f"Generate a secure key with: python -c 'import secrets; print(secrets.token_hex(32))'"
            )
        return self

    class Config:
        env_file = ".env"


try:
    settings = Settings()
except ValueError as e:
    print(f"Configuration Error: {e}", file=sys.stderr)
    sys.exit(1)
except Exception as e:
    # Handle Pydantic ValidationError for missing JWT_TOKEN
    error_msg = str(e)
    if "JWT_TOKEN" in error_msg and (
        "Field required" in error_msg or "missing" in error_msg.lower()
    ):
        print(
            "Configuration Error: JWT_TOKEN environment variable is required but not set.\n"
            "Please set it in your .env file or environment variables.\n"
            "Generate a secure key with: python -c 'import secrets; print(secrets.token_hex(32))'",
            file=sys.stderr,
        )
    else:
        print(f"Configuration Error: {e}", file=sys.stderr)
    sys.exit(1)
