from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.models.project import Card, CardType, GameConcept, Project
from app.schemas.project import (
    CardCreate,
    CardOut,
    CardTypeCreate,
    CardTypeOut,
    CardUpdate,
    ProjectCreate,
    ProjectOut,
    ProjectSummary,
    ProjectUpdate,
)

router = APIRouter(prefix="/projects", tags=["projects"])


async def _get_project(project_id: str, db: AsyncSession) -> Project:
    result = await db.execute(
        select(Project)
        .where(Project.id == project_id)
        .options(
            selectinload(Project.concepts),
            selectinload(Project.card_types),
            selectinload(Project.cards),
        )
    )
    project = result.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


# -- Project CRUD --


@router.get("", response_model=list[ProjectSummary])
async def list_projects(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Project).order_by(Project.updated_at.desc()))
    return result.scalars().all()


@router.post("", response_model=ProjectOut, status_code=201)
async def create_project(data: ProjectCreate, db: AsyncSession = Depends(get_db)):
    project = Project(
        name=data.name,
        brief=data.brief,
        brief_settings=data.brief_settings.model_dump(),
    )
    db.add(project)
    await db.commit()
    return await _get_project(project.id, db)


@router.get("/{project_id}", response_model=ProjectOut)
async def get_project(project_id: str, db: AsyncSession = Depends(get_db)):
    return await _get_project(project_id, db)


@router.patch("/{project_id}", response_model=ProjectOut)
async def update_project(
    project_id: str, data: ProjectUpdate, db: AsyncSession = Depends(get_db)
):
    project = await _get_project(project_id, db)
    update_data = data.model_dump(exclude_unset=True)
    if "brief_settings" in update_data and update_data["brief_settings"] is not None:
        update_data["brief_settings"] = data.brief_settings.model_dump()
    for key, value in update_data.items():
        setattr(project, key, value)
    project.version += 1
    await db.commit()
    return await _get_project(project_id, db)


@router.delete("/{project_id}", status_code=204)
async def delete_project(project_id: str, db: AsyncSession = Depends(get_db)):
    project = await _get_project(project_id, db)
    await db.delete(project)
    await db.commit()


# -- Card Types --


@router.post("/{project_id}/card-types", response_model=CardTypeOut, status_code=201)
async def create_card_type(
    project_id: str, data: CardTypeCreate, db: AsyncSession = Depends(get_db)
):
    await _get_project(project_id, db)
    card_type = CardType(project_id=project_id, **data.model_dump())
    db.add(card_type)
    await db.commit()
    await db.refresh(card_type)
    return card_type


@router.delete("/{project_id}/card-types/{type_id}", status_code=204)
async def delete_card_type(
    project_id: str, type_id: str, db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(CardType).where(CardType.id == type_id, CardType.project_id == project_id)
    )
    card_type = result.scalar_one_or_none()
    if not card_type:
        raise HTTPException(status_code=404, detail="Card type not found")
    await db.delete(card_type)
    await db.commit()


# -- Cards --


@router.post("/{project_id}/cards", response_model=CardOut, status_code=201)
async def create_card(
    project_id: str, data: CardCreate, db: AsyncSession = Depends(get_db)
):
    await _get_project(project_id, db)
    card = Card(project_id=project_id, **data.model_dump())
    db.add(card)
    await db.commit()
    await db.refresh(card)
    return card


@router.patch("/{project_id}/cards/{card_id}", response_model=CardOut)
async def update_card(
    project_id: str, card_id: str, data: CardUpdate, db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Card).where(Card.id == card_id, Card.project_id == project_id)
    )
    card = result.scalar_one_or_none()
    if not card:
        raise HTTPException(status_code=404, detail="Card not found")
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(card, key, value)
    await db.commit()
    await db.refresh(card)
    return card


@router.delete("/{project_id}/cards/{card_id}", status_code=204)
async def delete_card(
    project_id: str, card_id: str, db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Card).where(Card.id == card_id, Card.project_id == project_id)
    )
    card = result.scalar_one_or_none()
    if not card:
        raise HTTPException(status_code=404, detail="Card not found")
    await db.delete(card)
    await db.commit()
