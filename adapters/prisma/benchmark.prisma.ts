import { prisma } from '@/lib/prisma';
import type { ImportBenchmarkRow, Benchmark } from '@/types';

export async function getPrismaBenchmark(courseName: string, year: number): Promise<Benchmark | null> {
  const benchmark = await prisma.benchmark.findUnique({
    where: {
      courseName_year: {
        courseName,
        year
      }
    }
  });

  if (!benchmark) return null;

  return {
    ...benchmark,
    avgFgCourse: benchmark.avgFgCourse ?? null,
    avgCeCourse: benchmark.avgCeCourse ?? null,
    createdAt: benchmark.createdAt.toISOString()
  };
}

export async function upsertPrismaBenchmark(data: ImportBenchmarkRow): Promise<Benchmark> {
  const benchmark = await prisma.benchmark.upsert({
    where: {
      courseName_year: {
        courseName: data.courseName,
        year: data.year
      }
    },
    update: {
      avgFgCourse: data.avgFgCourse ?? null,
      avgCeCourse: data.avgCeCourse ?? null,
      avgFgUf: data.avgFgUf,
      avgFgBrasil: data.avgFgBrasil,
      avgCeUf: data.avgCeUf,
      avgCeBrasil: data.avgCeBrasil
    },
    create: {
      courseName: data.courseName,
      year: data.year,
      avgFgCourse: data.avgFgCourse ?? null,
      avgCeCourse: data.avgCeCourse ?? null,
      avgFgUf: data.avgFgUf,
      avgFgBrasil: data.avgFgBrasil,
      avgCeUf: data.avgCeUf,
      avgCeBrasil: data.avgCeBrasil
    }
  });

  return {
    ...benchmark,
    avgFgCourse: benchmark.avgFgCourse ?? null,
    avgCeCourse: benchmark.avgCeCourse ?? null,
    createdAt: benchmark.createdAt.toISOString()
  };
}
