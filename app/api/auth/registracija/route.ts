import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    // 1️⃣ Pridobi podatke iz requesta
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Manjkajo podatki (name, email ali password)." },
        { status: 400 }
      );
    }

    // 2️⃣ Ustvari Supabase client z service role key
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 3️⃣ Ustvari uporabnika v Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    const userId = authData.user.id;

    // 4️⃣ Hash geslo
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5️⃣ Vstavi uporabnika v tabelo "users" skupaj z email
    const { error: userError } = await supabase.from("users").insert([
      {
        id: userId,
        name,
        email, // ⬅️ dodano email
        password: hashedPassword,
        created_at: new Date().toISOString(),
      },
    ]);

    if (userError) {
      return NextResponse.json({ error: userError.message }, { status: 400 });
    }

    // 6️⃣ Uspeh
    return NextResponse.json({ message: "Registracija uspešna!" });
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json({ error: "Strežniška napaka." }, { status: 500 });
  }
}
