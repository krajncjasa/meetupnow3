"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import meetupnow from "./../../public/meetupnow.png";

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState<string>("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { email, password } = formData;

    if (!email || !password) {
      setMessage("Prosimo, izpolnite vsa polja.");
      return;
    }

    try {
      const res = await fetch("/api/auth/prijava", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Napaka pri prijavi.");
        return;
      }

      // ⭐ Shrani user_id za uporabo pri prijavi na dogodek
      localStorage.setItem("user_id", data.user.id);

      setMessage("Prijava uspešna!");
      setFormData({ email: "", password: "" });
      if (localStorage.user_id === "d308c4d6-6820-435b-995c-ae724494a46f") {
        router.push("/admin");
        return;
      }else{
      setTimeout(() => router.push("/dogodki"), 1500);
      }
    } catch (err) {
      console.error(err);
      setMessage("Napaka pri povezavi z strežnikom.");
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="absolute top-4 right-4 w-48 h-48 md:w-64 md:h-64">
        <Image src={meetupnow} alt="Meetup Now" className="object-contain" />
      </div>

      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md z-10">
        <h2 className="text-2xl font-bold mb-6 text-center text-black">Prijava</h2>

        {message && (
          <div className={`mb-4 p-2 text-center text-white rounded ${message === "Prijava uspešna!" ? "bg-green-500" : "bg-red-500"}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium text-black">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-black rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-black">Geslo</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-black rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Prijavi se
          </button>
        </form>

        <button
          onClick={() => router.push("/registracija")}
          className="w-full mt-4 py-2 px-4 bg-gray-300 text-black rounded-lg hover:bg-gray-400 transition-colors"
        >
          Še nimaš profila? Registriraj se
        </button>
      </div>
    </div>
  );
}
