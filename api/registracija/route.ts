import { NextRequest, NextResponse } from "next/server";
import { createUser } from '../../seed/route';
import { User } from "@/lib/definitions";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Vsa polja so obvezna." },
        { status: 400 }
      );
    }

    const user: Omit<User, "id"> = { name, email, password };
    const newUser = await createUser(user);

    return NextResponse.json({ user: newUser }, { status: 201 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: error.message || "Napaka pri registraciji." },
      { status: 500 }
    );
  }
}
