"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SideNav from "../components/SideNav";
import meetupnow from "./../../public/meetupnow.png";

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

export default function MojiDogodki() {
  const [prihajajoce, setPrihajajoce] = useState<Dogodek[]>([]);
  const [pretekli, setPretekli] = useState<Dogodek[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchDogodki = async () => {
      try {
        const userId = localStorage.getItem("user_id");
        if (!userId) return;

        const res = await fetch("/api/auth/moji_prijavljeni_dogodki", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: userId }),
        });
        const json = await res.json();

        if (json.error) {
          console.error(json.error);
          return;
        }

        const now = new Date();
        const prihajajoceTmp: Dogodek[] = [];
        const pretekliTmp: Dogodek[] = [];

        json.data.forEach((item: any) => {
          const dog = item.dogodki;
          const dogodek: Dogodek = {
            ...dog,
            slikaUrl: dog.slika ? `${BUCKET_URL}${dog.slika}` : null,
          };

          if (new Date(dog.cas_dogodka) >= now) {
            prihajajoceTmp.push(dogodek);
          } else {
            pretekliTmp.push(dogodek);
          }
        });

        setPrihajajoce(prihajajoceTmp);
        setPretekli(pretekliTmp);
      } catch (err) {
        console.error("Napaka pri nalaganju dogodkov:", err);
      }
    };

    fetchDogodki();
  }, []);

  const renderGrid = (dogodki: Dogodek[]) => (
    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      {dogodki.length === 0 && (
        <p className="text-center col-span-full text-black">
          Ni dogodkov v tej kategoriji.
        </p>
      )}

      {dogodki.map((dogodek) => (
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

          <h3 className="text-xl font-bold text-black mb-2">{dogodek.naslov}</h3>

          <p className="text-black">
            <strong>Kraj:</strong> {dogodek.kraj}
          </p>

          <p className="text-black">
            <strong>Čas:</strong> {new Date(dogodek.cas_dogodka).toLocaleString("sl-SI")}
          </p>
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex">
      <SideNav />

      <div className="ml-0 md:ml-64 min-h-screen bg-gray-100 w-full">
        {/* Header z logotipom */}
        <div className="flex items-center justify-between px-6 py-6">
          <h2 className="text-3xl font-bold text-black mb-6 px-6">Prihajajoči dogodki</h2>
          <img
            src={meetupnow.src}
            alt="Meetup Now"
            className="w-24 h-24 md:w-32 md:h-32 object-contain"
          />
        </div>

        {/* Prihajajoči dogodki */}
        {renderGrid(prihajajoce)}

        {/* Pretekli dogodki */}
        <h2 className="text-3xl font-bold text-black mt-12 mb-6 px-6">Pretekli dogodki</h2>
        {renderGrid(pretekli)}
      </div>
    </div>
  );
}
