import React from 'react';
import { 
  FileText, 
  Monitor, 
  ShoppingBag, 
  Share2, 
  Download, 
  ChevronRight,
  CheckCircle2,
  Clock,
  Printer,
  Package
} from 'lucide-react';
import { AppState } from '../types';
import { Button, Card, Badge, cn } from '../components/UI';

interface Props {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

export default function ExportStage({ state, setState }: Props) {
  const [paperSize, setPaperSize] = React.useState<'letter' | 'a4'>('letter');

  const EXPORT_OPTIONS = [
    {
      id: 'pnp',
      title: 'Print-and-Play PDF',
      description: 'High-quality PDF with bleed and crop marks, optimized for home printing.',
      icon: Printer,
      badge: 'Free',
      color: 'text-blue-400',
      extra: (
        <div className="flex gap-2 mt-3 mb-1">
          <button
            onClick={(e) => { e.stopPropagation(); setPaperSize('letter'); }}
            className={cn(
              "px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-colors",
              paperSize === 'letter' ? "bg-accent text-bg" : "bg-surface-light text-gray-400 hover:text-white"
            )}
          >
            US Letter
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setPaperSize('a4'); }}
            className={cn(
              "px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-colors",
              paperSize === 'a4' ? "bg-accent text-bg" : "bg-surface-light text-gray-400 hover:text-white"
            )}
          >
            A4
          </button>
        </div>
      )
    },
    {
      id: 'tts',
      title: 'Tabletop Simulator',
      description: 'Generate a JSON mod file and asset cloud links for digital playtesting.',
      icon: Monitor,
      badge: 'Digital',
      color: 'text-purple-400'
    },
    {
      id: 'tgc',
      title: 'The Game Crafter',
      description: 'Direct integration to order a professional physical copy of your game.',
      icon: ShoppingBag,
      badge: 'Physical',
      color: 'text-accent'
    },
    {
      id: 'kit',
      title: 'Crowdfunding Kit',
      description: 'Box mockups, campaign banners, and a high-res sell sheet for Kickstarter.',
      icon: Share2,
      badge: 'Marketing',
      color: 'text-emerald-400'
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
      <div className="lg:col-span-2 space-y-8">
        <section>
          <h2 className="text-2xl font-bold mb-6">Export & Publish</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {EXPORT_OPTIONS.map((option) => {
              const Icon = option.icon;
              return (
                <Card key={option.id} className="group cursor-pointer hover:border-accent transition-all hover:scale-[1.02] active:scale-[0.98]">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className={cn("w-12 h-12 rounded-xl bg-surface-light flex items-center justify-center transition-colors group-hover:bg-accent/10", option.color)}>
                        <Icon size={24} />
                      </div>
                      <Badge>{option.badge}</Badge>
                    </div>
                    <h3 className="text-lg font-bold mb-2">{option.title}</h3>
                    <p className="text-xs text-gray-400 leading-relaxed mb-3">
                      {option.description}
                    </p>
                    {'extra' in option && option.extra}
                    <div className="mb-3" />
                    <Button variant="ghost" size="sm" className="w-full justify-between group-hover:bg-accent group-hover:text-bg transition-all">
                      Configure Export
                      <ChevronRight size={16} />
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500">Recent Exports</h3>
          <Card className="divide-y divide-white/5">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-surface-light flex items-center justify-center">
                  <FileText size={20} className="text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-bold">Print_Play_V2.pdf</p>
                  <p className="text-[10px] text-gray-500">Generated 2 hours ago • 14.2 MB</p>
                </div>
              </div>
              <Button variant="ghost" size="sm"><Download size={16} /></Button>
            </div>
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-surface-light flex items-center justify-center">
                  <Monitor size={20} className="text-purple-400" />
                </div>
                <div>
                  <p className="text-sm font-bold">TTS_Mod_Alpha.json</p>
                  <p className="text-[10px] text-gray-500">Generated yesterday • 2.1 MB</p>
                </div>
              </div>
              <Button variant="ghost" size="sm"><Download size={16} /></Button>
            </div>
          </Card>
        </section>
      </div>

      <aside className="space-y-6">
        <Card className="p-6">
          <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-6">Order Summary</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText size={14} className="text-gray-500" />
                <span className="text-sm">60x Standard Cards</span>
              </div>
              <span className="text-sm font-mono">$8.40</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package size={14} className="text-gray-500" />
                <span className="text-sm">1x Custom Box (Small)</span>
              </div>
              <span className="text-sm font-mono">$4.50</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-gray-500" />
                <span className="text-sm">AI Processing Fee</span>
              </div>
              <span className="text-sm font-mono text-success">FREE</span>
            </div>

            <div className="pt-4 border-t border-white/5">
              <div className="flex items-center justify-between mb-6">
                <span className="text-base font-bold">Total Estimate</span>
                <span className="text-xl font-bold text-accent">$12.90</span>
              </div>
              <Button className="w-full py-4 rounded-xl shadow-xl shadow-accent/20">
                Proceed to Checkout
              </Button>
              <p className="text-[10px] text-gray-500 text-center mt-4">
                Prices estimated via The Game Crafter API. Shipping not included.
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-surface-light/30">
          <h4 className="text-xs font-bold uppercase text-gray-400 mb-4">Production Status</h4>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 size={16} className="text-success" />
              <span className="text-xs">All card art generated</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 size={16} className="text-success" />
              <span className="text-xs">Rules validated</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock size={16} className="text-accent" />
              <span className="text-xs">Layout bleed check pending</span>
            </div>
          </div>
        </Card>
      </aside>
    </div>
  );
}
