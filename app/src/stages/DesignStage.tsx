import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  Sparkles,
  Info,
  Layers,
  Loader2,
} from 'lucide-react';
import { AppState, Card as GameCard } from '../types';
import { Button, Card, Badge, cn } from '../components/UI';
import { generateCardTypes, generateCards } from '../services/gemini';

interface Props {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

export default function DesignStage({ state, setState }: Props) {
  const [selectedTypeId, setSelectedTypeId] = useState(state.cardTypes[0]?.id ?? '');
  const [isGeneratingTypes, setIsGeneratingTypes] = useState(false);
  const [isGeneratingCards, setIsGeneratingCards] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedType = state.cardTypes.find(t => t.id === selectedTypeId);
  const selectedConcept = state.concepts.find(c => c.id === state.selectedConceptId);
  const cardsForType = state.cards.filter(c => c.typeId === selectedTypeId);
  const totalCards = state.cardTypes.reduce((sum, t) => sum + t.count, 0);
  const estCostPerUnit = (totalCards * 0.14 + 4.50).toFixed(2);

  const handleGenerateTypes = async () => {
    if (!selectedConcept) return;
    setIsGeneratingTypes(true);
    setError(null);
    try {
      const cardTypes = await generateCardTypes(selectedConcept, state.briefSettings);
      setState(prev => ({ ...prev, cardTypes, cards: [] }));
      setSelectedTypeId(cardTypes[0]?.id ?? '');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate card types');
    } finally {
      setIsGeneratingTypes(false);
    }
  };

  const handleGenerateCards = async () => {
    if (!selectedConcept || !selectedType) return;
    setIsGeneratingCards(true);
    setError(null);
    try {
      const numToGenerate = Math.min(selectedType.count, 6);
      const newCards = await generateCards(selectedConcept, selectedType, numToGenerate);
      setState(prev => ({
        ...prev,
        cards: [
          ...prev.cards.filter(c => c.typeId !== selectedTypeId),
          ...newCards,
        ],
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate cards');
    } finally {
      setIsGeneratingCards(false);
    }
  };

  const handleDeleteType = (typeId: string) => {
    setState(prev => {
      const newTypes = prev.cardTypes.filter(t => t.id !== typeId);
      const newCards = prev.cards.filter(c => c.typeId !== typeId);
      return { ...prev, cardTypes: newTypes, cards: newCards };
    });
    if (selectedTypeId === typeId) {
      setSelectedTypeId(state.cardTypes.find(t => t.id !== typeId)?.id ?? '');
    }
  };

  const handleUpdateType = (patch: Partial<AppState['cardTypes'][0]>) => {
    setState(prev => ({
      ...prev,
      cardTypes: prev.cardTypes.map(t =>
        t.id === selectedTypeId ? { ...t, ...patch } : t
      ),
    }));
  };

  return (
    <div className="flex gap-8 h-full">
      {/* Left Panel: Tree View */}
      <aside className="w-64 space-y-6 shrink-0">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500">Components</h3>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 rounded-full"
            onClick={() => {
              const newType = {
                id: `type-${Date.now()}`,
                name: 'New Type',
                color: '#6B7280',
                icon: 'star',
                count: 10,
              };
              setState(prev => ({ ...prev, cardTypes: [...prev.cardTypes, newType] }));
              setSelectedTypeId(newType.id);
            }}
          >
            <Plus size={14} />
          </Button>
        </div>

        <nav className="space-y-1">
          {state.cardTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedTypeId(type.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all",
                selectedTypeId === type.id ? "bg-surface-light text-white" : "text-gray-400 hover:text-white hover:bg-white/5"
              )}
            >
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: type.color }} />
              <span className="flex-1 text-left">{type.name}</span>
              <span className="text-[10px] font-bold opacity-50">{type.count}</span>
            </button>
          ))}
        </nav>

        <div className="pt-4">
          <Button
            variant="ai"
            size="sm"
            className="w-full"
            onClick={handleGenerateTypes}
            disabled={!selectedConcept || isGeneratingTypes}
          >
            {isGeneratingTypes ? (
              <><Loader2 size={14} className="mr-2 animate-spin" />Generating...</>
            ) : (
              <><Sparkles size={14} className="mr-2" />Generate Card Types</>
            )}
          </Button>
          {!selectedConcept && (
            <p className="text-[10px] text-gray-500 mt-2 px-1">Select a concept in Stage 1 first</p>
          )}
        </div>

        <div className="pt-6 border-t border-white/5 space-y-4">
          <div className="px-2">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500">Global Rules</h3>
          </div>
          <div className="space-y-1">
            <Button variant="ghost" size="sm" className="w-full justify-start text-xs">Win Conditions</Button>
            <Button variant="ghost" size="sm" className="w-full justify-start text-xs">Turn Structure</Button>
            <Button variant="ghost" size="sm" className="w-full justify-start text-xs">Resource Systems</Button>
          </div>
        </div>
      </aside>

