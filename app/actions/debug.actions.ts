"use server";

import { prisma } from "@/lib/prisma";
import { processImport } from "@/services/import.service";
import fs from "fs";
import path from "path";
import Papa from "papaparse";

/**
 * Action de emergência para limpar o banco e reimportar apenas os dados do CSV.
 * Atende ao pedido do usuário de "zerar qualquer dado que não tiver no CSV".
 */
export async function resetAndImportCSVAction() {
  try {
    console.log("Iniciando reset de banco de dados...");

    // Ordem de deleção para respeitar chaves estrangeiras
    await prisma.studentResult.deleteMany({});
    await prisma.diagnostico.deleteMany({});
    await prisma.simulado.deleteMany({});
    await prisma.assessment.deleteMany({});
    await prisma.student.deleteMany({});
    await prisma.course.deleteMany({});
    await prisma.benchmark.deleteMany({});

    console.log("Banco zerado com sucesso (incluindo Benchmarks). Iniciando importação do enade-import.csv...");


    // Caminho para o CSV
    const csvPath = path.join(process.cwd(), "enade-import.csv");
    if (!fs.existsSync(csvPath)) {
      throw new Error("Arquivo enade-import.csv não encontrado na raiz do projeto.");
    }

    const fileContent = fs.readFileSync(csvPath, "utf-8");
    
    // Parse do CSV
    const { data } = Papa.parse(fileContent, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true
    });

    // Processamento usando o serviço existente
    const summary = await processImport(data as any);

    return { 
      success: true, 
      message: "Banco resetado e dados do CSV importados.",
      summary 
    };
  } catch (error: any) {
    console.error("Erro ao resetar banco:", error);
    return { success: false, error: error.message };
  }
}
