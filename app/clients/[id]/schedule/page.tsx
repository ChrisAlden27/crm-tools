"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

interface Client {
  id: string;
  name: string;
}

export default function ScheduleFollowUpPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [client, setClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState({
    date: "",
    objective: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    // In a real app, you'd fetch specific client data or pass it via state
    // For now, we'll fetch all clients and find the one we need
    fetch("/api/clients")
      .then((res) => res.json())
      .then((data) => {
        const found = data.find((c: Client) => c.id === id);
        setClient(found);
      });
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/followups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId: id,
          date: formData.date,
          objective: formData.objective,
          notes: formData.notes,
        }),
      });

      if (res.ok) {
        router.push("/");
      } else {
        const data = await res.json();
        setError(data.error || "Failed to schedule follow-up");
      }
    } catch {
      setError("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (!client) return <div className="loading">Loading...</div>;

  return (
    <div className="page-layout">
      <Navbar />
      <div className="container form-container animate-fade-in">
        <header className="page-header">
          <h1>Schedule Follow-up</h1>
          <p>For client: <strong>{client.name}</strong></p>
        </header>

        <div className="card">
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleSubmit} className="followup-form">
            <div className="form-group">
              <label>Follow-up Date *</label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Objective *</label>
              <input
                type="text"
                required
                value={formData.objective}
                onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
                placeholder="e.g., Send quotation, Project update..."
              />
            </div>
            <div className="form-group">
              <label>Additional Notes</label>
              <textarea
                rows={4}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Any other details..."
              ></textarea>
            </div>
            <div className="form-actions">
              <button type="button" onClick={() => router.back()} className="btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? "Scheduling..." : "Schedule Reminder"}
              </button>
            </div>
          </form>
        </div>
      </div>

    </div>
  );
}
