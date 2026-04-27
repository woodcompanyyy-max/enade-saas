'use client';

import { Users, TrendingUp, AlertTriangle, GraduationCap } from 'lucide-react';
import type { CourseAnalytics } from '@/types';

interface Props {
  data: CourseAnalytics;
}

export function AnalyticsKPIs({ data }: Props) {
  const kpis = [
    {
      title: 'Média do Curso',
      value: data.averages.total,
      icon: GraduationCap,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
      sub: `${data.comparison.national.diff}% ${data.comparison.national.status === 'above' ? 'acima' : 'abaixo'} da média nacional`,
      subColor: data.comparison.national.status === 'above' ? 'text-green-500' : 'text-red-500'
    },
    {
      title: 'Alunos em Risco',
      value: `${data.risk.highRate.toFixed(1)}%`,
      icon: AlertTriangle,
      color: 'text-red-500',
      bg: 'bg-red-500/10',
      sub: `${data.risk.high} alunos em alto risco`,
      subColor: 'text-gray-400'
    },
    {
      title: 'Participação',
      value: `${data.participation.rate.toFixed(1)}%`,
      icon: TrendingUp,
      color: 'text-green-500',
      bg: 'bg-green-500/10',
      sub: `${data.participation.participated} de ${data.participation.totalStudents} alunos`,
      subColor: 'text-gray-400'
    },
    {
      title: 'Total Alunos',
      value: data.participation.totalStudents,
      icon: Users,
      color: 'text-indigo-500',
      bg: 'bg-indigo-500/10',
      sub: 'Alunos matriculados',
      subColor: 'text-gray-400'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi, i) => (
        <div key={i} className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl shadow-sm hover:border-zinc-700 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className={`${kpi.bg} p-2 rounded-xl`}>
              <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
            </div>
          </div>
          <p className="text-zinc-500 text-sm font-medium mb-1">{kpi.title}</p>
          <h3 className="text-2xl font-bold text-white mb-2">{kpi.value}</h3>
          <p className={`text-xs font-medium ${kpi.subColor}`}>{kpi.sub}</p>
        </div>
      ))}
    </div>
  );
}
