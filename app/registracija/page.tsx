"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import meetupnow from "./../../public/meetupnow.png";
import { supabase } from "@/lib/supabase"; 

export default function Register() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState<string>("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { name, email, password, confirmPassword } = formData;

    if (!name || !email || !password || !confirmPassword) {
      setMessage("Prosimo, izpolnite vsa polja.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Gesli se ne ujemata.");
      return;
    }

    try {
      const res = await fetch("/api/auth/registracija", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Napaka pri registraciji.");
        return;
      }

      setMessage("Registracija uspešna!");
      setFormData({ name: "", email: "", password: "", confirmPassword: "" });

      setTimeout(() => {
        router.push("/prijava");
      }, 1500);
    } catch (err) {
      console.error(err);
      setMessage("Napaka pri povezavi z strežnikom.");
    }
  };

  // GitHub registracija / OAuth
  const githubRegister = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      alert(error.message);
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="absolute top-4 right-4 w-48 h-48 md:w-64 md:h-64">
        <Image src={meetupnow} alt="Meetup Now" className="object-contain" />
      </div>

      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md z-10">
        <h2 className="text-2xl font-bold mb-6 text-center text-black">
          Registracija
        </h2>

        {message && (
          <div
            className={`mb-4 p-2 text-center text-white rounded ${
              message === "Registracija uspešna!" ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium text-black">Ime</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-black rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Tvoje ime"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-black">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-black rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="tvoj@email.com"
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
              placeholder="Geslo"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-black">
              Potrdi geslo
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-black rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Ponovi geslo"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Registriraj se
          </button>
        </form>

        {/* 🚀 GITHUB LOGIN */}
        <button
          onClick={githubRegister}
          className="w-full mt-4 py-2 px-4 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors flex items-center justify-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.1 3.29 9.42 7.86 10.95.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.53-1.33-1.29-1.69-1.29-1.69-1.06-.73.08-.72.08-.72 1.18.08 1.8 1.21 1.8 1.21 1.04 1.79 2.72 1.27 3.38.97.11-.76.41-1.27.74-1.56-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.29 1.2-3.1-.12-.29-.52-1.45.11-3.02 0 0 .97-.31 3.18 1.18A11.1 11.1 0 0 1 12 6.8c.98.01 1.97.13 2.89.38 2.2-1.49 3.17-1.18 3.17-1.18.63 1.57.23 2.73.11 3.02.75.81 1.19 1.84 1.19 3.1 0 4.44-2.69 5.41-5.25 5.69.42.36.8 1.1.8 2.22 0 1.6-.02 2.89-.02 3.28 0 .31.2.67.8.56A10.99 10.99 0 0 0 23.5 12c0-6.35-5.15-11.5-11.5-11.5Z" />
          </svg>
          Registracija z GitHub
        </button>

        <button
          onClick={() => router.push("/prijava")}
          className="w-full mt-4 py-2 px-4 bg-gray-300 text-black rounded-lg hover:bg-gray-400 transition-colors"
        >
          Že imaš profil? Prijavi se
        </button>
      </div>
    </div>
  );
}
