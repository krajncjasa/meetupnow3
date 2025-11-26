import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Supabase client s service role key
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { user_id } = await req.json();

    if (!user_id) {
      return NextResponse.json(
        { error: "Manjkajo podatki: user_id." },
        { status: 400 }
      );
    }

    // Pridobi vse prijave uporabnika skupaj z informacijami o dogodku
    const { data, error } = await supabase
      .from("prijava_dogodek")
      .select(`
        dogodek_id,
        dogodki(id, naslov, kraj, cas_dogodka, slika)
      `)
      .eq("user_id", user_id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Nepričakovana napaka." }, { status: 500 });
  }
}
