"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { processBenchmarkImport } from "@/services/benchmark.service";
import * as Papa from 'papaparse';

export async function importBenchmarkCsvAction(csvContent: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.role !== 'ADMIN') {
      return { success: false, error: "Não autorizado. Apenas administradores podem importar benchmarks." };
    }

    const { data, errors } = Papa.parse(csvContent, {
      header: true,
      skipEmptyLines: true,
    });

    if (errors.length > 0) {
      return { success: false, error: "Erro ao fazer o parse do CSV. Verifique a formatação." };
    }

    const result = await processBenchmarkImport(data);

    return { 
      success: true, 
      message: `Importação concluída. Sucesso: ${result.success}. Erros: ${result.error}.` 
    };

  } catch (error: any) {
    console.error("Erro na server action de benchmark:", error);
    return { success: false, error: error.message || "Erro interno do servidor" };
  }
}
