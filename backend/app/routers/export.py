"""Export endpoints — PDF generation and future format exports."""

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import Response
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.models.project import Project
from app.services.pdf_export import generate_pnp_pdf

router = APIRouter(prefix="/export", tags=["export"])


class ExportPnPRequest(BaseModel):
    paper_size: str = "letter"
    show_crop_marks: bool = True


@router.post("/{project_id}/pnp-pdf")
async def export_pnp_pdf(
    project_id: str,
    data: ExportPnPRequest,
    db: AsyncSession = Depends(get_db),
):
    """Generate a Print-and-Play PDF for the project.

    Returns the PDF as a downloadable file.
    """
    result = await db.execute(
        select(Project)
        .where(Project.id == project_id)
        .options(selectinload(Project.cards), selectinload(Project.card_types))
    )
    project = result.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    if not project.cards:
        raise HTTPException(status_code=400, detail="No cards to export — generate cards first")

    cards = [
        {
            "id": c.id,
            "type_id": c.type_id,
            "name": c.name,
            "cost": c.cost,
            "stats": c.stats,
            "effect": c.effect,
            "flavor_text": c.flavor_text,
            "art_url": c.art_url,
        }
        for c in project.cards
    ]

    card_types = [
        {
            "id": ct.id,
            "name": ct.name,
            "color": ct.color,
            "icon": ct.icon,
            "count": ct.count,
        }
        for ct in project.card_types
    ]

    pdf_bytes = generate_pnp_pdf(
        cards=cards,
        card_types=card_types,
        project_name=project.name,
        paper_size=data.paper_size,
        show_crop_marks=data.show_crop_marks,
    )

    filename = f"{project.name.replace(' ', '_')}_PnP.pdf"
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )
