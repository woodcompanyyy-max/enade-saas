"use client";

import { User, Shield, Database, Trash2, RefreshCcw, BarChart2, Users, TrendingUp } from "lucide-react";
import { useState } from "react";
import { resetAndImportCSVAction } from "@/app/actions/debug.actions";
import Link from "next/link";

function RecalculateButton() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleRecalculate = async () => {
    try {
      setLoading(true);
      setResult(null);
      const res = await fetch('/api/admin/recalculate', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setResult(`✅ ${data.message}`);
      } else {
        setResult(`❌ Erro: ${data.error}`);
      }
    } catch {
      setResult("❌ Falha ao recalcular.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        onClick={handleRecalculate}
        disabled={loading}
        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition-all disabled:opacity-50"
      >
        {loading ? <RefreshCcw className="animate-spin w-4 h-4" /> : <BarChart2 className="w-4 h-4" />}
        {loading ? "Recalculando..." : "Recalcular KPIs"}
      </button>
      {result && <p className="text-xs text-right max-w-[200px]">{result}</p>}
    </div>
  );
}

function ResetButton() {
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!confirm("Tem certeza que deseja apagar todos os dados e reiniciar pelo CSV? Esta ação não pode ser desfeita.")) {
      return;
    }
    try {
      setLoading(true);
      const res = await resetAndImportCSVAction();
      if (res.success) {
        alert("Sistema reiniciado com sucesso!");
        window.location.reload();
      } else {
        alert("Erro: " + res.error);
      }
    } catch {
      alert("Falha crítica ao resetar dados.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleReset}
      disabled={loading}
      className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-700 transition-all disabled:opacity-50"
    >
      {loading ? <RefreshCcw className="animate-spin w-4 h-4" /> : <Database className="w-4 h-4" />}
      {loading ? "Processando..." : "Resetar e Reimportar"}
    </button>
  );
}

export default function SettingsPage() {
  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h2 className="text-xl font-bold tracking-tight">Configurações</h2>
        <p className="text-sm text-muted-foreground">Gerencie sua conta e preferências do sistema.</p>
      </div>

      <div className="bg-white border border-border rounded-xl divide-y divide-border overflow-hidden shadow-sm">
        <div className="p-6 flex items-center justify-between hover:bg-zinc-50 transition-colors">
          <div className="flex items-center gap-4">
            <User className="text-zinc-500" />
            <div>
              <p className="font-medium text-zinc-900">Perfil do Coordenador</p>
              <p className="text-xs text-muted-foreground">Nome, email e cargo na instituição.</p>
            </div>
          </div>
          <button className="text-sm font-medium text-blue-600 hover:underline">Editar</button>
        </div>

        {/* Módulo de Importação de Simulados */}
        <div className="p-6 flex items-center justify-between hover:bg-zinc-50 transition-colors">
          <div className="flex items-center gap-4">
            <Users className="text-emerald-500" />
            <div>
              <p className="font-medium text-zinc-900">Importar Simulados/Alunos</p>
              <p className="text-xs text-muted-foreground">
                Sincronize resultados de provas e crie cursos automaticamente via CSV.
              </p>
            </div>
          </div>
          <Link 
            href="/admin/import-alunos"
            className="text-sm font-bold bg-emerald-50 text-emerald-700 px-4 py-2 rounded-lg border border-emerald-100 hover:bg-emerald-100 transition-all"
          >
            Acessar Importador
          </Link>
        </div>

        {/* Módulo de Importação de Benchmarks */}
        <div className="p-6 flex items-center justify-between hover:bg-zinc-50 transition-colors">
          <div className="flex items-center gap-4">
            <TrendingUp className="text-blue-500" />
            <div>
              <p className="font-medium text-zinc-900">Benchmarks INEP</p>
              <p className="text-xs text-muted-foreground">
                Atualize as médias nacionais e estaduais para comparação.
              </p>
            </div>
          </div>
          <Link 
            href="/admin/import-benchmark"
            className="text-sm font-bold bg-blue-50 text-blue-700 px-4 py-2 rounded-lg border border-blue-100 hover:bg-blue-100 transition-all"
          >
            Acessar Benchmarks
          </Link>
        </div>

        <div className="p-6 flex items-center justify-between hover:bg-zinc-50 transition-colors">
          <div className="flex items-center gap-4">
            <BarChart2 className="text-zinc-500" />
            <div>
              <p className="font-medium text-zinc-900">Recalcular KPIs dos Cursos</p>
              <p className="text-xs text-muted-foreground">
                Atualiza Nota ENADE e Risco com base nos alunos cadastrados.
              </p>
            </div>
          </div>
          <RecalculateButton />
        </div>

        <div className="p-6 flex items-center justify-between hover:bg-zinc-50 transition-colors">
          <div className="flex items-center gap-4">
            <Trash2 className="text-red-500" />
            <div>
              <p className="font-medium text-zinc-900">Limpar e Reiniciar Dados</p>
              <p className="text-xs text-muted-foreground text-red-500">
                Atenção: Apaga tudo e reimporta do arquivo base enade-import.csv.
              </p>
            </div>
          </div>
          <ResetButton />
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button
          onClick={() => {
            localStorage.removeItem("authenticated");
            window.location.href = "/login";
          }}
          className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-100 transition-all border border-red-100"
        >
          Sair do Sistema
        </button>
      </div>
    </div>
  );
}
