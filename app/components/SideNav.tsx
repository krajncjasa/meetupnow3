"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SideNav() {
  const router = useRouter();

  const handleLogout = () => {
    // Odjava – izbriše localStorage/session po potrebi
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <nav className="h-screen w-64 bg-white shadow-lg fixed left-0 top-0 p-6 flex flex-col">
      
      {/* Naslov ali logo */}
      <h2 className="text-2xl font-bold text-black mb-10">Navigacija</h2>

      {/* Linki */}
      <ul className="flex flex-col gap-4 text-lg text-black">
        <li>
          <Link
            href="/bivsi-dogodki"
            className="block py-2 px-3 rounded hover:bg-gray-200 transition"
          >
            Bivši dogodki
          </Link>
        </li>

        <li>
          <Link
            href="/bivsi-objavljeni-dogodki"
            className="block py-2 px-3 rounded hover:bg-gray-200 transition"
          >
            Bivši objavljeni dogodki
          </Link>
        </li>

        <li>
          <Link
            href="/ustvari-dogodek"
            className="block py-2 px-3 rounded hover:bg-gray-200 transition"
          >
            Ustvari dogodek
          </Link>
        </li>

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
