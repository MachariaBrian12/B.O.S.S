"use client";

import { useState } from "react";
import { api } from "@/lib/api";

export default function InputPage() {
  const [sales, setSales] = useState("");
  const [expenses, setExpenses] = useState("");
  const [notes, setNotes] = useState("");
  const [token] = useState("demo-token");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setError("");
    setLoading(true);

    try {
      const { insights } = await api.addEntry(token, {
        sales: parseFloat(sales),
        expenses: parseFloat(expenses),
        notes,
      });

      console.log(insights);
    } catch (err) {
      setError("Failed to submit");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Input Page</h1>

      <form onSubmit={submit}>
        <input
          placeholder="Sales"
          value={sales}
          onChange={(e) => setSales(e.target.value)}
        />

        <input
          placeholder="Expenses"
          value={expenses}
          onChange={(e) => setExpenses(e.target.value)}
        />

        <input
          placeholder="Notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Submit"}
        </button>

        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
}
