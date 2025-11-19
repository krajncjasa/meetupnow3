"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import meetupnow from "./../../public/meetupnow.png";
import SideNav from "../components/SideNav";

// 🔹 Supabase bucket URL za slike
const BUCKET_URL =
  "https://tovzcaqtxmgsohhkmiqc.supabase.co/storage/v1/object/public/slike/"; 
// tukaj samo bucket, ime slike bo dodano iz baze

export default function Dogodki() {
  const [dogodki, setDogodki] = useState([]);

  useEffect(() => {
    const fetchDogodki = async () => {
      const res = await fetch("/api/auth/dogodki");
      const data = await res.json();
      setDogodki(data);
    };

    fetchDogodki();
  }, []);

  return (
    <div className="flex">
      <SideNav />

      <div className="ml-0 md:ml-64 relative min-h-screen bg-gray-100 p-6 w-full">
        <div className="absolute top-4 right-4 w-48 h-48 md:w-64 md:h-64">
          <Image src={meetupnow} alt="Meetup Now" className="object-contain" />
        </div>

        <h2 className="text-3xl font-bold text-center text-black mb-8">
          Odobreni dogodki
        </h2>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {dogodki.length === 0 && (
            <p className="text-center col-span-full text-black">
              Trenutno ni odobrenih dogodkov.
            </p>
          )}

          {dogodki.map((dogodek: any) => (
            <div
              key={dogodek.id}
              className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow"
            >
              {/* 🔹 SLIKA IZ SUPABASE BUCKETA */}
              <div className="w-full h-40 relative mb-3">
                <Image
                  src={dogodek.slika ? BUCKET_URL + dogodek.slika : "/placeholder.png"}
                  alt={dogodek.naslov}
                  fill
                  className="object-cover rounded-lg"
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
