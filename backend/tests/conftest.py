"""Shared test fixtures — creates in-memory DB tables before API tests."""

import pytest

from app.database import engine
from app.models.project import Base


@pytest.fixture(autouse=True, scope="session")
async def setup_db():
    """Create all tables once for the test session."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
