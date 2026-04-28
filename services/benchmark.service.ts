import type { Benchmark, ImportBenchmarkRow } from '@/types';

/**
 * Normaliza o nome do curso removendo textos entre parênteses e espaços extras.
 * Mantém a capitalização para melhor leitura, mas pode ser ajustado.
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

export async function processBenchmarkImport(rows: any[]): Promise<{ success: number, error: number }> {
  const { upsertPrismaBenchmark } = await import('@/adapters/prisma/benchmark.prisma');
  
  let success = 0;
  let error = 0;

  for (const row of rows) {
    try {
      const normalizedName = normalizeCourseName(row.courseName);
      if (!normalizedName || !row.year) continue;

      const data: ImportBenchmarkRow = {
        courseName: normalizedName,
        year: parseInt(row.year, 10),
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

  return { success, error };
}
