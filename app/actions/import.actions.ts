"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { processImport } from "@/services/import.service";
import Papa from "papaparse";

export async function importAlunosCsvAction(csvContent: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return { success: false, error: "Você precisa estar logado para importar dados." };
    }

    const { data, errors } = Papa.parse(csvContent, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
    });

    if (errors.length > 0) {
      return { success: false, error: "Erro ao fazer o parse do CSV. Verifique a formatação." };
    }

    const summary = await processImport(data as any);

    return { 
      success: true, 
      message: `Importação concluída. Processados: ${summary.totalRows}. Sucesso: ${summary.successCount}. Erros: ${summary.errorCount}.`,
      summary 
    };

  } catch (error: any) {
    console.error("Erro na server action de importação de alunos:", error);
    return { success: false, error: error.message || "Erro interno do servidor" };
  }
}
