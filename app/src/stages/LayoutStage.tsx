import React from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  Grid, 
  MousePointer2, 
  Type, 
  ImageIcon, 
  Square, 
  Layers, 
  Undo2, 
  Redo2,
  Hand,
  Eye,
  Maximize2,
  Plus,
  Sparkles
} from 'lucide-react';
import { motion } from 'motion/react';
import { AppState } from '../types';
import { Button, Card, Badge, cn } from '../components/UI';

interface Props {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

export default function LayoutStage({ state, setState }: Props) {
  const [selectedElement, setSelectedElement] = React.useState<string | null>('title');
  const [isPreviewMode, setIsPreviewMode] = React.useState(false);
  const [isCanvasEmpty, setIsCanvasEmpty] = React.useState(false);

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="h-12 border-b border-white/5 flex items-center justify-between px-4 bg-surface/50 backdrop-blur-md mb-6 rounded-xl">
        <div className="flex items-center gap-1">
          <Button 
            variant={isCanvasEmpty ? 'primary' : 'ghost'} 
            size="sm" 
            className="h-8 px-3 text-[10px] font-bold uppercase tracking-wider"
            onClick={() => setIsCanvasEmpty(!isCanvasEmpty)}
          >
            {isCanvasEmpty ? 'Populate' : 'Empty State'}
          </Button>
          <div className="w-px h-4 bg-white/10 mx-1" />
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0"><MousePointer2 size={16} /></Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0"><Hand size={16} /></Button>
          <div className="w-px h-4 bg-white/10 mx-1" />
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0"><Type size={16} /></Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0"><ImageIcon size={16} /></Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0"><Square size={16} /></Button>
          <div className="w-px h-4 bg-white/10 mx-1" />
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0"><Layers size={16} /></Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center bg-bg rounded-lg border border-white/10 px-2">
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0"><ZoomOut size={14} /></Button>
            <span className="text-[10px] font-bold w-10 text-center">100%</span>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0"><ZoomIn size={14} /></Button>
          </div>
          <Button variant="ghost" size="sm" className="h-8 px-3 text-[10px] font-bold uppercase tracking-wider">
            <Grid size={14} className="mr-2" />
            Snap
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            variant={isPreviewMode ? 'primary' : 'ghost'} 
            size="sm" 
            className="h-8 px-3 text-[10px] font-bold uppercase tracking-wider"
            onClick={() => setIsPreviewMode(!isPreviewMode)}
          >
            <Eye size={14} className="mr-2" />
            Fan Preview
          </Button>
          <Button variant="secondary" size="sm" className="h-8 px-3 text-[10px] font-bold uppercase tracking-wider">
            Print Preview
          </Button>
        </div>
      </div>

      <div className="flex-1 flex gap-8 overflow-hidden">
        {/* Left: Templates */}
        <aside className="w-64 space-y-6 shrink-0 overflow-y-auto custom-scrollbar pr-2">
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500">Card Templates</h3>
          <div className="space-y-4">
            {state.cardTypes.map(type => (
              <Card key={type.id} className="p-3 cursor-pointer hover:border-accent transition-colors group">
                <div className="aspect-[2.5/3.5] bg-bg rounded-lg border border-white/5 mb-3 relative overflow-hidden">
                  <div className="absolute top-2 left-2 right-2 h-1/2 bg-surface-light rounded-md opacity-20" />
                  <div className="absolute bottom-2 left-2 right-2 h-1/4 bg-surface-light rounded-md opacity-20" />
                  <div className="absolute inset-0 border-2 border-transparent group-hover:border-accent/30 transition-colors" />
                </div>
                <p className="text-xs font-bold text-center">{type.name}</p>
              </Card>
            ))}
          </div>
        </aside>

        {/* Center: Canvas Editor */}
        <div className="flex-1 bg-bg/50 rounded-2xl border border-white/5 relative overflow-hidden flex items-center justify-center p-12">
          <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
          
          {isCanvasEmpty ? (
            <div className="text-center space-y-4 max-w-xs animate-in fade-in zoom-in duration-500">
              <div className="w-16 h-16 bg-surface-light rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/10">
                <Plus size={32} className="text-gray-500" />
              </div>
              <h4 className="text-lg font-bold">Start Your Layout</h4>
              <p className="text-xs text-gray-500 leading-relaxed">Select a card template from the left or drag an element from the toolbar to begin designing your component layout.</p>
              <Button variant="ai" size="sm" onClick={() => setIsCanvasEmpty(false)}>
                <Sparkles size={14} className="mr-2" />
                Auto-Layout with AI
              </Button>
            </div>
          ) : (
            <>
              <motion.div 
                layout
                className={cn(
                  "relative bg-white text-bg shadow-2xl transition-all duration-500",
                  isPreviewMode ? "rotate-[-10deg] translate-x-[-20px]" : ""
                )}
                style={{ width: '350px', height: '490px', borderRadius: '16px' }}
              >
                {/* Card Content Simulation */}
                <div className="absolute inset-0 p-4 flex flex-col">
                  {/* Art Box */}
                  <div 
                    className={cn(
                      "w-full h-1/2 bg-gray-200 rounded-lg overflow-hidden relative group cursor-pointer",
                      selectedElement === 'art' && "ring-4 ring-accent ring-inset"
                    )}
                    onClick={() => setSelectedElement('art')}
                  >
                    <img src="https://picsum.photos/seed/scholar/400/600" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-accent/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>

                  {/* Title Bar */}
                  <div 
                    className={cn(
                      "mt-4 p-2 bg-gray-100 rounded border border-gray-300 flex justify-between items-center cursor-pointer",
                      selectedElement === 'title' && "ring-2 ring-accent"
                    )}
                    onClick={() => setSelectedElement('title')}
                  >
                    <span className="font-bold text-sm">Dr. Aris Thorne</span>
                    <span className="bg-bg text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center">0</span>
                  </div>

                  {/* Type Line */}
                  <div className="mt-2 px-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                    Scholar • Unique
                  </div>

                  {/* Text Box */}
                  <div 
                    className={cn(
                      "mt-2 flex-1 p-3 bg-gray-50 rounded border border-gray-200 text-[11px] leading-relaxed cursor-pointer",
                      selectedElement === 'text' && "ring-2 ring-accent"
                    )}
                    onClick={() => setSelectedElement('text')}
                  >
                    <p className="font-medium">Once per turn, you may look at the top 3 cards of the Archive deck.</p>
                    <p className="mt-2 italic text-gray-400">"The water hides more than just secrets."</p>
                  </div>

                  {/* Stats Bar */}
                  <div className="mt-4 flex justify-between">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-lg">4</div>
                    <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-lg">5</div>
                  </div>
                </div>

                {/* Selection Handles */}
                {selectedElement && (
                  <div className="absolute -inset-1 border-2 border-accent rounded-[18px] pointer-events-none">
                    <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-accent rounded-full" />
                    <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-accent rounded-full" />
                    <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-accent rounded-full" />
                    <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-accent rounded-full" />
                  </div>
                )}
              </motion.div>

              {isPreviewMode && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="absolute bg-white text-bg shadow-2xl rotate-[5deg] translate-x-[40px] pointer-events-none"
                  style={{ width: '350px', height: '490px', borderRadius: '16px', zIndex: -1 }}
                >
                  <div className="absolute inset-0 p-4 flex flex-col opacity-50">
                      <div className="w-full h-1/2 bg-gray-200 rounded-lg" />
                      <div className="mt-4 h-8 bg-gray-100 rounded" />
                      <div className="mt-4 flex-1 bg-gray-50 rounded" />
                  </div>
                </motion.div>
              )}
            </>
          )}
        </div>

