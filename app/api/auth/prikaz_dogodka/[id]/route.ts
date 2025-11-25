// app/api/auth/prikaz_dogodka/[id]/route.ts
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Pridobi id iz URL-ja
    const url = new URL(req.url);
    const segments = url.pathname.split("/"); // npr. ["", "api", "auth", "prikaz_dogodka", "16"]
    const id = segments[segments.length - 1];

    if (!id) {
      return NextResponse.json({ error: "ID dogodka ni podan" }, { status: 400 });
    }

    // Fetch iz Supabase
    const { data, error } = await supabase
      .from("dogodki")
      .select("*")
      .eq("id", parseInt(id))
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: error?.message || "Dogodek ni najden" },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Napaka na strežniku" }, { status: 500 });
  }
}
