import React from "react";
import Sidebar from "../components/ui/Sidebar"; 
import HeaderInstituicao from "../components/ui/HeaderInstituicao";

export default function InstituicaoLayout({ children }) {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* SIDEBAR FIXA */}
      <div className="w-64 bg-white shadow-lg">
        <Sidebar />
      </div>

      {/* CONTEÚDO */}
      <div className="flex flex-col flex-1">
        <HeaderInstituicao />

        <main className="p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
