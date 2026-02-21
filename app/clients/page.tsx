"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  category: string;
  status: string;
  statusNotes: string;
  createdAt: string;
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"Prospect" | "Member">("Prospect");

  useEffect(() => {
    fetch("/api/clients")
      .then((res) => res.json())
      .then((data) => {
        setClients(data);
        setLoading(false);
      });
  }, []);

  const filteredClients = clients.filter((c) => (c.category || "Prospect") === activeTab);

  return (
    <div className="page-layout">
      <Navbar />
      <div className="container clients-container animate-fade-in">
        <header className="page-header">
          <h1>Clients</h1>
          <Link href="/clients/new" className="btn-primary">
            + New Client
          </Link>
        </header>

        <div className="tabs-container">
          <button 
            className={`tab-btn ${activeTab === "Prospect" ? "active" : ""}`}
            onClick={() => setActiveTab("Prospect")}
          >
            Prospects
          </button>
          <button 
            className={`tab-btn ${activeTab === "Member" ? "active" : ""}`}
            onClick={() => setActiveTab("Member")}
          >
            Members
          </button>
        </div>

        <div className="card list-card">
          {loading ? (
            <p className="loading-state">Loading clients...</p>
          ) : clients.length === 0 ? (
            <div className="empty-state">
              <p>No clients found.</p>
              <Link href="/clients/new" className="btn-secondary">Add your first client</Link>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="clients-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Company</th>
                    <th>Contact</th>
                    <th>Status</th>
                    <th>Details</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClients.map((client) => (
                    <tr key={client.id}>
                      <td>
                        <strong>{client.name}</strong>
                      </td>
                      <td>{client.company || "-"}</td>
                      <td>
                        <div className="contact-info">
                          <span>{client.email}</span>
                          <span>{client.phone}</span>
                        </div>
                      </td>
                      <td>
                        <span className={`status-badge ${client.status?.toLowerCase().replace(" ", "-") || "active"}`}>
                          {client.status || "Active"}
                        </span>
                      </td>
                      <td>
                        <div className="status-notes-cell">
                          {client.statusNotes ? (
                            <small className="status-note">{client.statusNotes}</small>
                          ) : (
                            <span className="no-note">-</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="actions">
                          <Link href={`/clients/${client.id}/schedule`} className="btn-sm btn-outline">
                            Schedule
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
