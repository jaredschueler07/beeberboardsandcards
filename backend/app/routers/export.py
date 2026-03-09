"""Export endpoints — PDF and Tabletop Simulator generation."""

import io
import zipfile

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import Response
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.models.project import Project
from app.services.pdf_export import generate_pnp_pdf
from app.services.tts_export import generate_tts_bundle

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


class ExportTTSRequest(BaseModel):
    card_sheet_url: str = ""
    back_url: str = ""


@router.post("/{project_id}/tts-json")
async def export_tts_json(
    project_id: str,
    data: ExportTTSRequest,
    db: AsyncSession = Depends(get_db),
):
    """Generate a Tabletop Simulator save file bundle.

    Returns a ZIP containing:
    - card_sheet.png: Composite card face grid image
    - save.json: TTS-compatible JSON save file

    The card_sheet_url field should be set to the publicly-hosted URL of
    card_sheet.png so TTS can load it. If empty, TTS will need the image
    to be manually hosted.
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

    sheet_bytes, json_bytes = generate_tts_bundle(
        cards=cards,
        card_types=card_types,
        project_name=project.name,
        card_sheet_url=data.card_sheet_url,
        back_url=data.back_url,
    )

    # Package as ZIP
    zip_buf = io.BytesIO()
    with zipfile.ZipFile(zip_buf, "w", zipfile.ZIP_DEFLATED) as zf:
        zf.writestr("card_sheet.png", sheet_bytes)
        zf.writestr("save.json", json_bytes)
    zip_buf.seek(0)

    filename = f"{project.name.replace(' ', '_')}_TTS.zip"
    return Response(
        content=zip_buf.getvalue(),
        media_type="application/zip",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )
