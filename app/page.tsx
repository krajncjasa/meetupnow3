"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import meetupnow from "./../public/meetupnow.png";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen bg-gray-100 flex items-center justify-center">
      {/* Desna slika */}
      <div className="absolute top-4 right-4 w-48 h-48 md:w-64 md:h-64">
        <Image src={meetupnow} alt="Meetup Now" className="object-contain" />
      </div>

      {/* Glavni kvadrati */}
      <div className="flex flex-col md:flex-row gap-6 z-10">
        {/* Prijava */}
        <div
          className="w-72 p-8 bg-blue-500 rounded-lg flex flex-col items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer shadow-md"
          onClick={() => router.push("/prijava")}
        >
          <h2 className="text-xl font-bold mb-2 text-white">Prijava</h2>
          <p className="text-center text-white">
            Če že imaš račun, se tukaj prijavi.
          </p>
        </div>

        {/* Registracija */}
        <div
          className="w-72 p-8 bg-blue-500 rounded-lg flex flex-col items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer shadow-md"
          onClick={() => router.push("/registracija")}
        >
          <h2 className="text-xl font-bold mb-2 text-white">Registracija</h2>
          <p className="text-center text-white">
            Ustvari nov račun in se pridruži naši skupnosti.
          </p>
        </div>
      </div>
    </div>
  );
}
