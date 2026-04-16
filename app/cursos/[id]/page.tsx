"use client";

import { use } from "react";
import { COURSES } from "@/lib/courses";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  TrendingUp, 
  Users, 
  Award, 
  AlertTriangle,
  History,
  BrainCircuit,
  Target
} from "lucide-react";
import { HistoricalChart } from "@/components/historical-chart";
import { CompetenceRadar } from "@/components/competence-radar";

export default function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const course = COURSES.find(c => c.id === id);

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <h2 className="text-xl font-bold">Curso não encontrado</h2>
        <button onClick={() => router.push("/cursos")} className="text-blue-600 hover:underline">Voltar para a lista</button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header com Navegação */}
      <div className="flex flex-col gap-4">
        <button 
          onClick={() => router.push("/cursos")}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors w-fit"
        >
          <ArrowLeft size={16} />
          Voltar para Catálogo
        </button>
        
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">{course.name}</h1>
            <div className="flex items-center gap-3">
              <span className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-xs font-bold px-2 py-0.5 rounded uppercase">
                {course.type}
              </span>
              <span className="text-sm text-muted-foreground italic">
                {course.modality}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/10 text-green-700 dark:text-green-400 px-4 py-2 rounded-xl border border-green-100 dark:border-green-900/20">
            <Target size={18} />
            <span className="font-bold">Ciclo ENADE 2025</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Média Geral" value="4.1" trend="+0.3" icon={<TrendingUp size={20} />} />
        <StatCard label="Formação Geral" value="3.9" trend="+0.1" icon={<BrainCircuit size={20} />} />
        <StatCard label="Conhecimento Específico" value="4.3" trend="+0.5" icon={<Award size={20} />} />
        <StatCard label="Taxa de Participação" value="95%" trend="+3%" icon={<Users size={20} />} />
      </div>

      {/* Visualizações Principais */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-border dark:border-zinc-800 h-[450px] flex flex-col shadow-sm">
          <div className="flex justify-between items-center mb-6">
             <div className="flex items-center gap-2">
               <History className="text-blue-600" size={20} />
               <h3 className="font-bold text-lg">Evolução de Notas</h3>
             </div>
          </div>
          <div className="flex-1">
            <HistoricalChart />
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-border dark:border-zinc-800 h-[450px] flex flex-col shadow-sm">
          <h3 className="font-bold text-lg mb-6">Radar Acadêmico</h3>
          <div className="flex-1">
            <CompetenceRadar />
          </div>
        </div>
      </div>

      {/* Diagnóstico Rápido */}
      <div className="bg-zinc-900 dark:bg-zinc-100 p-8 rounded-2xl text-white dark:text-zinc-900 flex flex-col md:flex-row justify-between gap-8">
        <div className="space-y-4 max-w-2xl">
          <div className="flex items-center gap-2 text-blue-400 dark:text-blue-600">
             <TrendingUp size={24} />
             <h3 className="text-xl font-bold italic underline decoration-blue-500 decoration-2 underline-offset-4">Diagnóstico Smart</h3>
          </div>
          <p className="text-zinc-300 dark:text-zinc-600 leading-relaxed">
            O curso de <span className="font-bold text-white dark:text-zinc-900">{course.name}</span> apresenta uma tendência de crescimento sustentável. 
            O foco deve ser mantido no <span className="text-blue-400 dark:text-blue-600 font-bold">Componente Específico</span>, 
            onde a média da turma está no 85º percentil nacional.
          </p>
        </div>
        <div className="flex flex-col justify-center gap-3 min-w-[200px]">
          <div className="bg-zinc-800 dark:bg-zinc-200 p-4 rounded-xl space-y-1 border border-zinc-700 dark:border-zinc-300">
             <span className="text-[10px] uppercase font-bold text-zinc-500">Nível de Risco</span>
             <p className="font-black text-green-500">MUITO BAIXO</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, trend, icon }: { label: string, value: string, trend: string, icon: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-border dark:border-zinc-800 space-y-3 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className="p-2 bg-zinc-50 dark:bg-zinc-800 rounded-lg text-zinc-500 dark:text-zinc-400">
          {icon}
        </div>
        <span className="text-xs font-black text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
          {trend}
        </span>
      </div>
      <div>
        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{label}</h4>
        <p className="text-3xl font-black tracking-tighter mt-1">{value}</p>
      </div>
    </div>
  );
}
