"use client";

import { Settings, User, Bell, Shield, Database } from "lucide-react";

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
        
        <div className="p-6 flex items-center justify-between hover:bg-zinc-50 transition-colors">
          <div className="flex items-center gap-4">
            <Database className="text-zinc-500" />
            <div>
              <p className="font-medium text-zinc-900">Dados da Instituição</p>
              <p className="text-xs text-muted-foreground">CNPJ, Nome e Cursos vinculados.</p>
            </div>
          </div>
          <button className="text-sm font-medium text-blue-600 hover:underline">Gerenciar</button>
        </div>

        <div className="p-6 flex items-center justify-between hover:bg-zinc-50 transition-colors">
          <div className="flex items-center gap-4">
            <Shield className="text-zinc-500" />
            <div>
              <p className="font-medium text-zinc-900">Segurança e Tokens</p>
              <p className="text-xs text-muted-foreground">Chaves de API para integração com IA.</p>
            </div>
          </div>
          <button className="text-sm font-medium text-blue-600 hover:underline">Configurar</button>
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
