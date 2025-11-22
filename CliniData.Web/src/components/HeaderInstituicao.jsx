export default function HeaderInstituicao() {
  return (
    <header className="h-16 bg-white shadow flex items-center justify-between px-6">
      <h1 className="text-xl font-semibold">Painel da Instituição</h1>

      <button
        onClick={() => {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }}
        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
      >
        Sair
      </button>
    </header>
  );
}
 

 //ss