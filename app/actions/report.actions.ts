"use server";

import PDFDocument from "pdfkit";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getCourseAnalytics } from "@/services/analytics.service";
import { getCourseById } from "@/services/course.service";

/**
 * Server Action para gerar o relatório PDF de um curso.
 * Retorna os dados em Base64 para download no cliente.
 */
export async function generateCourseReport(courseId: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return { success: false, error: "Não autorizado" };
    }

    const course = await getCourseById(courseId);
    if (!course) {
      return { success: false, error: "Curso não encontrado" };
    }

    const analytics = await getCourseAnalytics(courseId, session as any);

    // Criação do documento PDF
    const doc = new PDFDocument({ 
      margin: 50,
      size: 'A4',
      info: {
        Title: `Relatório ENADE - ${course.name}`,
        Author: 'Antigravity Analytics',
      }
    });

    const chunks: Buffer[] = [];
    doc.on("data", (chunk) => chunks.push(chunk));
    
    return new Promise((resolve) => {
      doc.on("end", () => {
        const result = Buffer.concat(chunks);
        resolve({
          success: true,
          data: result.toString("base64"),
          filename: `Relatorio_ENADE_${course.name.replace(/\s+/g, "_")}.pdf`
        });
      });

      // --- DESIGN E CONTEÚDO ---
      
      // Cabeçalho Premium
      doc.rect(0, 0, 612, 120).fill('#0f172a'); // Fundo escuro (Slate 900)
      
      doc.fillColor('#ffffff').fontSize(24).font('Helvetica-Bold')
         .text("RELATÓRIO DE DESEMPENHO", 50, 40);
      
      doc.fontSize(12).font('Helvetica')
         .text(`CURSO: ${course.name.toUpperCase()}`, 50, 75);
      
      doc.fontSize(10).font('Helvetica-Oblique')
         .text(`Gerado em: ${new Date().toLocaleString("pt-BR")}`, 50, 95);

      doc.moveDown(5);

      // Seção KPIs - Grid Layout Simulado
      doc.fillColor('#0f172a').fontSize(16).font('Helvetica-Bold')
         .text("Métricas Principais (KPIs)", 50, 150);
      
      doc.moveTo(50, 170).lineTo(550, 170).stroke('#e2e8f0');
      
      doc.moveDown(2);

      const startY = 190;
      // Coluna 1
      doc.fontSize(10).fillColor('#64748b').text("MÉDIA DO CURSO", 50, startY);
      doc.fontSize(18).fillColor('#2563eb').font('Helvetica-Bold').text(`${analytics.averages.total.toFixed(2)}`, 50, startY + 15);
      
      // Coluna 2
      doc.fontSize(10).fillColor('#64748b').font('Helvetica').text("VS MÉDIA NACIONAL", 200, startY);
      const diffColor = analytics.comparison.national.status === 'above' ? '#16a34a' : '#dc2626';
      doc.fontSize(18).fillColor(diffColor).font('Helvetica-Bold')
         .text(`${analytics.comparison.national.status === 'above' ? '+' : '-'}${analytics.comparison.national.diff}%`, 200, startY + 15);
      
      // Coluna 3
      doc.fontSize(10).fillColor('#64748b').font('Helvetica').text("ALUNOS EM RISCO", 350, startY);
      doc.fontSize(18).fillColor('#ea580c').font('Helvetica-Bold').text(`${analytics.risk.highRate.toFixed(1)}%`, 350, startY + 15);

      doc.moveDown(4);

      // Seção Insights
      doc.fillColor('#0f172a').fontSize(16).font('Helvetica-Bold')
         .text("Insights Estratégicos", 50, 260);
      
      doc.moveTo(50, 280).lineTo(550, 280).stroke('#e2e8f0');
      doc.moveDown(1);

      let insightY = 300;
      analytics.insights.forEach(insight => {
        doc.rect(50, insightY, 5, 20).fill('#3b82f6'); // Marcador azul
        doc.fillColor('#1e293b').fontSize(11).font('Helvetica')
           .text(insight, 65, insightY + 5, { width: 480 });
        insightY += 35;
      });

      // Seção Rankings (Lado a Lado)
      const rankingY = 450;
      doc.fillColor('#0f172a').fontSize(16).font('Helvetica-Bold')
         .text("Detalhamento por Alunos", 50, rankingY);
      
      doc.moveTo(50, rankingY + 20).lineTo(550, rankingY + 20).stroke('#e2e8f0');

      // Top 5
      doc.fontSize(12).fillColor('#16a34a').font('Helvetica-Bold').text("Top 5 Alunos (Excelência)", 50, rankingY + 40);
      let topY = rankingY + 65;
      analytics.ranking.top.forEach((s, i) => {
        doc.fontSize(10).fillColor('#1e293b').font('Helvetica').text(`${i + 1}. ${s.name}`, 50, topY);
        doc.font('Helvetica-Bold').text(`${s.score}`, 230, topY);
        topY += 20;
      });

      // Bottom 5
      doc.fontSize(12).fillColor('#dc2626').font('Helvetica-Bold').text("Necessitam de Apoio", 300, rankingY + 40);
      let botY = rankingY + 65;
      analytics.ranking.bottom.forEach((s, i) => {
        doc.fontSize(10).fillColor('#1e293b').font('Helvetica').text(`${i + 1}. ${s.name}`, 300, botY);
        doc.font('Helvetica-Bold').text(`${s.score}`, 500, botY);
        botY += 20;
      });

      // Footer
      const pageHeight = doc.page.height;
      doc.fontSize(8).fillColor('#94a3b8').font('Helvetica')
         .text("Este relatório é gerado automaticamente pelo sistema de análise ENADE SaaS.", 50, pageHeight - 50, { align: 'center' });

      doc.end();
    });
  } catch (error) {
    console.error("Erro ao gerar relatório:", error);
    return { success: false, error: "Falha ao gerar o relatório PDF" };
  }
}
