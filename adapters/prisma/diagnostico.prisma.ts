import { prisma } from '@/lib/prisma';
import type { Diagnostico, DiagnosticoQueryParams, PaginatedResponse, RiskLevel } from '@/types';
import type { Prisma } from '@prisma/client';

export async function getPrismaDiagnosticos(params: DiagnosticoQueryParams): Promise<PaginatedResponse<Diagnostico>> {
  const page = params.page || 1;
  const perPage = params.perPage || 10;
  
  const where: Prisma.DiagnosticoWhereInput = {};

  if (params.courseId && params.courseId !== 'all') {
    where.courseId = params.courseId;
  }

  if (params.riskLevel && params.riskLevel !== 'all') {
    where.riskLevel = params.riskLevel;
  }

  if (params.dateStr) {
    const startDate = new Date(params.dateStr);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 1);
    
    where.createdAt = {
      gte: startDate,
      lt: endDate,
    };
  }

  // Autorização: Professor vê apenas seus diagnósticos
  if (params.userRole === 'PROFESSOR' && params.userId) {
    where.userId = params.userId;
  }

  const [total, data] = await Promise.all([
    prisma.diagnostico.count({ where }),
    prisma.diagnostico.findMany({
      where,
      skip: (page - 1) * perPage,
      take: perPage,
      orderBy: { createdAt: 'desc' },
      include: {
        course: { select: { name: true } },
        simulado: { select: { name: true } }
      }
    }),
  ]);

  const mappedData: Diagnostico[] = data.map(d => ({
    id: d.id,
    courseId: d.courseId,
    courseName: d.course.name,
    simuladoId: d.simuladoId || undefined,
    simuladoName: d.simulado?.name,
    scoreGeral: d.scoreGeral,
    riskLevel: d.riskLevel as RiskLevel,
    trend: d.trend as 'Crescente' | 'Estável' | 'Em queda',
    strengths: JSON.parse(d.strengths),
    weaknesses: JSON.parse(d.weaknesses),
    recommendations: JSON.parse(d.recommendations),
    createdAt: d.createdAt.toISOString(),
  }));

  return {
    data: mappedData,
    meta: {
      total,
      page,
      perPage,
      totalPages: Math.ceil(total / perPage),
    },
  };
}

export async function getPrismaDiagnosticoById(id: string): Promise<Diagnostico | null> {
  const d = await prisma.diagnostico.findUnique({
    where: { id },
    include: {
      course: { select: { name: true } },
      simulado: { select: { name: true } }
    }
  });

  if (!d) return null;

  return {
    id: d.id,
    courseId: d.courseId,
    courseName: d.course.name,
    simuladoId: d.simuladoId || undefined,
    simuladoName: d.simulado?.name,
    scoreGeral: d.scoreGeral,
    riskLevel: d.riskLevel as RiskLevel,
    trend: d.trend as 'Crescente' | 'Estável' | 'Em queda',
    strengths: JSON.parse(d.strengths),
    weaknesses: JSON.parse(d.weaknesses),
    recommendations: JSON.parse(d.recommendations),
    createdAt: d.createdAt.toISOString(),
  };
}
