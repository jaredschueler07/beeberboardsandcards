from datetime import datetime

from pydantic import BaseModel


# -- Brief Settings --
class BriefSettings(BaseModel):
    theme: str = ""
    playerCountMin: int = 2
    playerCountMax: int = 4
    playTime: int = 45
    complexity: str = "medium"
    gameType: str = "card"


# -- Game Concept --
class GameConceptBase(BaseModel):
    title: str
    description: str = ""
    mechanics: list[str] = []
    comparable_games: list[str] = []
    score: float = 0.0


class GameConceptOut(GameConceptBase):
    id: str

    model_config = {"from_attributes": True}


# -- Card Type --
class CardTypeBase(BaseModel):
    name: str
    color: str = "#3B82F6"
    icon: str = "layers"
    count: int = 1


class CardTypeCreate(CardTypeBase):
    pass


class CardTypeOut(CardTypeBase):
    id: str

    model_config = {"from_attributes": True}


# -- Card --
class CardBase(BaseModel):
    name: str
    cost: int = 0
    stats: dict[str, int] = {}
    effect: str = ""
    flavor_text: str = ""
    art_url: str | None = None


class CardCreate(CardBase):
    type_id: str


class CardUpdate(BaseModel):
    name: str | None = None
    cost: int | None = None
    stats: dict[str, int] | None = None
    effect: str | None = None
    flavor_text: str | None = None
    art_url: str | None = None


class CardOut(CardBase):
    id: str
    type_id: str

    model_config = {"from_attributes": True}


# -- Project --
class ProjectCreate(BaseModel):
    name: str = "Untitled Game"
    brief: str = ""
    brief_settings: BriefSettings = BriefSettings()


class ProjectUpdate(BaseModel):
    name: str | None = None
    brief: str | None = None
    brief_settings: BriefSettings | None = None
    current_stage: str | None = None
    selected_concept_id: str | None = None
    rule_set: dict | None = None
    style_guide: dict | None = None


class ProjectSummary(BaseModel):
    id: str
    name: str
    current_stage: str
    updated_at: datetime

    model_config = {"from_attributes": True}


class ProjectOut(BaseModel):
    id: str
    name: str
    brief: str
    brief_settings: dict
    current_stage: str
    selected_concept_id: str | None
    rule_set: dict | None
    balance_report: dict | None
    style_guide: dict | None
    version: int
    created_at: datetime
    updated_at: datetime
    concepts: list[GameConceptOut]
    card_types: list[CardTypeOut]
    cards: list[CardOut]

    model_config = {"from_attributes": True}


# -- Generation requests --
class GenerateConceptsRequest(BaseModel):
    brief: str
    brief_settings: BriefSettings
    count: int = 3


class GenerateCardTypesRequest(BaseModel):
    concept_title: str
    concept_description: str = ""
    mechanics: list[str] = []
    brief_settings: BriefSettings = BriefSettings()
    count: int = 4


class GenerateCardsRequest(BaseModel):
    concept_title: str = ""
    concept_description: str = ""
    mechanics: list[str] = []
    type_id: str
    type_name: str
    type_count: int = 10
    count: int = 5


class RunSimulationRequest(BaseModel):
    game_count: int = 1000
