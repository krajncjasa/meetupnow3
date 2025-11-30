import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabase
    .from("dogodki")
    .select("*")
    .eq("status", "cakanje na odobritev");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const dogodki = data.map((dog) => ({
    ...dog,
    slikaUrl: dog.slika
      ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/slike/${dog.slika}`
      : null,
  }));

  return NextResponse.json(dogodki);
}
