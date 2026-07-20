import PartidoCard from "../components/PartidoCard";
import { supabase } from "../lib/supabaseClient";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  let partidos = [];
  let perfil = null;

  if (supabase) {
    // Partidos
    const { data: partidosData } = await supabase
      .from("partidos")
      .select("*, inscripciones(count)")
      .order("fecha", { ascending: true });

    partidos = partidosData || [];

    // Perfil actual (para créditos y es_admin)
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: perfilData } = await supabase
        .from("perfiles")
        .select("id, nombre, creditos, es_admin")
        .eq("id", user.id)
        .single();

      perfil = perfilData || null;
    }
  }

  const proximos = partidos.filter((p) => p.estado !== "finalizado");
  const jugados = partidos
    .filter((p) => p.estado === "finalizado")
    .sort((a, b) => {
      const fechaA = new Date(`${a.fecha || ""}T${a.hora || "00:00:00"}`).getTime();
      const fechaB = new Date(`${b.fecha || ""}T${b.hora || "00:00:00"}`).getTime();
      return fechaB - fechaA;
    })
    .slice(0, 4);

  const esAdmin = Boolean(perfil?.es_admin);

  return (
    <div className="flex flex-col gap-12 max-w-6xl mx-auto pb-12">
      {/* --- BARRA SUPERIOR CON ADMIN --- */}
      <div className="flex items-center justify-between mt-4 mb-6 px-2">
        {/* Izquierda: logo + nav */}
        <div className="flex items-center gap-3">
          <span className="font-black text-sm tracking-[0.25em] text-gray-900">
            GOL BQTO
          </span>
          <nav className="flex items-center gap-2 text-xs">
            <Link
              href="/"
              className="px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 font-semibold"
            >
              Partidos
            </Link>
            <Link
              href="/jugadores"
              className="px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 font-semibold"
            >
              Jugadores
            </Link>
            <Link
              href="/creditos"
              className="px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 font-semibold"
            >
              Créditos
            </Link>
          </nav>
        </div>

        {/* Derecha: créditos + admin + perfil + salir */}
        <div className="flex items-center gap-2">
          {/* Créditos */}
          <div className="px-3 py-1.5 rounded-full bg-yellow-50 border border-yellow-200 text-xs font-semibold text-yellow-800">
            {perfil?.creditos ?? 0} créditos
          </div>

          {/* Botón Admin solo si es admin.
              OJO: este ejemplo es server component; para el desplegable real
              lo ideal es mover la barra a un componente client con useState. */}
          {esAdmin && (
            <Link
              href="/admin"
              className="px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-700"
            >
              Admin
            </Link>
          )}

          {/* Perfil */}
          <Link
            href="/perfil"
            className="px-3 py-1.5 rounded-full bg-green-500 text-white text-xs font-semibold"
          >
            Perfil
          </Link>

          {/* Salir (luego conectas con logout) */}
          <span className="text-xs text-gray-600 px-2 py-1 rounded-full">
            Salir
          </span>
        </div>
      </div>

      {/* --- HERO SECTION (igual que tienes) --- */}
      {/* ... TODO tu contenido actual de hero, cómo funciona, próximos partidos, resultados ... */}
    </div>
  );
}
