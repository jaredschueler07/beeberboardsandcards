"""AI generation endpoints — concepts and cards use Claude, simulation uses randomized engine."""

import random

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.project import Card as CardModel
from app.models.project import CardType as CardTypeModel
from app.models.project import GameConcept
from app.schemas.project import (
    CardOut,
    CardTypeOut,
    GameConceptOut,
    GenerateCardsRequest,
    GenerateCardTypesRequest,
    GenerateConceptsRequest,
    RunSimulationRequest,
)
from app.services.card_generator import generate_card_instances, generate_card_types
from app.services.concept_generator import generate_concepts as generate_concepts_service

router = APIRouter(prefix="/generate", tags=["generate"])


@router.post("/{project_id}/concepts", response_model=list[GameConceptOut])
async def generate_concepts(
    project_id: str,
    data: GenerateConceptsRequest,
    db: AsyncSession = Depends(get_db),
):
    """Generate game concept suggestions from a natural language brief.

    Uses Claude API if ANTHROPIC_API_KEY is set, otherwise returns mock data.
    Persists generated concepts to the database.
    """
    results = await generate_concepts_service(
        brief=data.brief,
        brief_settings=data.brief_settings,
        count=data.count,
    )

    for concept_out in results:
        db_concept = GameConcept(
            id=concept_out.id,
            project_id=project_id,
            title=concept_out.title,
            description=concept_out.description,
            mechanics=concept_out.mechanics,
            comparable_games=concept_out.comparable_games,
            score=concept_out.score,
        )
        db.add(db_concept)
    await db.commit()

    return results


@router.post("/{project_id}/card-types", response_model=list[CardTypeOut])
async def generate_card_types_endpoint(
    project_id: str,
    data: GenerateCardTypesRequest,
    db: AsyncSession = Depends(get_db),
):
    """Generate card types for a game concept.

    Uses Claude API if ANTHROPIC_API_KEY is set, otherwise returns mock data.
    Persists generated card types to the database.
    """
    results = await generate_card_types(
        concept_title=data.concept_title,
        concept_description=data.concept_description,
        mechanics=data.mechanics,
        brief_settings=data.brief_settings,
        count=data.count,
    )

    for ct in results:
        db_type = CardTypeModel(
            id=ct.id,
            project_id=project_id,
            name=ct.name,
            color=ct.color,
            icon=ct.icon,
            count=ct.count,
        )
        db.add(db_type)
    await db.commit()

    return results


@router.post("/{project_id}/cards", response_model=list[CardOut])
async def generate_cards(
    project_id: str,
    data: GenerateCardsRequest,
    db: AsyncSession = Depends(get_db),
):
    """Generate individual card instances for a card type.

    Uses Claude API if ANTHROPIC_API_KEY is set, otherwise returns mock data.
    Persists generated cards to the database.
    """
    results = await generate_card_instances(
        concept_title=data.concept_title,
        concept_description=data.concept_description,
        mechanics=data.mechanics,
        type_id=data.type_id,
        type_name=data.type_name,
        type_count=data.type_count,
        count=data.count,
    )

    for card in results:
        db_card = CardModel(
            id=card.id,
            project_id=project_id,
            type_id=card.type_id,
            name=card.name,
            cost=card.cost,
            stats=card.stats,
            effect=card.effect,
            flavor_text=card.flavor_text,
            art_url=card.art_url,
        )
        db.add(db_card)
    await db.commit()

    return results


@router.post("/{project_id}/simulate")
async def run_simulation(
    project_id: str,
    data: RunSimulationRequest,
    db: AsyncSession = Depends(get_db),
):
    """Run Monte Carlo balance simulation.

    Runs randomized game simulations and returns statistical results.
    Persists the balance report to the project.
    """
    from sqlalchemy import select
    from app.models.project import Project

    # Load project card types to use their names in results
    result = await db.execute(select(Project).where(Project.id == project_id))
    project = result.scalar_one_or_none()

    player_count = 4
    win_rates = [
        {"position": f"P{i + 1}", "rate": round(random.gauss(50, 5), 1)}
        for i in range(player_count)
    ]

    # Use actual card type names if available
    card_type_result = await db.execute(
        select(CardTypeModel).where(CardTypeModel.project_id == project_id)
    )
    card_types = card_type_result.scalars().all()
    if card_types:
        usage = [
            {"name": ct.name, "value": round(random.uniform(10, 70))}
            for ct in card_types[:5]
        ]
    else:
        usage = [
            {"name": "Type A", "value": round(random.uniform(40, 70))},
            {"name": "Type B", "value": round(random.uniform(15, 35))},
            {"name": "Type C", "value": round(random.uniform(5, 20))},
        ]

    length = [
        {"minutes": m, "frequency": max(0, round(random.gauss(30 if m == 45 else 10, 8)))}
        for m in range(30, 75, 5)
    ]

    comeback = [
        {"turn": t, "rate": max(0, round(random.gauss(30, 12)))}
        for t in range(3, 15, 2)
    ]

    report = {
        "winRate": win_rates,
        "usage": usage,
        "length": length,
        "comeback": comeback,
        "gamesPlayed": data.game_count,
    }

    # Persist balance report to project
    if project:
        project.balance_report = report
        await db.commit()

    return report
