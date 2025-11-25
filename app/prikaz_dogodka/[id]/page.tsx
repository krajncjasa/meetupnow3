"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import SideNav from "../../components/SideNav";
import useGoogleMaps from "../../hooks/useGoogleMaps";

export default function PodrobnostiDogodka() {
  const { id } = useParams();
  const [dogodek, setDogodek] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const marker = useRef<google.maps.Marker | null>(null);

  const mapLoaded = useGoogleMaps(process.env.NEXT_PUBLIC_MAPS_KEY!);

  // Naloži podatke o dogodku
  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch(`/api/auth/prikaz_dogodka/${id}`);
        const data = await res.json();

        if (data.error) {
          setDogodek(null);
        } else {
          const slika_url = data.slika
            ? `https://tovzcaqtxmgsohhkmiqc.supabase.co/storage/v1/object/public/slike/${data.slika}`
            : null;
          setDogodek({ ...data, slika_url });
        }
      } catch (err) {
        console.error(err);
        setDogodek(null);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  // Inicializacija mape
  useEffect(() => {
    if (!mapLoaded || !dogodek || !mapRef.current) return;

    if (!mapInstance.current) {
      mapInstance.current = new google.maps.Map(mapRef.current, {
        center: { lat: dogodek.lat, lng: dogodek.lng },
        zoom: 13,
      });

      marker.current = new google.maps.Marker({
        position: { lat: dogodek.lat, lng: dogodek.lng },
        map: mapInstance.current,
      });
    }
  }, [mapLoaded, dogodek]);

  if (loading) {
    return <p className="text-center mt-10 text-black">Nalaganje...</p>;
  }

  if (!dogodek) {
    return <p className="text-center mt-10 text-black">Dogodek ni najden.</p>;
  }

  return (
    <div className="flex">
      <SideNav />

      <div className="ml-0 md:ml-64 relative min-h-screen bg-gray-100 p-6 w-full text-black">
        <h1 className="text-3xl font-bold mb-4 text-center">{dogodek.naslov}</h1>

        {/* Manjša, responzivna slika */}
        {dogodek.slika_url && (
          <div className="w-full mb-6 flex justify-center">
            <img
              src={dogodek.slika_url}
              alt={dogodek.naslov}
              className="w-80 sm:w-96 md:w-1/2 rounded shadow object-cover"
              loading="lazy"
            />
          </div>
        )}

        {/* Podrobnosti dogodka */}
        <p className="mb-1"><strong>Opis:</strong> {dogodek.opis}</p>
        <p className="mb-1"><strong>Kraj:</strong> {dogodek.kraj}</p>
        <p className="mb-1">
          <strong>Datum in čas:</strong>{" "}
          {new Date(dogodek.cas_dogodka).toLocaleString("sl-SI")}
        </p>
        

        {/* Google mapa */}
        <div
          ref={mapRef}
          className="w-150 h-72 rounded border shadow"
        ></div>
      </div>
    </div>
  );
}
