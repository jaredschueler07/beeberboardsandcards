from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = "sqlite+aiosqlite:///./beeber.db"
    cors_origins: list[str] = ["http://localhost:3000"]
    anthropic_api_key: str = ""
    asset_storage_path: str = "./assets"

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


settings = Settings()
