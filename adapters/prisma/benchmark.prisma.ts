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
      avgFgUf: data.avgFgUf,
      avgFgBrasil: data.avgFgBrasil,
      avgCeUf: data.avgCeUf,
      avgCeBrasil: data.avgCeBrasil
    },
    create: {
      courseName: data.courseName,
      year: data.year,
      avgFgUf: data.avgFgUf,
      avgFgBrasil: data.avgFgBrasil,
      avgCeUf: data.avgCeUf,
      avgCeBrasil: data.avgCeBrasil
    }
  });

  return {
    ...benchmark,
    createdAt: benchmark.createdAt.toISOString()
  };
}
