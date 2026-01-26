import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { describe, it, expect, vi, beforeEach } from 'vitest'


vi.mock('next/server', () => ({
  NextResponse: {
    json: (data: any, init?: { status?: number }) => ({
      data,
      status: init?.status ?? 200,
    }),
  },
}))

// MOCK Supabase
const fromMock = vi.fn()

vi.mock('@supabase/supabase-js', () => ({
  createClient: () => ({
    from: fromMock,
  }),
}))

beforeEach(() => {
  vi.clearAllMocks()
})

describe('GET /api/auth/prikaz_dogodka/[id]', () => {

  it('vrne 400, če ID ni podan', async () => {
    const req = {
      url: 'http://localhost/api/auth/prikaz_dogodka/',
    } as Request

    const res: any = await GET(req)

    expect(res.status).toBe(400)
    expect(res.data.error).toBeDefined()
  })

  it('vrne 404, če dogodek ne obstaja', async () => {
  // mock prve supabase poizvedbe (dogodek)
  fromMock.mockReturnValueOnce({
    select: () => ({
      eq: () => ({
        single: async () => ({
          data: null,
          error: { message: 'Dogodek ni najden' },
        }),
      }),
    }),
  })

  const req = {
    url: 'http://localhost/api/auth/prikaz_dogodka/123',
  } as Request

  const res: any = await GET(req)

  expect(res.status).toBe(404)
  expect(res.data.error).toBeDefined()
})

})

export async function GET(req: Request) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const url = new URL(req.url);
    const segments = url.pathname.split("/");
    const id = segments[segments.length - 1];

    if (!id) {
      return NextResponse.json({ error: "ID dogodka ni podan" }, { status: 400 });
    }

    // 1️⃣ Pridobi dogodek
    const { data: dogodek, error: dogodekError } = await supabase
      .from("dogodki")
      .select("*")
      .eq("id", parseInt(id))
      .single();

    if (dogodekError || !dogodek) {
      return NextResponse.json(
        { error: dogodekError?.message || "Dogodek ni najden" },
        { status: 404 }
      );
    }

    // 2️⃣ Pridobi user_id vseh prijavljenih na dogodek
    const { data: prijave, error: prijaveError } = await supabase
      .from("prijava_dogodek")
      .select("user_id")
      .eq("dogodek_id", parseInt(id));

    if (prijaveError) {
      return NextResponse.json({ error: prijaveError.message }, { status: 500 });
    }

    const userIds = prijave?.map(p => p.user_id);

    // 3️⃣ Pridobi samo email teh uporabnikov
    let emails: string[] = [];
    if (userIds && userIds.length > 0) {
      const { data: users, error: usersError } = await supabase
        .from("users")
        .select("email")
        .in("id", userIds);

      if (usersError) {
        return NextResponse.json({ error: usersError.message }, { status: 500 });
      }

      emails = users?.map(u => u.email) || [];
    }

    return NextResponse.json({ ...dogodek, prijavljeni: emails });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Napaka na strežniku" }, { status: 500 });
  }
}
