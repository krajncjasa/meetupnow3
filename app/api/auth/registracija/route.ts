import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Manjkajo podatki (name, email ali password)." },
        { status: 400 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 1️⃣ Ustvari uporabnika v Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    const userId = authData.user.id;
    const hashedPassword = await bcrypt.hash(password, 10);

    // 2️⃣ Shrani v tabelo users
    const { error: userError } = await supabase.from("users").insert([
      {
        id: userId,
        name,
        email,
        password: hashedPassword,
        created_at: new Date().toISOString(),
      },
    ]);

    if (userError) {
      return NextResponse.json({ error: userError.message }, { status: 400 });
    }

    return NextResponse.json({ message: "Registracija uspešna!" });
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json({ error: "Strežniška napaka." }, { status: 500 });
  }
}
