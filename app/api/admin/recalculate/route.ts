import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * POST /api/admin/recalculate
 * Recalcula os KPIs (enadeScore, participationRate, idd, riskLevel) de todos os cursos
 * baseado nos StudentResults existentes, sem apagar dados.
 */
export async function POST() {
  try {
    const courses = await prisma.course.findMany({
      include: {
        students: true,
        results: true,
      }
    });

    let updated = 0;

    for (const course of courses) {
      const totalResults = course.results.length;
      const totalStudents = course.students.length;

      if (totalResults === 0) continue;

      const avgScore = course.results.reduce((acc, r) => acc + r.totalCorrect, 0) / totalResults;
      const avgFG = course.results.reduce((acc, r) => acc + r.fgCorrect, 0) / totalResults;
      const avgCE = course.results.reduce((acc, r) => acc + r.specificCorrect, 0) / totalResults;
      const participationRate = totalStudents > 0 ? (totalResults / totalStudents) * 100 : 100;

      // IDD proporcional simples: quanto acima de 50% de acerto
      const idd = Math.max(0, Number(((avgScore / Math.max(avgScore, 1)) * 5).toFixed(2)));

      // RiskLevel baseado na média de acertos
      const riskLevel = avgScore < 8 ? 'Alto' : avgScore < 12 ? 'Médio' : 'Baixo';

      await prisma.course.update({
        where: { id: course.id },
        data: {
          enadeScore: Number(avgScore.toFixed(2)),
          participationRate: Number(participationRate.toFixed(1)),
          idd: Number(idd.toFixed(2)),
          riskLevel,
        }
      });

      // Atualizar também a média de cada simulado vinculado
      const simuladoIds = Array.from(new Set(course.results.map(r => r.simuladoId).filter(Boolean)));
      for (const simId of simuladoIds) {
        if (!simId) continue;
        const simResults = course.results.filter(r => r.simuladoId === simId);
        const simAvg = simResults.reduce((acc, r) => acc + r.totalCorrect, 0) / simResults.length;
        const simParticipacao = totalStudents > 0 ? (simResults.length / totalStudents) * 100 : 100;

        await prisma.simulado.update({
          where: { id: simId },
          data: {
            avg: Number(simAvg.toFixed(2)),
            participation: Number(simParticipacao.toFixed(1)),
          }
        });
      }

      updated++;
    }

    return NextResponse.json({
      success: true,
      message: `${updated} curso(s) recalculado(s) com sucesso.`,
      updated,
      total: courses.length,
    });

  } catch (error: any) {
    console.error('Erro ao recalcular KPIs:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
