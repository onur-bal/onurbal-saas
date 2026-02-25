"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  useEffect(() => {
    let ignore = false;

    async function load() {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user) {
        router.replace("/login");
        return;
      }
      if (!ignore) setEmail(data.user.email || "");
    }

    load();
    return () => {
      ignore = true;
    };
  }, [router]);

  async function logout() {
    await supabase.auth.signOut();
    router.replace("/login");
  }

  return (
    <main style={{ maxWidth: 720, margin: "0 auto" }}>
      <h1>Dashboard</h1>
      <p>Giriş yapan kullanıcı: <b>{email || "..."}</b></p>

      <button onClick={logout} style={{ padding: 12, marginTop: 12 }}>
        Çıkış Yap
      </button>
    </main>
  );
}
