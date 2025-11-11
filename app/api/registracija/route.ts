import { NextRequest, NextResponse } from "next/server";
import { createUser } from "@/seed/route"; // @ = root, prilagodi path
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

    const newUser: Omit<User, "id"> = { name, email, password };
    const insertedUser = await createUser(newUser);

    const { password: _, ...userWithoutPassword } = insertedUser;

    return NextResponse.json(userWithoutPassword);
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
