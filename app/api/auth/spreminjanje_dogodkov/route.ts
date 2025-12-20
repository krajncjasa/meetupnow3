import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { user_id } = await req.json();
    if (!user_id) {
      return NextResponse.json({ error: "Manjkajo podatki: user_id." }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("dogodki")
      .select("id, naslov, kraj, cas_dogodka, slika, vrsta")
      .eq("user_id", user_id)
      .order("cas_dogodka", { ascending: false });

    if (error) throw error;

    const dogodki = (data || []).map((d) => ({
      ...d,
      id: Number(d.id),
      slikaUrl: d.slika
        ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/slike/${d.slika}`
        : null,
    }));

    return NextResponse.json({ data: dogodki });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Napaka strežnika." }, { status: 500 });
  }
}