        {/* Right: Inspector */}
        <aside className="w-72 space-y-6 shrink-0">
          <Card className="p-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-6">Properties</h3>
            
            {selectedElement ? (
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase mb-2 block">Position</label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-bg p-2 rounded border border-white/5 flex justify-between items-center">
                      <span className="text-[10px] text-gray-500">X</span>
                      <span className="text-xs font-mono">24px</span>
                    </div>
                    <div className="bg-bg p-2 rounded border border-white/5 flex justify-between items-center">
                      <span className="text-[10px] text-gray-500">Y</span>
                      <span className="text-xs font-mono">120px</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase mb-2 block">Typography</label>
                  <div className="space-y-2">
                    <select className="w-full bg-bg border border-white/10 rounded px-3 py-2 text-xs">
                      <option>Space Grotesk</option>
                      <option>Inter</option>
                      <option>JetBrains Mono</option>
                    </select>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-bg p-2 rounded border border-white/5 flex justify-between items-center">
                        <span className="text-[10px] text-gray-500">Size</span>
                        <span className="text-xs font-mono">14pt</span>
                      </div>
                      <div className="bg-bg p-2 rounded border border-white/5 flex justify-between items-center">
                        <span className="text-[10px] text-gray-500">Weight</span>
                        <span className="text-xs font-mono">Bold</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase mb-2 block">Appearance</label>
                  <div className="flex gap-2">
                    <button className="w-8 h-8 rounded-full bg-bg border border-white/10" />
                    <button className="w-8 h-8 rounded-full bg-accent" />
                    <button className="w-8 h-8 rounded-full bg-blue-500" />
                    <button className="w-8 h-8 rounded-full bg-red-500" />
                    <button className="w-8 h-8 rounded-full border border-dashed border-white/20 flex items-center justify-center">
                      <Plus size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <MousePointer2 size={32} className="mx-auto text-gray-600 mb-4" />
                <p className="text-xs text-gray-500">Select an element on the canvas to edit its properties.</p>
              </div>
            )}
          </Card>

          <Card className="p-4 bg-ai/5 border-ai/20">
            <div className="flex gap-3">
              <Sparkles size={16} className="text-ai shrink-0 mt-1" />
              <div>
                <p className="text-xs font-bold text-ai uppercase mb-1">AI Layout Tip</p>
                <p className="text-[11px] text-gray-300 leading-relaxed">
                  "I've aligned your text box to the golden ratio for better readability."
                </p>
              </div>
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}
