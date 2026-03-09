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
  Package,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { AppState } from '../types';
import { Button, Card, Badge, cn } from '../components/UI';
import { api } from '../api';

interface Props {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

export default function ExportStage({ state, setState }: Props) {
  const [paperSize, setPaperSize] = React.useState<'letter' | 'a4'>('letter');
  const [showCropMarks, setShowCropMarks] = React.useState(true);
  const [isExporting, setIsExporting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [lastExport, setLastExport] = React.useState<{ name: string; size: string; time: Date } | null>(null);

  const totalCards = state.cards.length;
  const totalTypes = state.cardTypes.length;
  const estCost = (totalCards * 0.14 + 4.50).toFixed(2);
  const hasCards = totalCards > 0;

  const handleExportPnP = async () => {
    if (!state.projectId) return;
    setIsExporting(true);
    setError(null);
    try {
      const blob = await api.exportPnPPdf(state.projectId, {
        paper_size: paperSize,
        show_crop_marks: showCropMarks,
      });

      // Trigger browser download
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const filename = `${state.projectName.replace(/\s+/g, '_')}_PnP.pdf`;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      const sizeMB = (blob.size / (1024 * 1024)).toFixed(1);
      setLastExport({ name: filename, size: `${sizeMB} MB`, time: new Date() });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Export failed');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
      <div className="lg:col-span-2 space-y-8">
        <section>
          <h2 className="text-2xl font-bold mb-6">Export & Publish</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400 flex items-center gap-2">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Print-and-Play — functional */}
            <Card className="group cursor-pointer hover:border-accent transition-all hover:scale-[1.02] active:scale-[0.98]">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-xl bg-surface-light flex items-center justify-center text-blue-400 transition-colors group-hover:bg-accent/10">
                    <Printer size={24} />
                  </div>
                  <Badge>Free</Badge>
                </div>
                <h3 className="text-lg font-bold mb-2">Print-and-Play PDF</h3>
                <p className="text-xs text-gray-400 leading-relaxed mb-3">
                  High-quality PDF with bleed and crop marks, optimized for home printing.
                </p>
                <div className="flex gap-2 mt-3 mb-3">
                  <button
                    onClick={() => setPaperSize('letter')}
                    className={cn(
                      "px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-colors",
                      paperSize === 'letter' ? "bg-accent text-bg" : "bg-surface-light text-gray-400 hover:text-white"
                    )}
                  >
                    US Letter
                  </button>
                  <button
                    onClick={() => setPaperSize('a4')}
                    className={cn(
                      "px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-colors",
                      paperSize === 'a4' ? "bg-accent text-bg" : "bg-surface-light text-gray-400 hover:text-white"
                    )}
                  >
                    A4
                  </button>
                </div>
                <label className="flex items-center gap-2 text-xs text-gray-400 mb-4 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showCropMarks}
                    onChange={(e) => setShowCropMarks(e.target.checked)}
                    className="accent-accent"
                  />
                  Show crop marks
                </label>
                <Button
                  size="sm"
                  className="w-full justify-between"
                  onClick={handleExportPnP}
                  disabled={isExporting || !hasCards}
                >
                  {isExporting ? (
                    <>
                      <span className="flex items-center gap-2">
                        <Loader2 size={14} className="animate-spin" />
                        Generating PDF...
                      </span>
                    </>
                  ) : (
                    <>
                      {hasCards ? 'Download PDF' : 'Generate cards first'}
                      <Download size={16} />
                    </>
                  )}
                </Button>
              </div>
            </Card>

            {/* TTS — placeholder */}
            <Card className="group cursor-pointer hover:border-accent/50 transition-all opacity-60">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-xl bg-surface-light flex items-center justify-center text-purple-400">
                    <Monitor size={24} />
                  </div>
                  <Badge>Coming Soon</Badge>
                </div>
                <h3 className="text-lg font-bold mb-2">Tabletop Simulator</h3>
                <p className="text-xs text-gray-400 leading-relaxed mb-3">
                  Generate a JSON mod file and asset cloud links for digital playtesting.
                </p>
              </div>
            </Card>

            {/* Game Crafter — placeholder */}
            <Card className="group cursor-pointer hover:border-accent/50 transition-all opacity-60">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-xl bg-surface-light flex items-center justify-center text-accent">
                    <ShoppingBag size={24} />
                  </div>
                  <Badge>Coming Soon</Badge>
                </div>
                <h3 className="text-lg font-bold mb-2">The Game Crafter</h3>
                <p className="text-xs text-gray-400 leading-relaxed mb-3">
                  Direct integration to order a professional physical copy of your game.
                </p>
              </div>
            </Card>

            {/* Crowdfunding Kit — placeholder */}
            <Card className="group cursor-pointer hover:border-accent/50 transition-all opacity-60">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-xl bg-surface-light flex items-center justify-center text-emerald-400">
                    <Share2 size={24} />
                  </div>
                  <Badge>Coming Soon</Badge>
                </div>
                <h3 className="text-lg font-bold mb-2">Crowdfunding Kit</h3>
                <p className="text-xs text-gray-400 leading-relaxed mb-3">
                  Box mockups, campaign banners, and a high-res sell sheet for Kickstarter.
                </p>
              </div>
            </Card>
          </div>
        </section>

        {lastExport && (
          <section className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500">Recent Exports</h3>
            <Card className="divide-y divide-white/5">
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-surface-light flex items-center justify-center">
                    <FileText size={20} className="text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">{lastExport.name}</p>
                    <p className="text-[10px] text-gray-500">
                      Generated just now &bull; {lastExport.size}
                    </p>
                  </div>
                </div>
                <CheckCircle2 size={16} className="text-success" />
              </div>
            </Card>
          </section>
        )}
      </div>

      <aside className="space-y-6">
        <Card className="p-6">
          <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-6">Order Summary</h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText size={14} className="text-gray-500" />
                <span className="text-sm">{totalCards}x Cards ({totalTypes} types)</span>
              </div>
              <span className="text-sm font-mono">${(totalCards * 0.14).toFixed(2)}</span>
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
                <span className="text-xl font-bold text-accent">${estCost}</span>
              </div>
              <Button className="w-full py-4 rounded-xl shadow-xl shadow-accent/20 opacity-50 cursor-not-allowed" disabled>
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
              {state.concepts.length > 0 ? (
                <CheckCircle2 size={16} className="text-success" />
              ) : (
                <Clock size={16} className="text-gray-500" />
              )}
              <span className="text-xs">Game concept defined</span>
            </div>
            <div className="flex items-center gap-3">
              {totalCards > 0 ? (
                <CheckCircle2 size={16} className="text-success" />
              ) : (
                <Clock size={16} className="text-gray-500" />
              )}
              <span className="text-xs">Cards generated ({totalCards} cards)</span>
            </div>
            <div className="flex items-center gap-3">
              {state.simulationData ? (
                <CheckCircle2 size={16} className="text-success" />
              ) : (
                <Clock size={16} className="text-gray-500" />
              )}
              <span className="text-xs">Balance validated</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock size={16} className="text-gray-500" />
              <span className="text-xs">Art generation (coming soon)</span>
            </div>
          </div>
        </Card>
      </aside>
    </div>
  );
}
