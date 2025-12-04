"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import meetupnow from "./../../public/meetupnow.png";
import SideNav from "../components/SideNav";

type Dogodek = {
  id: number;
  naslov: string;
  kraj: string;
  cas_dogodka: string;
  slika: string | null;
  slikaUrl: string | null;
  vrsta?: string; // ⚡ DODAMO VRSTA
};

export default function Dogodki() {
  const [dogodki, setDogodki] = useState<Dogodek[]>([]);
  const [filterVrste, setFilterVrste] = useState<string[]>([]); // ⚡ FILTER
  const router = useRouter();

  useEffect(() => {
    const fetchDogodki = async () => {
      try {
        const userId = localStorage.getItem("user_id");
        if (!userId) return;

        const res = await fetch(`/api/auth/dogodki?user_id=${userId}`);
        const data = await res.json();

        setDogodki(data);
      } catch (err) {
        console.error("Napaka pri nalaganju dogodkov:", err);
      }
    };

    fetchDogodki();
  }, []);

  // ⚡ FILTER LOGIKA
  const filteredDogodki =
    filterVrste.length === 0
      ? dogodki
      : dogodki.filter((d) => {
          if (!d.vrsta) return false;
          const vrsteDogodka = d.vrsta.split(","); // npr. "šport,kultura"
          return vrsteDogodka.some((v) => filterVrste.includes(v));
        });

  const toggleFilter = (vrsta: string) => {
    setFilterVrste((prev) =>
      prev.includes(vrsta) ? prev.filter((v) => v !== vrsta) : [...prev, vrsta]
    );
  };

  return (
    <div className="flex">
      <SideNav />

      <div className="ml-0 md:ml-64 min-h-screen bg-gray-100 w-full">
        <div className="flex items-center justify-between px-6 py-6">
          <h2 className="text-3xl font-bold text-black">Odobreni dogodki</h2>
          <img
            src={meetupnow.src}
            alt="Meetup Now"
            className="w-24 h-24 md:w-32 md:h-32 object-contain"
          />
        </div>

        {/* ⚡ FILTER UI */}
        <div className="max-w-6xl mx-auto px-6 pb-2">
          <div className="bg-white shadow p-4 rounded mb-4">
            <h3 className="font-bold text-black mb-2">Filtriraj po vrsti</h3>

            <div className="flex flex-wrap gap-4 text-black">
              {["šport", "kultura", "druženje", "zabava"].map((vrsta) => (
                <label key={vrsta} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filterVrste.includes(vrsta)}
                    onChange={() => toggleFilter(vrsta)}
                  />
                  {vrsta.charAt(0).toUpperCase() + vrsta.slice(1)}
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
          {filteredDogodki.length === 0 && (
            <p className="text-center col-span-full text-black">
              Ni dogodkov za izbrane filtre.
            </p>
          )}

          {filteredDogodki.map((dogodek) => (
            <div
              key={dogodek.id}
              onClick={() => router.push(`/prikaz_dogodka/${dogodek.id}`)}
              className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer"
            >
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

              <p className="text-black"><strong>Kraj:</strong> {dogodek.kraj}</p>

              <p className="text-black">
                <strong>Čas:</strong>{" "}
                {new Date(dogodek.cas_dogodka).toLocaleString("sl-SI")}
              </p>

              {dogodek.vrsta && (
                <p className="text-sm mt-1 text-gray-700">
                  <strong>Vrsta:</strong> {dogodek.vrsta}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
