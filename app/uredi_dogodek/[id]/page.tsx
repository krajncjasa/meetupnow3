"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import SideNav from "../../components/SideNav";
import meetupnow from "../../../public/meetupnow.png";
import useGoogleMaps from "../../hooks/useGoogleMaps";

type Dogodek = {
  id: number;
  naslov: string;
  opis?: string;
  kraj: string;
  cas_dogodka: string;
  slika: string | null;
  slikaUrl: string | null;
  vrsta?: string | null;
  lat?: number;
  lng?: number;
};

export default function UrediDogodek() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState<string | null>(null);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [dogodek, setDogodek] = useState<Dogodek | null>(null);

  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const marker = useRef<google.maps.Marker | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);

  const mapLoaded = useGoogleMaps(process.env.NEXT_PUBLIC_MAPS_KEY!);

  // FETCH EVENT DATA
  useEffect(() => {
    const fetchDogodek = async () => {
      try {
        const res = await fetch(`/api/auth/dogodki/${id}`);
        if (!res.ok) throw new Error("Napaka pri nalaganju dogodka");

        const data = await res.json();
        setDogodek(data.dogodek);

        // Set initial values
        if (data.dogodek.lat && data.dogodek.lng) {
          setCoords({ lat: data.dogodek.lat, lng: data.dogodek.lng });
        }

        if (data.dogodek.slikaUrl) {
          setPreview(data.dogodek.slikaUrl);
        }
      } catch (err) {
        console.error(err);
        setMsg("Napaka pri nalaganju dogodka");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDogodek();
  }, [id]);

  // MAP INIT
  useEffect(() => {
    if (!mapLoaded || !mapRef.current || !coords) return;

    if (!mapInstance.current) {
      mapInstance.current = new google.maps.Map(mapRef.current, {
        center: coords,
        zoom: 12,
      });
    }

    const map = mapInstance.current;

    // Set marker at current location
    if (!marker.current) {
      marker.current = new google.maps.Marker({
        position: coords,
        map,
      });
    } else {
      marker.current.setPosition(coords);
    }

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
  }, [mapLoaded, coords]);

  // IMAGE PREVIEW
  const handleImagePreview = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setPreview(file ? URL.createObjectURL(file) : dogodek?.slikaUrl || null);
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

    setMsg("Posodabljanje...");

    const updateData = {
      naslov: formData.get("naslov"),
      kraj: formData.get("kraj"),
      cas_dogodka: formData.get("cas_dogodka"),
      vrsta: formData.get("vrsta"),
      lat: coords.lat,
      lng: coords.lng,
    };

    const res = await fetch(`/api/auth/dogodki/${id}`, {
      method: "PUT",
      body: JSON.stringify(updateData),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();

    if (res.ok) {
      setMsg("Dogodek uspešno posodobljen!");
      setTimeout(() => {
        router.push("/spreminjanje_dogodkov");
      }, 2000);
      return;
    }

    setMsg("Napaka: " + data.error);
  };

  if (loading) {
    return (
      <div className="flex">
        <SideNav />
        <div className="ml-0 md:ml-64 min-h-screen bg-gray-100 w-full flex items-center justify-center">
          <p className="text-black">Nalaganje...</p>
        </div>
      </div>
    );
  }

  if (!dogodek) {
    return (
      <div className="flex">
        <SideNav />
        <div className="ml-0 md:ml-64 min-h-screen bg-gray-100 w-full flex items-center justify-center">
          <p className="text-black">Dogodek ni najden.</p>
        </div>
      </div>
    );
  }

  const minDateTime = new Date().toISOString().slice(0, 16);

  return (
    <div className="flex">
      <SideNav />

      <div className="ml-0 md:ml-64 relative min-h-screen bg-gray-100 p-6 w-full text-black">
        <div className="absolute top-4 right-4 w-48 h-48 md:w-64 md:h-64">
          <img src={meetupnow.src} alt="Meetup Now" className="object-contain w-full h-full" />
        </div>

        <h2 className="text-3xl font-bold text-center mb-8">Uredi dogodek</h2>

        <form
          ref={formRef}
          onSubmit={submitForm}
          className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6 space-y-4"
        >
          <div>
            <label className="block font-semibold">Naslov *</label>
            <input
              type="text"
              name="naslov"
              required
              defaultValue={dogodek.naslov}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block font-semibold">Opis</label>
            <textarea
              name="opis"
              defaultValue={dogodek.opis || ""}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block font-semibold">Slika</label>
            <p className="text-sm text-gray-600 mb-2">Slike trenutno ni mogoče spremeniti. Trenutna slika bo ohranjena.</p>
            {preview && (
              <img src={preview} alt="Current" className="h-20 w-20 object-cover rounded border" />
            )}
          </div>

          <div>
            <label className="block font-semibold">Kraj *</label>
            <input
              type="text"
              name="kraj"
              required
              defaultValue={dogodek.kraj}
              className="w-full p-2 border rounded"
            />
          </div>

          {/* VRSTA DOGODKA */}
          <div>
            <label className="block font-semibold mb-2">Vrsta dogodka *</label>

            <div className="flex flex-wrap gap-4">
              {["šport", "kultura", "druženje", "zabava"].map((vrsta) => (
                <label key={vrsta} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="vrsta"
                    value={vrsta}
                    defaultChecked={dogodek.vrsta?.split(",").map(v => v.trim()).includes(vrsta)}
                  />
                  {vrsta.charAt(0).toUpperCase() + vrsta.slice(1)}
                </label>
              ))}
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
              defaultValue={new Date(dogodek.cas_dogodka).toISOString().slice(0, 16)}
              className="w-full p-2 border rounded"
              min={minDateTime}
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Posodobi dogodek
            </button>
            <button
              type="button"
              onClick={() => router.push("/spreminjanje_dogodkov")}
              className="flex-1 bg-gray-600 text-white py-2 rounded hover:bg-gray-700"
            >
              Prekliči
            </button>
          </div>

          {msg && <p className="text-center mt-2">{msg}</p>}
        </form>
      </div>
    </div>
  );
}