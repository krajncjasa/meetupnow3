import { useEffect, useState } from "react";

export default function useGoogleMaps(apiKey: string) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const w = window as any;

    // 1️⃣ Če je Google Maps že naložen
    if (w.google && w.google.maps) {
      setLoaded(true);
      return;
    }

    // 2️⃣ Če skripta že nalaga drug loader
    if (w.__googleMapsScriptLoading) {
      const interval = setInterval(() => {
        if (w.google && w.google.maps) {
          clearInterval(interval);
          setLoaded(true);
        }
      }, 50);
      return;
    }

    // 3️⃣ Če skripta še ni bila dodana, dodajemo
    w.__googleMapsScriptLoading = true;

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      w.__googleMapsScriptLoaded = true; // globalna zastavica za prihodnje klice
      setLoaded(true);
    };

    document.head.appendChild(script);

  }, [apiKey]);

  return loaded;
}
