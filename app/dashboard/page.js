"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState(null);

  const [amount, setAmount] = useState("");
  const [type, setType] = useState("income");
  const [note, setNote] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    let unsub = null;

    async function init() {
      const { data } = await supabase.auth.getUser();
      if (!data?.user) {
        router.replace("/login");
        return;
      }

      setEmail(data.user.email || "");
      setUserId(data.user.id);

      await fetchTransactions(data.user.id);
      setLoading(false);

      const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
        if (!session) router.replace("/login");
      });
      unsub = listener?.subscription;
    }

    init();
    return () => unsub?.unsubscribe?.();
  }, [router]);

  async function fetchTransactions(uid) {
    setMsg("");
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", uid)
      .order("created_at", { ascending: false });

    if (error) {
      setMsg(error.message);
      return;
    }
    setTransactions(data || []);
  }

  async function addTransaction(e) {
    e.preventDefault();
    setMsg("");

    if (!userId) return;
    const n = Number(amount);
    if (!Number.isFinite(n) || n <= 0) {
      setMsg("Tutar 0'dan büyük olmalı.");
      return;
    }

    const { error } = await supabase.from("transactions").insert([
      { user_id: userId, amount: n, type, note }
    ]);

    if (error) {
      setMsg(error.message);
      return;
    }

    setAmount("");
    setNote("");
    await fetchTransactions(userId);
  }

  const total = useMemo(() => {
    return transactions.reduce((sum, t) => {
      const a = Number(t.amount) || 0;
      return t.type === "income" ? sum + a : sum - a;
    }, 0);
  }, [transactions]);

  async function logout() {
    await supabase.auth.signOut();
    router.replace("/login");
  }

  if (loading) return <p>Yükleniyor...</p>;

  return (
    <main style={{ maxWidth: 780 }}>
      <h1>Dashboard</h1>
      <p>Giriş yapan kullanıcı: <b>{email}</b></p>

      <h2>Toplam Bakiye: {total} ₺</h2>

      <form onSubmit={addTransaction} style={{ display: "grid", gap: 10, marginTop: 16 }}>
        <input
          type="number"
          step="0.01"
          placeholder="Tutar"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          style={{ padding: 10 }}
        />

        <select value={type} onChange={(e) => setType(e.target.value)} style={{ padding: 10 }}>
          <option value="income">Gelir</option>
          <option value="expense">Gider</option>
        </select>

        <input
          type="text"
          placeholder="Açıklama (opsiyonel)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          style={{ padding: 10 }}
        />

        <button type="submit" style={{ padding: 12 }}>
          Ekle
        </button>

        {msg ? <p style={{ margin: 0 }}>{msg}</p> : null}
      </form>

      <div style={{ marginTop: 12 }}>
        <button onClick={logout} style={{ padding: 10 }}>
          Çıkış Yap
        </button>
      </div>

      <h3 style={{ marginTop: 24 }}>Kayıtlar</h3>
      <ul>
        {transactions.map((t) => (
          <li key={t.id}>
            {t.type === "income" ? "+" : "-"} {t.amount} ₺ {t.note ? `- ${t.note}` : ""}
          </li>
        ))}
      </ul>
    </main>
  );
}
