"""Tests for the TTS export service."""

import json

import pytest
from PIL import Image
import io

from app.services.tts_export import (
    generate_card_sheet,
    generate_tts_save_json,
    generate_tts_bundle,
    _render_card_image,
    _hex_to_rgb,
    _build_card_description,
)


SAMPLE_CARD = {
    "id": "c1",
    "type_id": "t1",
    "name": "Fire Dragon",
    "cost": 5,
    "stats": {"Power": 8, "Defense": 3},
    "effect": "Deal 4 damage to all enemy creatures.",
    "flavor_text": "The sky turns crimson.",
}

SAMPLE_CARD_TYPE = {
    "id": "t1",
    "name": "Creature",
    "color": "#EF4444",
    "icon": "skull",
    "count": 10,
}


class TestHexToRgb:
    def test_red(self):
        assert _hex_to_rgb("#FF0000") == (255, 0, 0)

    def test_without_hash(self):
        assert _hex_to_rgb("3B82F6") == (59, 130, 246)


class TestBuildCardDescription:
    def test_includes_type_name(self):
        desc = _build_card_description(SAMPLE_CARD, SAMPLE_CARD_TYPE)
        assert "Creature" in desc

    def test_includes_cost(self):
        desc = _build_card_description(SAMPLE_CARD, SAMPLE_CARD_TYPE)
        assert "Cost: 5" in desc

    def test_includes_stats(self):
        desc = _build_card_description(SAMPLE_CARD, SAMPLE_CARD_TYPE)
        assert "Power: 8" in desc

    def test_includes_effect(self):
        desc = _build_card_description(SAMPLE_CARD, SAMPLE_CARD_TYPE)
        assert "Deal 4 damage" in desc

    def test_includes_flavor(self):
        desc = _build_card_description(SAMPLE_CARD, SAMPLE_CARD_TYPE)
        assert "crimson" in desc

    def test_handles_no_type(self):
        desc = _build_card_description(SAMPLE_CARD, None)
        assert "Cost: 5" in desc


class TestRenderCardImage:
    def test_returns_pil_image(self):
        img = _render_card_image(SAMPLE_CARD, SAMPLE_CARD_TYPE)
        assert isinstance(img, Image.Image)

    def test_correct_dimensions(self):
        img = _render_card_image(SAMPLE_CARD, SAMPLE_CARD_TYPE, width=750, height=1050)
        assert img.size == (750, 1050)

    def test_custom_dimensions(self):
        img = _render_card_image(SAMPLE_CARD, SAMPLE_CARD_TYPE, width=300, height=400)
        assert img.size == (300, 400)


class TestGenerateCardSheet:
    def test_single_card(self):
        sheet_bytes, cols, rows = generate_card_sheet([SAMPLE_CARD], [SAMPLE_CARD_TYPE])
        assert isinstance(sheet_bytes, bytes)
        assert cols == 1
        assert rows == 1
        # Verify it's a valid PNG
        img = Image.open(io.BytesIO(sheet_bytes))
        assert img.format == "PNG"

    def test_multiple_cards(self):
        cards = [
            {**SAMPLE_CARD, "id": f"c{i}", "name": f"Card {i}"}
            for i in range(15)
        ]
        sheet_bytes, cols, rows = generate_card_sheet(cards, [SAMPLE_CARD_TYPE])
        assert cols == 10  # max 10 cols
        assert rows == 2   # 15 cards = 2 rows of 10

    def test_empty_cards(self):
        sheet_bytes, cols, rows = generate_card_sheet([], [])
        assert cols == 1
        assert rows == 1

    def test_large_deck_capped(self):
        cards = [
            {**SAMPLE_CARD, "id": f"c{i}", "name": f"Card {i}"}
            for i in range(100)
        ]
        sheet_bytes, cols, rows = generate_card_sheet(cards, [SAMPLE_CARD_TYPE])
        # Max 10x7 = 70 cards per sheet
        assert cols == 10
        assert rows == 7


