"""Tests for the concept generator service."""

import pytest

from app.schemas.project import BriefSettings
from app.services.concept_generator import generate_concepts, _generate_mock_concepts


class TestMockConcepts:
    """Tests for mock concept generation (no API key needed)."""

    def test_returns_requested_count(self):
        settings = BriefSettings(theme="Fantasy", complexity="medium", gameType="card")
        result = _generate_mock_concepts("A card game about dragons", settings, count=3)
        assert len(result) == 3

    def test_each_concept_has_required_fields(self):
        settings = BriefSettings(theme="Sci-Fi")
        result = _generate_mock_concepts("Space exploration", settings, count=1)
        concept = result[0]
        assert concept.id
        assert concept.title
        assert concept.description
        assert isinstance(concept.mechanics, list)
        assert len(concept.mechanics) > 0
        assert isinstance(concept.comparable_games, list)
        assert len(concept.comparable_games) > 0
        assert 60 <= concept.score <= 100

    def test_concepts_have_unique_ids(self):
        settings = BriefSettings()
        result = _generate_mock_concepts("Test game", settings, count=5)
        ids = [c.id for c in result]
        assert len(ids) == len(set(ids))

    def test_zero_count_returns_empty(self):
        settings = BriefSettings()
        result = _generate_mock_concepts("Test", settings, count=0)
        assert result == []


class TestGenerateConceptsAsync:
    """Tests for the async generate_concepts function (mock fallback)."""

    @pytest.mark.asyncio
    async def test_returns_mock_when_no_api_key(self):
        settings = BriefSettings(theme="Horror", complexity="heavy")
        result = await generate_concepts("A horror card game", settings, count=2)
        assert len(result) == 2
        assert all(c.title for c in result)

    @pytest.mark.asyncio
    async def test_brief_text_appears_in_description(self):
        settings = BriefSettings()
        brief = "A cooperative pirate adventure"
        result = await generate_concepts(brief, settings, count=1)
        # Mock descriptions include the brief text
        assert brief[:20] in result[0].description
