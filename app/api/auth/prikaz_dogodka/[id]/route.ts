import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { id } = params;

  // Pridobimo dogodek po id
  const { data, error } = await supabase
    .from("dogodki")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: error?.message || "Dogodek ni najden" },
      { status: 404 }
    );
  }

  return NextResponse.json(data);
}
