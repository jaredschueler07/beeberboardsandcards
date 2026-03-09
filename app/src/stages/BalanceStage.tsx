import React from 'react';
import { motion } from 'motion/react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { Play, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import { AppState } from '../types';
import { Button, Card, Badge, cn } from '../components/UI';
import { api } from '../api';

interface Props {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

const GAME_COUNT_OPTIONS = [
  { label: '100 Games', value: 100 },
  { label: '1,000 Games', value: 1000 },
  { label: '10,000 Games', value: 10000 },
];

export default function BalanceStage({ state, setState }: Props) {
  const [isSimulating, setIsSimulating] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [gameCount, setGameCount] = React.useState(1000);
  const [error, setError] = React.useState<string | null>(null);

  const runSimulation = async () => {
    setIsSimulating(true);
    setProgress(0);
    setError(null);

    // Animate progress bar while waiting for API
    const interval = setInterval(() => {
      setProgress(prev => prev >= 90 ? 90 : prev + 5);
    }, 100);

    try {
      const projectId = state.projectId ?? 'draft';
      const result = await api.runSimulation(projectId, { game_count: gameCount });

      clearInterval(interval);
      setProgress(100);

      setState(prev => ({
        ...prev,
        simulationData: {
          winRate: result.winRate,
          usage: result.usage,
          length: result.length,
          comeback: result.comeback,
        },
      }));

      setTimeout(() => setIsSimulating(false), 500);
    } catch (err) {
      clearInterval(interval);
      setIsSimulating(false);
      setProgress(0);
      setError(err instanceof Error ? err.message : 'Simulation failed');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Balance & Simulation</h2>
          <p className="text-sm text-gray-500">AI-driven playtesting to ensure your game is fair and engaging.</p>
        </div>
        <div className="flex items-center gap-4">
          <select
            className="bg-surface border border-white/10 rounded-lg px-4 py-2 text-sm outline-none"
            value={gameCount}
            onChange={(e) => setGameCount(parseInt(e.target.value))}
          >
            {GAME_COUNT_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <Button
            onClick={runSimulation}
            disabled={isSimulating}
            className="shadow-lg shadow-accent/20"
          >
            {isSimulating ? (
              <RefreshCw size={18} className="mr-2 animate-spin" />
            ) : (
              <Play size={18} className="mr-2" />
            )}
            Run Simulation
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400">
          {error}
        </div>
      )}

      {isSimulating && (
        <Card className="p-6 bg-accent/5 border-accent/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-accent uppercase">Simulating {gameCount.toLocaleString()} Games...</span>
            <span className="text-sm font-bold text-accent">{progress}%</span>
          </div>
          <div className="w-full h-2 bg-bg rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-accent"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
            />
          </div>
        </Card>
      )}

      {!state.simulationData ? (
        <Card className="p-12 text-center">
          <p className="text-gray-500 mb-4">No simulation data yet. Run a simulation to analyze your game's balance.</p>
          <Button onClick={runSimulation} disabled={isSimulating}>
            <Play size={18} className="mr-2" />
            Run First Simulation
          </Button>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="p-6">
              <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-6">Win Rate by Player Position</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={state.simulationData.winRate}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                    <XAxis dataKey="position" stroke="#9CA3AF" fontSize={12} />
                    <YAxis stroke="#9CA3AF" fontSize={12} unit="%" />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1F2937', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                      itemStyle={{ color: '#F59E0B' }}
                    />
                    <Bar dataKey="rate" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-6">Game Length Distribution</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={state.simulationData.length}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                    <XAxis dataKey="minutes" stroke="#9CA3AF" fontSize={12} unit="m" />
                    <YAxis stroke="#9CA3AF" fontSize={12} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1F2937', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                      itemStyle={{ color: '#8B5CF6' }}
                    />
                    <Line type="monotone" dataKey="frequency" stroke="#8B5CF6" strokeWidth={3} dot={{ fill: '#8B5CF6' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-6">Comeback Frequency</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={state.simulationData.comeback}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                    <XAxis dataKey="turn" stroke="#9CA3AF" fontSize={12} label={{ value: 'Turn', position: 'insideBottom', offset: -2, fill: '#9CA3AF', fontSize: 10 }} />
                    <YAxis stroke="#9CA3AF" fontSize={12} unit="%" />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1F2937', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                      itemStyle={{ color: '#10B981' }}
                    />
                    <Bar dataKey="rate" fill="#10B981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500">AI Balance Suggestions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card ai className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <Badge variant="ai">High Impact</Badge>
                    <AlertCircle size={18} className="text-ai" />
                  </div>
                  <h4 className="font-bold mb-2">Nerf "Rusty Sextant"</h4>
                  <p className="text-xs text-gray-400 mb-4">
                    This card is appearing in 85% of winning decks. Consider increasing cost from 2 to 3.
                  </p>
                  <div className="flex gap-2">
                    <Button variant="ai" size="sm" className="flex-1">Apply</Button>
                    <Button variant="ghost" size="sm" className="flex-1">Ignore</Button>
                  </div>
                </Card>

                <Card ai className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <Badge variant="ai">Engagement</Badge>
                    <Sparkles size={18} className="text-ai" />
                  </div>
                  <h4 className="font-bold mb-2">Buff "Event" Frequency</h4>
                  <p className="text-xs text-gray-400 mb-4">
                    Early game feels slow. Increasing Event card draw rate by 15% improves player engagement scores.
                  </p>
                  <div className="flex gap-2">
                    <Button variant="ai" size="sm" className="flex-1">Apply</Button>
                    <Button variant="ghost" size="sm" className="flex-1">Ignore</Button>
                  </div>
                </Card>
              </div>
            </div>

            <Card className="p-6">
              <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-6">Card Usage Heatmap</h3>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={state.simulationData.usage}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {state.simulationData.usage.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6'][index % 5]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 mt-4">
                {state.simulationData.usage.map((entry, index) => (
                  <div key={entry.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6'][index % 5] }} />
                      <span className="text-gray-400">{entry.name}</span>
                    </div>
                    <span className="font-bold">{entry.value}%</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
