import { Trophy, ArrowDown } from 'lucide-react';
import type { CourseAnalytics } from '@/types';

interface Props {
  data: CourseAnalytics;
}

export function AnalyticsRanking({ data }: Props) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Top Students */}
      <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl">
        <div className="flex items-center gap-2 mb-6">
          <Trophy className="w-5 h-5 text-yellow-500" />
          <h3 className="text-lg font-bold text-white">Top 5 Alunos</h3>
        </div>
        <div className="space-y-3">
          {data.ranking.top.map((student, i) => (
            <div key={i} className="flex justify-between items-center p-3 bg-zinc-800/30 rounded-xl border border-zinc-800/50">
              <div className="flex items-center gap-3">
                <span className="text-zinc-500 font-mono text-sm">#{i + 1}</span>
                <span className="text-sm font-medium text-white">{student.name}</span>
              </div>
              <span className="text-sm font-bold text-blue-400">{student.score} pts</span>
            </div>
          ))}
          {data.ranking.top.length === 0 && <p className="text-zinc-500 text-sm italic">Nenhum dado disponível</p>}
        </div>
      </div>

      {/* Bottom Students */}
      <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl">
        <div className="flex items-center gap-2 mb-6">
          <ArrowDown className="w-5 h-5 text-red-500" />
          <h3 className="text-lg font-bold text-white">Atenção Prioritária</h3>
        </div>
        <div className="space-y-3">
          {data.ranking.bottom.map((student, i) => (
            <div key={i} className="flex justify-between items-center p-3 bg-zinc-800/30 rounded-xl border border-zinc-800/50">
              <div className="flex items-center gap-3">
                <span className="text-zinc-500 font-mono text-sm">#{i + 1}</span>
                <span className="text-sm font-medium text-white">{student.name}</span>
              </div>
              <span className="text-sm font-bold text-red-400">{student.score} pts</span>
            </div>
          ))}
          {data.ranking.bottom.length === 0 && <p className="text-zinc-500 text-sm italic">Nenhum dado disponível</p>}
        </div>
      </div>
    </div>
  );
}
