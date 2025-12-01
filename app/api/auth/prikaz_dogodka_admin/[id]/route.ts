import { createClient } from "@supabase/supabase-js";
import { NextResponse, NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;  // <-- pomembno, ker params je now Promise

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    if (!id) {
      return NextResponse.json(
        { error: "ID dogodka ni podan" },
        { status: 400 }
      );
    }

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
    console.error("API ERROR:", err);
    return NextResponse.json(
      { error: "Napaka na strežniku" },
      { status: 500 }
    );
  }
}
