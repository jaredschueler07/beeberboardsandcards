import React from 'react';
import { Sparkles, ChevronRight } from 'lucide-react';
import { AppState, Complexity, GameType } from '../types';
import { Button, Card, Badge, cn } from '../components/UI';

interface Props {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

const COMPLEXITY_LABELS: Record<Complexity, string> = {
  light: 'Light',
  medium: 'Medium',
  heavy: 'Heavy',
};

const THEMES = ['Deep Sea Exploration', 'Eldritch Horror', 'Steampunk', 'Cyberpunk', 'Post-Apocalyptic', 'Fantasy'];

export default function BriefStage({ state, setState }: Props) {
  const isEmpty = state.brief.length < 10;
  const settings = state.briefSettings;

  const updateSettings = (patch: Partial<AppState['briefSettings']>) => {
    setState(prev => ({ ...prev, briefSettings: { ...prev.briefSettings, ...patch } }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 h-full">
      <div className="lg:col-span-3 space-y-8">
        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Sparkles className="text-accent" size={24} />
            Describe Your Vision
          </h2>
          <div className="relative">
            <textarea
              className="w-full h-40 bg-surface border border-white/10 rounded-2xl p-6 text-lg outline-none focus:border-accent transition-all custom-scrollbar resize-none shadow-inner"
              placeholder="e.g., A cooperative survival card game for 2-4 players set in flooded 1920s London..."
              value={state.brief}
              onChange={(e) => setState(prev => ({ ...prev, brief: e.target.value }))}
            />
            {isEmpty && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-12 text-center opacity-40">
                <p className="text-sm italic">Start typing your game concept here. Be as specific as you like about theme, mechanics, and player experience...</p>
              </div>
            )}
            <div className="absolute bottom-4 right-4 flex gap-2">
              <Button variant="ai" size="sm">
                <Sparkles size={14} className="mr-2" />
                Refine with AI
              </Button>
              <Button size="sm">Generate Concepts</Button>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-400 uppercase tracking-wider">AI Concepts</h3>
            <Badge variant="ai">
              {state.concepts.length} Suggestion{state.concepts.length !== 1 ? 's' : ''}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {state.concepts.map((concept) => (
              <Card
                key={concept.id}
                ai={state.selectedConceptId === concept.id}
                className={cn(
                  "cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]",
                  state.selectedConceptId === concept.id ? "ring-2 ring-accent" : "hover:border-white/20"
                )}
              >
                <div className="p-6" onClick={() => setState(prev => ({ ...prev, selectedConceptId: concept.id }))}>
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="text-xl font-bold">{concept.title}</h4>
                    <Badge variant="success">{concept.score}% Match</Badge>
                  </div>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">{concept.description}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {concept.mechanics.map(m => (
                      <Badge key={m}>{m}</Badge>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                    <div className="text-[10px] text-gray-500 uppercase font-bold">Similar to: {concept.comparableGames.join(', ')}</div>
                    <ChevronRight size={16} className="text-accent" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </div>

      <aside className="space-y-6">
        <Card className="p-6 space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500">Refinement</h3>

          <div className="space-y-4">
            <label className="block">
              <span className="text-xs font-semibold text-gray-400 mb-2 block">Theme</span>
              <select
                className="w-full bg-bg border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-accent"
                value={settings.theme}
                onChange={(e) => updateSettings({ theme: e.target.value })}
              >
                {THEMES.map(t => <option key={t}>{t}</option>)}
              </select>
            </label>

            <div>
              <div className="flex justify-between text-xs font-semibold text-gray-400 mb-2">
                <span>Player Count</span>
                <span className="text-accent">{settings.playerCountMin}-{settings.playerCountMax}</span>
              </div>
              <div className="flex gap-2 items-center">
                <input
                  type="range" className="w-full accent-accent" min="1" max="8"
                  value={settings.playerCountMin}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    updateSettings({
                      playerCountMin: val,
                      playerCountMax: Math.max(val, settings.playerCountMax)
                    });
                  }}
                />
                <span className="text-[10px] text-gray-500 w-4">to</span>
                <input
                  type="range" className="w-full accent-accent" min="1" max="8"
                  value={settings.playerCountMax}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    updateSettings({
                      playerCountMax: val,
                      playerCountMin: Math.min(val, settings.playerCountMin)
                    });
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-gray-400 mb-2">
                <span>Play Time</span>
                <span className="text-accent">{settings.playTime} min</span>
              </div>
              <input
                type="range" className="w-full accent-accent" min="15" max="180" step="15"
                value={settings.playTime}
                onChange={(e) => updateSettings({ playTime: parseInt(e.target.value) })}
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-gray-400 mb-2">
                <span>Complexity</span>
                <span className="text-accent">{COMPLEXITY_LABELS[settings.complexity]}</span>
              </div>
              <div className="grid grid-cols-3 gap-1">
                {(['light', 'medium', 'heavy'] as Complexity[]).map((level) => (
                  <button
                    key={level}
                    onClick={() => updateSettings({ complexity: level })}
                    className={cn(
                      "h-2 rounded-full transition-colors",
                      settings.complexity === level ||
                      (level === 'light' && settings.complexity !== 'light') ||
                      (level === 'medium' && settings.complexity === 'heavy')
                        ? '' : '',
                    )}
                    style={{
                      backgroundColor: (['light', 'medium', 'heavy'].indexOf(level) <= ['light', 'medium', 'heavy'].indexOf(settings.complexity))
                        ? '#F59E0B' : '#374151'
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="pt-4">
              <span className="text-xs font-semibold text-gray-400 mb-2 block">Game Type</span>
              <div className="flex gap-2">
                {(['card', 'board', 'hybrid'] as GameType[]).map((type) => (
                  <Button
                    key={type}
                    variant={settings.gameType === type ? 'secondary' : 'ghost'}
                    size="sm"
                    className="flex-1 capitalize"
                    onClick={() => updateSettings({ gameType: type })}
                  >
                    {type}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-ai/5 border-ai/20">
          <div className="flex gap-3">
            <Sparkles size={16} className="text-ai shrink-0 mt-1" />
            <div>
              <p className="text-xs font-bold text-ai uppercase mb-1">AI Insight</p>
              <p className="text-[11px] text-gray-300 leading-relaxed">
                "Deep sea survival works best with high tension. I recommend adding a 'Pressure' resource mechanic."
              </p>
              <Button variant="ghost" size="sm" className="mt-2 text-[10px] h-6 text-ai hover:bg-ai/10">
                Apply Suggestion
              </Button>
            </div>
          </div>
        </Card>
      </aside>
    </div>
  );
}
