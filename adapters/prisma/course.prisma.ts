import { prisma } from '@/lib/prisma';
import type { Course, CourseQueryParams, PaginatedResponse, CourseCategory, CourseModality, RiskLevel } from '@/types';
import type { Prisma } from '@prisma/client';

export async function getPrismaCourses(params: CourseQueryParams): Promise<PaginatedResponse<Course>> {
  const page = params.page || 1;
  const perPage = params.perPage || 10;
  
  const where: Prisma.CourseWhereInput = {};

  if (params.search) {
    where.name = {
      contains: params.search,
    }; // Sqlite default contains is case-insensitive usually, depending on collation, but typically we'd use robust settings.
  }

  if (params.category && params.category !== 'all') {
    where.category = params.category;
  }

  if (params.riskLevel && params.riskLevel !== 'all') {
    where.riskLevel = params.riskLevel;
  }
  
  // Autorização: Professor vê apenas seus cursos
  if (params.userRole === 'PROFESSOR' && params.userId) {
    where.userId = params.userId;
  }

  const [total, data] = await Promise.all([
    prisma.course.count({ where }),
    prisma.course.findMany({
      where,
      skip: (page - 1) * perPage,
      take: perPage,
      orderBy: { name: 'asc' },
    }),
  ]);

  // Convertendo do tipo do Prisma para o tipo do nosso frontend para respeitar o contrato.
  const mappedData: Course[] = data.map(c => ({
    id: c.id,
    name: c.name,
    category: c.category as CourseCategory,
    modality: c.modality as CourseModality,
    enadeScore: c.enadeScore,
    nationalAvg: c.nationalAvg,
    participationRate: c.participationRate,
    idd: c.idd,
    riskLevel: c.riskLevel as RiskLevel,
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
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

export async function getPrismaCourseById(id: string): Promise<Course | null> {
  const c = await prisma.course.findUnique({
    where: { id },
  });

  if (!c) return null;

  return {
    id: c.id,
    name: c.name,
    category: c.category as CourseCategory,
    modality: c.modality as CourseModality,
    enadeScore: c.enadeScore,
    nationalAvg: c.nationalAvg,
    participationRate: c.participationRate,
    idd: c.idd,
    riskLevel: c.riskLevel as RiskLevel,
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
  };
}

export async function createPrismaCourse(data: import('@/types').CreateCourseInput, userId: string): Promise<Course> {
  const c = await prisma.course.create({
    data: {
      ...data,
      userId,
    }
  });

  return {
    ...c,
    category: c.category as CourseCategory,
    modality: c.modality as CourseModality,
    riskLevel: c.riskLevel as RiskLevel,
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
  };
}

export async function updatePrismaCourse(data: import('@/types').UpdateCourseInput, userId: string, role: string): Promise<Course> {
  const { id, ...updateData } = data;
  
  const whereClausule: Prisma.CourseWhereUniqueInput = { id };
  if (role === 'PROFESSOR') {
    whereClausule.userId = userId;
  }

  const c = await prisma.course.update({
    where: whereClausule,
    data: updateData,
  });

  return {
    ...c,
    category: c.category as CourseCategory,
    modality: c.modality as CourseModality,
    riskLevel: c.riskLevel as RiskLevel,
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
  };
}

export async function deletePrismaCourse(id: string, userId: string, role: string): Promise<boolean> {
  const whereClausule: Prisma.CourseWhereUniqueInput = { id };
  if (role === 'PROFESSOR') {
    whereClausule.userId = userId;
  }

  try {
    await prisma.course.delete({ where: whereClausule });
    return true;
  } catch (error) {
    return false;
  }
}
