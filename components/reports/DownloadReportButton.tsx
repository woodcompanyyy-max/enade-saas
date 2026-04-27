"use client";

import { useState } from "react";
import { FileDown, Loader2 } from "lucide-react";
import { generateCourseReport } from "@/app/actions/report.actions";

interface DownloadReportButtonProps {
  courseId: string;
}

/**
 * Botão para download do relatório executivo em PDF.
 * Gerencia o estado de loading e a conversão de Base64 para Blob.
 */
export function DownloadReportButton({ courseId }: DownloadReportButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    try {
      setLoading(true);
      
      // Chamada da Server Action
      const result = await generateCourseReport(courseId);

      if (result.success && result.data) {
        // Conversão de Base64 para Blob no lado do cliente
        const byteCharacters = atob(result.data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: "application/pdf" });

        // Criação de um link temporário para o download
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = 'none';
        a.href = url;
        a.download = result.filename || `relatorio_${courseId}.pdf`;
        
        document.body.appendChild(a);
        a.click();
        
        // Cleanup
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        // Feedback de erro (simples para este contexto)
        alert(result.error || "Houve um erro ao processar o seu relatório.");
      }
    } catch (error) {
      console.error("Erro ao processar download do PDF:", error);
      alert("Erro de conexão ou falha no servidor ao gerar o PDF.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="group relative flex items-center gap-2 bg-zinc-900 dark:bg-zinc-100 hover:bg-blue-600 dark:hover:bg-blue-500 text-white dark:text-zinc-900 dark:hover:text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md hover:shadow-blue-500/20 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden"
      title="Baixar relatório completo em PDF"
    >
      {/* Background glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-blue-600/10 to-blue-600/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
      
      {loading ? (
        <Loader2 className="animate-spin text-blue-400" size={18} />
      ) : (
        <FileDown className="group-hover:translate-y-[1px] transition-transform" size={18} />
      )}
      
      <span className="relative z-10">
        {loading ? "Processando..." : "Baixar Relatório"}
      </span>
    </button>
  );
}
