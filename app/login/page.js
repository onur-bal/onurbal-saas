"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState("signin"); // signin | signup
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    try {
      if (!email || !password) {
        setMsg("Email ve şifre gerekli.");
        return;
      }

      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMsg("Kayıt başarılı. Email doğrulaması gerekiyorsa mail kutunu kontrol et.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push("/dashboard");
      }
    } catch (err) {
      setMsg(err?.message || "Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ maxWidth: 520, margin: "0 auto" }}>
      <h1>{mode === "signup" ? "Kayıt Ol" : "Giriş Yap"}</h1>

      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12, marginTop: 16 }}>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="onur@ornek.com"
            style={{ width: "100%", padding: 10, marginTop: 6 }}
          />
        </label>

        <label>
          Şifre
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            style={{ width: "100%", padding: 10, marginTop: 6 }}
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          style={{ padding: 12, cursor: loading ? "not-allowed" : "pointer" }}
        >
          {loading ? "İşleniyor..." : mode === "signup" ? "Kayıt Ol" : "Giriş Yap"}
        </button>

        {msg ? <p style={{ margin: 0 }}>{msg}</p> : null}
      </form>

      <div style={{ marginTop: 16 }}>
        {mode === "signup" ? (
          <button onClick={() => setMode("signin")} style={{ padding: 10 }}>
            Zaten hesabım var → Giriş yap
          </button>
        ) : (
          <button onClick={() => setMode("signup")} style={{ padding: 10 }}>
            Hesabım yok → Kayıt ol
          </button>
        )}
      </div>
    </main>
  );
}
