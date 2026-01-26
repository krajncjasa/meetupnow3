import { chromium } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { readFileSync } from 'fs';
import { join } from 'path';

/**
 * Global setup - se izvede pred vsemi testi
 * Tukaj lahko nastaviš globalne podatke ali okolje
 */
async function globalSetup() {
  console.log('🚀 Začenjam e2e teste za MeetupNow aplikacijo...');

  // Naloži .env datoteko
  const envPath = join(process.cwd(), '.env');
  const envContent = readFileSync(envPath, 'utf8');
  const envVars = envContent.split('\n').reduce((acc, line) => {
    const [key, value] = line.split('=');
    if (key && value) {
      acc[key.trim()] = value.trim().replace(/"/g, '');
    }
    return acc;
  }, {} as Record<string, string>);

  // Počisti bazo pred testi
  console.log('🧹 Čiščenje testne baze...');
  const supabase = createClient(
    envVars.NEXT_PUBLIC_SUPABASE_URL,
    envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  try {
    // Izbriši vse prijave na dogodke
    await supabase.from('prijave_na_dogodke').delete().neq('id', 0);
    
    // Izbriši vse dogodke
    await supabase.from('dogodki').delete().neq('id', 0);
    
    console.log('✅ Baza počiščena');
  } catch (error) {
    console.error('❌ Napaka pri čiščenju baze:', error);
  }

  console.log('✅ Global setup zaključen');
}

export default globalSetup;