import { GameConcept, BriefSettings, CardType, Card } from '../types';

async function callAI(prompt: string): Promise<string> {
  const res = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(err.error || `API error ${res.status}`);
  }
  const data = await res.json();
  return data.text;
}

function parseJSON<T>(text: string): T {
  const cleaned = text.trim().replace(/^```(?:json)?\s*/, '').replace(/\s*```$/, '');
  return JSON.parse(cleaned);
}

export async function generateConcepts(
  brief: string,
  settings: BriefSettings
): Promise<GameConcept[]> {
  const prompt = `You are an expert board and card game designer. Based on the following game concept brief and settings, generate 3-4 unique game concepts.

BRIEF: "${brief}"

SETTINGS:
- Theme: ${settings.theme}
- Players: ${settings.playerCountMin}-${settings.playerCountMax}
- Play Time: ${settings.playTime} minutes
- Complexity: ${settings.complexity}
- Game Type: ${settings.gameType}

For each concept, provide:
- title: A creative, evocative game name
- description: 2-3 sentences describing the game's core experience and theme
- mechanics: 2-4 board/card game mechanics (e.g., "Deck Building", "Worker Placement", "Hand Management", "Area Control", "Push Your Luck", "Cooperative", "Engine Building", "Drafting", "Set Collection", "Trick-Taking")
- comparableGames: 2-3 existing published games that are similar in feel
- score: A market fit score from 70-98 based on how well the concept matches the brief and current market trends

Respond ONLY with a JSON array of objects. No markdown, no explanation, just the raw JSON array.

Example format:
[{"title":"Game Name","description":"Description here.","mechanics":["Mechanic 1","Mechanic 2"],"comparableGames":["Game A","Game B"],"score":85}]`;

  const text = await callAI(prompt);
  const parsed = parseJSON<Array<{
    title: string;
    description: string;
    mechanics: string[];
    comparableGames: string[];
    score: number;
  }>>(text);

  return parsed.map((item, i) => ({
    id: `gen-${Date.now()}-${i}`,
    title: item.title,
    description: item.description,
    mechanics: item.mechanics,
    comparableGames: item.comparableGames,
    score: item.score,
  }));
}

const CARD_TYPE_COLORS = [
  '#3B82F6', '#F59E0B', '#EF4444', '#10B981', '#8B5CF6', '#EC4899', '#06B6D4', '#F97316'
];

export async function generateCardTypes(
  concept: GameConcept,
  settings: BriefSettings
): Promise<CardType[]> {
  const prompt = `You are an expert card game designer. Based on the following game concept, generate 4-6 card types that would make up this game's component list.

GAME: "${concept.title}" — ${concept.description}
MECHANICS: ${concept.mechanics.join(', ')}
PLAYERS: ${settings.playerCountMin}-${settings.playerCountMax}
PLAY TIME: ${settings.playTime} minutes
COMPLEXITY: ${settings.complexity}

For each card type provide:
- name: The type name (e.g., "Hero", "Spell", "Event", "Resource", "Enemy")
- icon: One of these lucide icon names: user, gem, skull, zap, shield, sword, flame, heart, star, crown, scroll, map
- count: How many cards of this type should be in the deck (reasonable for the game's complexity and play time)

Respond ONLY with a JSON array. No markdown, no explanation.

Example: [{"name":"Hero","icon":"user","count":8},{"name":"Spell","icon":"zap","count":20}]`;

  const text = await callAI(prompt);
  const parsed = parseJSON<Array<{
    name: string;
    icon: string;
    count: number;
  }>>(text);

  return parsed.map((item, i) => ({
    id: `type-${Date.now()}-${i}`,
    name: item.name,
    color: CARD_TYPE_COLORS[i % CARD_TYPE_COLORS.length],
    icon: item.icon,
    count: item.count,
  }));
}

export async function generateCards(
  concept: GameConcept,
  cardType: CardType,
  count: number
): Promise<Card[]> {
  const prompt = `You are an expert card game designer. Generate ${count} unique cards of type "${cardType.name}" for the game "${concept.title}" — ${concept.description}.

MECHANICS: ${concept.mechanics.join(', ')}

For each card provide:
- name: A flavorful, thematic card name
- cost: Mana/resource cost (integer 0-8, lower for weaker cards)
- stats: An object with 1-3 numeric stats relevant to this card type (e.g., {"Attack": 3, "Defense": 2} or {"Duration": 2} or {"HP": 5, "Intellect": 4})
- effect: A concise game effect text (1-2 sentences)
- flavorText: A short atmospheric quote or description (1 sentence)

Respond ONLY with a JSON array. No markdown, no explanation.

Example: [{"name":"Shadow Strike","cost":3,"stats":{"Attack":4},"effect":"Deal 4 damage to target creature. If it dies, draw a card.","flavorText":"The darkness strikes without warning."}]`;

  const text = await callAI(prompt);
  const parsed = parseJSON<Array<{
    name: string;
    cost: number;
    stats: Record<string, number>;
    effect: string;
    flavorText: string;
  }>>(text);

  return parsed.map((item, i) => ({
    id: `card-${Date.now()}-${i}`,
    typeId: cardType.id,
    name: item.name,
    cost: item.cost,
    stats: item.stats,
    effect: item.effect,
    flavorText: item.flavorText,
  }));
}
