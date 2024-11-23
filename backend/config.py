import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.getenv('SECRET_KEY')
    JWT_SECRET_KEY = os.getenv('SECRET_KEY')
    
    # OAuth2 / JWT settings
    ALGORITHM = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES = 30

    # OAuth2 client settings
    OAUTH2_CLIENT_ID = os.getenv('OAUTH2_CLIENT_ID')
    OAUTH2_CLIENT_SECRET = os.getenv('OAUTH2_CLIENT_SECRET')
    OAUTH2_REDIRECT_URI = os.getenv('OAUTH2_REDIRECT_URI')

    # OAuth2 provider endpoints
    OAUTH2_AUTH_URL = os.getenv('OAUTH2_AUTH_URL')
    OAUTH2_TOKEN_URL = os.getenv('OAUTH2_TOKEN_URL')
    OAUTH2_USERINFO_URL = os.getenv('OAUTH2_USERINFO_URL')

    # Groq API settings (if needed)
    GROQ_API_KEY = os.getenv('GROQ_API_KEY')