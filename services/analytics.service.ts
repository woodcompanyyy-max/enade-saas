import { prisma } from '@/lib/prisma';
import type { CourseAnalytics, GlobalAnalytics, RiskLevel } from '@/types';

// MOCKS INICIAIS (Podem ser movidos para o banco depois)
const NATIONAL_AVG_MOCK: Record<string, { total: number; specific: number; fg: number }> = {
  'Direito': { total: 12, specific: 9, fg: 3 },
  'Administração': { total: 10, specific: 7, fg: 3 },
  'Psicologia': { total: 11, specific: 8, fg: 3 },
  'DEFAULT': { total: 10, specific: 7, fg: 3 }
};

const REGIONAL_AVG_MOCK: Record<string, { total: number }> = {
  'Direito': { total: 11 },
  'Administração': { total: 9 },
  'DEFAULT': { total: 9.5 }
};

/**
 * Calcula métricas detalhadas de um curso específico.
 */
export async function getCourseAnalytics(
  courseId: string, 
  session: { user: { id: string; role: string } }
): Promise<CourseAnalytics> {
  const { id: userId, role } = session.user;

  // 1. Busca o curso validando Data Tenancy
  const course = await prisma.course.findFirst({
    where: {
      id: courseId,
      ...(role === 'PROFESSOR' ? { userId } : {})
    },
    include: {
      students: true,
      results: {
        include: { student: true },
        orderBy: { totalCorrect: 'desc' }
      }
    }
  });

  if (!course) {
    throw new Error('Curso não encontrado ou acesso negado.');
  }

  const results = course.results;
  const totalResults = results.length;
  const totalStudents = course.students.length;

  // 2. Cálculos de Médias
  const sumTotal = results.reduce((acc, r) => acc + r.totalCorrect, 0);
  const sumSpecific = results.reduce((acc, r) => acc + r.specificCorrect, 0);
  const sumFG = results.reduce((acc, r) => acc + r.fgCorrect, 0);

  const avgTotal = totalResults > 0 ? sumTotal / totalResults : 0;
  const avgSpecific = totalResults > 0 ? sumSpecific / totalResults : 0;
  const avgFG = totalResults > 0 ? sumFG / totalResults : 0;

  // 3. Análise de Risco e Ranking
  const risk = {
    high: 0,
    medium: 0,
    low: 0,
    students: [] as any[]
  };

  results.forEach(r => {
    let level: RiskLevel = 'Baixo';
    if (r.totalCorrect < 8) {
      level = 'Alto';
      risk.high++;
    } else if (r.totalCorrect < 12) {
      level = 'Médio';
      risk.medium++;
    } else {
      risk.low++;
    }

    if (level === 'Alto' || level === 'Médio') {
      risk.students.push({
        id: r.student.id,
        name: r.student.name,
        ra: r.student.ra,
        score: r.totalCorrect,
        level
      });
    }
  });

  // 4. Comparações (Benchmarks)
  const nationalMock = NATIONAL_AVG_MOCK[course.name] || NATIONAL_AVG_MOCK['DEFAULT'];
  const regionalMock = REGIONAL_AVG_MOCK[course.name] || REGIONAL_AVG_MOCK['DEFAULT'];

  const getComparison = (current: number, target: number) => {
    const diff = target > 0 ? ((current - target) / target) * 100 : 0;
    const status = diff > 0 ? 'above' : diff < 0 ? 'below' : 'equal';
    return { diff: Math.abs(Number(diff.toFixed(1))), status: status as any };
  };

  // 5. Retorno Estruturado
  return {
    averages: {
      total: Number(avgTotal.toFixed(2)),
      specific: Number(avgSpecific.toFixed(2)),
      fg: Number(avgFG.toFixed(2)),
    },
    risk: {
      ...risk,
      highRate: totalResults > 0 ? (risk.high / totalResults) * 100 : 0,
    },
    comparison: {
      national: getComparison(avgTotal, nationalMock.total),
      regional: getComparison(avgTotal, regionalMock.total),
    },
    ranking: {
      top: results.slice(0, 5).map(r => ({ name: r.student.name, score: r.totalCorrect })),
      bottom: results.slice(-5).reverse().map(r => ({ name: r.student.name, score: r.totalCorrect })),
    },
    participation: {
      totalStudents,
      participated: totalResults,
      rate: totalStudents > 0 ? (totalResults / totalStudents) * 100 : 0,
    },
    insights: generateInsights(avgTotal, avgSpecific, avgFG, nationalMock, risk)
  };
}

function generateInsights(avgTotal: number, avgSpecific: number, avgFG: number, nationalMock: any, risk: any): string[] {
  const insights: string[] = [];

  if (avgTotal < nationalMock.total) {
    insights.push("⚠️ O curso está com média geral abaixo da média nacional de referência.");
  }

  if (risk.highRate > 15) {
    insights.push("🚨 Alerta: Alta concentração de alunos em nível de Alto Risco (acima de 15%).");
  }

  if (avgFG < nationalMock.fg) {
    insights.push("📘 Atenção: O desempenho em Formação Geral está inferior ao esperado nacionalmente.");
  }

  if (avgTotal > nationalMock.total * 1.1) {
    insights.push("✅ Parabéns! O curso está performando 10% acima da média nacional.");
  }

  if (insights.length === 0) {
    insights.push("ℹ️ O curso mantém um desempenho estável dentro das médias esperadas.");
  }

  return insights;
}

/**
 * Calcula métricas globais para o Dashboard principal.
 */
export async function getGlobalAnalytics(
  session: { user: { id: string; role: string } }
): Promise<GlobalAnalytics> {
  const { id: userId, role } = session.user;

  const whereClause = role === 'PROFESSOR' ? { userId } : {};

  // Busca dados agregados
  const courses = await prisma.course.findMany({
    where: whereClause,
    include: {
      _count: { select: { students: true } },
      results: { select: { totalCorrect: true } }
    }
  });

  const totalCourses = courses.length;
  let totalStudents = 0;
  let totalScore = 0;
  let totalResultsCount = 0;
  
  const riskCounts = { high: 0, medium: 0, low: 0 };
  const areaPerformance: Record<string, { sum: number; count: number }> = {};

  courses.forEach(c => {
    totalStudents += c._count.students;
    c.results.forEach(r => {
      totalScore += r.totalCorrect;
      totalResultsCount++;

      if (r.totalCorrect < 8) riskCounts.high++;
      else if (r.totalCorrect < 12) riskCounts.medium++;
      else riskCounts.low++;
    });

    if (!areaPerformance[c.category]) {
      areaPerformance[c.category] = { sum: 0, count: 0 };
    }
    const courseAvg = c.results.length > 0 
      ? c.results.reduce((a, b) => a + b.totalCorrect, 0) / c.results.length 
      : 0;
    
    areaPerformance[c.category].sum += courseAvg;
    areaPerformance[c.category].count++;
  });

  return {
    totalStudents,
    totalCourses,
    globalAvg: totalResultsCount > 0 ? Number((totalScore / totalResultsCount).toFixed(2)) : 0,
    riskDistribution: [
      { name: 'Alto Risco', value: riskCounts.high },
      { name: 'Médio Risco', value: riskCounts.medium },
      { name: 'Baixo Risco', value: riskCounts.low },
    ],
    performanceByArea: Object.entries(areaPerformance).map(([area, data]) => ({
      area,
      avg: Number((data.sum / data.count).toFixed(2))
    }))
  };
}
