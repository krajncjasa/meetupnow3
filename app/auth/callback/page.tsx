"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function OAuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleOAuth = async () => {
      try {
        // Supabase bo prebral access_token iz URL hash (#access_token=...)
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error("OAuth napaka:", error.message);
          router.push("/prijava");
          return;
        }

        if (session?.user) {
          const userId = session.user.id;
          const email = session.user.email;
          const name = session.user.user_metadata?.full_name || session.user.user_metadata?.user_name || "GitHub User";

          // Dodaj uporabnika v tabelo users, če še ne obstaja
          const { data: existingUser } = await supabase
            .from("users")
            .select("*")
            .eq("id", userId)
            .single();

          if (!existingUser) {
            await supabase.from("users").insert([
              {
                id: userId,
                name,
                email,
                password: "", // OAuth uporabnik nima gesla
                created_at: new Date().toISOString(),
              },
            ]);
          }

          localStorage.setItem("user_id", userId);

          router.push("/dogodki"); // ali /admin, če je admin
        } else {
          router.push("/prijava");
        }
      } catch (err) {
        console.error(err);
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
