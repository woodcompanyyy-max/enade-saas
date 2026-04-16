"use client";

import { FileText, Download, Eye, Calendar, User, BarChart2 } from "lucide-react";

const reports = [
  { id: 1, name: "Relatório Consolidado - Administração 2023", date: "25/03/2024", type: "ENADE Oficial", size: "1.2 MB" },
  { id: 2, name: "Análise de Gap - Simulado Abril", date: "20/03/2024", type: "Simulado", size: "850 KB" },
  { id: 3, name: "Desempenho por Competência - Ciclo III", date: "15/03/2024", type: "Interno", size: "2.1 MB" },
];

export default function ReportsPage() {
  const handleExportPDF = () => {
    window.print();
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Centro de Relatórios</h2>
          <p className="text-sm text-muted-foreground">Gerencie e exporte documentos detalhados de desempenho.</p>
        </div>
        <button 
          onClick={handleExportPDF}
          className="bg-black dark:bg-zinc-100 text-white dark:text-zinc-900 px-4 py-2 rounded-lg text-sm font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all flex items-center gap-2"
        >
          Exportar Tudo (PDF)
          <Download size={16} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-zinc-900 border border-border dark:border-zinc-800 rounded-xl p-6 space-y-4 shadow-sm">
          <div className="bg-blue-50 dark:bg-blue-900/20 w-10 h-10 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400">
            <FileText size={20} />
          </div>
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Relatórios Gerados</h3>
          <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">12</p>
          <p className="text-xs text-muted-foreground">+2 este mês</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 border border-border dark:border-zinc-800 rounded-xl p-6 space-y-4 shadow-sm">
          <div className="bg-green-50 dark:bg-green-900/20 w-10 h-10 rounded-lg flex items-center justify-center text-green-600 dark:text-green-400">
            <Download size={20} />
          </div>
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Downloads Realizados</h3>
          <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">48</p>
          <p className="text-xs text-muted-foreground">+12% vs mês passado</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 border border-border dark:border-zinc-800 rounded-xl p-6 space-y-4 shadow-sm">
          <div className="bg-purple-50 dark:bg-purple-900/20 w-10 h-10 rounded-lg flex items-center justify-center text-purple-600 dark:text-purple-400">
            <BarChart2 size={20} />
          </div>
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Média de Páginas</h3>
          <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">8.4</p>
          <p className="text-xs text-muted-foreground">Relatórios detalhados</p>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-border dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-border dark:border-zinc-800 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-800/50">
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Arquivos Recentes</h3>
          <div className="flex gap-2">
            <input type="text" placeholder="Buscar relatório..." className="text-sm bg-white dark:bg-zinc-800 border border-border dark:border-zinc-700 rounded-md px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-zinc-400 w-64 text-zinc-900 dark:text-zinc-100" />
          </div>
        </div>
        <div className="divide-y divide-border">
          {reports.map((report) => (
            <div key={report.id} className="p-6 flex items-center justify-between hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="bg-zinc-100 dark:bg-zinc-800 p-3 rounded-lg text-zinc-500">
                  <FileText size={24} />
                </div>
                <div>
                  <h4 className="font-medium text-zinc-900 dark:text-zinc-100">{report.name}</h4>
                  <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Calendar size={12} /> {report.date}</span>
                    <span className="flex items-center gap-1"><User size={12} /> {report.type}</span>
                    <span>{report.size}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 border border-border dark:border-zinc-700 rounded-md hover:bg-white dark:hover:bg-zinc-800 transition-all">
                  <Eye size={18} />
                </button>
                <button 
                  onClick={handleExportPDF}
                  className="p-2 text-blue-600 hover:text-blue-700 border border-border dark:border-zinc-700 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
                >
                  <Download size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-zinc-900 rounded-xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <h3 className="text-xl font-bold">Precisa de um relatório personalizado?</h3>
          <p className="text-zinc-400 text-sm">Use nosso construtor de diagnósticos IA para focar em indicadores específicos.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition-all whitespace-nowrap shadow-lg shadow-blue-900/20">
          Configurar Relatório
        </button>
      </div>
    </div>
  );
}
