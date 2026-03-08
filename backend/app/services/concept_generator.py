"""Generate game concepts from a natural language brief using Claude."""

import json
import logging
import random
import uuid

import anthropic

from app.config import settings
from app.schemas.project import BriefSettings, GameConceptOut

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """\
You are an expert board and card game designer with deep knowledge of game mechanics, \
market trends, and player psychology. You help creators turn ideas into playable games.

When given a game concept brief, you generate distinct game concept suggestions. \
Each concept should have:
- A compelling title (2-4 words, evocative)
- A 1-2 sentence description of the core experience
- 2-4 game mechanics that work well together for this concept
- 2 comparable published games that share similar DNA
- A "concept score" from 60-98 reflecting market fit and mechanical synergy

Make each concept meaningfully different — vary the mechanics, tone, and approach. \
One concept should be the "safe" crowd-pleaser, one should be novel/experimental, \
and others should fall between.

Choose mechanics from this taxonomy: Hand Management, Deck Building, Worker Placement, \
Area Control, Push Your Luck, Cooperative, Engine Building, Drafting, Set Collection, \
Trick-Taking, Tableau Building, Resource Management, Action Points, Dice Rolling, \
Tile Placement, Route Building, Hidden Roles, Negotiation, Legacy, Campaign.

Respond with ONLY a JSON array of concept objects. No other text."""

USER_PROMPT_TEMPLATE = """\
Game Brief: {brief}

Settings:
- Theme: {theme}
- Players: {player_min}-{player_max}
- Play Time: {play_time} minutes
- Complexity: {complexity}
- Game Type: {game_type}

Generate {count} distinct game concepts."""

# Fallback mock data for when no API key is configured
MOCK_MECHANICS = [
    "Hand Management", "Deck Building", "Worker Placement", "Area Control",
    "Push Your Luck", "Cooperative", "Engine Building", "Drafting",
    "Set Collection", "Trick-Taking", "Resource Management",
]

MOCK_GAMES = [
    "Pandemic", "Gloomhaven", "Terraforming Mars", "Wingspan", "Arkham Horror",
    "Spirit Island", "7 Wonders", "Dominion", "Azul", "Catan", "Root",
    "Everdell", "The Crew", "Arcs", "Brass: Birmingham",
]


def _generate_mock_concepts(
    brief: str, brief_settings: BriefSettings, count: int
) -> list[GameConceptOut]:
    """Fallback when no API key is available."""
    concepts = []
    for i in range(count):
        concepts.append(
            GameConceptOut(
                id=str(uuid.uuid4()),
                title=f"Concept {i + 1}: {brief_settings.theme}",
                description=f"An AI-generated concept based on: {brief[:80]}...",
                mechanics=random.sample(MOCK_MECHANICS, k=3),
                comparable_games=random.sample(MOCK_GAMES, k=2),
                score=round(random.uniform(70, 98), 1),
            )
        )
    return concepts


async def generate_concepts(
    brief: str, brief_settings: BriefSettings, count: int = 3
) -> list[GameConceptOut]:
    """Generate game concepts — uses Claude if API key is set, otherwise mock data."""

    if not settings.anthropic_api_key:
        logger.info("No ANTHROPIC_API_KEY set — returning mock concepts")
        return _generate_mock_concepts(brief, brief_settings, count)

    client = anthropic.Anthropic(api_key=settings.anthropic_api_key)

    user_prompt = USER_PROMPT_TEMPLATE.format(
        brief=brief,
        theme=brief_settings.theme or "unspecified",
        player_min=brief_settings.playerCountMin,
        player_max=brief_settings.playerCountMax,
        play_time=brief_settings.playTime,
        complexity=brief_settings.complexity,
        game_type=brief_settings.gameType,
        count=count,
    )

    try:
        message = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=2000,
            system=SYSTEM_PROMPT,
            messages=[{"role": "user", "content": user_prompt}],
        )

        response_text = message.content[0].text

        # Parse JSON from response — handle potential markdown wrapping
        text = response_text.strip()
        if text.startswith("```"):
            text = text.split("\n", 1)[1]
            text = text.rsplit("```", 1)[0]

        raw_concepts = json.loads(text)

        concepts = []
        for raw in raw_concepts[:count]:
            concepts.append(
                GameConceptOut(
                    id=str(uuid.uuid4()),
                    title=raw.get("title", "Untitled Concept"),
                    description=raw.get("description", ""),
                    mechanics=raw.get("mechanics", []),
                    comparable_games=raw.get("comparable_games", raw.get("comparableGames", [])),
                    score=float(raw.get("score", raw.get("concept_score", 80))),
                )
            )

        return concepts

    except Exception:
        logger.exception("Claude API call failed — falling back to mock concepts")
        return _generate_mock_concepts(brief, brief_settings, count)
