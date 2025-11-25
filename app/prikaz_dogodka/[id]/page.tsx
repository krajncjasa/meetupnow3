"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import SideNav from "../../components/SideNav";
import useGoogleMaps from "../../hooks/useGoogleMaps";

export default function PodrobnostiDogodka() {
  const { id } = useParams();
  const router = useRouter(); // ✅ hook na vrhu komponente
  const [dogodek, setDogodek] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

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

  // Inicializacija Google mape
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

  // ⭐ Funkcija za prijavo na dogodek
  const prijaviSe = async () => {
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      alert("Najprej se prijavite!");
      return;
    }

    setMsg("Pošiljam prijavo...");

    try {
      const res = await fetch("/api/auth/prijava_dogodek", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dogodek_id: dogodek.id, user_id: userId }),
      });

      const data = await res.json();

      if (data.success) {
        setMsg("Uspešno prijavljen na dogodek!");
        router.push("/dogodki"); // ⭐ preusmeritev po uspešni prijavi
      } else {
        setMsg("Napaka: " + data.error);
      }
    } catch (err) {
      setMsg("Prišlo je do napake.");
    }
  };

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
        <h1 className="text-3xl font-bold mb-8 text-center">{dogodek.naslov}</h1>

        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6 space-y-6">

          {/* Slika */}
          {dogodek.slika_url && (
            <div className="w-full flex justify-center">
              <img
                src={dogodek.slika_url}
                alt={dogodek.naslov}
                className="w-full max-w-xl rounded-lg shadow object-cover"
              />
            </div>
          )}

          {/* Podrobnosti */}
          <div className="space-y-2 text-black">
            <p><strong>Opis:</strong> {dogodek.opis}</p>
            <p><strong>Kraj:</strong> {dogodek.kraj}</p>
            <p>
              <strong>Datum in čas:</strong>{" "}
              {new Date(dogodek.cas_dogodka).toLocaleString("sl-SI")}
            </p>
          </div>

          {/* Google mapa */}
          <div>
            <label className="block font-semibold mb-2 text-black">Lokacija:</label>
            <div ref={mapRef} className="w-full h-72 rounded border shadow"></div>
          </div>

          {/* Gumb PRIJAVI SE */}
          <div className="pt-4">
            <button
              onClick={prijaviSe} // ✅ zdaj pravilno uporablja hook router
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Prijavi se
            </button>

            {msg && (
              <p className="text-center mt-3 text-black font-medium">{msg}</p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
