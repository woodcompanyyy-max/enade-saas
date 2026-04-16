import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const courses = [
      { name: 'Administração', category: 'Bacharelado', modality: 'Semipresencial', enadeScore: 3.2, nationalAvg: 3.1, participationRate: 85, idd: 3.4, riskLevel: 'Baixo' },
      { name: 'Biomedicina', category: 'Bacharelado', modality: 'Presencial', enadeScore: 4.1, nationalAvg: 3.5, participationRate: 94, idd: 4.2, riskLevel: 'Baixo' },
      { name: 'Ciências Contábeis', category: 'Bacharelado', modality: 'Semipresencial', enadeScore: 3.8, nationalAvg: 3.2, participationRate: 88, idd: 3.9, riskLevel: 'Baixo' },
      { name: 'Direito', category: 'Bacharelado', modality: 'Presencial', enadeScore: 3.9, nationalAvg: 3.4, participationRate: 92, idd: 3.8, riskLevel: 'Médio' },
      { name: 'Educação Física', category: 'Bacharelado', modality: 'Presencial', enadeScore: 3.5, nationalAvg: 3.2, participationRate: 80, idd: 3.5, riskLevel: 'Médio' },
      { name: 'Enfermagem', category: 'Bacharelado', modality: 'Presencial', enadeScore: 4.2, nationalAvg: 3.6, participationRate: 96, idd: 4.1, riskLevel: 'Baixo' },
      { name: 'Engenharia Civil', category: 'Bacharelado', modality: 'Presencial', enadeScore: 2.8, nationalAvg: 3.3, participationRate: 75, idd: 2.9, riskLevel: 'Alto' },
      { name: 'Psicologia', category: 'Bacharelado', modality: 'Presencial', enadeScore: 3.7, nationalAvg: 3.5, participationRate: 90, idd: 3.6, riskLevel: 'Médio' },
    ];

    console.log('Start seeding via API...');
    for (const c of courses) {
      await prisma.course.upsert({
        where: { id: `seed-${c.name}` },
        update: c,
        create: { id: `seed-${c.name}`, ...c },
      });
    }
    
    return NextResponse.json({ success: true, message: "Database seeded successfully" });
  } catch (error: any) {
    console.error("Seed error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
