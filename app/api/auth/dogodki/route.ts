import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(req: Request) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const url = new URL(req.url);

    // Obvezno
    const userId = url.searchParams.get("user_id");
    if (!userId) {
      return NextResponse.json({ error: "user_id je zahtevan" }, { status: 400 });
    }

    // Opcijsko: filtriranje po vrsti
    // primer: vrsta=šport ali vrsta=šport,kultura
    const vrstaQuery = url.searchParams.get("vrsta");

    // Trenutni čas za skrivanje preteklih dogodkov
    const nowLocal = new Date().toISOString().slice(0, 19).replace("T", " ");

    // ⚡ PRIDOBI DOGODKE
    let baseQuery = supabase
      .from("dogodki")
      .select("*")
      .eq("status", "odobreno")
      .gte("cas_dogodka", nowLocal)
      .order("cas_dogodka", { ascending: true });

    // Če filtriramo po vrsti → naredimo LIKE filter
    if (vrstaQuery) {
      const vrste = vrstaQuery.split(","); // ["šport", "kultura"]

      // Supabase ne podpira OR z IN, zato naredimo OR chain:
      const orString = vrste
        .map((v) => `vrsta.ilike.%${v}%`)
        .join(",");

      baseQuery = baseQuery.or(orString);
    }

    const { data: dogodki, error: errDogodki } = await baseQuery;

    if (errDogodki) throw errDogodki;

    // Prijave uporabnika
    const { data: prijave, error: errPrijave } = await supabase
      .from("prijava_dogodek")
      .select("dogodek_id")
      .eq("user_id", userId);

    if (errPrijave) throw errPrijave;

    const prijavljeniIds = prijave.map((p) => p.dogodek_id);

    // Skrij dogodke, na katere je uporabnik že prijavljen
    const filtriraniDogodki = dogodki.filter(
      (d) => !prijavljeniIds.includes(d.id)
    );

    // Dodaj public URL za sliko
    const dogodkiWithImages = filtriraniDogodki.map((d) => ({
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
