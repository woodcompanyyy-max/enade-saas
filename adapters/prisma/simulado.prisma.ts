import { prisma } from '@/lib/prisma';
import type { Simulado, SimuladoQueryParams, PaginatedResponse, SimuladoStatus } from '@/types';
import type { Prisma } from '@prisma/client';

export async function getPrismaSimulados(params: SimuladoQueryParams): Promise<PaginatedResponse<Simulado>> {
  const page = params.page || 1;
  const perPage = params.perPage || 10;
  
  const where: Prisma.SimuladoWhereInput = {};

  if (params.search) {
    where.OR = [
      { name: { contains: params.search } },
      { course: { name: { contains: params.search } } }
    ];
  }

  if (params.status && params.status !== 'all') {
    where.status = params.status;
  }

  if (params.courseId && params.courseId !== 'all') {
    where.courseId = params.courseId;
  }

  // Autorização: Professor vê apenas seus simulados
  if (params.userRole === 'PROFESSOR' && params.userId) {
    where.userId = params.userId;
  }

  const [total, data] = await Promise.all([
    prisma.simulado.count({ where }),
    prisma.simulado.findMany({
      where,
      skip: (page - 1) * perPage,
      take: perPage,
      orderBy: { date: 'desc' },
      include: {
        course: {
          select: { name: true }
        }
      }
    }),
  ]);

  const mappedData: Simulado[] = data.map(s => ({
    id: s.id,
    name: s.name,
    date: s.date.toISOString(),
    avg: s.avg,
    participation: s.participation,
    status: s.status as SimuladoStatus,
    courseId: s.courseId,
    courseName: s.course.name,
    createdAt: s.createdAt.toISOString(),
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

export async function getPrismaSimuladoById(id: string): Promise<Simulado | null> {
  const s = await prisma.simulado.findUnique({
    where: { id },
    include: {
      course: {
        select: { name: true }
      }
    }
  });

  if (!s) return null;

  return {
    id: s.id,
    name: s.name,
    date: s.date.toISOString(),
    avg: s.avg,
    participation: s.participation,
    status: s.status as SimuladoStatus,
    courseId: s.courseId,
    courseName: s.course.name,
    createdAt: s.createdAt.toISOString(),
  };
}

export async function createPrismaSimulado(data: import('@/types').CreateSimuladoInput, userId: string): Promise<Simulado> {
  const s = await prisma.simulado.create({
    data: {
      name: data.name,
      courseId: data.courseId,
      date: new Date(data.date),
      status: data.status || 'Agendado',
      userId,
    },
    include: { course: true }
  });

  return {
    id: s.id,
    name: s.name,
    date: s.date.toISOString(),
    avg: s.avg,
    participation: s.participation,
    status: s.status as SimuladoStatus,
    courseId: s.courseId,
    courseName: s.course.name,
    createdAt: s.createdAt.toISOString(),
  };
}

export async function updatePrismaSimulado(data: import('@/types').UpdateSimuladoInput, userId: string, role: string): Promise<Simulado> {
  const { id, ...updateData } = data;
  
  const whereClausule: Prisma.SimuladoWhereUniqueInput = { id };
  if (role === 'PROFESSOR') {
    whereClausule.userId = userId;
  }

  const s = await prisma.simulado.update({
    where: whereClausule,
    data: {
      ...updateData,
      date: updateData.date ? new Date(updateData.date) : undefined,
    },
    include: { course: true }
  });

  return {
    id: s.id,
    name: s.name,
    date: s.date.toISOString(),
    avg: s.avg,
    participation: s.participation,
    status: s.status as SimuladoStatus,
    courseId: s.courseId,
    courseName: s.course.name,
    createdAt: s.createdAt.toISOString(),
  };
}

export async function deletePrismaSimulado(id: string, userId: string, role: string): Promise<boolean> {
  const whereClausule: Prisma.SimuladoWhereUniqueInput = { id };
  if (role === 'PROFESSOR') {
    whereClausule.userId = userId;
  }

  try {
    await prisma.simulado.delete({ where: whereClausule });
    return true;
  } catch (error) {
    return false;
  }
}
