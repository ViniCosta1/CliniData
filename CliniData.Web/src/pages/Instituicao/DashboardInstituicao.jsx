import React from 'react';
import InstituicaoLayout from '../../layouts/InstituicaoLayout';


export default function DashboardInstituicao(){
return (
<InstituicaoLayout>
<div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:20}}>
<div className="card">
<h3 className="h1">Atendimentos (mês)</h3>
<p className="p-muted">234</p>
</div>
<div className="card">
<h3 className="h1">Médicos vinculados</h3>
<p className="p-muted">18</p>
</div>
<div className="card">
<h3 className="h1">Gastos (equipamentos)</h3>
<p className="p-muted">R$ 4.320,00</p>
</div>
</div>


<div style={{marginTop:20}} className="card">
<h3 className="h1">Resumo</h3>
<p className="p-muted">Relatório rápido e indicadores principais.</p>
</div>
</InstituicaoLayout>
);
}