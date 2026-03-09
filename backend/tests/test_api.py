"""Integration tests for the FastAPI API endpoints."""

import pytest
from httpx import ASGITransport, AsyncClient

from app.main import app


@pytest.fixture
async def client():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as c:
        yield c


class TestHealthEndpoint:
    @pytest.mark.asyncio
    async def test_health_returns_ok(self, client):
        response = await client.get("/api/health")
        assert response.status_code == 200
        assert response.json() == {"status": "ok"}


class TestProjectCRUD:
    @pytest.mark.asyncio
    async def test_create_and_get_project(self, client):
        # Create
        response = await client.post("/api/projects", json={"name": "Test Game"})
        assert response.status_code == 201
        project = response.json()
        assert project["name"] == "Test Game"
        project_id = project["id"]

        # Get
        response = await client.get(f"/api/projects/{project_id}")
        assert response.status_code == 200
        assert response.json()["name"] == "Test Game"

    @pytest.mark.asyncio
    async def test_update_project(self, client):
        response = await client.post("/api/projects", json={"name": "Original"})
        project_id = response.json()["id"]

        response = await client.patch(
            f"/api/projects/{project_id}",
            json={"name": "Updated", "brief": "A new brief"},
        )
        assert response.status_code == 200
        assert response.json()["name"] == "Updated"
        assert response.json()["brief"] == "A new brief"

    @pytest.mark.asyncio
    async def test_delete_project(self, client):
        response = await client.post("/api/projects", json={"name": "To Delete"})
        project_id = response.json()["id"]

        response = await client.delete(f"/api/projects/{project_id}")
        assert response.status_code == 204

        response = await client.get(f"/api/projects/{project_id}")
        assert response.status_code == 404

    @pytest.mark.asyncio
    async def test_list_projects(self, client):
        await client.post("/api/projects", json={"name": "List Test"})
        response = await client.get("/api/projects")
        assert response.status_code == 200
        assert isinstance(response.json(), list)
        assert len(response.json()) >= 1


class TestConceptGeneration:
    @pytest.mark.asyncio
    async def test_generate_concepts_mock(self, client):
        # Create project first
        resp = await client.post("/api/projects", json={"name": "Concept Test"})
        project_id = resp.json()["id"]

        response = await client.post(
            f"/api/generate/{project_id}/concepts",
            json={
                "brief": "A fantasy card game with dragons and magic",
                "brief_settings": {
                    "theme": "Fantasy",
                    "playerCountMin": 2,
                    "playerCountMax": 4,
                    "playTime": 45,
                    "complexity": "medium",
                    "gameType": "card",
                },
                "count": 2,
            },
        )
        assert response.status_code == 200
        concepts = response.json()
        assert len(concepts) == 2
        assert all("title" in c for c in concepts)
        assert all("mechanics" in c for c in concepts)


class TestCardTypeGeneration:
    @pytest.mark.asyncio
    async def test_generate_card_types_mock(self, client):
        resp = await client.post("/api/projects", json={"name": "Card Type Test"})
        project_id = resp.json()["id"]

        response = await client.post(
            f"/api/generate/{project_id}/card-types",
            json={
                "concept_title": "Dragon Wars",
                "concept_description": "A battle game",
                "mechanics": ["Hand Management"],
                "count": 3,
            },
        )
        assert response.status_code == 200
        types = response.json()
        assert len(types) == 3
        assert all("name" in t for t in types)
        assert all("color" in t for t in types)


class TestSimulation:
    @pytest.mark.asyncio
    async def test_run_simulation(self, client):
        resp = await client.post("/api/projects", json={"name": "Sim Test"})
        project_id = resp.json()["id"]

        response = await client.post(
            f"/api/generate/{project_id}/simulate",
            json={"game_count": 100},
        )
        assert response.status_code == 200
        data = response.json()
        assert "winRate" in data
        assert "usage" in data
        assert "length" in data
        assert "comeback" in data
        assert data["gamesPlayed"] == 100


class TestExport:
    @pytest.mark.asyncio
    async def test_export_empty_project_returns_400(self, client):
        resp = await client.post("/api/projects", json={"name": "Empty Export"})
        project_id = resp.json()["id"]

        response = await client.post(
            f"/api/export/{project_id}/pnp-pdf",
            json={"paper_size": "letter"},
        )
        assert response.status_code == 400

    @pytest.mark.asyncio
    async def test_export_nonexistent_project_returns_404(self, client):
        response = await client.post(
            "/api/export/nonexistent-id/pnp-pdf",
            json={"paper_size": "letter"},
        )
        assert response.status_code == 404
