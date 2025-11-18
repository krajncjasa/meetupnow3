import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// GET request za pridobivanje vseh odobrenih dogodkov
export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Pridobi vse dogodke, kjer je status = "odobreno"
    const { data: dogodki, error } = await supabase
      .from("dogodki")
      .select("*")
      .eq("status", "odobreno")
      .order("cas_dogodka", { ascending: true });

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(dogodki);

  } catch (err) {
    console.error("Server error:", err);
    return NextResponse.json({ error: "Strežniška napaka." }, { status: 500 });
  }
}
