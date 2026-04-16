"use client";

import { BrainCircuit, CheckCircle2, AlertCircle, Lightbulb, ChevronRight } from "lucide-react";
import { generateDiagnosis } from "@/lib/ai-diagnostics";

const diagnosis = generateDiagnosis("Administração", { avgGeral: 3.80 });

export default function DiagnosisPage() {
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="bg-white dark:bg-zinc-900 border border-border dark:border-zinc-800 rounded-xl p-8 flex flex-col md:flex-row gap-8 items-start shadow-sm">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-full text-blue-600 dark:text-blue-400">
          <BrainCircuit size={48} />
        </div>
        <div className="flex-1 space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Diagnóstico Inteligente: {diagnosis.course}</h2>
          <p className="text-muted-foreground">Análise gerada automaticamente com base nos dados do ciclo 2023 e simulados recentes.</p>
          <div className="flex gap-4 mt-4">
            <div className="bg-zinc-50 dark:bg-zinc-800/50 px-4 py-2 rounded-lg border border-border dark:border-zinc-800">
              <span className="text-xs text-muted-foreground block uppercase font-bold tracking-wider">Nota Geral</span>
              <span className="text-xl font-bold leading-tight text-zinc-900 dark:text-zinc-100">{diagnosis.notaGeral}</span>
            </div>
            <div className="bg-zinc-50 dark:bg-zinc-800/50 px-4 py-2 rounded-lg border border-border dark:border-zinc-800">
              <span className="text-xs text-muted-foreground block uppercase font-bold tracking-wider">Tendência</span>
              <span className="text-xl font-bold leading-tight text-green-600 dark:text-green-400">{diagnosis.trend}</span>
            </div>
          </div>
        </div>
        <button className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-6 py-3 rounded-lg font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all flex items-center gap-2 shadow-sm">
          Gerar Novo Relatório
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Pontos Fortes */}
        <div className="bg-white dark:bg-zinc-900 border border-border dark:border-zinc-800 rounded-xl p-6 h-full shadow-sm">
          <div className="flex items-center gap-2 mb-6 text-green-700 dark:text-green-500">
            <CheckCircle2 size={24} />
            <h3 className="text-lg font-semibold">Pontos Fortes</h3>
          </div>
          <ul className="space-y-4">
            {diagnosis.strengths.map((s, i) => (
              <li key={i} className="flex gap-3 text-sm text-zinc-700 dark:text-zinc-300 items-start">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 shrink-0" />
                {s}
              </li>
            ))}
          </ul>
        </div>

        {/* Pontos de Atenção */}
        <div className="bg-white dark:bg-zinc-900 border border-border dark:border-zinc-800 rounded-xl p-6 h-full shadow-sm">
          <div className="flex items-center gap-2 mb-6 text-red-700 dark:text-red-500">
            <AlertCircle size={24} />
            <h3 className="text-lg font-semibold">Pontos de Atenção</h3>
          </div>
          <ul className="space-y-4">
            {diagnosis.weaknesses.map((w, i) => (
              <li key={i} className="flex gap-3 text-sm text-zinc-700 dark:text-zinc-300 items-start">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                {w}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Recomendações */}
      <div className="bg-zinc-900 text-zinc-50 border border-zinc-800 rounded-xl p-8 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-6">
            <Lightbulb size={24} className="text-yellow-400" />
            <h3 className="text-xl font-semibold">Recomendações Estratégicas</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {diagnosis.recommendations.map((r, i) => (
              <div key={i} className="bg-zinc-800/50 p-6 rounded-lg border border-zinc-700 hover:border-zinc-500 transition-colors">
                <span className="text-zinc-500 text-xs font-bold uppercase mb-2 block">Ação {i + 1}</span>
                <p className="text-sm font-medium leading-relaxed">{r}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -mr-32 -mt-32" />
      </div>
    </div>
  );
}
