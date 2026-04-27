import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getGlobalAnalytics, getCourseAnalytics } from "@/services/analytics.service";
import { getCourses } from "@/services/course.service";
import { DashboardCourseFilter } from "@/components/dashboard/DashboardCourseFilter";
import { AnalyticsKPIs } from "@/components/dashboard/AnalyticsKPIs";
import { AnalyticsCharts } from "@/components/dashboard/AnalyticsCharts";
import { AnalyticsRanking } from "@/components/dashboard/AnalyticsRanking";
import { AnalyticsInsights } from "@/components/dashboard/AnalyticsInsights";
import { ThemeToggle } from "@/components/theme-toggle";
import { StatCard } from "@/components/dashboard/StatCard";
import { HistoricalChart } from "@/components/historical-chart";
import { getHistoricalChartData } from "@/services/dashboard.service";
import { Zap, BarChart3, AlertTriangle, TrendingUp, ArrowDownRight } from "lucide-react";
import { SummaryIconCard } from "@/components/dashboard/SummaryIconCard";
import { ReportButton } from "@/components/dashboard/ReportButton";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function DashboardPage(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams;
  const session = await getServerSession(authOptions);
  
  if (!session) return null;

  const courseId = typeof searchParams.courseId === "string" ? searchParams.courseId : undefined;

  // 1. Buscar lista de cursos para o filtro (Data Tenancy)
  const coursesResponse = await getCourses({
    userId: session.user.id,
    userRole: session.user.role,
    perPage: 100 // Pega todos para o dropdown
  });

  // 2. Buscar Analytics (Global ou Específico)
  const analyticsData = courseId 
    ? await getCourseAnalytics(courseId, { user: session.user as any })
    : null;
    
  const globalData = !courseId 
    ? await getGlobalAnalytics({ user: session.user as any })
    : null;

  const chartData = await getHistoricalChartData();

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-700">
      {/* Header com Filtro */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tighter text-zinc-900 dark:text-zinc-100">
            {courseId ? "Análise do Curso" : "Dashboard Institucional"}
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 font-medium text-sm">
            {courseId ? "Métricas detalhadas e performance individual" : "Visão geral do desempenho ENADE"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          {courseId && <ReportButton courseId={courseId} />}
          <DashboardCourseFilter courses={coursesResponse.data} />
        </div>
      </div>

      {/* VISÃO ESPECÍFICA DO CURSO */}
      {courseId && analyticsData && (
        <>
          <AnalyticsInsights insights={analyticsData.insights} />
          <AnalyticsKPIs data={analyticsData} />
          <AnalyticsCharts data={analyticsData} />
          <AnalyticsRanking data={analyticsData} />
        </>
      )}

      {/* VISÃO GLOBAL (Quando nenhum curso está selecionado) */}
      {!courseId && globalData && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              label="Média Geral ENADE"
              value={globalData.globalAvg.toString()}
              trend="+2.3%"
              trendLabel="vs. ciclo anterior"
              isPositive={true}
            />
            <StatCard
              label="Cursos Monitorados"
              value={globalData.totalCourses}
              trend="+1"
              trendLabel="este mês"
              isPositive={true}
            />
            <StatCard
              label="Alunos Ativos"
              value={globalData.totalStudents}
              trend="+12%"
              trendLabel="vs. mês anterior"
              isPositive={true}
            />
            <StatCard
              label="Participação Média"
              value="87.5%"
              trend="-2.1%"
              trendLabel="meta: 90%"
              isPositive={false}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
                <BarChart3 size={18} className="text-blue-500" />
                Evolução Histórica
              </h3>
              <div className="h-[300px]">
                <HistoricalChart data={chartData} />
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
                <Zap size={18} className="text-yellow-500" />
                Desempenho por Área
              </h3>
              <div className="space-y-4">
                {globalData.performanceByArea.map((area) => (
                  <div key={area.area} className="flex justify-between items-center p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
                    <span className="text-sm font-bold">{area.area}</span>
                    <span className="text-sm font-black text-blue-600">{area.avg}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Footer comum */}
      <div className="pt-8 border-t border-zinc-100 dark:border-zinc-800 flex flex-col md:flex-row justify-between items-center text-[10px] text-zinc-400 gap-4">
        <p>© 2026 ENADE Analytics. Todos os direitos reservados.</p>
        <div className="flex items-center gap-2">
          <span>Desenvolvido por</span>
          <span className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1">
            <div className="w-2 h-2 bg-blue-600 rounded-full" /> WoodCompany
          </span>
        </div>
      </div>
    </div>
  );
}
