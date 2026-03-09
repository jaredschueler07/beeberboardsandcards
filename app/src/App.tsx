import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  Sparkles,
  Loader2
} from 'lucide-react';
import { Stage, AppState, Card as GameCard } from './types';
import { STAGES, DESIGN_SYSTEM } from './constants';
import { Button, cn } from './components/UI';
import { api } from './api';

// Stages
import BriefStage from './stages/BriefStage';
import DesignStage from './stages/DesignStage';
import BalanceStage from './stages/BalanceStage';
import ArtStage from './stages/ArtStage';
import LayoutStage from './stages/LayoutStage';
import ExportStage from './stages/ExportStage';

const EMPTY_STATE: AppState = {
  currentStage: 'brief',
  projectName: 'Untitled Game',
  brief: '',
  briefSettings: {
    theme: 'Deep Sea Exploration',
    playerCountMin: 2,
    playerCountMax: 4,
    playTime: 45,
    complexity: 'medium',
    gameType: 'card',
  },
  concepts: [],
  selectedConceptId: undefined,
  cardTypes: [],
  cards: [],
  simulationData: undefined,
};

/** Map a backend project response to frontend AppState */
function projectToState(p: any): AppState {
  const bs = p.brief_settings ?? {};
  return {
    projectId: p.id,
    currentStage: (p.current_stage ?? 'brief') as AppState['currentStage'],
    projectName: p.name ?? 'Untitled Game',
    brief: p.brief ?? '',
    briefSettings: {
      theme: bs.theme ?? '',
      playerCountMin: bs.playerCountMin ?? 2,
      playerCountMax: bs.playerCountMax ?? 4,
      playTime: bs.playTime ?? 45,
      complexity: bs.complexity ?? 'medium',
      gameType: bs.gameType ?? 'card',
    },
    concepts: (p.concepts ?? []).map((c: any) => ({
      id: c.id,
      title: c.title,
      description: c.description,
      mechanics: c.mechanics ?? [],
      comparableGames: c.comparable_games ?? c.comparableGames ?? [],
      score: c.score ?? 0,
    })),
    selectedConceptId: p.selected_concept_id ?? undefined,
    cardTypes: (p.card_types ?? []).map((t: any) => ({
      id: t.id,
      name: t.name,
      color: t.color ?? '#3B82F6',
      icon: t.icon ?? 'layers',
      count: t.count ?? 1,
    })),
    cards: (p.cards ?? []).map((c: any) => ({
      id: c.id,
      typeId: c.type_id ?? c.typeId,
      name: c.name,
      cost: c.cost ?? 0,
      stats: c.stats ?? {},
      effect: c.effect ?? '',
      flavorText: c.flavor_text ?? c.flavorText ?? '',
      artUrl: c.art_url ?? c.artUrl ?? undefined,
    })),
    simulationData: p.balance_report ?? undefined,
    styleGuide: p.style_guide ?? undefined,
  };
}

export default function App() {
  const [state, setState] = useState<AppState>(EMPTY_STATE);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('beeber-theme') !== 'light';
    }
    return true;
  });

  // Load or create project on mount
  useEffect(() => {
    (async () => {
      try {
        // Check for saved project ID in localStorage
        const savedId = localStorage.getItem('beeber-project-id');
        if (savedId) {
          try {
            const project = await api.getProject(savedId);
            setState(projectToState(project));
            setIsLoading(false);
            return;
          } catch {
            // Project not found — create a new one
          }
        }
        // Create new project
        const project = await api.createProject({ name: 'Untitled Game' });
        localStorage.setItem('beeber-project-id', project.id);
        setState(projectToState(project));
      } catch {
        // Backend unavailable — work offline with empty state
        console.warn('Backend unavailable — working offline');
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  // Debounced auto-save to backend
  const saveTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const prevStateRef = useRef<string>('');

  const saveToBackend = useCallback(async (s: AppState) => {
    if (!s.projectId) return;
    setSaveStatus('saving');
    try {
      await api.updateProject(s.projectId, {
        name: s.projectName,
        brief: s.brief,
        brief_settings: s.briefSettings,
        current_stage: s.currentStage,
        selected_concept_id: s.selectedConceptId ?? null,
        balance_report: s.simulationData ?? null,
        style_guide: s.styleGuide ?? null,
      });
      setSaveStatus('saved');
    } catch {
      setSaveStatus('error');
    }
  }, []);

  useEffect(() => {
    if (isLoading) return;
    // Only save when saveable fields change
    const key = JSON.stringify({
      name: state.projectName,
      brief: state.brief,
      briefSettings: state.briefSettings,
      currentStage: state.currentStage,
      selectedConceptId: state.selectedConceptId,
      simulationData: state.simulationData,
    });
    if (key === prevStateRef.current) return;
    prevStateRef.current = key;

    clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => saveToBackend(state), 1000);
    return () => clearTimeout(saveTimerRef.current);
  }, [state, isLoading, saveToBackend]);

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

  if (isLoading) {
    return (
      <div className="flex h-screen w-full bg-bg items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 text-accent animate-spin mx-auto" />
          <p className="text-sm text-gray-500">Loading project...</p>
        </div>
      </div>
    );
  }

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
            <span className={cn(
              "text-[10px] px-2 py-1 rounded font-bold uppercase",
              saveStatus === 'saved' ? 'bg-white/5 text-gray-500' :
              saveStatus === 'saving' ? 'bg-accent/10 text-accent' :
              'bg-red-500/10 text-red-400'
            )}>
              {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'error' ? 'Save failed' : 'Saved'}
            </span>
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
