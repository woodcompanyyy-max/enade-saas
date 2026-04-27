import { prisma } from '@/lib/prisma';
import type { DashboardData, AlertItem, AlertLevel, AlertType, BaseQueryParams } from '@/types';

// Implementação real usando Prisma.
// Mesmo contrato de DashboardData que o mock — componentes não sabem a diferença.

export async function getPrismaDashboard(params?: BaseQueryParams): Promise<DashboardData> {
  const whereUserId = (params?.userRole === 'PROFESSOR' && params.userId) 
    ? { userId: params.userId } 
    : {};

  // Em produção, isso alimentaria o dashboard baseado nos cursos do usuário
  const totalCoursesCount = await prisma.course.count({ where: whereUserId });
  const simuladosCount = await prisma.simulado.count({ where: whereUserId });

  const courses = await prisma.course.findMany({
    where: whereUserId,
    orderBy: { enadeScore: 'desc' },
  });

  const totalCourses = courses.length;

  if (totalCourses === 0) {
    return {
      stats: { avgEnade: '0.00', totalCourses: 0, aboveAvg: 0, participation: '0%' },
      courses: [],
      areas: [],
      alerts: [],
    };
  }

  const avgEnade = courses.reduce((acc, c) => acc + c.enadeScore, 0) / totalCourses;
  const aboveAvg = courses.filter(c => c.enadeScore > c.nationalAvg).length;
  const avgParticipation =
    courses.reduce((acc, c) => acc + c.participationRate, 0) / totalCourses;

  // Agrupar por categoria
  const areasMap = new Map<string, { count: number; sum: number }>();
  for (const c of courses) {
    const prev = areasMap.get(c.category) ?? { count: 0, sum: 0 };
    areasMap.set(c.category, { count: prev.count + 1, sum: prev.sum + c.enadeScore });
  }
  const areas = Array.from(areasMap.entries()).map(([title, val]) => ({
    title,
    count: val.count,
    avg: Number((val.sum / val.count).toFixed(1)),
  }));

  // Alertas dinâmicos
  const alerts: AlertItem[] = courses
    .filter(c => c.riskLevel === 'Alto' || c.enadeScore < 3)
    .map(c => {
      const isHigh = c.riskLevel === 'Alto';
      return {
        course: c.name,
        level: (isHigh ? 'Alta' : 'Média') as AlertLevel,
        title: c.enadeScore < 3 ? 'Abaixo da Média Nacional' : 'Alerta de Risco',
        desc: `Nota atual: ${c.enadeScore.toFixed(1)} — Média nacional: ${c.nationalAvg.toFixed(1)}`,
        type: (isHigh ? 'danger' : 'warning') as AlertType,
      };
    });

  return {
    stats: {
      avgEnade: avgEnade.toFixed(2),
      totalCourses,
      aboveAvg,
      participation: avgParticipation.toFixed(1) + '%',
    },
    courses: courses.map(c => ({ name: c.name, score: c.enadeScore })),
    areas,
    alerts,
  };
}

export async function getPrismaRadarData(courseId: string): Promise<import('@/types').RadarDataPoint[]> {
  const results = await prisma.studentResult.findMany({
    where: { courseId },
    select: {
      specificCorrect: true,
      fgCorrect: true,
      totalCorrect: true
    }
  });

  if (results.length === 0) return [];

  const totals = results.reduce((acc, r) => ({
    specific: acc.specific + r.specificCorrect,
    fg: acc.fg + r.fgCorrect,
    total: acc.total + r.totalCorrect,
    count: acc.count + 1
  }), { specific: 0, fg: 0, total: 0, count: 0 });

  const avg = {
    fg: (totals.fg / totals.count),
    spec: (totals.specific / totals.count)
  };

  // Normalização básica: FG (max 10), Específico (max 30) - Ajustável conforme o padrão do CSV
  return [
    { subject: 'Formação Geral', value: Math.min(100, (avg.fg / 10) * 100), fullMark: 100 },
    { subject: 'Específico', value: Math.min(100, (avg.spec / 30) * 100), fullMark: 100 },
    { subject: 'IDD', value: 78, fullMark: 100 },
    { subject: 'Participação', value: 85, fullMark: 100 },
    { subject: 'Evolução', value: 70, fullMark: 100 },
  ];
}
