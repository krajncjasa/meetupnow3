-- ============================================================================
-- DDL Skript za MeetupNow3 aplikacijo
-- Baza: PostgreSQL (Supabase)
-- ============================================================================

-- 1. USERS Tabela - Registrirani uporabniki
-- ============================================================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    vrsta VARCHAR(50) DEFAULT 'false',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_admin BOOLEAN DEFAULT FALSE
);

-- Index na email za hitreje iskanje
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- ============================================================================
-- 2. EVENTI (DOGODKI) Tabela - Objavljeni eventi
-- ============================================================================
CREATE TABLE IF NOT EXISTS eventi (
    id SERIAL PRIMARY KEY,
    naslov VARCHAR(255) NOT NULL,
    opis TEXT NOT NULL,
    kraj VARCHAR(255) NOT NULL,
    cas_dogodka TIMESTAMP WITH TIME ZONE NOT NULL,
    vrsta VARCHAR(255),
    slika VARCHAR(255),
    status VARCHAR(50) NOT NULL DEFAULT 'cakanje na odobritev'
        CHECK (status IN ('cakanje na odobritev', 'odobreno', 'zavrnjeno')),
    lat DECIMAL(10, 8) NOT NULL,
    lng DECIMAL(11, 8) NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indeksi za hitrejše iskanje
CREATE INDEX IF NOT EXISTS idx_eventi_user_id ON eventi(user_id);
CREATE INDEX IF NOT EXISTS idx_eventi_status ON eventi(status);
CREATE INDEX IF NOT EXISTS idx_eventi_cas_dogodka ON eventi(cas_dogodka);

-- ============================================================================
-- 3. PRIJAVA_DOGODEK Tabela - Prijave na dogodke (Many-to-Many)
-- ============================================================================
CREATE TABLE IF NOT EXISTS prijava_dogodek (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    dogodek_id INTEGER NOT NULL REFERENCES eventi(id) ON DELETE CASCADE,
    prijavljeni_na TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, dogodek_id)
);

-- Indeksi za hitreje iskanje
CREATE INDEX IF NOT EXISTS idx_prijava_user_id ON prijava_dogodek(user_id);
CREATE INDEX IF NOT EXISTS idx_prijava_dogodek_id ON prijava_dogodek(dogodek_id);

-- ============================================================================
-- Dodatne nastavitve
-- ============================================================================

-- Enable Row Level Security (RLS) - Supabase
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE eventi ENABLE ROW LEVEL SECURITY;
ALTER TABLE prijava_dogodek ENABLE ROW LEVEL SECURITY;

-- Policije za RLS
-- Uporabniki lahko vidijo samo svoje podatke
CREATE POLICY "Users can view own data" ON users
    FOR SELECT USING (auth.uid() = id);

-- Uporabniki lahko urejajo samo svoje podatke
CREATE POLICY "Users can update own data" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Vsi lahko vidijo odobrene dogodke
CREATE POLICY "Anyone can view approved events" ON eventi
    FOR SELECT USING (status = 'odobreno');

-- Admin in lastnik lahko vidijo lastne neodobrene dogodke
CREATE POLICY "Creators can view own events" ON eventi
    FOR SELECT USING (auth.uid() = user_id);

-- Samo avtenticiran uporabnik lahko vidi svoje prijave
CREATE POLICY "Users can view own registrations" ON prijava_dogodek
    FOR SELECT USING (auth.uid() = user_id);

-- Samo avtenticiran uporabnik lahko se prijavi na dogodek
CREATE POLICY "Users can register for events" ON prijava_dogodek
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- Seed podatki (opciono - za testiranje)
-- ============================================================================

-- INSERT INTO users (id, name, email, password, created_at) VALUES
-- ('11111111-1111-1111-1111-111111111111', 'Test User', 'test@example.com', '$2b$10$...', NOW());

-- INSERT INTO eventi (naslov, opis, kraj, cas_dogodka, vrsta, status, lat, lng, user_id) VALUES
-- ('Testni Dogodek', 'Opis testnega dogodka', 'Ljubljana', NOW() + INTERVAL '7 days', 'šport', 'odobreno', 46.0569, 14.5058, '11111111-1111-1111-1111-111111111111');

-- ============================================================================
-- END OF DDL SCRIPT
-- ============================================================================
