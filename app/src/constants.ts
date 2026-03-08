import React from 'react';
import {
  Lightbulb,
  ScrollText, 
  Scale, 
  Palette, 
  Layout, 
  Rocket,
  Gamepad2,
  Dices,
  Layers,
  Users,
  Clock,
  Zap
} from 'lucide-react';
import { Stage } from './types';

export const DESIGN_SYSTEM = {
  colors: {
    bg: '#111827', // Rich charcoal
    surface: '#1F2937', // Slate
    surfaceLight: '#374151',
    accent: '#F59E0B', // Warm Amber/Gold
    accentHover: '#D97706',
    ai: 'linear-gradient(135deg, #8B5CF6 0%, #D946EF 100%)', // Purple/Pink AI gradient
    aiText: '#C084FC',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
    cardTypes: [
      '#EF4444', // Attack
      '#3B82F6', // Defense
      '#10B981', // Resource
      '#F59E0B', // Event
      '#8B5CF6', // Magic/Special
      '#EC4899', // Item
      '#06B6D4', // Character
      '#F97316', // Hazard
    ]
  },
  spacing: 8,
  radius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '24px'
  }
};

export const STAGES: { id: Stage; label: string; icon: React.ComponentType<{ size?: number }> }[] = [
  { id: 'brief', label: 'Brief', icon: Lightbulb },
  { id: 'design', label: 'Design', icon: ScrollText },
  { id: 'balance', label: 'Balance', icon: Scale },
  { id: 'art', label: 'Art', icon: Palette },
  { id: 'layout', label: 'Layout', icon: Layout },
  { id: 'export', label: 'Export', icon: Rocket },
];

export const GAME_COMPONENTS = {
  card: Gamepad2,
  die: Dices,
  token: Zap,
  board: Layout,
  meeple: Users,
};

export const TAGLINES = [
  "From spark to shelf, powered by AI.",
  "Your game, engineered for play.",
  "The future of tabletop is here.",
  "Design faster. Balance better. Play sooner.",
  "Unleash your inner game designer."
];
