import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Settings,
  Sun,
  Moon,
  Undo2,
  Redo2, 
  User, 
  CheckCircle2, 
  MessageSquare,
  ChevronUp,
  ChevronDown,
  Send,
  Sparkles
} from 'lucide-react';
import { Stage, AppState, Card as GameCard } from './types';
import { STAGES, DESIGN_SYSTEM } from './constants';
import { Button, cn } from './components/UI';

// Stages
import BriefStage from './stages/BriefStage';
import DesignStage from './stages/DesignStage';
import BalanceStage from './stages/BalanceStage';
import ArtStage from './stages/ArtStage';
import LayoutStage from './stages/LayoutStage';
import ExportStage from './stages/ExportStage';

const INITIAL_STATE: AppState = {
  currentStage: 'brief',
  projectName: 'Abyssal Echoes',
  brief: 'A cooperative survival card game for 2-4 players set in flooded 1920s London, 45 minutes, medium complexity',
  briefSettings: {
    theme: 'Deep Sea Exploration',
    playerCountMin: 2,
    playerCountMax: 4,
    playTime: 45,
    complexity: 'medium',
    gameType: 'card',
  },
  concepts: [
    {
      id: '1',
      title: 'The Drowned Archive',
      description: 'Players are scholars salvaging forbidden knowledge from submerged libraries while avoiding eldritch horrors.',
      mechanics: ['Hand Management', 'Push Your Luck', 'Cooperative'],
      comparableGames: ['Arkham Horror', 'The Crew'],
      score: 92
    },
    {
      id: '2',
      title: 'Steam & Silt',
      description: 'A resource management race to build a submersible before the rising tides consume the last dry land.',
      mechanics: ['Engine Building', 'Resource Management', 'Race'],
      comparableGames: ['Terraforming Mars', '7 Wonders'],
      score: 85
    }
  ],
  selectedConceptId: '1',
  cardTypes: [
    { id: '1', name: 'Scholar', color: '#3B82F6', icon: 'user', count: 4 },
    { id: '2', name: 'Artifact', color: '#F59E0B', icon: 'gem', count: 24 },
    { id: '3', name: 'Horror', color: '#EF4444', icon: 'skull', count: 12 },
    { id: '4', name: 'Event', color: '#10B981', icon: 'zap', count: 20 },
  ],
  cards: [
    {
      id: 'c1',
      typeId: '1',
      name: 'Dr. Aris Thorne',
      cost: 0,
      stats: { HP: 5, Intellect: 4 },
      effect: 'Once per turn, you may look at the top 3 cards of the Archive deck.',
      flavorText: 'The water hides more than just secrets.',
      artUrl: 'https://picsum.photos/seed/scholar/400/600'
    },
    {
      id: 'c2',
      typeId: '2',
      name: 'Rusty Sextant',
      cost: 2,
      stats: { Range: 2 },
      effect: 'Gain +1 Intellect while exploring submerged locations.',
      flavorText: 'It still points true, even under fifty fathoms.',
      artUrl: 'https://picsum.photos/seed/artifact/400/600'
    }
  ],
  simulationData: {
    winRate: [
      { position: 'P1', rate: 48 },
      { position: 'P2', rate: 52 },
      { position: 'P3', rate: 45 },
      { position: 'P4', rate: 42 },
    ],
    usage: [
      { name: 'Artifacts', value: 65 },
      { name: 'Horrors', value: 25 },
      { name: 'Events', value: 10 },
    ],
    length: [
      { minutes: 30, frequency: 10 },
      { minutes: 40, frequency: 45 },
      { minutes: 50, frequency: 30 },
      { minutes: 60, frequency: 15 },
    ],
    comeback: [
      { turn: 3, rate: 12 },
      { turn: 5, rate: 28 },
      { turn: 7, rate: 45 },
      { turn: 9, rate: 38 },
      { turn: 11, rate: 22 },
      { turn: 13, rate: 15 },
    ]
  }
};

