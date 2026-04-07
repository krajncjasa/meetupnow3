"use client";

import { useState, FormEvent, Suspense } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import meetupnow from "./../../public/meetupnow.png";
import { supabase } from "@/lib/supabase";

function VerifikacijaForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromParams = searchParams.get("email") || "";

  const [email, setEmail] = useState(emailFromParams);
  const [code, setCode] = useState("");
  const [message, setMessage] = useState<string>("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !code) {
      setMessage("Prosimo, vnesite e-poštni naslov in verifikacijsko kodo.");
      return;
    }

    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: code,
        type: "signup",
      });

      if (error) {
        setMessage(error.message || "Napaka pri verifikaciji.");
        return;
      }

      setMessage("Verifikacija uspešna!");
      setTimeout(() => {
        router.push("/dogodki");
      }, 1500);
    } catch (err) {
      console.error(err);
      setMessage("Napaka pri povezavi z strežnikom.");
    }
  };

  return (
    <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md z-10">
      <h2 className="text-2xl font-bold mb-6 text-center text-black">
        Verifikacija e-pošte
      </h2>

      <p className="text-center text-gray-600 mb-6">
        Vnesite kodo, ki ste jo prejeli na vaš e-poštni naslov.
      </p>

      {message && (
        <div
          className={`mb-4 p-2 text-center text-white rounded ${
            message === "Verifikacija uspešna!" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium text-black">E-pošta</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-black rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="tvoj@email.com"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-black">
            Verifikacijska koda
          </label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full px-3 py-2 border border-black rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="123456"
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
  );
}

export default function Verifikacija() {
  return (
    <div className="relative min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="absolute top-4 right-4 w-48 h-48 md:w-64 md:h-64">
        <Image src={meetupnow} alt="Meetup Now" className="object-contain" />
      </div>

      <Suspense
        fallback={
          <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md z-10">
            <p className="text-center text-black">Nalaganje…</p>
          </div>
        }
      >
        <VerifikacijaForm />
      </Suspense>
    </div>
  );
}
