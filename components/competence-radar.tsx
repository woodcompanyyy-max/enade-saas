"use client";

import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer 
} from 'recharts';

const data = [
  { subject: 'Formação Geral', A: 85, fullMark: 100 },
  { subject: 'Específico', A: 92, fullMark: 100 },
  { subject: 'IDD', A: 78, fullMark: 100 },
  { subject: 'Participação', A: 96, fullMark: 100 },
  { subject: 'Evolução', A: 70, fullMark: 100 },
];

export function CompetenceRadar() {
  return (
    <div className="h-full w-full flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="var(--chart-grid)" />
          <PolarAngleAxis dataKey="subject" tick={{fontSize: 10, fill: 'var(--chart-text)'}} />
          <Radar
            name="Desempenho"
            dataKey="A"
            stroke="#2563eb"
            fill="#2563eb"
            fillOpacity={0.5}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
