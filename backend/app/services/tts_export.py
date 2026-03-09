"""Generate Tabletop Simulator JSON save files and card sheet images.

TTS uses a specific JSON format for saved objects. A custom deck consists of:
1. A card sheet image (grid of card faces in a single PNG/JPG)
2. A JSON save file with a Custom_Deck ObjectState containing ContainedObjects

Reference: https://kb.tabletopsimulator.com/custom-content/save-file-format/
"""

import io
import json
import logging
import math
import uuid
from typing import Any

from PIL import Image, ImageDraw, ImageFont

logger = logging.getLogger(__name__)

# Card dimensions in pixels (standard TTS card at 300 DPI: 2.5" x 3.5")
CARD_PX_WIDTH = 750
CARD_PX_HEIGHT = 1050

# TTS limits card sheets to 10x7 max (70 cards per sheet)
MAX_SHEET_COLS = 10
MAX_SHEET_ROWS = 7


def _hex_to_rgb(hex_color: str) -> tuple[int, int, int]:
    """Convert hex color to RGB tuple (0-255 scale)."""
    hex_color = hex_color.lstrip("#")
    return (
        int(hex_color[0:2], 16),
        int(hex_color[2:4], 16),
        int(hex_color[4:6], 16),
    )


def _render_card_image(
    card: dict,
    card_type: dict | None,
    width: int = CARD_PX_WIDTH,
    height: int = CARD_PX_HEIGHT,
) -> Image.Image:
    """Render a single card as a PIL Image."""
    img = Image.new("RGB", (width, height), (240, 240, 240))
    draw = ImageDraw.Draw(img)

    type_color = _hex_to_rgb(card_type.get("color", "#3B82F6")) if card_type else (59, 130, 246)
    type_name = card_type.get("name", "Card") if card_type else "Card"

    # Header bar
    draw.rectangle([0, 0, width, int(height * 0.15)], fill=type_color)

    # Card name
    try:
        title_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 36)
        body_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 24)
        small_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 20)
        italic_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Oblique.ttf", 18)
    except (OSError, IOError):
        title_font = ImageFont.load_default()
        body_font = title_font
        small_font = title_font
        italic_font = title_font

    name = card.get("name", "Unnamed")[:30]
    draw.text((20, 20), name, fill=(255, 255, 255), font=title_font)

    # Type badge (right side of header)
    draw.text((width - 20, 25), type_name, fill=(255, 255, 255, 180), font=small_font, anchor="ra")

    # Cost circle
    cost = card.get("cost", 0)
    cx, cy = width - 50, int(height * 0.15) - 50
    draw.ellipse([cx - 30, cy - 30, cx + 30, cy + 30], fill=(40, 40, 40))
    draw.text((cx, cy), str(cost), fill=(255, 255, 255), font=title_font, anchor="mm")

    # Stats section
    stats = card.get("stats", {})
    y_pos = int(height * 0.20)
    for stat_name, stat_val in list(stats.items())[:4]:
        draw.text((30, y_pos), f"{stat_name}: {stat_val}", fill=(60, 60, 60), font=body_font)
        y_pos += 35

    # Divider line
    y_pos += 10
    draw.line([(30, y_pos), (width - 30, y_pos)], fill=(200, 200, 200), width=2)
    y_pos += 20

    # Effect text (word wrapped)
    effect = card.get("effect", "")
    words = effect.split()
    line = ""
    for word in words:
        test = f"{line} {word}".strip()
        bbox = draw.textbbox((0, 0), test, font=body_font)
        if bbox[2] < width - 60:
            line = test
        else:
            draw.text((30, y_pos), line, fill=(50, 50, 50), font=body_font)
            y_pos += 30
            line = word
            if y_pos > height - 120:
                break
    if line:
        draw.text((30, y_pos), line, fill=(50, 50, 50), font=body_font)

    # Flavor text at bottom
    flavor = card.get("flavor_text", card.get("flavorText", ""))
    if flavor:
        draw.text((30, height - 60), flavor[:60], fill=(140, 140, 140), font=italic_font)

    # Border
    draw.rectangle([0, 0, width - 1, height - 1], outline=type_color, width=4)

    return img


def generate_card_sheet(
    cards: list[dict],
    card_types: list[dict],
) -> tuple[bytes, int, int]:
    """Generate a card sheet image (composite grid of card faces).

    Returns (png_bytes, num_cols, num_rows).
    TTS expects card sheets to be a grid where each cell is one card face.
    """
    if not cards:
        # Return a 1x1 blank card sheet
        img = Image.new("RGB", (CARD_PX_WIDTH, CARD_PX_HEIGHT), (200, 200, 200))
        buf = io.BytesIO()
        img.save(buf, format="PNG")
        return buf.getvalue(), 1, 1

    type_map = {t.get("id", ""): t for t in card_types}

    n = len(cards)
    cols = min(n, MAX_SHEET_COLS)
    rows = min(math.ceil(n / cols), MAX_SHEET_ROWS)
    # Clamp total cards to sheet capacity
    max_cards = cols * rows
    cards = cards[:max_cards]

    sheet_w = cols * CARD_PX_WIDTH
    sheet_h = rows * CARD_PX_HEIGHT
    sheet = Image.new("RGB", (sheet_w, sheet_h), (30, 30, 30))

    for idx, card in enumerate(cards):
        col = idx % cols
        row = idx // cols
        card_type = type_map.get(card.get("type_id", card.get("typeId", "")))
        card_img = _render_card_image(card, card_type)
        sheet.paste(card_img, (col * CARD_PX_WIDTH, row * CARD_PX_HEIGHT))

    buf = io.BytesIO()
    sheet.save(buf, format="PNG", optimize=True)
    return buf.getvalue(), cols, rows


