import { Link, useLocation } from "react-router-dom";

const menu = [
  { path: "/instituicao", label: "Dashboard" },
  { path: "/instituicao/pacientes", label: "Pacientes" },
  { path: "/instituicao/medicos", label: "Médicos" },
  { path: "/instituicao/equipamentos", label: "Equipamentos" },
  { path: "/instituicao/financeiro", label: "Financeiro" },
];

export default function Sidebar() {
  const { pathname } = useLocation();

  return (
    <aside className="h-full p-6 bg-white border-r flex flex-col gap-3">
      <h2 className="text-xl font-bold mb-4">CliniData</h2>

      {menu.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`p-3 rounded-lg transition ${
            pathname === item.path
              ? "bg-blue-600 text-white"
              : "hover:bg-gray-200"
          }`}
        >
          {item.label}
        </Link>
      ))}
    </aside>
  );
}
