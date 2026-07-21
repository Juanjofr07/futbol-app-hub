'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

const SportContext = createContext(null);

/**
 * Detecta el deporte activo a partir de la ruta.
 * /futbol/** → 'futbol'
 * /padel/**  → 'padel'
 * Resto      → mantiene el valor previo
 */
function detectSportFromPath(pathname) {
  if (pathname?.startsWith('/futbol')) return 'futbol';
  if (pathname?.startsWith('/padel')) return 'padel';
  return null;
}

export function SportProvider({ children }) {
  const pathname = usePathname();
  const [sport, setSport] = useState('futbol'); // 'futbol' | 'padel'

  // Sincroniza el deporte con la ruta activa
  useEffect(() => {
    const detected = detectSportFromPath(pathname);
    if (detected) setSport(detected);
  }, [pathname]);

  return (
    <SportContext.Provider value={{ sport, setSport }}>
      {children}
    </SportContext.Provider>
  );
}

/** Hook para leer y cambiar el deporte activo */
export function useSport() {
  const ctx = useContext(SportContext);
  if (!ctx) throw new Error('useSport debe usarse dentro de <SportProvider>');
  return ctx;
}
