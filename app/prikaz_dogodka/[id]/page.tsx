"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";

// Hook za nalaganje Google Maps
function useGoogleMaps(apiKey: string) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Če je Google Maps že naložen
    if ((window as any).google) {
      setLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
    script.async = true;
    script.defer = true;
    script.onload = () => setLoaded(true);

    document.head.appendChild(script);

    // Ne odstranjuj script ob unmount, da ne naloži ponovno
  }, [apiKey]);

  return loaded;
}

export default function PodrobnostiDogodka() {
  const { id } = useParams();
  const [dogodek, setDogodek] = useState<any>(null);

  const mapRef = useRef<HTMLDivElement | null>(null);
  const markerRef = useRef<any>(null);
  const mapInstanceRef = useRef<any>(null);

  const mapLoaded = useGoogleMaps(process.env.NEXT_PUBLIC_MAPS_KEY!);

  // 🔹 1) Naloži podatke o dogodku
  useEffect(() => {
    const loadData = async () => {
      const res = await fetch(`/api/prikaz_dogodka/${id}`);
      const data = await res.json();

      if (data.error) {
        console.error(data.error);
        return;
      }

      // Nastavi URL slike
      const slika_url = data.slika
        ? `https://tovzcaqtxmgsohhkmiqc.supabase.co/storage/v1/object/public/slike/${data.slika}`
        : null;

      setDogodek({ ...data, slika_url });
    };

    loadData();
  }, [id]);

  // 🔹 2) Inicializacija mape, ko imamo dogodek in je Google Maps naložen
  useEffect(() => {
    if (!mapLoaded || !dogodek || !mapRef.current) return;

    const { lat, lng } = dogodek;

    mapInstanceRef.current = new google.maps.Map(mapRef.current, {
      center: { lat, lng },
      zoom: 13,
    });

    markerRef.current = new google.maps.Marker({
      position: { lat, lng },
      map: mapInstanceRef.current,
    });
  }, [mapLoaded, dogodek]);

  if (!dogodek) {
    return <p className="text-center mt-10">Nalaganje...</p>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{dogodek.naslov}</h1>

      {/* Slika */}
      {dogodek.slika_url && (
        <img
          src={dogodek.slika_url}
          alt={dogodek.naslov}
          className="w-full h-64 object-cover rounded shadow mb-4"
        />
      )}

      {/* Podrobnosti */}
      <p><strong>Opis:</strong> {dogodek.opis}</p>
      <p><strong>Kraj:</strong> {dogodek.kraj}</p>
      <p>
        <strong>Datum in čas:</strong>{" "}
        {new Date(dogodek.cas_dogodka).toLocaleString("sl-SI")}
      </p>

      {/* Koordinati */}
      <p>
        <strong>Lokacija:</strong> {dogodek.lat}, {dogodek.lng}
      </p>

      {/* Mapa */}
      <div
        ref={mapRef}
        className="w-full h-72 rounded border shadow mt-4"
      ></div>
    </div>
  );
}
