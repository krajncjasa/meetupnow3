"use client";

import { useState, ChangeEvent, FormEvent, Suspense } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import meetupnow from "./../../public/meetupnow.png";
import { supabase } from "@/lib/supabase";

function VerificationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get("email") || "";

  const [email, setEmail] = useState(initialEmail);
  const [token, setToken] = useState("");
  const [message, setMessage] = useState<string>("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !token) {
      setMessage("Prosimo, vnesite e-poštni naslov in kodo.");
      return;
    }

    const { error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: "signup",
    });

    if (error) {
      setMessage("Napačna ali potekla koda. Preverite kodo in poskusite znova.");
      return;
    }

    setSuccess(true);
    setMessage("E-poštni naslov je bil uspešno verificiran!");
    setTimeout(() => router.push("/prijava"), 2000);
  };

  return (
    <div className="relative min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="absolute top-4 right-4 w-48 h-48 md:w-64 md:h-64">
        <Image src={meetupnow} alt="Meetup Now" className="object-contain" />
      </div>

      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md z-10">
        <h2 className="text-2xl font-bold mb-4 text-center text-black">
          Verificiraj e-poštni naslov
        </h2>

        <p className="text-gray-600 text-center mb-6">
          Na vaš e-poštni naslov smo poslali 6-mestno kodo. Vnesite jo spodaj,
          da potrdite svojo registracijo.
        </p>

        {message && (
          <div
            className={`mb-4 p-2 text-center text-white rounded ${
              success ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium text-black">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
              className="w-full px-3 py-2 border border-black rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="tvoj@email.com"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-black">
              Verifikacijska koda
            </label>
            <input
              type="tel"
              inputMode="numeric"
              value={token}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setToken(e.target.value.replace(/\s/g, ""))
              }
              className="w-full px-3 py-2 border border-black rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-black text-center tracking-widest text-xl"
              placeholder="123456"
              maxLength={6}
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Potrdi kodo
          </button>
        </form>

        <button
          onClick={() => router.push("/prijava")}
          className="w-full mt-4 py-2 px-4 bg-gray-300 text-black rounded-lg hover:bg-gray-400 transition-colors"
        >
          Nazaj na prijavo
        </button>
      </div>
    </div>
  );
}

export default function VerificationPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-black text-lg">Nalaganje…</p>
        </div>
      }
    >
      <VerificationForm />
    </Suspense>
  );
}
