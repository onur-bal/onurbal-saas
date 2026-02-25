"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsub = null;

    async function init() {
      const { data } = await supabase.auth.getUser();
      if (!data?.user) {
        router.replace("/login");
        return;
      }
      setEmail(data.user.email || "");
      setLoading(false);

      // Oturum değişirse (logout vs) anında yakala
      const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
        if (!session) router.replace("/login");
      });
      unsub = listener?.subscription;
    }

    init();
    return () => unsub?.unsubscribe?.();
  }, [router]);

  async function logout() {
    await supabase.auth.signOut();
    router.replace("/login");
  }

  if (loading) return <p>Yükleniyor...</p>;

  return (
    <main style={{ maxWidth: 720 }}>
      <h1>Dashboard</h1>
      <p>Giriş yapan kullanıcı: <b>{email}</b></p>

      <div style={{ marginTop: 16, display: "flex", gap: 12 }}>
        <a href="/blog">Blog’a git</a>
        <button onClick={logout} style={{ padding: 10 }}>
          Çıkış Yap
        </button>
      </div>
    </main>
  );
}
