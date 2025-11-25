import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const { dogodek_id, user_id } = await req.json();

    if (!dogodek_id || !user_id) {
      return NextResponse.json({ error: "Manjkajo podatki (dogodek_id ali user_id)." }, { status: 400 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { error: insertErr } = await supabase
      .from("prijava_dogodek")
      .insert({ user_id, dogodek_id });

    if (insertErr) {
      if (insertErr.code === "23505") {
        return NextResponse.json({ error: "Na ta dogodek ste že prijavljeni." }, { status: 400 });
      }
      return NextResponse.json({ error: "Napaka pri prijavi: " + insertErr.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Nepričakovana napaka." }, { status: 500 });
  }
}
