"use client";

import { 
  TrendingUp, 
  Users, 
  AlertTriangle, 
  ChevronRight,
  BarChart3,
  Search,
  Zap,
  ShieldAlert,
  ArrowUpRight,
  ArrowDownRight,
  Loader2
} from "lucide-react";
import { HistoricalChart } from "@/components/historical-chart";
import { ThemeToggle } from "@/components/theme-toggle";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard")
      .then(res => res.json())
      .then(json => {
        setData(json);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="h-[80vh] w-full flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-blue-600" size={48} />
        <p className="text-zinc-500 font-bold animate-pulse uppercase tracking-widest text-xs">Carregando Inteligência...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tighter text-zinc-900 dark:text-zinc-100">Dashboard</h1>
          <p className="text-zinc-500 dark:text-zinc-400 font-medium text-sm">Visão geral do desempenho institucional no ENADE</p>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-1.5 rounded-xl hidden md:flex items-center gap-2 shadow-sm">
            <Search size={16} className="text-zinc-400 ml-2" />
            <input 
              type="text" 
              placeholder="Buscar curso..." 
              className="bg-transparent border-none focus:outline-none text-sm w-48 text-zinc-900 dark:text-zinc-100"
            />
          </div>
          <label className="bg-black dark:bg-zinc-100 text-white dark:text-zinc-900 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-zinc-800 dark:hover:bg-zinc-300 transition-all cursor-pointer shadow-lg shadow-black/10">
            <Zap size={14} />
            <span className="hidden sm:inline">Upload CSV</span>
            <input 
              type="file" 
              accept=".csv" 
              className="hidden" 
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const formData = new FormData();
                formData.append("file", file);
                const res = await fetch("/api/upload", { method: "POST", body: formData });
                if (res.ok) {
                  alert("Dados processados com sucesso!");
                  window.location.reload();
                }
                else alert("Erro ao processar arquivo.");
              }}
            />
          </label>
        </div>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MainStatCard 
          label="Média Geral ENADE" 
          value={data?.stats?.avgEnade || "0.00"} 
          trend="+2.3%" 
          trendLabel="vs. ciclo anterior"
          isPositive={true}
        />
        <MainStatCard 
          label="Total de Cursos Avaliados" 
          value={data?.stats?.totalCourses || "0"} 
          trend="+4.3%" 
          trendLabel="vs. ciclo anterior"
          isPositive={true}
        />
        <MainStatCard 
          label="Cursos Acima da Média Nacional" 
          value={data?.stats?.aboveAvg || "0"} 
          trend="+7.1%" 
          trendLabel="vs. ciclo anterior"
          isPositive={true}
        />
        <MainStatCard 
          label="Taxa de Participação" 
          value={data?.stats?.participation || "0%"} 
          trend="-2.1%" 
          trendLabel="vs. ciclo anterior"
          isPositive={false}
        />
      </div>

      {/* First Row Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-zinc-900 dark:text-zinc-100 italic underline decoration-blue-500/30">
            <BarChart3 size={18} className="text-blue-500" />
            Evolução Histórica da Média ENADE
          </h3>
          <div className="h-[300px]">
            <HistoricalChart />
          </div>
        </div>
        
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-zinc-900 dark:text-zinc-100 italic underline decoration-yellow-500/30">
            <Zap size={18} className="text-yellow-500" />
            Top Cursos por Nota ENADE
          </h3>
          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {data?.courses?.map((c: any, i: number) => (
              <TopCourseRow key={i} name={c.name} score={c.score} max={5} />
            ))}
          </div>
        </div>
      </div>

      {/* Second Row Areas and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Performance by Area */}
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6 text-zinc-900 dark:text-zinc-100">
            <h3 className="text-lg font-bold">Desempenho por Área de Conhecimento</h3>
          </div>
          <div className="space-y-3">
            {data?.areas?.map((a: any, i: number) => (
              <AreaPerfCard key={i} title={a.title} count={a.count} avg={a.avg} />
            ))}
          </div>
        </div>

        {/* Recent Alerts */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6 text-zinc-900 dark:text-zinc-100">
            <h3 className="text-lg font-bold">Alertas Recentes</h3>
            <button className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
              Ver todos <ChevronRight size={12} />
            </button>
          </div>
          <div className="space-y-6">
            {data?.alerts?.length > 0 ? data.alerts.map((alert: any, i: number) => (
              <AlertItem 
                key={i}
                course={alert.course} 
                level={alert.level} 
                title={alert.title} 
                desc={alert.desc}
                type={alert.type}
              />
            )) : (
              <p className="text-zinc-500 text-xs italic text-center py-8">Nenhum alerta crítico detectado no momento.</p>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Summary Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryIconCard title="Cursos em Crescimento" value="12" icon={<TrendingUp className="text-green-500" />} />
        <SummaryIconCard title="Cursos em Declínio" value="3" icon={<ArrowDownRight className="text-red-500" />} />
        <SummaryIconCard title="Requer Atenção" value="5" icon={<AlertTriangle className="text-yellow-500" />} />
      </div>

      {/* Footer */}
      <div className="pt-8 border-t border-zinc-100 dark:border-zinc-800 flex flex-col md:flex-row justify-between items-center text-[10px] text-zinc-400 gap-4">
        <p>© 2026 ENADE Analytics. Todos os direitos reservados.</p>
        <div className="flex items-center gap-2">
           <span>Desenvolvido por</span>
           <span className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1">
             <div className="w-2 h-2 bg-blue-600 rounded-full" /> WoodCompany
           </span>
        </div>
        <div className="flex gap-4">
          <a href="#" className="hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors uppercase font-bold tracking-tighter">Privacidade</a>
          <a href="#" className="hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors uppercase font-bold tracking-tighter">Termos</a>
        </div>
      </div>
    </div>
  );
}

function MainStatCard({ label, value, trend, trendLabel, isPositive }: any) {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
      <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">{label}</h4>
      <p className="text-4xl font-black text-zinc-900 dark:text-zinc-100 tracking-tighter">{value}</p>
      <div className={`flex items-center gap-1.5 mt-3 text-xs font-bold ${isPositive ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'}`}>
        {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        <span>{trend}</span>
        <span className="text-zinc-400 font-medium ml-1 text-[10px]">{trendLabel}</span>
      </div>
    </div>
  );
}

function TopCourseRow({ name, score, max }: any) {
  const percentage = (score / max) * 100;
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs">
        <span className="font-bold text-zinc-700 dark:text-zinc-300">{name}</span>
        <span className="font-black text-zinc-900 dark:text-zinc-100">{score}</span>
      </div>
      <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden shadow-inner">
        <div 
          className="h-full bg-blue-600 rounded-full transition-all duration-1000" 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function AreaPerfCard({ title, count, avg }: any) {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group shadow-sm">
      <div>
        <h4 className="font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 transition-colors">{title}</h4>
        <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-tight">{count} cursos avaliados</p>
      </div>
      <div className="text-right">
        <p className="text-2xl font-black text-zinc-900 dark:text-zinc-100">{avg}</p>
        <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Média</p>
      </div>
    </div>
  );
}

function AlertItem({ course, level, title, desc, type }: any) {
  const levelColors: any = {
    Alta: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
    Média: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
    Baixa: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
  };

  return (
    <div className="space-y-2 group cursor-pointer">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          {type === 'danger' && <ShieldAlert size={16} className="text-red-500" />}
          {type === 'warning' && <AlertTriangle size={16} className="text-yellow-500" />}
          {type === 'info' && <Users size={16} className="text-blue-500" />}
          <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{course}</span>
        </div>
        <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-tighter ${levelColors[level]}`}>
          {level}
        </span>
      </div>
      <div className="pl-6 border-l-2 border-zinc-100 dark:border-zinc-800 group-hover:border-blue-500 transition-colors">
        <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{title}</p>
        <p className="text-[11px] text-zinc-500 mt-0.5">{desc}</p>
      </div>
    </div>
  );
}

function SummaryIconCard({ title, value, icon }: any) {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-xl flex items-center gap-4 shadow-sm hover:shadow-md transition-all">
      <div className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
        {icon}
      </div>
      <div>
        <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-tight">{title}</h4>
        <p className="text-2xl font-black text-zinc-900 dark:text-zinc-100 tracking-tighter">{value}</p>
      </div>
    </div>
  );
}
