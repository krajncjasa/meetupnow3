"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function SideNav() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Proverim vrsta iz Supabase baze
    const checkVrsta = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const { data, error } = await supabase
            .from("users")
            .select("vrsta")
            .eq("id", user.id)
            .single();

          if (error) {
            console.error("Napaka pri pridobivanju vrsta:", error);
            setIsAdmin(false);
          } else if (data) {
            setIsAdmin(data.vrsta === 'true');
          }
        }
      } catch (error) {
        console.error("Napaka pri preverjanju vrsta:", error);
      } finally {
        setLoading(false);
      }
    };

    checkVrsta();
  }, []);

  const handleLogout = async () => {
    // ⭐ Odjava
    localStorage.removeItem("user");
    localStorage.removeItem("user_id");

    await supabase.auth.signOut();

    // Preusmeri na login
    router.push("/prijava");
  };

  return (
    <nav className="h-screen w-64 bg-white shadow-lg fixed left-0 top-0 p-6 flex flex-col">
      
      <h2 className="text-2xl font-bold text-black mb-10">Navigacija</h2>

      <ul className="flex flex-col gap-4 text-lg text-black">

        <li>
          <Link
            href="/dogodki"
            className="block py-2 px-3 rounded hover:bg-gray-200 transition"
          >
            Izpis dogodkov
          </Link>
        </li>

        <li>
          <Link
            href="/moji_prijavljeni_dogodki"
            className="block py-2 px-3 rounded hover:bg-gray-200 transition"
          >
            Moji prijavljeni dogodki
          </Link>
        </li>

        {isAdmin && (
          <>
            <li>
              <Link
                href="/spreminjanje_dogodkov"
                className="block py-2 px-3 rounded hover:bg-gray-200 transition"
              >
                Spreminjanje dogodkov
              </Link>
            </li>

            <li>
              <Link
                href="/ustvari_dogodek"
                className="block py-2 px-3 rounded hover:bg-gray-200 transition"
              >
                Ustvari dogodek
              </Link>
            </li>
          </>
        )}

        <li>
          <button
            onClick={handleLogout}
            className="w-full text-left py-2 px-3 rounded hover:bg-red-200 text-red-600 transition"
          >
            Odjava
          </button>
        </li>
      </ul>
    </nav>
  );
}
