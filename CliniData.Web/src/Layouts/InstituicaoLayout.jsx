import React from "react";
import HeaderInstituicao from "../components/HeaderInstituicao";

export default function InstituicaoLayout({ children }) {
  return (
    <div className="layout-container">
      <HeaderInstituicao />

      <main className="layout-main" style={{ padding: 24 }}>
        {children}
      </main>
    </div>
  );
}
