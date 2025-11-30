import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function PATCH(req: Request, context: any) {
  const params = await context.params; // ← pomembno!
  const { id } = params;

  const { status } = await req.json();

  if (!["odobreno", "zavrnjeno"].includes(status)) {
    return NextResponse.json(
      { error: "Neveljaven status." },
      { status: 400 }
    );
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { error } = await supabase
    .from("dogodki")
    .update({ status })
    .eq("id", id);

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ message: "Status posodobljen." });
}
