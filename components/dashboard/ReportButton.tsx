'use client';

import { useState } from 'react';
import { FileDown, Loader2 } from 'lucide-react';
import { generateCourseReportAction } from '@/app/actions/report.actions';

interface Props {
  courseId: string;
}

export function ReportButton({ courseId }: Props) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    try {
      setLoading(true);
      const base64 = await generateCourseReportAction(courseId);
      
      // Criar link temporário para download
      const link = document.createElement('a');
      link.href = base64;
      link.download = `relatorio-enade-${courseId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      alert('Não foi possível gerar o relatório. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all disabled:opacity-50"
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <FileDown className="w-4 h-4" />
      )}
      {loading ? 'Gerando...' : 'Baixar PDF'}
    </button>
  );
}
