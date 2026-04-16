import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      include: {
        assessments: {
          orderBy: { year: 'desc' },
          take: 1
        }
      }
    });

    // Calcular KPIs
    const totalCourses = courses.length;
    const avgEnade = courses.reduce((acc: number, c: any) => acc + c.enadeScore, 0) / (totalCourses || 1);
    const aboveAvg = courses.filter((c: any) => c.enadeScore > (c.nationalAvg || 3.0)).length;
    const avgParticipation = courses.reduce((acc: number, c: any) => acc + c.participationRate, 0) / (totalCourses || 1);

    // Alertas (exemplo: cursos com nota < 3 ou queda)
    const alerts = courses
      .filter((c: any) => c.riskLevel === 'Alto' || c.enadeScore < 3)
      .map((c: any) => ({
        course: c.name,
        level: c.riskLevel,
        title: c.enadeScore < 3 ? "Abaixo da Média Nacional" : "Alerta de Queda",
        desc: `Nota atual: ${c.enadeScore.toFixed(1)}`,
        type: c.riskLevel === 'Alto' ? 'danger' : 'warning'
      }));

    // Áreas de conhecimento (Agrupamento)
    const areasMap: any = {};
    courses.forEach((c: any) => {
      if (!areasMap[c.category]) {
        areasMap[c.category] = { title: c.category, count: 0, sum: 0 };
      }
      areasMap[c.category].count++;
      areasMap[c.category].sum += c.enadeScore;
    });

    const areas = Object.values(areasMap).map((a: any) => ({
      title: a.title,
      count: a.count,
      avg: Number((a.sum / a.count).toFixed(1))
    }));

    return NextResponse.json({
      stats: {
        avgEnade: avgEnade.toFixed(2),
        totalCourses,
        aboveAvg,
        participation: avgParticipation.toFixed(1) + "%"
      },
      areas,
      alerts,
      courses: courses.map(c => ({
        name: c.name,
        score: c.enadeScore,
        max: 5
      }))
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
