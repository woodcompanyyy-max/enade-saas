"use client";

import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import { TrendingUp } from 'lucide-react';
import type { EvolutionDataPoint } from '@/types';

interface Props {
  data: EvolutionDataPoint[];
}

/**
 * Gráfico de linha para mostrar a evolução das médias em simulados.
 */
export function CourseEvolutionChart({ data }: Props) {
  if (data.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-zinc-500 space-y-2">
        <TrendingUp size={40} className="opacity-20" />
        <p className="text-sm italic">Dados insuficientes para gerar evolução histórica.</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorAvg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis 
            dataKey="date" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: '#94a3b8' }}
            dy={10}
          />
          <YAxis 
            domain={[0, 5]}
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: '#94a3b8' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff', 
              borderRadius: '12px', 
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
            }}
            labelStyle={{ fontWeight: 'bold', marginBottom: '4px', color: '#1e293b' }}
            itemStyle={{ fontSize: '12px', color: '#2563eb', fontWeight: 'bold' }}
            formatter={(value: number) => [`${value.toFixed(2)} pts`, 'Média Geral']}
            labelFormatter={(label) => `Período: ${label}`}
          />
          <Area 
            type="monotone" 
            dataKey="average" 
            stroke="#2563eb" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorAvg)" 
            animationDuration={1500}
            dot={{ r: 4, fill: '#2563eb', strokeWidth: 2, stroke: '#fff' }}
            activeDot={{ r: 6, strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
