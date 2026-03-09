import React from 'react';
import {
  Plus,
  Trash2,
  Sparkles,
  ChevronRight,
  Info,
  Layers,
  Loader2,
} from 'lucide-react';
import { AppState } from '../types';
import { Button, Card, Badge, cn } from '../components/UI';
import { api } from '../api';

interface Props {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

export default function DesignStage({ state, setState }: Props) {
  const [selectedTypeId, setSelectedTypeId] = React.useState(state.cardTypes[0]?.id ?? '');
  const selectedType = state.cardTypes.find(t => t.id === selectedTypeId);
  const totalCards = state.cardTypes.reduce((sum, t) => sum + t.count, 0);
  const estCostPerUnit = (totalCards * 0.14 + 4.50).toFixed(2);
  const [isGeneratingTypes, setIsGeneratingTypes] = React.useState(false);
  const [isGeneratingCards, setIsGeneratingCards] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const selectedConcept = state.concepts.find(c => c.id === state.selectedConceptId);
  const cardsForType = state.cards.filter(c => c.typeId === selectedTypeId);

  const handleGenerateCardTypes = async () => {
    if (!selectedConcept) return;
    setIsGeneratingTypes(true);
    setError(null);
    try {
      const projectId = state.projectId ?? 'draft';
      const types = await api.generateCardTypes(projectId, {
        concept_title: selectedConcept.title,
        concept_description: selectedConcept.description,
        mechanics: selectedConcept.mechanics,
        brief_settings: state.briefSettings,
        count: 4,
      });
      const mapped = types.map((t: any) => ({
        id: t.id,
        name: t.name,
        color: t.color ?? '#3B82F6',
        icon: t.icon ?? 'layers',
        count: t.count ?? 10,
      }));
      setState(prev => ({ ...prev, cardTypes: mapped, cards: [] }));
      if (mapped.length > 0) setSelectedTypeId(mapped[0].id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate card types');
    } finally {
      setIsGeneratingTypes(false);
    }
  };

  const handleGenerateCards = async () => {
    if (!selectedType || !selectedConcept) return;
    setIsGeneratingCards(true);
    setError(null);
    try {
      const projectId = state.projectId ?? 'draft';
      const cards = await api.generateCards(projectId, {
        concept_title: selectedConcept.title,
        concept_description: selectedConcept.description,
        mechanics: selectedConcept.mechanics,
        type_id: selectedType.id,
        type_name: selectedType.name,
        type_count: selectedType.count,
        count: selectedType.count,
      });
      const mapped = cards.map((c: any) => ({
        id: c.id,
        typeId: c.type_id ?? c.typeId,
        name: c.name,
        cost: c.cost ?? 0,
        stats: c.stats ?? {},
        effect: c.effect ?? '',
        flavorText: c.flavor_text ?? c.flavorText ?? '',
        artUrl: c.art_url ?? undefined,
      }));
      setState(prev => ({
        ...prev,
        cards: [
          ...prev.cards.filter(c => c.typeId !== selectedType.id),
          ...mapped,
        ],
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate cards');
    } finally {
      setIsGeneratingCards(false);
    }
  };

  return (
    <div className="flex gap-8 h-full">
      {/* Left Panel: Tree View */}
      <aside className="w-64 space-y-6 shrink-0">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500">Components</h3>
          <Button
            variant="ghost" size="sm" className="h-6 w-6 p-0 rounded-full"
            onClick={handleGenerateCardTypes}
            disabled={isGeneratingTypes || !selectedConcept}
            title={selectedConcept ? 'Generate card types from concept' : 'Select a concept in Brief first'}
          >
            {isGeneratingTypes ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
          </Button>
        </div>

        {state.cardTypes.length === 0 ? (
          <div className="px-3 py-8 text-center">
            <p className="text-sm text-gray-500 mb-3">No card types yet.</p>
            <Button
              variant="ai" size="sm"
              onClick={handleGenerateCardTypes}
              disabled={isGeneratingTypes || !selectedConcept}
            >
              {isGeneratingTypes ? (
                <Loader2 size={14} className="mr-2 animate-spin" />
              ) : (
                <Sparkles size={14} className="mr-2" />
              )}
              Generate from Concept
            </Button>
          </div>
        ) : (
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
        )}

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
      <div className="flex-1 space-y-6">
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400">
            {error}
          </div>
        )}

        {selectedType ? (
          <Card key={selectedTypeId} className="p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: selectedType.color + '20' }}>
                  <Layers style={{ color: selectedType.color }} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{selectedType.name} Editor</h2>
                  <p className="text-sm text-gray-500">
                    {cardsForType.length} card{cardsForType.length !== 1 ? 's' : ''} generated of {selectedType.count} target
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ai" size="sm"
                  onClick={handleGenerateCards}
                  disabled={isGeneratingCards}
                >
                  {isGeneratingCards ? (
                    <Loader2 size={14} className="mr-2 animate-spin" />
                  ) : (
                    <Sparkles size={14} className="mr-2" />
                  )}
                  {cardsForType.length > 0 ? 'Regenerate Cards' : 'Generate Cards'}
                </Button>
              </div>
            </div>

            {cardsForType.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">No cards generated yet for this type.</p>
                <Button variant="ai" onClick={handleGenerateCards} disabled={isGeneratingCards}>
                  {isGeneratingCards ? (
                    <Loader2 size={14} className="mr-2 animate-spin" />
                  ) : (
                    <Sparkles size={14} className="mr-2" />
                  )}
                  Generate {selectedType.count} Cards
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-[1fr_80px_1fr_1fr] gap-4 px-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                  <span>Name</span>
                  <span>Cost</span>
                  <span>Stats</span>
                  <span>Effect</span>
                </div>
                {cardsForType.map((card) => (
                  <div
                    key={card.id}
                    className="grid grid-cols-[1fr_80px_1fr_1fr] gap-4 items-center bg-bg border border-white/5 rounded-xl px-4 py-3 hover:border-white/10 transition-colors"
                  >
                    <div>
                      <p className="text-sm font-semibold">{card.name}</p>
                      <p className="text-[10px] text-gray-500 italic truncate">{card.flavorText}</p>
                    </div>
                    <div className="flex items-center justify-center">
                      <span className="bg-accent/20 text-accent text-xs font-bold px-2 py-1 rounded-lg">{card.cost}</span>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {Object.entries(card.stats).map(([key, val]) => (
                        <span key={key} className="text-[10px] bg-surface-light px-2 py-1 rounded text-gray-300">
                          {key}: {val}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-gray-400 line-clamp-2">{card.effect}</p>
                  </div>
                ))}
              </div>
            )}
          </Card>
        ) : (
          <Card className="p-8 text-center">
            <p className="text-gray-500">Select or generate card types to begin designing.</p>
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
              <span className="text-sm text-gray-400">Unique Types</span>
              <span className="text-sm font-bold">{state.cardTypes.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Cards Generated</span>
              <span className="text-sm font-bold">{state.cards.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Est. Production Cost</span>
              <span className="text-sm font-bold text-accent">${estCostPerUnit} / unit</span>
            </div>

            {state.cardTypes.length > 0 && (
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
            )}
          </div>
        </Card>

        <Button
          className="w-full py-4 rounded-xl shadow-xl shadow-accent/10"
          onClick={() => setState(prev => ({ ...prev, currentStage: 'balance' }))}
        >
          Run Balance Check
        </Button>
      </aside>
    </div>
  );
}
