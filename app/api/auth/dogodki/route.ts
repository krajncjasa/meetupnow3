import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Trenutni čas v formatu timestamp (brez timezone)
    const nowLocal = new Date().toISOString().slice(0, 19).replace("T", " ");

    // Pridobi odobrene dogodke, ki še niso potekli
    const { data: dogodki, error } = await supabase
      .from("dogodki")
      .select("*")
      .eq("status", "odobreno")
      .gte("cas_dogodka", nowLocal)
      .order("cas_dogodka", { ascending: true });

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Dodaj URL-je slik iz javnega bucket-a
    const dogodkiWithImages = dogodki.map((dogodek) => ({
      ...dogodek,
      slikaUrl: dogodek.slika
        ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/slike/${dogodek.slika}`
        : null,
    }));

    return NextResponse.json(dogodkiWithImages);
  } catch (err) {
    console.error("Server error:", err);
    return NextResponse.json({ error: "Strežniška napaka." }, { status: 500 });
  }
}
