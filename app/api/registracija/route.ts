import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Manjkajo podatki." }, { status: 400 });
    }

    // 1) Ustvari supabase client z service role key
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 2) Ustvari uporabnika v Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    const userId = authData.user.id;

    // 3) Hash geslo (nikoli ne shranjuj plain text)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4) Vstavi v tabelo User
    const { error: userError } = await supabase.from("User").insert([
      {
        id: userId,
        name,
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
