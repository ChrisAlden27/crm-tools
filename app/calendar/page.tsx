"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CompleteButton from "@/components/CompleteButton";

interface FollowUp {
  id: string;
  date: string;
  notes: string;
  client: {
    name: string;
  };
}

export default function CalendarPage() {
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchFollowUps = () => {
    setLoading(true);
    fetch("/api/followups/list")
      .then((res) => res.json())
      .then((data) => {
        setFollowUps(data.filter((f: any) => f.status === "scheduled"));
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchFollowUps();
  }, []);

  // Group follow-ups by date
  const grouped = followUps.reduce((acc, curr) => {
    const date = new Date(curr.date).toLocaleDateString();
    if (!acc[date]) acc[date] = [];
    acc[date].push(curr);
    return acc;
  }, {} as Record<string, FollowUp[]>);

  return (
    <div className="page-layout">
      <Navbar />
      <div className="container calendar-container animate-fade-in">
        <header className="page-header">
          <h1>Follow-up Calendar</h1>
          <Link href="/clients" className="btn-primary">Schedule New</Link>
        </header>

        <div className="calendar-grid">
          {loading ? (
            <p>Loading your schedule...</p>
          ) : Object.keys(grouped).length === 0 ? (
            <div className="card empty-state">
              <p>No follow-ups scheduled yet.</p>
            </div>
          ) : (
            Object.keys(grouped).sort((a, b) => new Date(a).getTime() - new Date(b).getTime()).map((date) => (
              <div key={date} className="date-group">
                <h3 className="date-header">{date}</h3>
                <div className="followup-cards">
                  {grouped[date].map((fu) => (
                    <div key={fu.id} className="card followup-item-card">
                      <div className="fu-card-content">
                        <div className="card-header">
                          <strong>{fu.client.name}</strong>
                        </div>
                        <p>{fu.notes || "No notes provided"}</p>
                      </div>
                      <CompleteButton id={fu.id} onComplete={fetchFollowUps} />
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}
