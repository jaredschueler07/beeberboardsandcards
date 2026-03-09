"""Generate Print-and-Play PDF documents from game project data."""

import io
import logging

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4, letter
from reportlab.lib.units import inch, mm
from reportlab.pdfgen import canvas

logger = logging.getLogger(__name__)

# Card dimensions (standard poker size: 2.5" x 3.5")
CARD_WIDTH = 2.5 * inch
CARD_HEIGHT = 3.5 * inch
CARD_MARGIN = 0.15 * inch  # gap between cards
PAGE_MARGIN = 0.5 * inch
BLEED = 0.125 * inch

PAPER_SIZES = {
    "letter": letter,
    "a4": A4,
}


def _hex_to_rgb(hex_color: str) -> tuple[float, float, float]:
    """Convert hex color to RGB tuple (0-1 scale)."""
    hex_color = hex_color.lstrip("#")
    r, g, b = int(hex_color[0:2], 16), int(hex_color[2:4], 16), int(hex_color[4:6], 16)
    return r / 255.0, g / 255.0, b / 255.0


def _draw_card(
    c: canvas.Canvas,
    x: float,
    y: float,
    card: dict,
    card_type: dict | None,
    show_crop_marks: bool,
) -> None:
    """Draw a single card at position (x, y)."""
    # Card border
    type_color = card_type.get("color", "#3B82F6") if card_type else "#3B82F6"
    r, g, b = _hex_to_rgb(type_color)

    # Card background
    c.setFillColorRGB(0.95, 0.95, 0.95)
    c.roundRect(x, y, CARD_WIDTH, CARD_HEIGHT, 8, fill=1, stroke=0)

    # Color header bar
    c.setFillColorRGB(r, g, b)
    c.roundRect(x, y + CARD_HEIGHT - 0.6 * inch, CARD_WIDTH, 0.6 * inch, 8, fill=1, stroke=0)
    # Square off bottom corners of header
    c.rect(x, y + CARD_HEIGHT - 0.6 * inch, CARD_WIDTH, 0.3 * inch, fill=1, stroke=0)

    # Card name in header
    c.setFillColor(colors.white)
    c.setFont("Helvetica-Bold", 10)
    name = card.get("name", "Unnamed")
    c.drawString(x + 8, y + CARD_HEIGHT - 0.4 * inch, name[:30])

    # Type badge
    type_name = card_type.get("name", "Card") if card_type else "Card"
    c.setFont("Helvetica", 7)
    c.drawRightString(x + CARD_WIDTH - 8, y + CARD_HEIGHT - 0.4 * inch, type_name)

    # Cost circle
    c.setFillColorRGB(0.2, 0.2, 0.2)
    cost = card.get("cost", 0)
    cx_pos = x + CARD_WIDTH - 0.3 * inch
    cy_pos = y + CARD_HEIGHT - 0.3 * inch
    c.circle(cx_pos, cy_pos, 0.2 * inch, fill=1, stroke=0)
    c.setFillColor(colors.white)
    c.setFont("Helvetica-Bold", 12)
    c.drawCentredString(cx_pos, cy_pos - 4, str(cost))

    # Stats
    stats = card.get("stats", {})
    stat_y = y + CARD_HEIGHT - 1.0 * inch
    c.setFillColorRGB(0.3, 0.3, 0.3)
    c.setFont("Helvetica-Bold", 8)
    for stat_name, stat_val in list(stats.items())[:4]:
        c.drawString(x + 10, stat_y, f"{stat_name}: {stat_val}")
        stat_y -= 14

    # Effect text
    effect = card.get("effect", "")
    c.setFont("Helvetica", 7)
    c.setFillColorRGB(0.2, 0.2, 0.2)
    text_y = y + 1.2 * inch
    # Simple word wrap
    words = effect.split()
    line = ""
    for word in words:
        test = f"{line} {word}".strip()
        if c.stringWidth(test, "Helvetica", 7) < CARD_WIDTH - 20:
            line = test
        else:
            c.drawString(x + 10, text_y, line)
            text_y -= 10
            line = word
            if text_y < y + 0.5 * inch:
                break
    if line:
        c.drawString(x + 10, text_y, line)

    # Flavor text
    flavor = card.get("flavor_text", card.get("flavorText", ""))
    if flavor:
        c.setFont("Helvetica-Oblique", 6)
        c.setFillColorRGB(0.5, 0.5, 0.5)
        c.drawString(x + 10, y + 0.25 * inch, flavor[:60])

    # Card border outline
    c.setStrokeColorRGB(r, g, b)
    c.setLineWidth(1.5)
    c.roundRect(x, y, CARD_WIDTH, CARD_HEIGHT, 8, fill=0, stroke=1)

    # Crop marks
    if show_crop_marks:
        c.setStrokeColorRGB(0.6, 0.6, 0.6)
        c.setLineWidth(0.5)
        mark_len = 0.1 * inch
        for corner_x, corner_y in [
            (x, y), (x + CARD_WIDTH, y),
            (x, y + CARD_HEIGHT), (x + CARD_WIDTH, y + CARD_HEIGHT),
        ]:
            dx = -1 if corner_x == x else 1
            dy = -1 if corner_y == y else 1
            c.line(corner_x - dx * mark_len, corner_y, corner_x - dx * (mark_len + 0.1 * inch), corner_y)
            c.line(corner_x, corner_y - dy * mark_len, corner_x, corner_y - dy * (mark_len + 0.1 * inch))


