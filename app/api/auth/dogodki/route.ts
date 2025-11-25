import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(req: Request) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Preberi user_id iz query param
    const url = new URL(req.url);
    const userId = url.searchParams.get("user_id");
    if (!userId) {
      return NextResponse.json({ error: "user_id je zahtevan" }, { status: 400 });
    }

    // Trenutni čas
    const nowLocal = new Date().toISOString().slice(0, 19).replace("T", " ");

    // Pridobi odobrene dogodke, ki še niso potekli
    const { data: dogodki, error: errDogodki } = await supabase
      .from("dogodki")
      .select("*")
      .eq("status", "odobreno")
      .gte("cas_dogodka", nowLocal)
      .order("cas_dogodka", { ascending: true });

    if (errDogodki) throw errDogodki;

    // Pridobi vse prijave tega uporabnika
    const { data: prijave, error: errPrijave } = await supabase
      .from("prijava_dogodek")
      .select("dogodek_id")
      .eq("user_id", userId);

    if (errPrijave) throw errPrijave;

    const prijavljeniIds = prijave.map((p) => p.dogodek_id);

    // Filtriraj dogodke, ki jih uporabnik še ni prijavil
    const filtriraniDogodki = dogodki.filter(d => !prijavljeniIds.includes(d.id));

    // Dodaj URL za sliko
    const dogodkiWithImages = filtriraniDogodki.map(d => ({
      ...d,
      slikaUrl: d.slika
        ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/slike/${d.slika}`
        : null,
    }));

    return NextResponse.json(dogodkiWithImages);

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Strežniška napaka." }, { status: 500 });
  }
}
