import React from 'react';
import { 
  Plus, 
  Trash2, 
  Sparkles, 
  ChevronRight, 
  Info,
  Layers,
  Zap,
  Skull,
  User,
  Gem
} from 'lucide-react';
import { AppState } from '../types';
import { Button, Card, Badge, cn } from '../components/UI';

interface Props {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

export default function DesignStage({ state, setState }: Props) {
  const [selectedTypeId, setSelectedTypeId] = React.useState(state.cardTypes[0].id);
  const selectedType = state.cardTypes.find(t => t.id === selectedTypeId);
  const totalCards = state.cardTypes.reduce((sum, t) => sum + t.count, 0);
  const estCostPerUnit = (totalCards * 0.14 + 4.50).toFixed(2); // ~$0.14/card + $4.50 box

  return (
    <div className="flex gap-8 h-full">
      {/* Left Panel: Tree View */}
      <aside className="w-64 space-y-6 shrink-0">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500">Components</h3>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 rounded-full">
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
        <Card key={selectedTypeId} className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: selectedType?.color + '20' }}>
                <Layers style={{ color: selectedType?.color }} />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{selectedType?.name} Editor</h2>
                <p className="text-sm text-gray-500">Define the core attributes and behavior of this component.</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="text-error hover:bg-error/10">
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
                  defaultValue={selectedType?.name}
                />
              </label>

              <div className="grid grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-xs font-bold text-gray-400 uppercase mb-2 block">Base Cost</span>
                  <div className="flex items-center bg-bg border border-white/10 rounded-xl overflow-hidden">
                    <button className="px-3 py-3 hover:bg-white/5">-</button>
                    <input className="w-full bg-transparent text-center outline-none" defaultValue="2" />
                    <button className="px-3 py-3 hover:bg-white/5">+</button>
                  </div>
                </label>
                <label className="block">
                  <span className="text-xs font-bold text-gray-400 uppercase mb-2 block">Rarity</span>
                  <select className="w-full bg-bg border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-accent">
                    <option>Common</option>
                    <option>Uncommon</option>
                    <option>Rare</option>
                    <option>Legendary</option>
                  </select>
                </label>
              </div>

              <label className="block">
                <span className="text-xs font-bold text-gray-400 uppercase mb-2 block">Standard Stats</span>
                <div className="space-y-2">
                  <div className="flex items-center gap-4 bg-bg p-3 rounded-xl border border-white/5">
                    <span className="text-sm font-medium flex-1">Intellect</span>
                    <input className="w-12 bg-surface-light rounded text-center text-sm py-1" defaultValue="4" />
                  </div>
                  <div className="flex items-center gap-4 bg-bg p-3 rounded-xl border border-white/5">
                    <span className="text-sm font-medium flex-1">Sanity</span>
                    <input className="w-12 bg-surface-light rounded text-center text-sm py-1" defaultValue="10" />
                  </div>
                </div>
              </label>
            </div>

            <div className="space-y-6">
              <label className="block">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-gray-400 uppercase">Effect Logic</span>
                  <Badge variant="ai">AI Assisted</Badge>
                </div>
                <div className="relative">
                  <textarea 
                    className="w-full h-32 bg-bg border border-white/10 rounded-xl p-4 text-sm outline-none focus:border-accent resize-none"
                    placeholder="Describe what this card does..."
                    defaultValue="When played, draw 2 cards. If you have no artifacts, gain +1 Sanity."
                  />
                  <div className="absolute bottom-3 right-3">
                    <Button variant="ai" size="sm" className="h-7 text-[10px]">
                      <Sparkles size={12} className="mr-1" />
                      Optimize
                    </Button>
                  </div>
                </div>
              </label>

              <div className="bg-ai/5 border border-ai/20 rounded-xl p-4">
                <div className="flex gap-3">
                  <Info size={16} className="text-ai shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-ai uppercase mb-1">AI Suggestion</p>
                    <p className="text-xs text-gray-300">
                      "Based on your cooperative theme, consider adding a <span className="text-ai font-bold underline decoration-ai/30 cursor-pointer">Support Keyword</span> to this type."
                    </p>
                    <div className="flex gap-2 mt-3">
                      <Button variant="ai" size="sm" className="h-7 text-[10px]">Accept</Button>
                      <Button variant="ghost" size="sm" className="h-7 text-[10px]">Dismiss</Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
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

        <Button className="w-full py-4 rounded-xl shadow-xl shadow-accent/10">
          Run Balance Check
        </Button>
      </aside>
    </div>
  );
}
