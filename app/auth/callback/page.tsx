"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function OAuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleOAuth = async () => {
      try {
        // Pridobi trenutno sejo in uporabnika
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError || !session?.user) {
          console.error("OAuth napaka:", sessionError?.message);
          router.push("/prijava");
          return;
        }

        const user = session.user;
        const userId = user.id;
        const email = user.email;
        const name =
          user.user_metadata?.full_name ||
          user.user_metadata?.user_name ||
          "GitHub User";

        // 1️⃣ Preveri, ali že obstaja v tvoji tabeli 'users'
        const { data: existingUser, error: fetchError } = await supabase
          .from("users")
          .select("*")
          .eq("id", userId)
          .single();

        if (fetchError && fetchError.code !== "PGRST116") {
          // PGRST116 pomeni, da ni najdenega rezultata, kar je OK
          console.error("Napaka pri preverjanju uporabnika:", fetchError.message);
        }

        // 2️⃣ Če še ne obstaja, dodaj v tabelo 'users'
        if (!existingUser) {
          const { error: insertError } = await supabase.from("users").insert([
            {
              id: userId,
              name,
              email,
              password: null, // OAuth uporabnik nima gesla
              created_at: new Date().toISOString(),
            },
          ]);

          if (insertError) {
            console.error("Napaka pri vstavljanju uporabnika:", insertError.message);
          }
        }

        // 3️⃣ Opcijsko shrani id v localStorage ali naprej na session
        localStorage.setItem("user_id", userId);

        // 4️⃣ Preusmeri uporabnika na glavno stran ali dashboard
        router.push("/dogodki");
      } catch (err) {
        console.error("Nepričakovana napaka:", err);
        router.push("/prijava");
      }
    };

    handleOAuth();
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-black text-lg">Prijava v teku… prosimo počakajte.</p>
    </div>
  );
}
