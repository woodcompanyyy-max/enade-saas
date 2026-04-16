"use client";

import { BookOpen, FileCheck, ArrowRight, BarChart2 } from "lucide-react";
import { HistoricalChart } from "@/components/historical-chart";

const simulations = [
  { id: 1, name: "Simulado 1 (Março/2024)", date: "20/03/2024", avg: 3.4, participation: "85%", status: "Finalizado" },
  { id: 2, name: "Simulado 2 (Abril/2024)", date: "15/04/2024", avg: 3.6, participation: "92%", status: "Em andamento" },
];

export default function SimulationsPage() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Módulo de Simulados</h2>
          <p className="text-sm text-muted-foreground">Registre e compare simulados acadêmicos com o ENADE oficial.</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-all flex items-center gap-2">
          Novo Simulado
          <FileCheck size={16} />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-zinc-900 border border-border dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-50 dark:bg-zinc-800/50 border-b border-border dark:border-zinc-800">
                <tr>
                  <th className="px-6 py-4 font-semibold text-zinc-900 dark:text-zinc-100">Nome do Simulado</th>
                  <th className="px-6 py-4 font-semibold text-zinc-900 dark:text-zinc-100">Data</th>
                  <th className="px-6 py-4 font-semibold text-zinc-900 dark:text-zinc-100">Média</th>
                  <th className="px-6 py-4 font-semibold text-zinc-900 dark:text-zinc-100">Participação</th>
                  <th className="px-6 py-4 font-semibold text-zinc-900 dark:text-zinc-100 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border dark:divide-zinc-800">
                {simulations.map((sim) => (
                  <tr key={sim.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50 transition-colors group">
                    <td className="px-6 py-4 font-medium text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full bg-blue-500" />
                       {sim.name}
                    </td>
                    <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">{sim.date}</td>
                    <td className="px-6 py-4 font-bold text-zinc-900 dark:text-zinc-100">{sim.avg}</td>
                    <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">{sim.participation}</td>
                    <td className="px-6 py-4 text-right">
                       <button className="text-blue-600 hover:underline inline-flex items-center gap-1 font-medium">
                         Relatório <ArrowRight size={14} />
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-blue-600 text-white p-8 rounded-xl flex items-center justify-between">
            <div className="space-y-2">
              <h3 className="text-xl font-bold">Gap de Aprendizado Detectado</h3>
              <p className="text-blue-100 text-sm max-w-md">O desempenho em 'Gestão Financeira' nos simulados está 15% abaixo do esperado para atingir a meta oficial.</p>
            </div>
            <BarChart2 size={64} className="text-white/20" />
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-border dark:border-zinc-800 rounded-xl p-6 flex flex-col shadow-sm">
          <h3 className="font-semibold text-lg mb-6 text-zinc-900 dark:text-zinc-100">Projeção ENADE Real</h3>
          <div className="flex-1 space-y-6">
            <div className="h-48 bg-zinc-50 dark:bg-zinc-800 rounded-lg border border-border dark:border-zinc-800 p-4">
              <HistoricalChart />
            </div>
            <div className="space-y-4">
               <div>
                  <div className="flex justify-between text-xs font-bold uppercase text-zinc-500 mb-1">
                     <span>Probabilidade de Nota 4 ou 5</span>
                     <span>65%</span>
                  </div>
                  <div className="w-full h-2 bg-zinc-100 rounded-full overflow-hidden">
                     <div className="h-full bg-green-500 w-[65%]" />
                  </div>
               </div>
                <div>
                  <div className="flex justify-between text-xs font-bold uppercase text-zinc-500 dark:text-zinc-400 mb-1">
                     <span>Engajamento do Aluno</span>
                     <span>92%</span>
                  </div>
                  <div className="w-full h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                     <div className="h-full bg-blue-500 w-[92%]" />
                  </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
