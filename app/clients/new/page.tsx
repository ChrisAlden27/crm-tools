"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function NewClientPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    category: "Prospect",
    status: "Active",
    statusNotes: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push("/clients");
      } else {
        const data = await res.json();
        setError(data.error || "Failed to create client");
      }
    } catch {
      setError("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-layout">
      <Navbar />
      <div className="container form-container animate-fade-in">
        <header className="page-header">
          <h1>Add New Client</h1>
        </header>

        <div className="card">
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleSubmit} className="client-form">
            <div className="form-grid">
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@example.com"
                />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 234 567 890"
                />
              </div>
              <div className="form-group">
                <label>Company</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="Acme Inc."
                />
              </div>
              <div className="form-group">
                <label>Current Status</label>
                <input
                  type="text"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  placeholder="e.g. Active, Busy, Away..."
                />
              </div>
              <div className="form-group">
                <label>Client Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="Prospect">Prospect (Lead)</option>
                  <option value="Member">Member (Regular)</option>
                </select>
              </div>
              <div className="form-group full-width">
                <label>Detailed Status Notes (Travel, Health, etc.)</label>
                <textarea
                  rows={2}
                  value={formData.statusNotes}
                  onChange={(e) => setFormData({ ...formData, statusNotes: e.target.value })}
                  placeholder="e.g. Traveling until next week, Currently unwell..."
                ></textarea>
              </div>
              <div className="form-group full-width">
                <label>Initial Notes</label>
                <textarea
                  rows={4}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Any specific details about the client..."
                ></textarea>
              </div>
            </div>
            <div className="form-actions">
              <button type="button" onClick={() => router.back()} className="btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? "Saving..." : "Save Client"}
              </button>
            </div>
          </form>
        </div>
      </div>

    </div>
  );
}
