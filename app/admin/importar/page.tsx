'use client';

import { useState } from 'react';
import Papa from 'papaparse';
import { importDataAction } from '@/app/actions/import';
import type { ImportRow, ImportSummary } from '@/types';
import { Upload, CheckCircle, AlertCircle, FileText, Loader2 } from 'lucide-react';

export default function ImportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<ImportSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
      setSummary(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Por favor, selecione um arquivo CSV.');
      return;
    }

    setLoading(true);
    setError(null);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      complete: async (results) => {
        try {
          const rows = results.data as ImportRow[];
          const result = await importDataAction(rows);
          setSummary(result);
        } catch (err: any) {
          setError(err.message || 'Erro ao processar arquivo.');
        } finally {
          setLoading(false);
        }
      },
      error: (err) => {
        setError(`Erro no parser: ${err.message}`);
        setLoading(false);
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent mb-2">
            Importação de Dados
          </h1>
          <p className="text-gray-400">
            Suba arquivos CSV para popular cursos, alunos e resultados no sistema.
          </p>
        </header>

        <div className="bg-[#161618] border border-[#26262a] rounded-2xl p-8 shadow-2xl">
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-[#36363a] rounded-xl p-12 transition-all hover:border-blue-500/50 group">
            <Upload className="w-12 h-12 text-gray-500 group-hover:text-blue-400 mb-4 transition-colors" />
            <p className="text-gray-300 mb-2 font-medium">Arraste seu arquivo CSV aqui</p>
            <p className="text-gray-500 text-sm mb-6">Apenas arquivos .csv são permitidos</p>
            
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
              id="csv-upload"
            />
            <label
              htmlFor="csv-upload"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg cursor-pointer transition-all active:scale-95"
            >
              Selecionar Arquivo
            </label>
            
            {file && (
              <div className="mt-6 flex items-center gap-2 text-blue-400 bg-blue-400/10 px-4 py-2 rounded-full border border-blue-400/20">
                <FileText className="w-4 h-4" />
                <span className="text-sm font-medium">{file.name}</span>
              </div>
            )}
          </div>

          <button
            onClick={handleUpload}
            disabled={!file || loading}
            className={`w-full mt-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
              !file || loading
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-900/20 active:scale-[0.99]'
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processando...
              </>
            ) : (
              'Iniciar Importação'
            )}
          </button>
        </div>

        {error && (
          <div className="mt-8 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-4">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {summary && (
          <div className="mt-8 animate-in fade-in slide-in-from-top-4">
            <div className="bg-[#161618] border border-green-500/20 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-green-500/20 p-2 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-green-500">Importação Concluída</h2>
                  <p className="text-gray-400 text-sm">Resumo do processamento</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-[#0a0a0b] p-4 rounded-xl border border-[#26262a]">
                  <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Total</p>
                  <p className="text-2xl font-bold">{summary.totalRows}</p>
                </div>
                <div className="bg-[#0a0a0b] p-4 rounded-xl border border-[#26262a]">
                  <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Sucesso</p>
                  <p className="text-2xl font-bold text-green-500">{summary.successCount}</p>
                </div>
                <div className="bg-[#0a0a0b] p-4 rounded-xl border border-[#26262a]">
                  <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Erros</p>
                  <p className="text-2xl font-bold text-red-500">{summary.errorCount}</p>
                </div>
                <div className="bg-[#0a0a0b] p-4 rounded-xl border border-[#26262a]">
                  <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Novos Alunos</p>
                  <p className="text-2xl font-bold text-blue-400">{summary.successCount}</p>
                </div>
              </div>

              {summary.errors.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-widest">Detalhes dos Erros</h3>
                  <div className="max-h-60 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                    {summary.errors.map((err, idx) => (
                      <div key={idx} className="bg-red-500/5 border border-red-500/10 p-3 rounded-lg text-xs flex gap-3">
                        <span className="text-red-500 font-bold">Linha {err.row}:</span>
                        <span className="text-gray-300">{err.error}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
