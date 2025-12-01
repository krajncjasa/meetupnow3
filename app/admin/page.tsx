"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";   // <-- dodano
import SideNav from "../components/SideNav";
import meetupnow from "../../public/meetupnow.png";

type Dogodek = {
  id: number;
  naslov: string;
  kraj: string;
  cas_dogodka: string;
  slika: string | null;
  slikaUrl: string | null;
};

export default function AdminPregled() {
  const [dogodki, setDogodki] = useState<Dogodek[]>([]);
  const router = useRouter();   // <-- dodano

  const fetchDogodki = async () => {
    const res = await fetch("/api/auth/admin");
    const data = await res.json();
    setDogodki(data);
  };

  useEffect(() => {
    fetchDogodki();
  }, []);

  const posodobiStatus = async (id: number, status: "odobreno" | "zavrnjeno") => {
    await fetch(`/api/auth/admin/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    fetchDogodki();
  };

  return (
    <div className="flex">
      <SideNav />

      <div className="ml-0 md:ml-64 min-h-screen bg-gray-100 w-full">
        <div className="flex items-center justify-between px-6 py-6">
          <h2 className="text-3xl font-bold text-black">Čakanje na odobritev</h2>
          <img src={meetupnow.src} className="w-24 h-24 md:w-32 md:h-32 object-contain" />
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
          {dogodki.length === 0 && (
            <p className="text-center col-span-full text-black">
              Trenutno ni dogodkov, ki čakajo na odobritev.
            </p>
          )}

          {dogodki.map((dogodek) => (
            <div
              key={dogodek.id}
              onClick={() => router.push(`/prikaz_dogodka_admin/${dogodek.id}`)} // <-- preusmeritev
              className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="w-full h-40 mb-3">
                <img
                  src={dogodek.slikaUrl || "/placeholder.png"}
                  alt={dogodek.naslov}
                  className="w-full h-40 object-cover rounded-lg"
                />
              </div>

              <h3 className="text-xl font-bold text-black mb-2">{dogodek.naslov}</h3>

              <p className="text-black">
                <strong>Kraj:</strong> {dogodek.kraj}
              </p>

              <p className="text-black">
                <strong>Čas:</strong>{" "}
                {new Date(dogodek.cas_dogodka).toLocaleString("sl-SI")}
              </p>

              <div className="flex gap-3 mt-4 z-20">
                <button
                  onClick={(e) => { e.stopPropagation(); posodobiStatus(dogodek.id, "zavrnjeno"); }}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                >
                  Zavrni
                </button>

                <button
                  onClick={(e) => { e.stopPropagation(); posodobiStatus(dogodek.id, "odobreno"); }}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                >
                  Odobri
                </button>
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
