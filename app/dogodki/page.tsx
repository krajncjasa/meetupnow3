"use client";

import { useEffect, useState } from "react";
import meetupnow from "./../../public/meetupnow.png";
import SideNav from "../components/SideNav";

// 🔹 Supabase bucket URL za slike
const BUCKET_URL =
  "https://tovzcaqtxmgsohhkmiqc.supabase.co/storage/v1/object/public/slike/";

type Dogodek = {
  id: number;
  naslov: string;
  kraj: string;
  cas_dogodka: string;
  slika: string | null;
  slikaUrl: string | null;
};

export default function Dogodki() {
  const [dogodki, setDogodki] = useState<Dogodek[]>([]);

  useEffect(() => {
    const fetchDogodki = async () => {
      try {
        const res = await fetch("/api/auth/dogodki");
        const data = await res.json();
        setDogodki(data);
      } catch (err) {
        console.error("Napaka pri nalaganju dogodkov:", err);
      }
    };

    fetchDogodki();
  }, []);

  return (
    <div className="flex">
      <SideNav />

      <div className="ml-0 md:ml-64 min-h-screen bg-gray-100 w-full">
        {/* 🔹 Naslov in logo v isti vrstici */}
        <div className="flex items-center justify-between px-6 py-6">
          <h2 className="text-3xl font-bold text-black">
            Odobreni dogodki
          </h2>
          <img
            src={meetupnow.src}
            alt="Meetup Now"
            className="w-24 h-24 md:w-32 md:h-32 object-contain"
          />
        </div>

        {/* 🔹 Mreža dogodkov */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
          {dogodki.length === 0 && (
            <p className="text-center col-span-full text-black">
              Trenutno ni odobrenih dogodkov.
            </p>
          )}

          {dogodki.map((dogodek) => (
            <div
              key={dogodek.id}
              className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow"
            >
              {/* 🔹 SLIKA IZ SUPABASE BUCKETA */}
              <div className="w-full h-40 mb-3">
                <img
                  src={dogodek.slikaUrl || "/placeholder.png"}
                  alt={dogodek.naslov}
                  className="w-full h-40 object-cover rounded-lg"
                />
              </div>

              <h3 className="text-xl font-bold text-black mb-2">
                {dogodek.naslov}
              </h3>

              <p className="text-black">
                <strong>Kraj:</strong> {dogodek.kraj}
              </p>

              <p className="text-black">
                <strong>Čas:</strong>{" "}
                {new Date(dogodek.cas_dogodka).toLocaleString("sl-SI")}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
