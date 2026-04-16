"use client";

import { BarChart3, TrendingUp, Users, PieChart, Activity } from "lucide-react";
import { HistoricalChart } from "@/components/historical-chart";

export default function AnalysisPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Análise Detalhada</h2>
        <p className="text-sm text-muted-foreground">Explore métricas avançadas e tendências de desempenho.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-zinc-900 border border-border dark:border-zinc-800 p-6 rounded-xl space-y-4 shadow-sm">
          <div className="bg-purple-50 dark:bg-purple-900/20 w-10 h-10 rounded-lg flex items-center justify-center text-purple-600 dark:text-purple-400">
            <Users size={20} />
          </div>
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Perfil do Aluno</h3>
          <p className="text-sm text-muted-foreground italic">Distribuição socioeconômica e acadêmica consolidada.</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 border border-border dark:border-zinc-800 p-6 rounded-xl space-y-4 shadow-sm">
          <div className="bg-orange-50 dark:bg-orange-900/20 w-10 h-10 rounded-lg flex items-center justify-center text-orange-600 dark:text-orange-400">
            <PieChart size={20} />
          </div>
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Distribuição de Notas</h3>
          <p className="text-sm text-muted-foreground italic">Visualização por percentis e quartis.</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 border border-border dark:border-zinc-800 p-6 rounded-xl space-y-4 shadow-sm">
          <div className="bg-green-50 dark:bg-green-900/20 w-10 h-10 rounded-lg flex items-center justify-center text-green-600 dark:text-green-400">
            <Activity size={20} />
          </div>
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Engajamento</h3>
          <p className="text-sm text-muted-foreground italic">Taxa de resposta em simulados por semestre.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-border dark:border-zinc-800 rounded-xl p-8 h-[400px] shadow-sm">
        <h3 className="font-semibold text-lg mb-6 text-zinc-900 dark:text-zinc-100">Comparativo Regional vs Nacional</h3>
        <HistoricalChart />
      </div>

      <div className="bg-zinc-900 rounded-xl p-8 text-white flex items-center justify-between">
        <div className="space-y-2">
          <h3 className="text-xl font-bold">Insights Avançados</h3>
          <p className="text-zinc-400 text-sm">A média de 'Conhecimento Específico' do curso está 12% acima do benchmark das privadas do Sudeste.</p>
        </div>
        <TrendingUp size={48} className="text-blue-500 opacity-50" />
      </div>
    </div>
  );
}
