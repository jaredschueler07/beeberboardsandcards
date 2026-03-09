"""Generate card types and card instances from a game concept using Claude."""

import json
import logging
import random
import uuid

import anthropic

from app.config import settings
from app.schemas.project import BriefSettings, CardOut, CardTypeOut

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """\
You are an expert board and card game designer. Given a game concept, you generate \
detailed card types and individual card instances that form a balanced, thematic game.

When generating CARD TYPES, produce an array of objects with:
- name: The category name (e.g. "Hero", "Spell", "Trap", "Resource")
- color: A hex color code that fits the theme
- icon: One of: user, gem, skull, zap, shield, sword, heart, star, flame, layers
- count: How many cards of this type should exist in the deck (4-30)

When generating CARD INSTANCES for a specific type, produce an array of objects with:
- name: A unique, evocative card name
- cost: Integer resource cost (0-8)
- stats: Object with 1-3 numeric stat fields relevant to the game
- effect: A clear game effect (1-2 sentences)
- flavor_text: A short atmospheric quote or description (1 sentence)

Ensure cards are balanced: higher cost = stronger effects/stats. \
Effects should reference real game mechanics from the concept. \
Respond with ONLY a JSON object. No other text."""

CARD_TYPES_PROMPT = """\
Game Concept: {concept_title}
Description: {concept_description}
Mechanics: {mechanics}
Theme: {theme}
Player Count: {player_min}-{player_max}
Complexity: {complexity}
Game Type: {game_type}

Generate {count} distinct card types for this game. \
Respond with a JSON object: {{"card_types": [...]}}"""

CARD_INSTANCES_PROMPT = """\
Game Concept: {concept_title} — {concept_description}
Mechanics: {mechanics}
Card Type: {type_name} (there should be {type_count} of these in the deck)

Generate {count} unique card instances of the "{type_name}" type. \
Cards should vary in cost and power level to create interesting decisions. \
Respond with a JSON object: {{"cards": [...]}}"""

# Colors for mock card types
MOCK_COLORS = ["#3B82F6", "#F59E0B", "#EF4444", "#10B981", "#8B5CF6", "#EC4899"]
MOCK_ICONS = ["user", "gem", "skull", "zap", "shield", "star"]
MOCK_EFFECTS = [
    "Draw 2 cards from the deck.",
    "Deal 3 damage to target creature.",
    "Gain 2 resources at the start of your next turn.",
    "All players discard 1 card.",
    "Move up to 3 spaces on the board.",
    "Look at the top 3 cards of the deck; keep 1.",
    "Double the effect of your next action.",
    "Heal 2 HP to any friendly unit.",
]


def _generate_mock_card_types(count: int) -> list[CardTypeOut]:
    names = ["Hero", "Artifact", "Creature", "Spell", "Trap", "Event"][:count]
    return [
        CardTypeOut(
            id=str(uuid.uuid4()),
            name=names[i],
            color=MOCK_COLORS[i % len(MOCK_COLORS)],
            icon=MOCK_ICONS[i % len(MOCK_ICONS)],
            count=random.randint(4, 20),
        )
        for i in range(count)
    ]


def _generate_mock_cards(type_id: str, type_name: str, count: int) -> list[CardOut]:
    return [
        CardOut(
            id=str(uuid.uuid4()),
            type_id=type_id,
            name=f"{type_name} {chr(65 + i)}",
            cost=random.randint(0, 5),
            stats={"Power": random.randint(1, 6), "Defense": random.randint(1, 4)},
            effect=random.choice(MOCK_EFFECTS),
            flavor_text="The winds of fate blow ever onward.",
        )
        for i in range(count)
    ]


def _parse_json(text: str) -> dict:
    """Parse JSON from a response, stripping markdown fences if present."""
    text = text.strip()
    if text.startswith("```"):
        text = text.split("\n", 1)[1]
        text = text.rsplit("```", 1)[0]
    return json.loads(text)


async def generate_card_types(
    concept_title: str,
    concept_description: str,
    mechanics: list[str],
    brief_settings: BriefSettings,
    count: int = 4,
) -> list[CardTypeOut]:
    """Generate card types for a game concept."""

    if not settings.anthropic_api_key:
        logger.info("No ANTHROPIC_API_KEY — returning mock card types")
        return _generate_mock_card_types(count)

    client = anthropic.Anthropic(api_key=settings.anthropic_api_key)

    user_prompt = CARD_TYPES_PROMPT.format(
        concept_title=concept_title,
        concept_description=concept_description,
        mechanics=", ".join(mechanics),
        theme=brief_settings.theme or "unspecified",
        player_min=brief_settings.playerCountMin,
        player_max=brief_settings.playerCountMax,
        complexity=brief_settings.complexity,
        game_type=brief_settings.gameType,
        count=count,
    )

    try:
        message = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=1500,
            system=SYSTEM_PROMPT,
            messages=[{"role": "user", "content": user_prompt}],
        )

        data = _parse_json(message.content[0].text)
        raw_types = data.get("card_types", data) if isinstance(data, dict) else data

        results = []
        for raw in raw_types[:count]:
            results.append(
                CardTypeOut(
                    id=str(uuid.uuid4()),
                    name=raw.get("name", "Unknown"),
                    color=raw.get("color", "#3B82F6"),
                    icon=raw.get("icon", "layers"),
                    count=raw.get("count", 10),
                )
            )
        return results

    except Exception:
        logger.exception("Claude card type generation failed — falling back to mock")
        return _generate_mock_card_types(count)


async def generate_card_instances(
    concept_title: str,
    concept_description: str,
    mechanics: list[str],
    type_id: str,
    type_name: str,
    type_count: int,
    count: int = 5,
) -> list[CardOut]:
    """Generate individual card instances for a card type."""

    if not settings.anthropic_api_key:
        logger.info("No ANTHROPIC_API_KEY — returning mock cards")
        return _generate_mock_cards(type_id, type_name, count)

    client = anthropic.Anthropic(api_key=settings.anthropic_api_key)

    user_prompt = CARD_INSTANCES_PROMPT.format(
        concept_title=concept_title,
        concept_description=concept_description,
        mechanics=", ".join(mechanics),
        type_name=type_name,
        type_count=type_count,
        count=count,
    )

    try:
        message = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=2000,
            system=SYSTEM_PROMPT,
            messages=[{"role": "user", "content": user_prompt}],
        )

        data = _parse_json(message.content[0].text)
        raw_cards = data.get("cards", data) if isinstance(data, dict) else data

        results = []
        for raw in raw_cards[:count]:
            results.append(
                CardOut(
                    id=str(uuid.uuid4()),
                    type_id=type_id,
                    name=raw.get("name", "Unnamed Card"),
                    cost=int(raw.get("cost", 0)),
                    stats=raw.get("stats", {}),
                    effect=raw.get("effect", ""),
                    flavor_text=raw.get("flavor_text", ""),
                )
            )
        return results

    except Exception:
        logger.exception("Claude card generation failed — falling back to mock")
        return _generate_mock_cards(type_id, type_name, count)
