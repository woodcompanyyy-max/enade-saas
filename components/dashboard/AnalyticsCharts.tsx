'use client';

import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie
} from 'recharts';
import type { CourseAnalytics } from '@/types';

interface Props {
  data: CourseAnalytics;
}

export function AnalyticsCharts({ data }: Props) {
  const comparisonData = [
    { name: 'Curso', score: data.averages.total, color: '#3b82f6' },
    { name: 'Nacional', score: 12, color: '#6366f1' }, // MOCK para visualização, idealmente viria do back
    { name: 'Regional', score: 11, color: '#8b5cf6' },
  ];

  const riskData = [
    { name: 'Alto Risco', value: data.risk.high, color: '#ef4444' },
    { name: 'Médio Risco', value: data.risk.medium, color: '#f59e0b' },
    { name: 'Baixo Risco', value: data.risk.low, color: '#10b981' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Gráfico de Comparação */}
      <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl">
        <h3 className="text-lg font-bold text-white mb-6">Comparação de Médias</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis dataKey="name" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}
                itemStyle={{ color: '#fff' }}
              />
              <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                {comparisonData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Gráfico de Risco */}
      <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl">
        <h3 className="text-lg font-bold text-white mb-6">Distribuição de Risco</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={riskData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {riskData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}
                itemStyle={{ color: '#fff' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center gap-4 mt-4">
          {riskData.map((r, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: r.color }} />
              <span className="text-xs text-zinc-400">{r.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
