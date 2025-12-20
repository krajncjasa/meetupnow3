import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params; // ✅ await, ker params je Promise
  const dogodekId = Number(id);

  if (isNaN(dogodekId)) {
    return NextResponse.json({ error: "Neveljaven ID" }, { status: 400 });
  }

  try {
    const { data, error } = await supabase
      .from("dogodki")
      .delete()
      .eq("id", dogodekId);

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Dogodek izbrisan", data });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Napaka pri brisanju dogodka" }, { status: 500 });
  }
}
