'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';
import FutbolPlayerCard from '../../components/FutbolPlayerCard';
import PadelPlayerCard from '../../components/PadelPlayerCard';

// ─────────────────────────────────────────
// Pestaña activa: 'futbol' | 'padel'
// ─────────────────────────────────────────

export default function PerfilPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('futbol');

  // Datos de usuario base
  const [usuario, setUsuario] = useState(null);
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);

  // Perfil de fútbol
  const [futbolProfile, setFutbolProfile] = useState(null);

  // Perfil de pádel
  const [padelProfile, setPadelProfile] = useState(null);

  useEffect(() => {
    if (!supabase) return;

    async function cargar() {
      setLoading(true);
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) { router.push('/login'); return; }
        setUsuario(user);

        // Perfil base
        const { data: perfilData } = await supabase
          .from('perfiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();
        setPerfil(perfilData);

        // Perfil fútbol
        const { data: futData } = await supabase
          .from('futbol_profiles')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();
        setFutbolProfile(futData);

        // Perfil pádel
        const { data: padData } = await supabase
          .from('padel_profiles')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();
        setPadelProfile(padData);
      } finally {
        setLoading(false);
      }
    }

    cargar();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-500" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">

      {/* Header del perfil */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center text-white text-2xl font-black overflow-hidden shadow">
          {perfil?.avatar_url
            ? <img src={perfil.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
            : <span>{usuario?.email?.[0]?.toUpperCase() ?? 'U'}</span>
          }
        </div>
        <div>
          <h1 className="text-2xl font-black text-gray-900">{perfil?.nombre ?? usuario?.email}</h1>
          <p className="text-sm text-gray-500">{usuario?.email}</p>
        </div>
      </div>

      {/* Tabs Fútbol / Pádel */}
      <div className="flex gap-2 mb-8 bg-gray-100 p-1 rounded-full w-fit border border-gray-200">
        <button
          onClick={() => setActiveTab('futbol')}
          className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
            activeTab === 'futbol'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          ⚽ Fútbol
        </button>
        <button
          onClick={() => setActiveTab('padel')}
          className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
            activeTab === 'padel'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          🎾 Pádel
        </button>
      </div>

      {/* Contenido por tab */}
      {activeTab === 'futbol' && (
        <div className="flex flex-col items-center gap-6">
          {futbolProfile ? (
            <>
              <FutbolPlayerCard
                nombre={perfil?.nombre ?? usuario?.email}
                posicion={futbolProfile.posicion}
                media={futbolProfile.media}
                stats={{
                  ritmo: futbolProfile.ritmo,
                  tiro: futbolProfile.tiro,
                  pase: futbolProfile.pase,
                  regate: futbolProfile.regate,
                  defensa: futbolProfile.defensa,
                  fisico: futbolProfile.fisico,
                }}
                nacionalidad={perfil?.nacionalidad}
                avatar={perfil?.avatar_url}
                size="lg"
              />
              <div className="grid grid-cols-3 gap-4 w-full mt-4 text-center">
                <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                  <p className="text-2xl font-black text-gray-900">{futbolProfile.goles ?? 0}</p>
                  <p className="text-xs text-gray-500 font-semibold mt-1">Goles</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                  <p className="text-2xl font-black text-gray-900">{futbolProfile.asistencias ?? 0}</p>
                  <p className="text-xs text-gray-500 font-semibold mt-1">Asistencias</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                  <p className="text-2xl font-black text-gray-900">{futbolProfile.tarjetas_amarillas ?? 0}</p>
                  <p className="text-xs text-gray-500 font-semibold mt-1">Tarjetas</p>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-16 flex flex-col items-center gap-4">
              <span className="text-5xl">⚽</span>
              <h3 className="text-lg font-bold text-gray-800">Aún no tienes perfil de fútbol</h3>
              <p className="text-sm text-gray-500 max-w-xs">Juega tu primer partido para que tu carta de jugador se cree automáticamente.</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'padel' && (
        <div className="flex flex-col items-center gap-6">
          {padelProfile ? (
            <>
              <PadelPlayerCard
                nombre={perfil?.nombre ?? usuario?.email}
                nivel={padelProfile.nivel}
                lado={padelProfile.lado}
                victorias={padelProfile.victorias}
                derrotas={padelProfile.derrotas}
                puntos={padelProfile.puntos}
                nacionalidad={perfil?.nacionalidad}
                avatar={perfil?.avatar_url}
                size="lg"
              />
              <div className="grid grid-cols-3 gap-4 w-full mt-4 text-center">
                <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                  <p className="text-2xl font-black text-gray-900">{padelProfile.victorias ?? 0}</p>
                  <p className="text-xs text-gray-500 font-semibold mt-1">Victorias</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                  <p className="text-2xl font-black text-gray-900">{padelProfile.derrotas ?? 0}</p>
                  <p className="text-xs text-gray-500 font-semibold mt-1">Derrotas</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                  <p className="text-2xl font-black text-gray-900">{padelProfile.puntos ?? 1000}</p>
                  <p className="text-xs text-gray-500 font-semibold mt-1">Puntos ELO</p>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-16 flex flex-col items-center gap-4">
              <span className="text-5xl">🎾</span>
              <h3 className="text-lg font-bold text-gray-800">Aún no tienes perfil de pádel</h3>
              <p className="text-sm text-gray-500 max-w-xs">Juega tu primer partido de pádel para que tu carta se genere.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
