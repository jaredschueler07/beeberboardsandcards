import { GoogleGenAI } from '@google/genai';
import { GameConcept, BriefSettings } from '../types';

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

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

  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: prompt,
  });

  const text = response.text?.trim() ?? '';

  // Strip markdown code fences if present
  const jsonStr = text.replace(/^```(?:json)?\s*/, '').replace(/\s*```$/, '');

  const parsed = JSON.parse(jsonStr) as Array<{
    title: string;
    description: string;
    mechanics: string[];
    comparableGames: string[];
    score: number;
  }>;

  return parsed.map((item, i) => ({
    id: `gen-${Date.now()}-${i}`,
    title: item.title,
    description: item.description,
    mechanics: item.mechanics,
    comparableGames: item.comparableGames,
    score: item.score,
  }));
}