class TestGenerateTtsSaveJson:
    def test_basic_structure(self):
        result = generate_tts_save_json(
            cards=[SAMPLE_CARD],
            card_types=[SAMPLE_CARD_TYPE],
            project_name="Test Game",
            face_url="https://example.com/sheet.png",
            num_width=1,
            num_height=1,
        )
        assert result["SaveName"] == "Test Game"
        assert len(result["ObjectStates"]) == 1
        assert result["ObjectStates"][0]["Name"] == "DeckCustom"

    def test_deck_contains_cards(self):
        cards = [
            {**SAMPLE_CARD, "id": f"c{i}", "name": f"Card {i}"}
            for i in range(5)
        ]
        result = generate_tts_save_json(
            cards=cards,
            card_types=[SAMPLE_CARD_TYPE],
            face_url="https://example.com/sheet.png",
            num_width=5,
            num_height=1,
        )
        deck = result["ObjectStates"][0]
        assert len(deck["ContainedObjects"]) == 5
        assert len(deck["DeckIDs"]) == 5

    def test_card_nicknames(self):
        result = generate_tts_save_json(
            cards=[SAMPLE_CARD],
            card_types=[SAMPLE_CARD_TYPE],
            face_url="",
            num_width=1,
            num_height=1,
        )
        card = result["ObjectStates"][0]["ContainedObjects"][0]
        assert card["Nickname"] == "Fire Dragon"

    def test_custom_deck_urls(self):
        result = generate_tts_save_json(
            cards=[SAMPLE_CARD],
            card_types=[SAMPLE_CARD_TYPE],
            face_url="https://example.com/face.png",
            back_url="https://example.com/back.png",
            num_width=1,
            num_height=1,
        )
        deck = result["ObjectStates"][0]
        custom_deck = deck["CustomDeck"]["1"]
        assert custom_deck["FaceURL"] == "https://example.com/face.png"
        assert custom_deck["BackURL"] == "https://example.com/back.png"

    def test_default_back_url(self):
        result = generate_tts_save_json(
            cards=[SAMPLE_CARD],
            card_types=[SAMPLE_CARD_TYPE],
            face_url="",
            num_width=1,
            num_height=1,
        )
        custom_deck = result["ObjectStates"][0]["CustomDeck"]["1"]
        assert custom_deck["BackURL"]  # Should have a default

    def test_json_serializable(self):
        result = generate_tts_save_json(
            cards=[SAMPLE_CARD],
            card_types=[SAMPLE_CARD_TYPE],
            face_url="",
            num_width=1,
            num_height=1,
        )
        # Should not raise
        serialized = json.dumps(result)
        assert len(serialized) > 0


class TestGenerateTtsBundle:
    def test_returns_two_byte_arrays(self):
        sheet_bytes, json_bytes = generate_tts_bundle(
            cards=[SAMPLE_CARD],
            card_types=[SAMPLE_CARD_TYPE],
            project_name="Bundle Test",
        )
        assert isinstance(sheet_bytes, bytes)
        assert isinstance(json_bytes, bytes)

    def test_sheet_is_valid_png(self):
        sheet_bytes, _ = generate_tts_bundle(
            cards=[SAMPLE_CARD],
            card_types=[SAMPLE_CARD_TYPE],
        )
        img = Image.open(io.BytesIO(sheet_bytes))
        assert img.format == "PNG"

    def test_json_is_valid(self):
        _, json_bytes = generate_tts_bundle(
            cards=[SAMPLE_CARD],
            card_types=[SAMPLE_CARD_TYPE],
        )
        data = json.loads(json_bytes)
        assert "ObjectStates" in data
        assert data["ObjectStates"][0]["Name"] == "DeckCustom"

    def test_grid_dimensions_match(self):
        cards = [
            {**SAMPLE_CARD, "id": f"c{i}", "name": f"Card {i}"}
            for i in range(12)
        ]
        sheet_bytes, json_bytes = generate_tts_bundle(
            cards=cards,
            card_types=[SAMPLE_CARD_TYPE],
        )
        data = json.loads(json_bytes)
        custom_deck = data["ObjectStates"][0]["CustomDeck"]["1"]
        assert custom_deck["NumWidth"] == 10
        assert custom_deck["NumHeight"] == 2
