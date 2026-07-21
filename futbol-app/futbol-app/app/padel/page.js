'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function PadelHub() {
  const [partidos, setPartidos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) { setLoading(false); return; }
    async function cargar() {
      setLoading(true);
      // Cuando exista la tabla partidos con columna sport, filtrar por sport='padel'
      // const { data } = await supabase.from('partidos').select('*').eq('sport', 'padel').order('fecha', { ascending: false });
      // setPartidos(data ?? []);

      // Por ahora dejamos la lista vacía hasta que se migre la BD
      setPartidos([]);
      setLoading(false);
    }
    cargar();
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            🎾 Pádel
          </h1>
          <p className="text-sm text-gray-500 mt-1">Encuentra y únete a partidos de pádel cerca de ti.</p>
        </div>
        <Link
          href="/padel/ranking"
          className="px-4 py-2 rounded-full bg-blue-600 text-white text-sm font-bold hover:bg-blue-500 transition-colors"
        >
          Ver Ranking
        </Link>
      </div>

      {/* Próximamente / Estado vacío */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500" />
        </div>
      ) : partidos.length === 0 ? (
        <div className="text-center py-16 flex flex-col items-center gap-4">
          <span className="text-6xl">🎾</span>
          <h2 className="text-xl font-black text-gray-800">No hay partidos de pádel aún</h2>
          <p className="text-sm text-gray-500 max-w-sm">
            La sección de pádel está casi lista. Pronto podrás crear y unirte a partidos.
          </p>
          <Link
            href="/"
            className="mt-4 px-6 py-2.5 rounded-full bg-blue-600 text-white text-sm font-bold hover:bg-blue-500"
          >
            Volver al Hub
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {partidos.map((p) => (
            <div key={p.id} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
              <p className="font-bold">{p.titulo ?? 'Partido de pádel'}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
