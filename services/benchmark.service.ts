import { prisma } from '@/lib/prisma';
import type { Benchmark, ImportBenchmarkRow } from '@/types';

/**
 * Normaliza o nome do curso removendo textos entre parênteses e espaços extras.
 * Exemplo: "Direito (Matutino)" -> "Direito"
 */
export function normalizeCourseName(name: string): string {
  if (!name) return "";
  return name.replace(/\s*\(.*?\)\s*/g, '').trim();
}

export async function getBenchmark(courseName: string, year: number): Promise<Benchmark | null> {
  const normalizedName = normalizeCourseName(courseName);
  const { getPrismaBenchmark } = await import('@/adapters/prisma/benchmark.prisma');
  return getPrismaBenchmark(normalizedName, year);
}

export async function processBenchmarkImport(
  rows: any[]
): Promise<{ success: number; error: number; coursesCreated: number }> {
  const { upsertPrismaBenchmark } = await import('@/adapters/prisma/benchmark.prisma');

  // Converte campo para float ou null (nunca para 0).
  // Usado para campos opcionais como avgFgCourse e avgCeCourse.
  const parseNullable = (val: any): number | null => {
    if (val === undefined || val === null || val === '') return null;
    const parsed = parseFloat(val);
    return isNaN(parsed) ? null : parsed;
  };

  let success = 0;
  let error = 0;
  let coursesCreated = 0;

  for (const row of rows) {
    try {
      const normalizedName = normalizeCourseName(row.courseName);
      if (!normalizedName || !row.year) continue;

      // Cria o curso no catálogo automaticamente se ainda não existir.
      // Os KPIs reais serão preenchidos quando alunos forem importados.
      const existingCourse = await prisma.course.findUnique({ where: { name: normalizedName } });
      if (!existingCourse) {
        await prisma.course.create({
          data: {
            name: normalizedName,
            category: 'Bacharelado',
            modality: 'Presencial',
            enadeScore: parseNullable(row.avgFgCourse) ?? 0,
            nationalAvg: parseFloat(row.avgFgBrasil) || 0,
            participationRate: 0,
            idd: 0,
            riskLevel: 'Médio',
          }
        });
        coursesCreated++;
      }

      const data: ImportBenchmarkRow = {
        courseName: normalizedName,
        year: parseInt(row.year, 10),
        // Campos opcionais da instituição — null se ausentes no CSV
        avgFgCourse: parseNullable(row.avgFgCourse),
        avgCeCourse: parseNullable(row.avgCeCourse),
        // Campos externos obrigatórios — fallback para 0 se ausentes
        avgFgUf: parseFloat(row.avgFgUf) || 0,
        avgFgBrasil: parseFloat(row.avgFgBrasil) || 0,
        avgCeUf: parseFloat(row.avgCeUf) || 0,
        avgCeBrasil: parseFloat(row.avgCeBrasil) || 0,
      };

      await upsertPrismaBenchmark(data);
      success++;
    } catch (e) {
      console.error("Erro importando benchmark:", e);
      error++;
    }
  }

  return { success, error, coursesCreated };
}
