"use client";

import { useEffect, useState } from "react";
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

  useEffect(() => {
    async function loadUser() {
      const { data } = await supabase.auth.getUser();
      if (!data?.user) {
        router.replace("/login");
        return;
      }
      setEmail(data.user.email);
      setUserId(data.user.id);
      fetchTransactions(data.user.id);
    }
    loadUser();
  }, []);

  async function fetchTransactions(uid) {
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", uid)
      .order("created_at", { ascending: false });

    if (!error) setTransactions(data);
  }

  async function addTransaction(e) {
    e.preventDefault();

    const { error } = await supabase.from("transactions").insert([
      {
        user_id: userId,
        amount: parseFloat(amount),
        type,
        note,
      },
    ]);

    if (!error) {
      setAmount("");
      setNote("");
      fetchTransactions(userId);
    }
  }

  const total = transactions.reduce((sum, t) => {
    return t.type === "income"
      ? sum + Number(t.amount)
      : sum - Number(t.amount);
  }, 0);

  return (
    <main>
      <h1>Dashboard</h1>
      <p>Hoşgeldin: {email}</p>

      <h2>Toplam Bakiye: {total} ₺</h2>

      <form onSubmit={addTransaction}>
        <input
          type="number"
          placeholder="Tutar"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />

        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="income">Gelir</option>
          <option value="expense">Gider</option>
        </select>

        <input
          type="text"
          placeholder="Açıklama"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        <button type="submit">Ekle</button>
      </form>

      <h3>Kayıtlar</h3>
      <ul>
        {transactions.map((t) => (
          <li key={t.id}>
            {t.type === "income" ? "+" : "-"} {t.amount} ₺ - {t.note}
          </li>
        ))}
      </ul>
    </main>
  );
}"use client";

import { useEffect, useState } from "react";
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

  useEffect(() => {
    async function loadUser() {
      const { data } = await supabase.auth.getUser();
      if (!data?.user) {
        router.replace("/login");
        return;
      }
      setEmail(data.user.email);
      setUserId(data.user.id);
      fetchTransactions(data.user.id);
    }
    loadUser();
  }, []);

  async function fetchTransactions(uid) {
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", uid)
      .order("created_at", { ascending: false });

    if (!error) setTransactions(data);
  }

  async function addTransaction(e) {
    e.preventDefault();

    const { error } = await supabase.from("transactions").insert([
      {
        user_id: userId,
        amount: parseFloat(amount),
        type,
        note,
      },
    ]);

    if (!error) {
      setAmount("");
      setNote("");
      fetchTransactions(userId);
    }
  }

  const total = transactions.reduce((sum, t) => {
    return t.type === "income"
      ? sum + Number(t.amount)
      : sum - Number(t.amount);
  }, 0);

  return (
    <main>
      <h1>Dashboard</h1>
      <p>Hoşgeldin: {email}</p>

      <h2>Toplam Bakiye: {total} ₺</h2>

      <form onSubmit={addTransaction}>
        <input
          type="number"
          placeholder="Tutar"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />

        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="income">Gelir</option>
          <option value="expense">Gider</option>
        </select>

        <input
          type="text"
          placeholder="Açıklama"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        <button type="submit">Ekle</button>
      </form>

      <h3>Kayıtlar</h3>
      <ul>
        {transactions.map((t) => (
          <li key={t.id}>
            {t.type === "income" ? "+" : "-"} {t.amount} ₺ - {t.note}
          </li>
        ))}
      </ul>
    </main>
  );
}
