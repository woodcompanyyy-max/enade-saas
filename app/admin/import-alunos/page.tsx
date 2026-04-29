"use client";

import { useState } from "react";
import { Upload, FileText, AlertCircle, CheckCircle2, Info } from "lucide-react";
import { importAlunosCsvAction } from "@/app/actions/import.actions";

export default function ImportAlunosPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setResult(null);

    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target?.result as string;
      const response = await importAlunosCsvAction(text);
      setResult({ success: response.success, message: (response as any).error || response.message || "Erro desconhecido" });
      setLoading(false);
      if (response.success) setFile(null);
    };
    reader.readAsText(file);
  };

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="space-y-2">
        <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">
          Importar Simulados e Alunos
        </h1>
        <p className="text-zinc-500 font-medium">
          Adicione novos resultados de simulados ao sistema. Isso também criará automaticamente os cursos e alunos que ainda não existirem.
        </p>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 space-y-6 shadow-sm">
        
        <div className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100 font-bold">
            <Info size={18} className="text-blue-500" />
            <span>Formato do CSV de Alunos</span>
          </div>
          <p className="text-xs text-zinc-500">O cabeçalho deve conter exatamente os nomes abaixo:</p>
          <code className="block text-[10px] bg-white dark:bg-black p-4 rounded border border-zinc-200 dark:border-zinc-800 overflow-x-auto whitespace-nowrap">
            student_name,ra,course,shift,exam_type,specific_correct,specific_wrong,fg_correct,fg_wrong,total_correct,total_wrong
          </code>
        </div>

        <div className="flex flex-col items-center justify-center w-full">
          <label className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-xl cursor-pointer bg-zinc-50 dark:bg-zinc-950 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors ${file ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/10' : 'border-zinc-300 dark:border-zinc-700'}`}>
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              {file ? (
                <>
                  <FileText className="w-10 h-10 mb-3 text-blue-500" />
                  <p className="mb-2 text-sm text-zinc-700 dark:text-zinc-300 font-semibold">{file.name}</p>
                  <p className="text-xs text-zinc-500">Pronto para importar</p>
                </>
              ) : (
                <>
                  <Upload className="w-10 h-10 mb-3 text-zinc-400" />
                  <p className="mb-2 text-sm text-zinc-500 dark:text-zinc-400"><span className="font-semibold">Clique para selecionar</span> ou arraste o arquivo</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-500">CSV delimitado por vírgula</p>
                </>
              )}
            </div>
            <input type="file" className="hidden" accept=".csv" onChange={handleFileChange} />
          </label>
        </div>

        <button
          onClick={handleUpload}
          disabled={!file || loading}
          className="w-full flex items-center justify-center gap-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 py-3 rounded-xl font-bold hover:bg-blue-600 dark:hover:bg-blue-500 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg active:scale-[0.98]"
        >
          {loading ? "Processando dados..." : "Processar CSV de Alunos"}
        </button>

        {result && (
          <div className={`p-4 rounded-xl flex items-start gap-3 animate-in slide-in-from-top-2 duration-300 ${result.success ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-900/30' : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-900/30'}`}>
            {result.success ? <CheckCircle2 className="shrink-0 mt-0.5" size={18} /> : <AlertCircle className="shrink-0 mt-0.5" size={18} />}
            <p className="text-sm font-medium">{result.message}</p>
          </div>
        )}
      </div>
    </div>
  );
}
