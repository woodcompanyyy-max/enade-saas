import Link from "next/link";
import { notFound } from "next/navigation";
import { 
  ArrowLeft, 
  TrendingUp, 
  Users, 
  Award, 
  History,
  BrainCircuit,
  Target
} from "lucide-react";
import { HistoricalChart } from "@/components/historical-chart";
import { CompetenceRadar } from "@/components/competence-radar";
import { getCourseById } from "@/services/course.service";
import { getHistoricalChartData, getRadarData } from "@/services/dashboard.service";
import { StatCard } from "@/components/dashboard/StatCard";
import { DownloadReportButton } from "@/components/reports/DownloadReportButton";


interface Props {
  params: Promise<{ id: string }>;
}

export default async function CourseDetailPage(props: Props) {
  const { id } = await props.params;
  
  // Consome services real/mock intercabiáveis
  const [course, chartData, radarData] = await Promise.all([
    getCourseById(id),
    getHistoricalChartData(),
    getRadarData(id)
  ]);

  if (!course) {
    notFound(); // Redireciona para 404 do Next.js
  }

  const isHighRisk = course.riskLevel === 'Alto';

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Header com Navegação */}
      <div className="flex flex-col gap-4">
        <Link 
          href="/cursos"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-blue-600 transition-colors w-fit font-medium"
        >
          <ArrowLeft size={16} />
          Voltar para Catálogo
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">{course.name}</h1>
            <div className="flex items-center gap-3">
              <span className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wider">
                {course.category}
              </span>
              <span className="text-sm font-medium text-zinc-500">
                {course.modality}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/10 text-green-700 dark:text-green-400 px-4 py-2.5 rounded-xl border border-green-100 dark:border-green-900/20 shrink-0">
              <Target size={18} />
              <span className="font-bold text-sm tracking-tight">Ciclo ENADE atual</span>
            </div>
            <DownloadReportButton courseId={id} />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Nota ENADE" 
          value={course.enadeScore.toFixed(1)} 
          trend={course.enadeScore >= course.nationalAvg ? "Acima da média" : "Abaixo da média"}
          trendLabel=""
          isPositive={course.enadeScore >= course.nationalAvg} 
        />
        <StatCard 
          label="Média Nacional (Comparativo)" 
          value={course.nationalAvg.toFixed(1)} 
          trend="Referência"
          trendLabel=""
          isPositive={true} 
        />
        <StatCard 
          label="IDD (Diferença Desempenho)" 
          value={course.idd.toFixed(1)} 
          trend={course.idd > 3 ? "Boa agregação" : "Atenção necessária"}
          trendLabel=""
          isPositive={course.idd > 3} 
        />
        <StatCard 
          label="Taxa de Participação" 
          value={`${course.participationRate.toFixed(1)}%`} 
          trend={course.participationRate > 85 ? "Engajamento alto" : "Risco de amostragem"}
          trendLabel=""
          isPositive={course.participationRate > 85} 
        />
      </div>

      {/* Visualizações Principais */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 h-[450px] flex flex-col shadow-sm">
          <div className="flex justify-between items-center mb-6">
             <div className="flex items-center gap-2">
               <History className="text-blue-600" size={20} />
               <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100">Evolução Histórica</h3>
             </div>
          </div>
          <div className="flex-1 min-h-0">
            <HistoricalChart data={chartData} />
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 h-[450px] flex flex-col shadow-sm">
          <h3 className="font-bold text-lg mb-6 text-zinc-900 dark:text-zinc-100">Radar de Competências</h3>
          <div className="flex-1 min-h-0">
            <CompetenceRadar data={radarData} />
          </div>
        </div>
      </div>

      {/* Diagnóstico Rápido */}
      <div className="bg-zinc-900 dark:bg-zinc-100 p-8 rounded-2xl text-white dark:text-zinc-900 flex flex-col md:flex-row justify-between items-center gap-8 shadow-md">
        <div className="space-y-4 max-w-2xl">
          <div className="flex items-center gap-2 text-blue-400 dark:text-blue-600">
             <TrendingUp size={24} />
             <h3 className="text-xl font-bold italic underline decoration-blue-500 decoration-2 underline-offset-4">Diagnóstico Smart</h3>
          </div>
          <p className="text-zinc-300 dark:text-zinc-700 leading-relaxed text-sm md:text-base">
            O curso de <span className="font-bold text-white dark:text-zinc-900">{course.name}</span> apresenta uma nota geral de <span className="font-bold text-white dark:text-zinc-900">{course.enadeScore.toFixed(1)}</span>. 
            O foco deve ser mantido em elevar o indicador acima da média nacional ({course.nationalAvg.toFixed(1)}).
            O IDD (Indicador de Diferença entre Desempenhos) está em {course.idd.toFixed(1)}, mostrando o valor agregado real.
          </p>
        </div>
        <div className="flex flex-col justify-center gap-3 min-w-[200px] w-full md:w-auto">
          <div className="bg-zinc-800 dark:bg-white p-5 rounded-xl space-y-1 border border-zinc-700 dark:border-zinc-200 flex flex-col items-center justify-center text-center">
             <span className="text-[10px] uppercase font-bold text-zinc-400 dark:text-zinc-500 tracking-wider">Status de Risco</span>
             <p className={`text-xl font-black ${
              isHighRisk 
                ? 'text-red-500' 
                : course.riskLevel === 'Médio'
                  ? 'text-yellow-500'
                  : 'text-green-500'
             }`}>
               NÍVEL {course.riskLevel.toUpperCase()}
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}