export default function App() {
  const [state, setState] = useState<AppState>(INITIAL_STATE);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('beeber-theme') !== 'light';
    }
    return true;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('light-mode', !isDarkMode);
    localStorage.setItem('beeber-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const currentStageIndex = STAGES.findIndex(s => s.id === state.currentStage);
  const progressPercent = Math.round(((currentStageIndex + 1) / STAGES.length) * 100);
  const progressLabel = STAGES[currentStageIndex]?.label ?? 'Brief';

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') return;

      // Number keys 1-6 jump to stages
      if (e.key >= '1' && e.key <= '6') {
        const stageIndex = parseInt(e.key) - 1;
        if (stageIndex < STAGES.length) {
          setState(prev => ({ ...prev, currentStage: STAGES[stageIndex].id }));
        }
        return;
      }

      // Alt+Left/Right for prev/next stage
      if (e.altKey && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
        e.preventDefault();
        setState(prev => {
          const idx = STAGES.findIndex(s => s.id === prev.currentStage);
          const next = e.key === 'ArrowRight'
            ? Math.min(idx + 1, STAGES.length - 1)
            : Math.max(idx - 1, 0);
          return { ...prev, currentStage: STAGES[next].id };
        });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const CurrentStageComponent = {
    brief: BriefStage,
    design: DesignStage,
    balance: BalanceStage,
    art: ArtStage,
    layout: LayoutStage,
    export: ExportStage,
  }[state.currentStage];

  return (
    <div className="flex h-screen w-full bg-bg overflow-hidden">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-white/5 flex flex-col bg-surface/50 backdrop-blur-xl">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center shadow-lg shadow-accent/20">
            <Sparkles className="text-bg w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight tracking-tight">Beeber</h1>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">Boards & Cards</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {STAGES.map((stage, index) => {
            const isActive = state.currentStage === stage.id;
            const isCompleted = STAGES.findIndex(s => s.id === state.currentStage) > index;
            const Icon = stage.icon;

            return (
              <button
                key={stage.id}
                onClick={() => setState(prev => ({ ...prev, currentStage: stage.id }))}
                className={cn(
                  "w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all group relative",
                  isActive ? "bg-accent text-bg shadow-lg shadow-accent/10" : "text-gray-400 hover:text-white hover:bg-white/5"
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                  isActive ? "bg-bg/10" : "bg-surface-light group-hover:bg-gray-600"
                )}>
                  <Icon size={18} />
                </div>
                <span className="font-medium text-sm">{stage.label}</span>
                {isCompleted && !isActive && (
                  <CheckCircle2 size={16} className="ml-auto text-success" />
                )}
                {isActive && (
                  <motion.div 
                    layoutId="active-stage"
                    className="absolute left-0 w-1 h-6 bg-bg rounded-r-full"
                  />
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5">
          <div className="bg-surface rounded-xl p-4 border border-white/5">
            <p className="text-[10px] text-gray-500 uppercase font-bold mb-2">Project Status</p>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium">{progressLabel} Phase</span>
              <span className="text-xs text-accent">{progressPercent}%</span>
            </div>
            <div className="w-full h-1.5 bg-bg rounded-full overflow-hidden">
              <div className="h-full bg-accent transition-all duration-300" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-surface/30 backdrop-blur-md z-10">
          <div className="flex items-center gap-4">
            <input 
              value={state.projectName}
              onChange={(e) => setState(prev => ({ ...prev, projectName: e.target.value }))}
              className="bg-transparent border-none focus:ring-0 font-bold text-lg text-white w-48 hover:bg-white/5 rounded px-2 py-1 transition-colors"
            />
            <span className="text-[10px] bg-white/5 px-2 py-1 rounded text-gray-500 font-bold uppercase">Saved</span>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm"><Undo2 size={18} /></Button>
            <Button variant="ghost" size="sm"><Redo2 size={18} /></Button>
            <div className="w-px h-6 bg-white/10 mx-2" />
            <Button variant="ghost" size="sm" onClick={() => setIsDarkMode(prev => !prev)}>
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </Button>
            <Button variant="ghost" size="sm"><Settings size={18} /></Button>
            <div className="w-8 h-8 rounded-full bg-surface-light border border-white/10 flex items-center justify-center overflow-hidden">
              <User size={16} className="text-gray-400" />
            </div>
          </div>
        </header>

        {/* Stage Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={state.currentStage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="p-8 max-w-7xl mx-auto w-full h-full"
            >
              <CurrentStageComponent state={state} setState={setState} />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* AI Chat Assistant (Bottom Bar) */}
        <div className={cn(
          "absolute bottom-0 left-0 right-0 z-20 transition-all duration-300 ease-in-out",
          isChatOpen ? "h-80" : "h-14"
        )}>
          <div className="h-full bg-surface/90 backdrop-blur-xl border-t border-white/10 shadow-2xl flex flex-col">
            <button 
              onClick={() => setIsChatOpen(!isChatOpen)}
              className="h-14 flex items-center justify-between px-8 hover:bg-white/5 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded bg-ai/20 flex items-center justify-center">
                  <Sparkles size={14} className="text-ai" />
                </div>
                <span className="text-sm font-semibold text-gray-300">Beeber Assistant</span>
                <span className="text-[10px] text-gray-500 font-medium italic">"Make all creature cards cost 1 more..."</span>
              </div>
              {isChatOpen ? <ChevronDown size={20} className="text-gray-500" /> : <ChevronUp size={20} className="text-gray-500" />}
            </button>

            {isChatOpen && (
              <div className="flex-1 flex flex-col p-6 pt-0 overflow-hidden">
                <div className="flex-1 overflow-y-auto custom-scrollbar mb-4 space-y-4">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-lg bg-ai/20 flex items-center justify-center shrink-0">
                      <Sparkles size={16} className="text-ai" />
                    </div>
                    <div className="bg-surface-light/50 rounded-2xl rounded-tl-none p-4 text-sm text-gray-200 max-w-[80%]">
                      Hello! I'm Beeber, your AI game design mentor. How can I help you with <strong>{state.projectName}</strong> today?
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <input 
                    placeholder="Ask Beeber anything..."
                    className="w-full bg-bg border border-white/10 rounded-xl px-4 py-3 pr-12 text-sm focus:border-accent outline-none transition-colors shadow-inner"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                  />
                  <button className="absolute right-3 top-1/2 -translate-y-1/2 text-accent hover:text-accent-hover transition-colors">
                    <Send size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
