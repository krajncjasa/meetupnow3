import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const naslov = formData.get("naslov") as string;
    const opis = formData.get("opis") as string;
    const kraj = formData.get("kraj") as string;
    const cas_dogodka = formData.get("cas_dogodka") as string;

    const file = formData.get("slika") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Slika ni bila naložena." }, { status: 400 });
    }

    // 1) USTVARIMO SUPABASE CLIENT
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY! // potreben za storage upload
    );

    // 2) SHANIMO SLIKO V STORAGE "slike"
    const ext = file.name.split(".").pop();
    const fileName = `${Date.now()}.${ext}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("slike")
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error(uploadError);
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    // 3) PRIDOBIMO JAVNI URL SLIKE
    const { data: publicUrlData } = supabase.storage
      .from("slike")
      .getPublicUrl(fileName);

    const imageUrl = publicUrlData.publicUrl;

    // 4) ZAPIŠEMO DOGODEK V BAZO
    const { data, error } = await supabase
      .from("dogodki")
      .insert([
        {
          naslov,
          opis,
          kraj,
          cas_dogodka,
          slika: fileName,
          status: "odobreno",
        },
      ])
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Napaka na strežniku." },
      { status: 500 }
    );
  }
}