def generate_pnp_pdf(
    cards: list[dict],
    card_types: list[dict],
    project_name: str = "Game",
    paper_size: str = "letter",
    show_crop_marks: bool = True,
) -> bytes:
    """Generate a Print-and-Play PDF with cards laid out on pages.

    Returns the PDF as bytes.
    """
    page_w, page_h = PAPER_SIZES.get(paper_size, letter)

    # Calculate cards per page
    usable_w = page_w - 2 * PAGE_MARGIN
    usable_h = page_h - 2 * PAGE_MARGIN
    cols = int(usable_w // (CARD_WIDTH + CARD_MARGIN))
    rows = int(usable_h // (CARD_HEIGHT + CARD_MARGIN))
    cards_per_page = cols * rows

    if cards_per_page == 0:
        cols, rows, cards_per_page = 1, 1, 1

    # Build type lookup
    type_map = {t.get("id", ""): t for t in card_types}

    buf = io.BytesIO()
    c = canvas.Canvas(buf, pagesize=(page_w, page_h))
    c.setTitle(f"{project_name} — Print and Play")
    c.setAuthor("Beeber Boards & Cards")

    # Title page
    c.setFont("Helvetica-Bold", 24)
    c.drawCentredString(page_w / 2, page_h - 2 * inch, project_name)
    c.setFont("Helvetica", 12)
    c.drawCentredString(page_w / 2, page_h - 2.5 * inch, "Print and Play Edition")
    c.setFont("Helvetica", 10)
    c.setFillColorRGB(0.5, 0.5, 0.5)
    c.drawCentredString(page_w / 2, page_h - 3 * inch, f"{len(cards)} cards across {len(card_types)} types")
    c.drawCentredString(page_w / 2, 1 * inch, "Generated by Beeber Boards & Cards")
    c.showPage()

    # Card pages
    for page_start in range(0, len(cards), cards_per_page):
        page_cards = cards[page_start : page_start + cards_per_page]

        # Center the grid on the page
        grid_w = cols * CARD_WIDTH + (cols - 1) * CARD_MARGIN
        grid_h = rows * CARD_HEIGHT + (rows - 1) * CARD_MARGIN
        start_x = (page_w - grid_w) / 2
        start_y = (page_h - grid_h) / 2

        for idx, card in enumerate(page_cards):
            col = idx % cols
            row = idx // cols
            x = start_x + col * (CARD_WIDTH + CARD_MARGIN)
            y = start_y + (rows - 1 - row) * (CARD_HEIGHT + CARD_MARGIN)

            card_type = type_map.get(card.get("type_id", card.get("typeId", "")))
            _draw_card(c, x, y, card, card_type, show_crop_marks)

        # Page footer
        page_num = page_start // cards_per_page + 2  # +2 because title page is 1
        c.setFont("Helvetica", 8)
        c.setFillColorRGB(0.5, 0.5, 0.5)
        c.drawCentredString(page_w / 2, 0.3 * inch, f"{project_name} — Page {page_num}")
        c.showPage()

    c.save()
    return buf.getvalue()
