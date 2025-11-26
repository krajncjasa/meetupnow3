"use client";
import { useState, useEffect } from "react";
import SideNav from "../components/SideNav";

export default function PrijavljeniDogodki() {
  const [prijave, setPrijave] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPrijave = async () => {
      const userId = localStorage.getItem("user_id");
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/auth/prijavljeni_dogodki`, {
          method: "POST", // zdaj POST, ker pošljemo user_id v body
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: userId }),
        });
        const data = await res.json();
        setPrijave(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadPrijave();
  }, []);

  if (loading) return <p className="text-center mt-10">Nalaganje...</p>;

  const zdaj = new Date();
  const prihodnji = prijave.filter((p) => new Date(p.dogodki.cas_dogodka) > zdaj);
  const pretekli = prijave.filter((p) => new Date(p.dogodki.cas_dogodka) <= zdaj);

  return (
    <div className="flex">
      <SideNav />
      <div className="ml-0 md:ml-64 relative min-h-screen bg-gray-100 p-6 w-full text-black">
        <h1 className="text-3xl font-bold mb-6 text-center">Moji dogodki</h1>

        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Prihodnji dogodki</h2>
          {prihodnji.length === 0 ? (
            <p>Nimate prihodnjih prijav.</p>
          ) : (
            prihodnji.map((p) => (
              <div key={p.dogodek_id} className="bg-white p-4 mb-4 rounded shadow">
                <h3 className="text-xl font-bold">{p.dogodki.naslov}</h3>
                <p>{new Date(p.dogodki.cas_dogodka).toLocaleString("sl-SI")}</p>
                <p>{p.dogodki.kraj}</p>
              </div>
            ))
          )}
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Pretekli dogodki</h2>
          {pretekli.length === 0 ? (
            <p>Nimate preteklih prijav.</p>
          ) : (
            pretekli.map((p) => (
              <div key={p.dogodek_id} className="bg-white p-4 mb-4 rounded shadow">
                <h3 className="text-xl font-bold">{p.dogodki.naslov}</h3>
                <p>{new Date(p.dogodki.cas_dogodka).toLocaleString("sl-SI")}</p>
                <p>{p.dogodki.kraj}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
