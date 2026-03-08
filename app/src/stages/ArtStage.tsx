import React from 'react';
import { 
  Sparkles, 
  Upload, 
  RefreshCw, 
  Maximize2, 
  Grid, 
  Type, 
  Palette as PaletteIcon,
  Image as ImageIcon,
  Search,
  Plus
} from 'lucide-react';
import { AppState } from '../types';
import { Button, Card, Badge, cn } from '../components/UI';

interface Props {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

export default function ArtStage({ state, setState }: Props) {
  const [selectedStyle, setSelectedStyle] = React.useState(0);

  const MOOD_BOARDS = [
    { id: 0, title: 'Eldritch Noir', colors: ['#0F172A', '#1E293B', '#334155', '#F59E0B'], img: 'https://picsum.photos/seed/noir/400/300' },
    { id: 1, title: 'Bioluminescent', colors: ['#020617', '#1E1B4B', '#312E81', '#06B6D4'], img: 'https://picsum.photos/seed/bio/400/300' },
    { id: 2, title: 'Victorian Steampunk', colors: ['#451A03', '#78350F', '#92400E', '#F59E0B'], img: 'https://picsum.photos/seed/steam/400/300' },
  ];

  const ASSETS = [
    { id: 1, type: 'Illustration', name: 'Scholar Portrait', status: 'ready', img: 'https://picsum.photos/seed/scholar/200/200' },
    { id: 2, type: 'Icon', name: 'Intellect Pip', status: 'ready', img: 'https://picsum.photos/seed/brain/200/200' },
    { id: 3, type: 'Illustration', name: 'Rusty Sextant', status: 'ready', img: 'https://picsum.photos/seed/sextant/200/200' },
    { id: 4, type: 'Board', name: 'Submerged Library', status: 'generating', img: 'https://picsum.photos/seed/library/200/200' },
    { id: 5, type: 'Icon', name: 'Sanity Pip', status: 'ready', img: 'https://picsum.photos/seed/sanity/200/200' },
    { id: 6, type: 'Illustration', name: 'Deep One', status: 'ready', img: 'https://picsum.photos/seed/monster/200/200' },
    { id: 7, type: 'Box', name: 'Game Box Front', status: 'custom', img: 'https://picsum.photos/seed/box/200/200' },
    { id: 8, type: 'Illustration', name: 'Flooded Street', status: 'ready', img: 'https://picsum.photos/seed/street/200/200' },
  ];

  return (
    <div className="flex gap-8 h-full">
      <div className="flex-1 space-y-8">
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Style Guide</h2>
            <Button variant="ai" size="sm">
              <Sparkles size={16} className="mr-2" />
              Generate New Styles
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-6">
            {MOOD_BOARDS.map((style) => (
              <Card 
                key={style.id}
                className={cn(
                  "cursor-pointer transition-all hover:scale-[1.02]",
                  selectedStyle === style.id ? "ring-2 ring-accent" : "hover:border-white/20"
                )}
                onClick={() => setSelectedStyle(style.id)}
              >
                <img src={style.img} alt={style.title} className="w-full h-32 object-cover" referrerPolicy="no-referrer" />
                <div className="p-4">
                  <h4 className="font-bold text-sm mb-3">{style.title}</h4>
                  <div className="flex gap-2">
                    {style.colors.map(c => (
                      <div key={c} className="w-6 h-6 rounded-full border border-white/10" style={{ backgroundColor: c }} />
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-bold">Asset Gallery</h2>
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input 
                  placeholder="Search assets..."
                  className="bg-surface border border-white/10 rounded-lg pl-9 pr-4 py-1.5 text-xs outline-none focus:border-accent w-48"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm"><Grid size={16} /></Button>
              <Button variant="secondary" size="sm">
                <Upload size={16} className="mr-2" />
                Upload Asset
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {ASSETS.map((asset) => (
              <Card key={asset.id} className="group cursor-pointer relative">
                <div className="aspect-square relative overflow-hidden">
                  <img src={asset.img} alt={asset.name} className="w-full h-full object-cover transition-transform group-hover:scale-110" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button variant="secondary" size="sm" className="h-8 w-8 p-0 rounded-full"><Maximize2 size={14} /></Button>
                    <Button variant="secondary" size="sm" className="h-8 w-8 p-0 rounded-full"><RefreshCw size={14} /></Button>
                  </div>
                  {asset.status === 'generating' && (
                    <div className="absolute inset-0 bg-bg/80 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center">
                      <RefreshCw size={24} className="text-ai animate-spin mb-2" />
                      <span className="text-[10px] font-bold text-ai uppercase">Generating...</span>
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">{asset.type}</p>
                  <p className="text-xs font-bold truncate">{asset.name}</p>
                </div>
                {asset.status === 'custom' && (
                  <div className="absolute top-2 right-2">
                    <Badge variant="default" className="bg-bg/80 backdrop-blur-md">Custom</Badge>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </section>
      </div>

      <aside className="w-72 space-y-6 shrink-0">
        <Card className="p-6 space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500">Active Style Guide</h3>
          
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <PaletteIcon size={14} className="text-accent" />
                <span className="text-xs font-bold uppercase text-gray-400">Color Palette</span>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {MOOD_BOARDS[selectedStyle].colors.map(c => (
                  <div key={c} className="aspect-square rounded-lg border border-white/10" style={{ backgroundColor: c }} />
                ))}
                <button className="aspect-square rounded-lg border border-dashed border-white/20 flex items-center justify-center hover:border-accent transition-colors">
                  <Plus size={14} className="text-gray-500" />
                </button>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <Type size={14} className="text-accent" />
                <span className="text-xs font-bold uppercase text-gray-400">Typography</span>
              </div>
              <div className="space-y-2">
                <div className="bg-bg p-3 rounded-lg border border-white/5">
                  <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Heading</p>
                  <p className="text-lg font-bold">Space Grotesk</p>
                </div>
                <div className="bg-bg p-3 rounded-lg border border-white/5">
                  <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Body</p>
                  <p className="text-sm">Inter</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-dashed border-white/20 bg-transparent">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-surface-light flex items-center justify-center mb-4">
              <Upload size={20} className="text-gray-400" />
            </div>
            <p className="text-sm font-bold mb-1">Reference Images</p>
            <p className="text-xs text-gray-500 mb-4">Upload images to guide the AI art generation style.</p>
            <Button variant="ghost" size="sm" className="w-full border border-white/10">Select Files</Button>
          </div>
        </Card>
      </aside>
    </div>
  );
}