      {/* Center: Editor */}
      <div className="flex-1 space-y-6 overflow-y-auto custom-scrollbar">
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {selectedType ? (
          <>
            <Card key={selectedTypeId} className="p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: selectedType.color + '20' }}>
                    <Layers style={{ color: selectedType.color }} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{selectedType.name} Editor</h2>
                    <p className="text-sm text-gray-500">Define the core attributes and behavior of this component.</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-error hover:bg-error/10"
                  onClick={() => handleDeleteType(selectedTypeId)}
                >
                  <Trash2 size={16} className="mr-2" />
                  Delete Type
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-6">
                  <label className="block">
                    <span className="text-xs font-bold text-gray-400 uppercase mb-2 block">Type Name</span>
                    <input
                      className="w-full bg-bg border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-accent"
                      value={selectedType.name}
                      onChange={(e) => handleUpdateType({ name: e.target.value })}
                    />
                  </label>

                  <div className="grid grid-cols-2 gap-4">
                    <label className="block">
                      <span className="text-xs font-bold text-gray-400 uppercase mb-2 block">Card Count</span>
                      <div className="flex items-center bg-bg border border-white/10 rounded-xl overflow-hidden">
                        <button
                          className="px-3 py-3 hover:bg-white/5"
                          onClick={() => handleUpdateType({ count: Math.max(1, selectedType.count - 1) })}
                        >-</button>
                        <input
                          className="w-full bg-transparent text-center outline-none"
                          value={selectedType.count}
                          onChange={(e) => {
                            const val = parseInt(e.target.value);
                            if (!isNaN(val) && val > 0) handleUpdateType({ count: val });
                          }}
                        />
                        <button
                          className="px-3 py-3 hover:bg-white/5"
                          onClick={() => handleUpdateType({ count: selectedType.count + 1 })}
                        >+</button>
                      </div>
                    </label>
                    <label className="block">
                      <span className="text-xs font-bold text-gray-400 uppercase mb-2 block">Color</span>
                      <input
                        type="color"
                        className="w-full h-[46px] bg-bg border border-white/10 rounded-xl px-2 cursor-pointer"
                        value={selectedType.color}
                        onChange={(e) => handleUpdateType({ color: e.target.value })}
                      />
                    </label>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-gray-400 uppercase">Cards ({cardsForType.length})</span>
                      <Button
                        variant="ai"
                        size="sm"
                        className="h-7 text-[10px]"
                        onClick={handleGenerateCards}
                        disabled={!selectedConcept || isGeneratingCards}
                      >
                        {isGeneratingCards ? (
                          <><Loader2 size={12} className="mr-1 animate-spin" />Generating...</>
                        ) : (
                          <><Sparkles size={12} className="mr-1" />Generate Cards</>
                        )}
                      </Button>
                    </div>

                    {cardsForType.length > 0 ? (
                      <div className="space-y-2 max-h-80 overflow-y-auto custom-scrollbar">
                        {cardsForType.map((card) => (
                          <div key={card.id} className="bg-bg border border-white/5 rounded-xl p-3">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-bold">{card.name}</span>
                              <Badge>{card.cost} cost</Badge>
                            </div>
                            <p className="text-xs text-gray-400 mb-2">{card.effect}</p>
                            <div className="flex gap-2 flex-wrap">
                              {Object.entries(card.stats).map(([stat, val]) => (
                                <span key={stat} className="text-[10px] bg-surface-light px-2 py-0.5 rounded text-gray-300">
                                  {stat}: {val}
                                </span>
                              ))}
                            </div>
                            <p className="text-[10px] text-gray-500 italic mt-2">"{card.flavorText}"</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-bg border border-white/5 rounded-xl p-6 text-center">
                        <p className="text-sm text-gray-500">No cards generated yet</p>
                        <p className="text-[10px] text-gray-600 mt-1">Click "Generate Cards" to create cards for this type</p>
                      </div>
                    )}
                  </div>

                  {selectedConcept && (
                    <div className="bg-ai/5 border border-ai/20 rounded-xl p-4">
                      <div className="flex gap-3">
                        <Info size={16} className="text-ai shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-bold text-ai uppercase mb-1">Active Concept</p>
                          <p className="text-xs text-gray-300">
                            {selectedConcept.title} — {selectedConcept.mechanics.join(', ')}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </>
        ) : (
          <Card className="p-12 text-center">
            <p className="text-gray-500">No card types yet. Generate card types from your concept or add one manually.</p>
          </Card>
        )}
      </div>

      {/* Right Panel: Manifest */}
      <aside className="w-72 space-y-6 shrink-0">
        <Card className="p-6">
          <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-6">Component Manifest</h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Total Cards</span>
              <span className="text-sm font-bold">{totalCards}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Cards Generated</span>
              <span className="text-sm font-bold">{state.cards.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Unique Types</span>
              <span className="text-sm font-bold">{state.cardTypes.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Est. Production Cost</span>
              <span className="text-sm font-bold text-accent">${estCostPerUnit} / unit</span>
            </div>

            <div className="pt-4 border-t border-white/5">
              <p className="text-[10px] text-gray-500 uppercase font-bold mb-3">Distribution</p>
              <div className="h-4 w-full bg-bg rounded-full overflow-hidden flex">
                {state.cardTypes.map(t => (
                  <div
                    key={t.id}
                    className="h-full transition-all duration-300"
                    style={{ width: `${totalCards > 0 ? (t.count / totalCards) * 100 : 0}%`, backgroundColor: t.color }}
                  />
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2 mt-3">
                {state.cardTypes.map(t => (
                  <div key={t.id} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: t.color }} />
                    <span className="text-[10px] text-gray-400 truncate">{t.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <Button
          className="w-full py-4 rounded-xl shadow-xl shadow-accent/10"
          onClick={() => setState(prev => ({ ...prev, currentStage: 'balance' }))}
        >
          Continue to Balance
        </Button>
      </aside>
    </div>
  );
}
