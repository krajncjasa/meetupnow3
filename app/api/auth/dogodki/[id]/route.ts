import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const dogodekId = Number(id);

  if (isNaN(dogodekId)) {
    return NextResponse.json({ error: "Neveljaven ID" }, { status: 400 });
  }

  try {
    const { data, error } = await supabase
      .from("dogodki")
      .select("*")
      .eq("id", dogodekId)
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const dogodek = {
      ...data,
      slikaUrl: data.slika
        ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/slike/${data.slika}`
        : null,
    };

    return NextResponse.json({ dogodek });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Napaka pri pridobivanju dogodka" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const dogodekId = Number(id);

  if (isNaN(dogodekId)) {
    return NextResponse.json({ error: "Neveljaven ID" }, { status: 400 });
  }

  try {
    const body = await req.json();
    const { naslov, kraj, cas_dogodka, vrsta, lat, lng } = body;

    const updateData: any = {
      naslov,
      kraj,
      cas_dogodka,
      vrsta,
    };

    // Only update coordinates if provided
    if (lat !== undefined && lng !== undefined) {
      updateData.lat = lat;
      updateData.lng = lng;
    }

    const { data, error } = await supabase
      .from("dogodki")
      .update(updateData)
      .eq("id", dogodekId)
      .select();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Dogodek posodobljen", data });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Napaka pri posodabljanju dogodka" }, { status: 500 });
  }
}

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
