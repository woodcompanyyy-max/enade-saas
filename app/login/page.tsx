"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BrainCircuit, Lock, User, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulação de login
    setTimeout(() => {
      localStorage.setItem("authenticated", "true");
      router.push("/");
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-4">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/5 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white border border-border rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8 pb-4">
            <div className="flex items-center gap-2 mb-8">
              <div className="bg-blue-600 p-2 rounded-lg text-white">
                <BrainCircuit size={24} />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-zinc-900">ENADE<span className="text-blue-600">SaaS</span></h1>
            </div>
            
            <div className="space-y-2 mb-8">
              <h2 className="text-xl font-semibold text-zinc-900">Bem-vindo de volta</h2>
              <p className="text-sm text-muted-foreground">Entre com suas credenciais para acessar o painel.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700 ml-1">Email Institucional</label>
                <div className="relative group">
                  <User className="absolute left-3 top-3 text-zinc-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nome@instituicao.edu.br"
                    className="w-full bg-zinc-50 border border-border rounded-xl py-2.5 pl-10 pr-4 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700 ml-1">Senha</label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-3 text-zinc-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                  <input 
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-zinc-50 border border-border rounded-xl py-2.5 pl-10 pr-4 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between py-2">
                <label className="flex items-center gap-2 text-xs text-zinc-600 cursor-pointer">
                  <input type="checkbox" className="rounded border-zinc-300 text-blue-600 focus:ring-blue-500" />
                  Lembrar de mim
                </label>
                <a href="#" className="text-xs text-blue-600 hover:underline font-medium">Esqueceu a senha?</a>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-zinc-900 text-white rounded-xl py-3 font-semibold hover:bg-zinc-800 transition-all flex items-center justify-center gap-2 group disabled:opacity-70 shadow-lg shadow-zinc-200"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Acessar Painel
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              <button 
                type="button"
                onClick={() => {
                  localStorage.setItem("authenticated", "true");
                  router.push("/");
                }}
                className="w-full bg-white text-zinc-600 border border-border rounded-xl py-3 font-medium hover:bg-zinc-50 transition-all flex items-center justify-center gap-2"
              >
                Acesso Rápido (Demo)
              </button>
            </form>
          </div>
          
          <div className="p-6 bg-zinc-50 border-t border-border flex justify-center">
            <p className="text-xs text-muted-foreground">
              Não tem uma conta? <a href="#" className="text-blue-600 font-semibold hover:underline">Solicite acesso</a>
            </p>
          </div>
        </div>
        
        <p className="text-center mt-8 text-xs text-zinc-400 uppercase tracking-widest font-bold">
          Plataforma de inteligência acadêmica
        </p>
      </div>
    </div>
  );
}
