import { prisma } from '@/lib/prisma';
import { Shift } from '@prisma/client';
import type { ImportRow, ImportSummary } from '@/types';

/**
 * Normaliza o nome do curso removendo sufixos de turno.
 */
function normalizeCourseName(name: string): string {
  return name.replace(/\s*\(.*?\)\s*/g, '').trim();
}

/**
 * Converte string para o Enum Shift do Prisma.
 */
function normalizeShift(shiftStr: string): Shift {
  const s = shiftStr.trim().toUpperCase();
  if (s === 'MATUTINO') return Shift.MATUTINO;
  if (s === 'NOTURNO') return Shift.NOTURNO;
  if (s === 'EAD') return Shift.EAD;
  return Shift.EAD; // Default
}

export async function processImport(rows: ImportRow[]): Promise<ImportSummary> {
  const summary: ImportSummary = {
    totalRows: rows.length,
    successCount: 0,
    errorCount: 0,
    errors: [],
    newCourses: [],
    newStudents: 0,
  };

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const rowNum = i + 1;

    try {
      // 1. Validações Básicas
      if (!row.ra || !row.course || !row.student_name) {
        throw new Error('RA, curso e nome do aluno são obrigatórios.');
      }

      const normalizedCourse = normalizeCourseName(row.course);
      const shift = normalizeShift(row.shift);
      const examType = row.exam_type?.toLowerCase() || 'simulado';

      // 2. Garantir Curso (Upsert por nome)
      const course = await prisma.course.upsert({
        where: { name: normalizedCourse },
        update: {},
        create: {
          name: normalizedCourse,
          category: 'Bacharelado', // Default, pode ser ajustado
          modality: shift === Shift.EAD ? 'EaD' : 'Presencial',
        },
      });

      // 3. Garantir Aluno (Upsert por RA)
      const student = await prisma.student.upsert({
        where: { ra: String(row.ra) },
        update: {
          name: row.student_name,
          shift: shift,
          courseId: course.id,
        },
        create: {
          ra: String(row.ra),
          name: row.student_name,
          shift: shift,
          courseId: course.id,
        },
      });

      // 4. Criar Cabeçalho da Avaliação (Simulado ou Oficial)
      let simuladoId: string | null = null;
      let assessmentId: string | null = null;

      if (examType === 'simulado') {
        const sim = await prisma.simulado.upsert({
          where: { 
            // Para simplificar, usamos um nome fixo por data ou algo similar
            // Aqui vamos criar/buscar um simulado genérico para o import
            id: `import-sim-${normalizedCourse}` 
          },
          update: {},
          create: {
            id: `import-sim-${normalizedCourse}`,
            name: `Simulado Importado - ${normalizedCourse}`,
            date: new Date(),
            courseId: course.id,
            status: 'Finalizado',
          }
        });
        simuladoId = sim.id;
      } else {
        const ass = await prisma.assessment.upsert({
          where: {
            // No schema atual Assessment não tem ID único por ano/curso, vamos gerar um
            id: `import-ass-${normalizedCourse}-2024`
          },
          update: {},
          create: {
            id: `import-ass-${normalizedCourse}-2024`,
            year: 2024,
            courseId: course.id,
            generalScore: 0, // Será calculado depois ou vindo do CSV
            idd: 0,
            riskLevel: 'Médio',
          }
        });
        assessmentId = ass.id;
      }

      // 5. Criar Resultado Detalhado
      await prisma.studentResult.create({
        data: {
          studentId: student.id,
          courseId: course.id,
          simuladoId: simuladoId,
          assessmentId: assessmentId,
          examType: examType,
          specificCorrect: Number(row.specific_correct) || 0,
          specificWrong: Number(row.specific_wrong) || 0,
          fgCorrect: Number(row.fg_correct) || 0,
          fgWrong: Number(row.fg_wrong) || 0,
          totalCorrect: Number(row.total_correct) || 0,
          totalWrong: Number(row.total_wrong) || 0,
        },
      });

      summary.successCount++;
    } catch (error: any) {
      summary.errorCount++;
      summary.errors.push({ row: rowNum, error: error.message });
    }
  }

  return summary;
}
