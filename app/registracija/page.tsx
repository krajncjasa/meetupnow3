"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import Image from "next/image";
import meetupnow from "./../../public/meetupnow.png";

export default function Register() {
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
    const res = await fetch("/api/register", {
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
  } catch (err) {
    console.error(err);
    setMessage("Napaka pri povezavi z strežnikom.");
  }
};

  

  return (
    <div className="relative min-h-screen bg-gray-100 flex items-center justify-center">
      {/* Desna slika */}
      <div className="absolute top-4 right-4 w-48 h-48 md:w-64 md:h-64">
        <Image src={meetupnow} alt="Meetup Now" className="object-contain" />
      </div>

      {/* Registracijski kvadrat */}
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md z-10">
        <h2 className="text-2xl font-bold mb-6 text-center text-black">
          Registracija
        </h2>

        {message && (
          <div className="mb-4 p-2 text-center text-white bg-red-500 rounded">
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
      </div>
    </div>
  );
}
