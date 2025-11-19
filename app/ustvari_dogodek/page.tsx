"use client";

import { useState } from "react";
import Image from "next/image";
import SideNav from "../components/SideNav";
import meetupnow from "../../public/meetupnow.png";

export default function NovDogodek() {
  const [msg, setMsg] = useState("");
  const [preview, setPreview] = useState<string | null>(null);

  const handleImagePreview = (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  };

  const submitForm = async (e: any) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    setMsg("Nalaganje...");

    const res = await fetch("/api/auth/ustvari_dogodek", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (data.success) {
      setMsg("Dogodek uspešno dodan!");
      e.target.reset();
      setPreview(null);
    } else {
      setMsg("Napaka: " + data.error);
    }
  };

  return (
    <div className="flex">
      <SideNav />

      <div className="ml-0 md:ml-64 relative min-h-screen bg-gray-100 p-6 w-full">
        <div className="absolute top-4 right-4 w-48 h-48 md:w-64 md:h-64">
          <Image src={meetupnow} alt="Meetup Now" className="object-contain" />
        </div>

        <h2 className="text-3xl font-bold text-center text-black mb-8">
          Ustvari nov dogodek
        </h2>

        <form
          onSubmit={submitForm}
          className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6 space-y-4"
        >
          {/* Naslov */}
          <div>
            <label className="block font-semibold text-black">Naslov *</label>
            <input
              type="text"
              name="naslov"
              required
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Opis */}
          <div>
            <label className="block font-semibold text-black">Opis</label>
            <textarea name="opis" className="w-full p-2 border rounded" />
          </div>

          {/* Slika */}
          <div>
            <label className="block font-semibold text-black">Slika *</label>
            <input
              type="file"
              name="slika"
              accept="image/*"
              required
              onChange={handleImagePreview}
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Predogled slike */}
          {preview && (
            <div className="mt-4">
              <p className="font-semibold mb-2 text-black">Predogled slike:</p>
              <img
                src={preview}
                alt="Preview"
                className="h-40 rounded shadow border object-contain"
              />
            </div>
          )}

          {/* Kraj */}
          <div>
            <label className="block font-semibold text-black">Kraj *</label>
            <input
              type="text"
              name="kraj"
              required
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Datum + čas */}
          <div>
            <label className="block font-semibold text-black">
              Datum in čas dogodka *
            </label>
            <input
              type="datetime-local"
              name="cas_dogodka"
              required
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Dodaj dogodek
          </button>

          {msg && <p className="text-center mt-2 text-black">{msg}</p>}
        </form>
      </div>
    </div>
  );
}
