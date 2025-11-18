import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) return NextResponse.json({ error: "Manjkajo podatki." }, { status: 400 });

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Najdi uporabnika
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !user) return NextResponse.json({ error: "Uporabnik ne obstaja." }, { status: 400 });

    // Preveri geslo
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return NextResponse.json({ error: "Napačno geslo." }, { status: 400 });

    // Uspešna prijava
    return NextResponse.json({ message: "Prijava uspešna!", user: { id: user.id, name: user.name, email: user.email } });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Strežniška napaka." }, { status: 500 });
  }
}
