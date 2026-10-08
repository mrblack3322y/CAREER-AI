"""
Application Configuration Settings for CareerAI.
Reads from environment variables with sensible local defaults.
"""

import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "CareerAI — AI Career Intelligence Platform"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Security & JWT
    SECRET_KEY: str = os.getenv("SECRET_KEY", "career-ai-super-secret-jwt-key-development-2026")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 7 days
    
    # Database: SQLite fallback for instant zero-dependency execution,
    # or PostgreSQL when configured via env
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        f"sqlite:///{os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'career_ai.db')}"
    )

    # CORS
    BACKEND_CORS_ORIGINS: list = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
        "*"
    ]

    model_config = SettingsConfigDict(case_sensitive=True)

settings = Settings()
