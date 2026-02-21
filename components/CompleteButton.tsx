"use client";

import { useState } from "react";

interface CompleteButtonProps {
  id: string;
  onComplete?: () => void;
}

export default function CompleteButton({ id, onComplete }: CompleteButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleComplete = async () => {
    if (!confirm("Are you sure you want to mark this follow-up as completed?")) return;
    
    setLoading(true);
    try {
      const res = await fetch("/api/followups/status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: "completed" }),
      });

      if (res.ok) {
        if (onComplete) onComplete();
      } else {
        alert("Failed to update status");
      }
    } catch (error) {
      alert("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleComplete} 
      disabled={loading}
      className="btn-complete"
      title="Mark as completed"
    >
      {loading ? "..." : "✓"}
    </button>
  );
}
