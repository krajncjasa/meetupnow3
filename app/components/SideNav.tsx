"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

export default function SideNav() {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    // ⭐ Odjava – izbriše vse uporabniške podatke iz localStorage
    localStorage.removeItem("user");       // če shranjaš objekt uporabnika
    localStorage.removeItem("user_id");    // če shranjaš user_id
    // lahko po potrebi dodaš še druge ključe, povezane s sejo

    // Preusmeri na login
    router.push("/prijava");
  };

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="h-screen w-64 bg-gradient-to-b from-blue-50 to-indigo-100 shadow-xl fixed left-0 top-0 p-6 flex flex-col border-r border-indigo-200">
      
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-indigo-800 mb-2">📅 MeetupNow</h2>
        <p className="text-sm text-indigo-600">Navigacija</p>
      </div>

      <ul className="flex flex-col gap-3 text-lg">

        <li>
          <Link
            href="/dogodki"
            className={`block py-3 px-4 rounded-lg transition-all duration-200 ${
              isActive('/dogodki')
                ? 'bg-indigo-200 text-indigo-900 shadow-md'
                : 'text-gray-700 hover:bg-indigo-100 hover:text-indigo-800'
            }`}
          >
            📋 Izpis dogodkov
          </Link>
        </li>

        <li>
          <Link
            href="/moji_prijavljeni_dogodki"
            className={`block py-3 px-4 rounded-lg transition-all duration-200 ${
              isActive('/moji_prijavljeni_dogodki')
                ? 'bg-indigo-200 text-indigo-900 shadow-md'
                : 'text-gray-700 hover:bg-indigo-100 hover:text-indigo-800'
            }`}
          >
            🎫 Moji prijavljeni dogodki
          </Link>
        </li>

        <li>
          <Link
            href="/spreminjanje_dogodkov"
            className={`block py-3 px-4 rounded-lg transition-all duration-200 ${
              isActive('/spreminjanje_dogodkov')
                ? 'bg-indigo-200 text-indigo-900 shadow-md'
                : 'text-gray-700 hover:bg-indigo-100 hover:text-indigo-800'
            }`}
          >
            ✏️ Spreminjanje dogodkov
          </Link>
        </li>

        <li>
          <Link
            href="/ustvari_dogodek"
            className={`block py-3 px-4 rounded-lg transition-all duration-200 ${
              isActive('/ustvari_dogodek')
                ? 'bg-indigo-200 text-indigo-900 shadow-md'
                : 'text-gray-700 hover:bg-indigo-100 hover:text-indigo-800'
            }`}
          >
            ➕ Ustvari dogodek
          </Link>
        </li>

        <li>
          <Link
            href="/admin"
            className={`block py-3 px-4 rounded-lg transition-all duration-200 ${
              isActive('/admin')
                ? 'bg-purple-200 text-purple-900 shadow-md'
                : 'text-gray-700 hover:bg-purple-100 hover:text-purple-800'
            }`}
          >
            👑 Admin panel
          </Link>
        </li>

        <li className="mt-auto">
          <button
            onClick={handleLogout}
            className="w-full text-left py-3 px-4 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 transition-all duration-200 border border-red-200"
          >
            🚪 Odjava
          </button>
        </li>
      </ul>
    </nav>
  );
}
