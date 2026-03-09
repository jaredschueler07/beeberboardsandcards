"""Tests for the PDF export service."""

import pytest

from app.services.pdf_export import generate_pnp_pdf, _hex_to_rgb


class TestHexToRgb:
    """Tests for hex color conversion."""

    def test_basic_colors(self):
        assert _hex_to_rgb("#FF0000") == (1.0, 0.0, 0.0)
        assert _hex_to_rgb("#00FF00") == (0.0, 1.0, 0.0)
        assert _hex_to_rgb("#0000FF") == (0.0, 0.0, 1.0)

    def test_without_hash(self):
        assert _hex_to_rgb("3B82F6") == pytest.approx((0.231, 0.510, 0.965), abs=0.01)

    def test_black_and_white(self):
        assert _hex_to_rgb("#000000") == (0.0, 0.0, 0.0)
        assert _hex_to_rgb("#FFFFFF") == (1.0, 1.0, 1.0)


class TestPdfGeneration:
    """Tests for PDF generation."""

    def test_generates_valid_pdf_bytes(self):
        cards = [
            {
                "id": "c1",
                "type_id": "t1",
                "name": "Test Card",
                "cost": 3,
                "stats": {"Power": 5, "Defense": 2},
                "effect": "Draw 2 cards.",
                "flavor_text": "A test card for testing.",
            }
        ]
        card_types = [
            {"id": "t1", "name": "Hero", "color": "#3B82F6", "icon": "user", "count": 1}
        ]

        result = generate_pnp_pdf(cards, card_types, project_name="Test Game")
        assert isinstance(result, bytes)
        assert len(result) > 0
        assert result[:5] == b"%PDF-"

    def test_multi_page_pdf(self):
        """A large number of cards should produce multiple pages."""
        cards = [
            {
                "id": f"c{i}",
                "type_id": "t1",
                "name": f"Card {i}",
                "cost": i % 6,
                "stats": {"ATK": i + 1},
                "effect": f"Effect {i}",
                "flavor_text": f"Flavor {i}",
            }
            for i in range(20)
        ]
        card_types = [{"id": "t1", "name": "Unit", "color": "#EF4444", "icon": "skull", "count": 20}]

        result = generate_pnp_pdf(cards, card_types, project_name="Big Game")
        assert result[:5] == b"%PDF-"
        # Should be larger than single-card PDF
        assert len(result) > 1000

    def test_a4_paper_size(self):
        cards = [{"id": "c1", "type_id": "t1", "name": "A4 Card", "cost": 0, "stats": {}, "effect": "", "flavor_text": ""}]
        card_types = [{"id": "t1", "name": "Test", "color": "#10B981", "icon": "zap", "count": 1}]

        result = generate_pnp_pdf(cards, card_types, paper_size="a4")
        assert result[:5] == b"%PDF-"

    def test_no_crop_marks(self):
        cards = [{"id": "c1", "type_id": "t1", "name": "No Marks", "cost": 1, "stats": {}, "effect": "test", "flavor_text": ""}]
        card_types = [{"id": "t1", "name": "Test", "color": "#F59E0B", "icon": "star", "count": 1}]

        result = generate_pnp_pdf(cards, card_types, show_crop_marks=False)
        assert result[:5] == b"%PDF-"

    def test_empty_cards_list(self):
        result = generate_pnp_pdf(cards=[], card_types=[], project_name="Empty")
        assert result[:5] == b"%PDF-"

    def test_card_without_matching_type(self):
        """Cards with unknown type_id should still render."""
        cards = [{"id": "c1", "type_id": "unknown", "name": "Orphan", "cost": 0, "stats": {}, "effect": "", "flavor_text": ""}]
        result = generate_pnp_pdf(cards, card_types=[], project_name="Orphan Test")
        assert result[:5] == b"%PDF-"