def generate_tts_save_json(
    cards: list[dict],
    card_types: list[dict],
    project_name: str = "Game",
    face_url: str = "",
    back_url: str = "",
    num_width: int = 10,
    num_height: int = 7,
) -> dict[str, Any]:
    """Generate a TTS-compatible JSON save object for a custom deck.

    Args:
        cards: List of card data dicts
        card_types: List of card type dicts
        project_name: Name for the deck
        face_url: URL to the card sheet image (front faces)
        back_url: URL to the card back image (or empty for default)
        num_width: Number of columns in the card sheet
        num_height: Number of rows in the card sheet

    Returns:
        A dict matching the TTS SaveState/ObjectState schema.
    """
    type_map = {t.get("id", ""): t for t in card_types}
    deck_id = 1  # TTS uses integer deck IDs starting from 1

    # Build CustomDeck definition
    custom_deck = {
        str(deck_id): {
            "FaceURL": face_url,
            "BackURL": back_url or "https://i.imgur.com/EcbhVuh.jpg",  # Default card back
            "NumWidth": num_width,
            "NumHeight": num_height,
            "BackIsHidden": True,
            "UniqueBack": False,
            "Type": 0,
        }
    }

    # Build ContainedObjects (one per card)
    contained = []
    for idx, card in enumerate(cards):
        card_type = type_map.get(card.get("type_id", card.get("typeId", "")))
        card_id = deck_id * 100 + idx  # TTS card IDs: deckId*100 + index

        card_obj = {
            "GUID": uuid.uuid4().hex[:6],
            "Name": "Card",
            "Nickname": card.get("name", f"Card {idx + 1}"),
            "Description": _build_card_description(card, card_type),
            "CardID": card_id,
            "CustomDeck": custom_deck,
            "Transform": {
                "posX": 0,
                "posY": 0,
                "posZ": 0,
                "rotX": 0,
                "rotY": 180,
                "rotZ": 180,
                "scaleX": 1,
                "scaleY": 1,
                "scaleZ": 1,
            },
            "Locked": False,
            "SidewaysCard": False,
        }
        contained.append(card_obj)

    # Build the deck object
    deck_ids = [deck_id * 100 + i for i in range(len(cards))]

    deck_object = {
        "GUID": uuid.uuid4().hex[:6],
        "Name": "DeckCustom",
        "Nickname": project_name,
        "Description": f"Generated by Beeber Boards & Cards — {len(cards)} cards",
        "Transform": {
            "posX": 0,
            "posY": 1.5,
            "posZ": 0,
            "rotX": 0,
            "rotY": 180,
            "rotZ": 180,
            "scaleX": 1,
            "scaleY": 1,
            "scaleZ": 1,
        },
        "CustomDeck": custom_deck,
        "DeckIDs": deck_ids,
        "ContainedObjects": contained,
        "Locked": False,
    }

    # Full save state
    save_state = {
        "SaveName": project_name,
        "Date": "",
        "VersionNumber": "v13.3.0",
        "GameMode": "",
        "GameType": "",
        "GameComplexity": "",
        "Tags": ["Beeber", "Custom Game"],
        "Table": "Table_Custom",
        "Sky": "Sky_Museum",
        "Note": f"Generated by Beeber Boards & Cards",
        "LuaScript": "",
        "LuaScriptState": "",
        "XmlUI": "",
        "ObjectStates": [deck_object],
    }

    return save_state


def _build_card_description(card: dict, card_type: dict | None) -> str:
    """Build a TTS-friendly description string for a card."""
    parts = []

    type_name = card_type.get("name", "") if card_type else ""
    if type_name:
        parts.append(f"[b]{type_name}[/b]")

    cost = card.get("cost", 0)
    parts.append(f"Cost: {cost}")

    stats = card.get("stats", {})
    if stats:
        stat_strs = [f"{k}: {v}" for k, v in stats.items()]
        parts.append(" | ".join(stat_strs))

    effect = card.get("effect", "")
    if effect:
        parts.append(f"\n{effect}")

    flavor = card.get("flavor_text", card.get("flavorText", ""))
    if flavor:
        parts.append(f"\n[i]{flavor}[/i]")

    return "\n".join(parts)


def generate_tts_bundle(
    cards: list[dict],
    card_types: list[dict],
    project_name: str = "Game",
    card_sheet_url: str = "",
    back_url: str = "",
) -> tuple[bytes, bytes]:
    """Generate both the card sheet PNG and TTS JSON save file.

    Returns (card_sheet_png_bytes, tts_json_bytes).
    """
    sheet_bytes, num_cols, num_rows = generate_card_sheet(cards, card_types)

    save_json = generate_tts_save_json(
        cards=cards,
        card_types=card_types,
        project_name=project_name,
        face_url=card_sheet_url,
        back_url=back_url,
        num_width=num_cols,
        num_height=num_rows,
    )

    json_bytes = json.dumps(save_json, indent=2).encode("utf-8")
    return sheet_bytes, json_bytes
