'use server';

import { processImport } from '@/services/import.service';
import type { ImportRow, ImportSummary } from '@/types';
import { revalidatePath } from 'next/cache';

export async function importDataAction(rows: ImportRow[]): Promise<ImportSummary> {
  try {
    const summary = await processImport(rows);
    
    // Revalidar as páginas afetadas para mostrar os novos dados
    revalidatePath('/cursos');
    revalidatePath('/simulados');
    revalidatePath('/dashboard');
    
    return summary;
  } catch (error: any) {
    throw new Error(error.message || 'Erro ao processar importação');
  }
}
