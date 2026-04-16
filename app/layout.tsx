import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import { 
  LayoutDashboard, 
  BarChart3, 
  BookOpen, 
  BrainCircuit, 
  FileText, 
  Settings,
  X
} from "lucide-react";

export const metadata: Metadata = {
  title: "ENADE SaaS - Desempenho Acadêmico",
  description: "Análise inteligente de desempenho ENADE e simulados",
};

import { AuthGuard } from "@/components/auth-guard";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased bg-[#fafafa]">
        <AuthGuard>
          <div className="flex h-screen overflow-hidden">
          {/* Sidebar */}
          <aside className="w-64 border-r border-border dark:border-zinc-800 bg-white dark:bg-black flex flex-col">
            <div className="p-6">
              <h1 className="text-xl font-bold tracking-tight dark:text-white">ENADE<span className="text-blue-600">SaaS</span></h1>
            </div>
            
            <nav className="flex-1 px-4 py-2 space-y-1">
              <Link href="/" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md bg-muted dark:bg-zinc-800 text-primary dark:text-white">
                <LayoutDashboard size={18} />
                Dashboard
              </Link>
              <Link href="/cursos" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-muted-foreground hover:bg-muted dark:hover:bg-zinc-800 hover:text-primary dark:hover:text-white transition-colors">
                <BookOpen size={18} />
                Cursos
              </Link>
              <Link href="/analises" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-muted-foreground hover:bg-muted dark:hover:bg-zinc-800 hover:text-primary dark:hover:text-white transition-colors">
                <BarChart3 size={18} />
                Análises
              </Link>
              <Link href="/simulados" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-muted-foreground hover:bg-muted dark:hover:bg-zinc-800 hover:text-primary dark:hover:text-white transition-colors">
                <BookOpen size={18} />
                Simulados
              </Link>
              <Link href="/diagnostico" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-muted-foreground hover:bg-muted dark:hover:bg-zinc-800 hover:text-primary dark:hover:text-white transition-colors">
                <BrainCircuit size={18} />
                Diagnóstico IA
              </Link>
              <Link href="/relatorios" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-muted-foreground hover:bg-muted dark:hover:bg-zinc-800 hover:text-primary dark:hover:text-white transition-colors">
                <FileText size={18} />
                Relatórios
              </Link>
            </nav>

            <div className="p-4 border-t border-border dark:border-zinc-800">
              <Link href="/configuracoes" className="flex items-center gap-3 px-3 py-2 w-full text-sm font-medium rounded-md text-muted-foreground hover:bg-muted dark:hover:bg-zinc-800 hover:text-primary dark:hover:text-white transition-colors">
                <Settings size={18} />
                Configurações
              </Link>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto p-8 relative dark:bg-[#09090b]">
            <header className="mb-8 flex justify-between items-center">
              <div>
                <h2 className="text-sm font-medium text-muted-foreground">Bem-vindo ao EnadeSaaS</h2>
                <h1 className="text-2xl font-semibold">Análise de Desempenho</h1>
              </div>
              <div className="flex gap-4">
              </div>
            </header>
            {children}
          </main>
        </div>
        </AuthGuard>
      </body>
    </html>
  );
}
