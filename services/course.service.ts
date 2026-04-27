import type { Course, CourseQueryParams, PaginatedResponse, EvolutionDataPoint } from '@/types';

const USE_MOCK = process.env.USE_MOCK === 'true';

export async function getCourses(params: CourseQueryParams): Promise<PaginatedResponse<Course>> {
  if (USE_MOCK) {
    const { getMockCourses } = await import('@/adapters/mock/course.mock');
    return getMockCourses(params);
  }
  
  const { getPrismaCourses } = await import('@/adapters/prisma/course.prisma');
  return getPrismaCourses(params);
}

export async function getCourseById(id: string): Promise<Course | null> {
  if (USE_MOCK) {
    const { getMockCourseById } = await import('@/adapters/mock/course.mock');
    return getMockCourseById(id);
  }
  
  const { getPrismaCourseById } = await import('@/adapters/prisma/course.prisma');
  return getPrismaCourseById(id);
}

export async function createCourse(data: import('@/types').CreateCourseInput, userId: string): Promise<Course> {
  if (USE_MOCK) {
    throw new Error("Mutations not implemented in mock adapter yet.");
  }
  const { createPrismaCourse } = await import('@/adapters/prisma/course.prisma');
  return createPrismaCourse(data, userId);
}

export async function updateCourse(data: import('@/types').UpdateCourseInput, userId: string, role: string): Promise<Course> {
  if (USE_MOCK) {
    throw new Error("Mutations not implemented in mock adapter yet.");
  }
  const { updatePrismaCourse } = await import('@/adapters/prisma/course.prisma');
  return updatePrismaCourse(data, userId, role);
}

export async function deleteCourse(id: string, userId: string, role: string): Promise<boolean> {
  if (USE_MOCK) {
    throw new Error("Mutations not implemented in mock adapter yet.");
  }
  const { deletePrismaCourse } = await import('@/adapters/prisma/course.prisma');
  return deletePrismaCourse(id, userId, role);
}

export async function getCourseEvolution(courseId: string): Promise<EvolutionDataPoint[]> {
  if (USE_MOCK) {
    // Retorno mockado simples para desenvolvimento
    return [
      { date: "2024-01", average: 3.2 },
      { date: "2024-03", average: 3.8 },
      { date: "2024-05", average: 4.1 },
    ];
  }
  
  const { getPrismaCourseEvolution } = await import('@/adapters/prisma/course.prisma');
  return getPrismaCourseEvolution(courseId);
}
