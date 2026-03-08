export type Stage = 'brief' | 'design' | 'balance' | 'art' | 'layout' | 'export';

export interface GameConcept {
  id: string;
  title: string;
  description: string;
  mechanics: string[];
  comparableGames: string[];
  score: number;
}

export interface CardType {
  id: string;
  name: string;
  color: string;
  icon: string;
  count: number;
}

export interface Card {
  id: string;
  typeId: string;
  name: string;
  cost: number;
  stats: Record<string, number>;
  effect: string;
  flavorText: string;
  artUrl?: string;
}

export type Complexity = 'light' | 'medium' | 'heavy';
export type GameType = 'card' | 'board' | 'hybrid';

export interface BriefSettings {
  theme: string;
  playerCountMin: number;
  playerCountMax: number;
  playTime: number;
  complexity: Complexity;
  gameType: GameType;
}

export interface SimulationData {
  winRate: { position: string; rate: number }[];
  usage: { name: string; value: number }[];
  length: { minutes: number; frequency: number }[];
  comeback: { turn: number; rate: number }[];
}

export interface AppState {
  currentStage: Stage;
  projectName: string;
  brief: string;
  briefSettings: BriefSettings;
  concepts: GameConcept[];
  selectedConceptId?: string;
  cardTypes: CardType[];
  cards: Card[];
  simulationData?: SimulationData;
  styleGuide?: {
    moodBoardUrl: string;
    palette: string[];
    font: string;
  };
}
