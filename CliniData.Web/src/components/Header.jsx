export default function Header() {
  return (
    <header className="h-16 bg-white shadow flex items-center justify-between px-6">
      <h2 className="text-lg font-semibold">Painel da Instituição</h2>

      <button
        className="bg-red-600 text-white px-4 py-2 rounded-lg"
        onClick={() => {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }}
      >
        Sair
      </button>
    </header>
  );
}
