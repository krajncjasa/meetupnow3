// app/hooks/useGoogleMaps.ts
import { useEffect, useState } from "react";

export default function useGoogleMaps(apiKey: string) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Če je Google že naložen, nastavi loaded = true
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

    return () => {
      // ne odstranjuj scripta ob unmount, da ne povzroči ponovnega nalaganja
    };
  }, [apiKey]);

  return loaded;
}
