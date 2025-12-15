"use client";

import { useState, useEffect, useRef } from "react";
import SideNav from "../components/SideNav";
import meetupnow from "../../public/meetupnow.png";
import useGoogleMaps from "../hooks/useGoogleMaps";

export default function NovDogodek() {
  const [msg, setMsg] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const marker = useRef<google.maps.Marker | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);

  const formData = new FormData();
  formData.append("user_id", localStorage.getItem("user_id")!);
  // ostali appendi...


  const mapLoaded = useGoogleMaps(process.env.NEXT_PUBLIC_MAPS_KEY!);

  // MAP INIT
  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;

    if (!mapInstance.current) {
      mapInstance.current = new google.maps.Map(mapRef.current, {
        center: { lat: 46.5547, lng: 15.6459 },
        zoom: 8,
      });
    }

    const map = mapInstance.current;

    const listener = map.addListener("click", (e: google.maps.MapMouseEvent) => {
      if (!e.latLng) return;
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();

      setCoords({ lat, lng });

      if (!marker.current) {
        marker.current = new google.maps.Marker({
          position: { lat, lng },
          map,
        });
      } else {
        marker.current.setPosition({ lat, lng });
      }
    });

    return () => {
      google.maps.event.removeListener(listener);
    };
  }, [mapLoaded]);

  // IMAGE PREVIEW
  const handleImagePreview = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  // SUBMIT FORM
  const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!coords) {
      setMsg("Prosim izberi lokacijo na zemljevidu.");
      return;
    }

    const formData = new FormData(e.currentTarget);

    // Zberemo več checkbox vrst
    const vrste = Array.from(formData.getAll("vrsta")) as string[];

    // Pobrišemo originalne multiple vrednosti
    formData.delete("vrsta");

    // Dodamo združeno obliko, npr: "šport,kultura"
    formData.append("vrsta", vrste.join(","));

    // Koordinate
    formData.append("lat", String(coords.lat));
    formData.append("lng", String(coords.lng));

    setMsg("Nalaganje...");

    const res = await fetch("/api/auth/ustvari_dogodek", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (data.success) {
      setMsg("Dogodek uspešno dodan!");

      formRef.current?.reset();
      setPreview(null);
      setCoords(null);

      if (marker.current) {
        marker.current.setMap(null);
        marker.current = null;
      }

      return;
    }

    setMsg("Napaka: " + data.error);
  };

  const minDateTime = new Date().toISOString().slice(0, 16);

  return (
    <div className="flex">
      <SideNav />

      <div className="ml-0 md:ml-64 relative min-h-screen bg-gray-100 p-6 w-full text-black">
        <div className="absolute top-4 right-4 w-48 h-48 md:w-64 md:h-64">
          <img src={meetupnow.src} alt="Meetup Now" className="object-contain w-full h-full" />
        </div>

        <h2 className="text-3xl font-bold text-center mb-8">Ustvari nov dogodek</h2>

        <form
          ref={formRef}
          onSubmit={submitForm}
          className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6 space-y-4"
        >
          <div>
            <label className="block font-semibold">Naslov *</label>
            <input type="text" name="naslov" required className="w-full p-2 border rounded" />
          </div>

          <div>
            <label className="block font-semibold">Opis</label>
            <textarea name="opis" className="w-full p-2 border rounded" />
          </div>

          <div>
            <label className="block font-semibold">Slika *</label>
            <input
              type="file"
              name="slika"
              accept="image/*"
              required
              onChange={handleImagePreview}
              className="w-full p-2 border rounded"
            />
          </div>

          {preview && (
            <div>
              <p className="font-semibold mb-2">Predogled slike:</p>
              <img src={preview} alt="Preview" className="h-40 rounded shadow border object-contain" />
            </div>
          )}

          <div>
            <label className="block font-semibold">Kraj *</label>
            <input type="text" name="kraj" required className="w-full p-2 border rounded" />
          </div>

          {/* VRSTA DOGODKA */}
          <div>
            <label className="block font-semibold mb-2">Vrsta dogodka *</label>

            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2">
                <input type="checkbox" name="vrsta" value="šport" />
                Šport
              </label>

              <label className="flex items-center gap-2">
                <input type="checkbox" name="vrsta" value="kultura" />
                Kultura
              </label>

              <label className="flex items-center gap-2">
                <input type="checkbox" name="vrsta" value="druženje" />
                Druženje
              </label>

              <label className="flex items-center gap-2">
                <input type="checkbox" name="vrsta" value="zabava" />
                Zabava
              </label>
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1">Izberi lokacijo dogodka *</label>
            <div ref={mapRef} className="w-full h-64 border rounded shadow"></div>
            {coords && (
              <p className="text-sm mt-2">
                Izbrano: {coords.lat.toFixed(6)}, {coords.lng.toFixed(6)}
              </p>
            )}
          </div>

          <div>
            <label className="block font-semibold">Datum in čas dogodka *</label>
            <input
              type="datetime-local"
              name="cas_dogodka"
              required
              className="w-full p-2 border rounded"
              min={minDateTime}
            />
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
            Dodaj dogodek
          </button>

          {msg && <p className="text-center mt-2">{msg}</p>}
        </form>
      </div>
    </div>
  );
}
