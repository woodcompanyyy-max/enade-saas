import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import Papa from "papaparse";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "Nenhum arquivo enviado" }, { status: 400 });
    }

    const text = await file.text();
    
    // Parse CSV
    const result = Papa.parse(text, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
    });

    const data = result.data as any[];

    // Processar e salvar no banco
    // Assumindo que o CSV tem colunas: Nome, Categoria, Modalidade, Nota_ENADE, IDD, Risco
    for (const row of data) {
      await prisma.course.upsert({
        where: { id: row.ID || "new-id" }, // fallback to create if no ID
        update: {
          enadeScore: row.Nota_ENADE || 0,
          idd: row.IDD || 0,
          riskLevel: row.Risco || "Médio",
        },
        create: {
          name: row.Nome,
          category: row.Categoria,
          modality: row.Modalidade,
          enadeScore: row.Nota_ENADE || 0,
          idd: row.IDD || 0,
          riskLevel: row.Risco || "Médio",
        },
      });
    }

    return NextResponse.json({ success: true, count: data.length });
  } catch (error: any) {
    console.error("Erro no upload:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
