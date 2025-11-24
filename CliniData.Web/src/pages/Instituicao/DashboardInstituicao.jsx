export default function DashboardInstituicao() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white shadow rounded-xl p-6">
        <h3 className="text-lg font-semibold">Atendimentos (mês)</h3>
        <p className="text-3xl font-bold mt-2">234</p>
      </div>

      <div className="bg-white shadow rounded-xl p-6">
        <h3 className="text-lg font-semibold">Médicos vinculados</h3>
        <p className="text-3xl font-bold mt-2">18</p>
      </div>

      <div className="bg-white shadow rounded-xl p-6">
        <h3 className="text-lg font-semibold">Gastos (equipamentos)</h3>
        <p className="text-3xl font-bold mt-2">R$ 4.320,00</p>
      </div>

      <div className="bg-white shadow rounded-xl p-6 md:col-span-3">
        <h3 className="text-xl font-semibold">Resumo Geral</h3>
        <p className="text-gray-600 mt-2">
          Gráficos e relatórios podem ser exibidos aqui futuramente.
        </p>
      </div>
    </div>
  );
}


