-- ============================================================
-- Migration 001: Sports Hub — Multi-deporte
-- Ejecutar en Supabase SQL Editor
-- ============================================================

-- ──────────────────────────────────────────
-- 1. Perfil de fútbol (uno por usuario)
-- ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS futbol_profiles (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID NOT NULL REFERENCES perfiles(id) ON DELETE CASCADE,
  posicion            TEXT NOT NULL DEFAULT 'MED',   -- POR, DEF, MED, DEL
  media               INTEGER NOT NULL DEFAULT 60,
  goles               INTEGER NOT NULL DEFAULT 0,
  asistencias         INTEGER NOT NULL DEFAULT 0,
  tarjetas_amarillas  INTEGER NOT NULL DEFAULT 0,
  tarjetas_rojas      INTEGER NOT NULL DEFAULT 0,
  ritmo               INTEGER NOT NULL DEFAULT 60,
  tiro                INTEGER NOT NULL DEFAULT 60,
  pase                INTEGER NOT NULL DEFAULT 60,
  regate              INTEGER NOT NULL DEFAULT 60,
  defensa             INTEGER NOT NULL DEFAULT 60,
  fisico              INTEGER NOT NULL DEFAULT 60,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id)
);

-- Trigger: actualiza updated_at automáticamente
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$;

DROP TRIGGER IF EXISTS futbol_profiles_updated_at ON futbol_profiles;
CREATE TRIGGER futbol_profiles_updated_at
  BEFORE UPDATE ON futbol_profiles
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- RLS
ALTER TABLE futbol_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lectura pública de perfiles de fútbol"
  ON futbol_profiles FOR SELECT USING (true);

CREATE POLICY "Usuario puede insertar su perfil de fútbol"
  ON futbol_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuario puede actualizar su perfil de fútbol"
  ON futbol_profiles FOR UPDATE
  USING (auth.uid() = user_id);


-- ──────────────────────────────────────────
-- 2. Perfil de pádel (uno por usuario)
-- ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS padel_profiles (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES perfiles(id) ON DELETE CASCADE,
  nivel       NUMERIC(2,1) NOT NULL DEFAULT 1.0,   -- 1.0 – 7.0
  lado        TEXT NOT NULL DEFAULT 'derecha',      -- 'derecha' | 'izquierda'
  victorias   INTEGER NOT NULL DEFAULT 0,
  derrotas    INTEGER NOT NULL DEFAULT 0,
  puntos      INTEGER NOT NULL DEFAULT 1000,        -- ELO inicial
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id)
);

DROP TRIGGER IF EXISTS padel_profiles_updated_at ON padel_profiles;
CREATE TRIGGER padel_profiles_updated_at
  BEFORE UPDATE ON padel_profiles
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- RLS
ALTER TABLE padel_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lectura pública de perfiles de pádel"
  ON padel_profiles FOR SELECT USING (true);

CREATE POLICY "Usuario puede insertar su perfil de pádel"
  ON padel_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuario puede actualizar su perfil de pádel"
  ON padel_profiles FOR UPDATE
  USING (auth.uid() = user_id);


-- ──────────────────────────────────────────
-- 3. Añadir columna sport a partidos
--    (si la tabla se llama diferente, cambia el nombre)
-- ──────────────────────────────────────────
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'partidos' AND column_name = 'sport'
  ) THEN
    ALTER TABLE partidos ADD COLUMN sport TEXT NOT NULL DEFAULT 'futbol';
    COMMENT ON COLUMN partidos.sport IS 'Deporte del partido: futbol | padel';
  END IF;
END;
$$;

-- Índice para filtrar por deporte eficientemente
CREATE INDEX IF NOT EXISTS partidos_sport_idx ON partidos(sport);


-- ──────────────────────────────────────────
-- 4. Añadir columna sport a match_stats
--    (si existe la tabla)
-- ──────────────────────────────────────────
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'match_stats')
  AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'match_stats' AND column_name = 'sport')
  THEN
    ALTER TABLE match_stats ADD COLUMN sport TEXT NOT NULL DEFAULT 'futbol';
  END IF;
END;
$$;
