import { Lightbulb } from 'lucide-react';

interface Props {
  insights: string[];
}

export function AnalyticsInsights({ insights }: Props) {
  return (
    <div className="bg-blue-500/5 border border-blue-500/20 p-6 rounded-2xl">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="w-5 h-5 text-blue-400" />
        <h3 className="text-lg font-bold text-blue-400">Insights da IA</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {insights.map((insight, i) => (
          <div key={i} className="flex items-start gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
            <span className="text-sm text-zinc-300">{insight}</span>
          </div>
        ))}
        {insights.length === 0 && <p className="text-zinc-500 text-sm italic">Processando insights...</p>}
      </div>
    </div>
  );
}
