"""Tests for the card generator service."""

import pytest

from app.schemas.project import BriefSettings
from app.services.card_generator import (
    generate_card_instances,
    generate_card_types,
    _generate_mock_card_types,
    _generate_mock_cards,
)


class TestMockCardTypes:
    """Tests for mock card type generation."""

    def test_returns_requested_count(self):
        result = _generate_mock_card_types(count=4)
        assert len(result) == 4

    def test_each_type_has_required_fields(self):
        result = _generate_mock_card_types(count=1)
        ct = result[0]
        assert ct.id
        assert ct.name
        assert ct.color.startswith("#")
        assert ct.icon
        assert ct.count > 0

    def test_types_have_unique_ids(self):
        result = _generate_mock_card_types(count=6)
        ids = [ct.id for ct in result]
        assert len(ids) == len(set(ids))


class TestMockCards:
    """Tests for mock card instance generation."""

    def test_returns_requested_count(self):
        result = _generate_mock_cards("type-1", "Hero", count=5)
        assert len(result) == 5

    def test_each_card_has_required_fields(self):
        result = _generate_mock_cards("type-1", "Artifact", count=1)
        card = result[0]
        assert card.id
        assert card.type_id == "type-1"
        assert card.name
        assert isinstance(card.cost, int)
        assert isinstance(card.stats, dict)
        assert card.effect

    def test_cards_bound_to_type_id(self):
        result = _generate_mock_cards("my-type", "Spell", count=3)
        assert all(c.type_id == "my-type" for c in result)


class TestGenerateCardTypesAsync:
    """Tests for async card type generation (mock fallback)."""

    @pytest.mark.asyncio
    async def test_returns_mock_when_no_api_key(self):
        settings = BriefSettings(theme="Fantasy")
        result = await generate_card_types(
            concept_title="Dragon Wars",
            concept_description="A battle card game",
            mechanics=["Hand Management"],
            brief_settings=settings,
            count=3,
        )
        assert len(result) == 3
        assert all(ct.name for ct in result)


class TestGenerateCardInstancesAsync:
    """Tests for async card instance generation (mock fallback)."""

    @pytest.mark.asyncio
    async def test_returns_mock_when_no_api_key(self):
        result = await generate_card_instances(
            concept_title="Dragon Wars",
            concept_description="Battle game",
            mechanics=["Deck Building"],
            type_id="t1",
            type_name="Dragon",
            type_count=10,
            count=5,
        )
        assert len(result) == 5
        assert all(c.type_id == "t1" for c in result)
