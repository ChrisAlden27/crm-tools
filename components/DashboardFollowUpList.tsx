"use client";

import { useRouter } from "next/navigation";
import CompleteButton from "@/components/CompleteButton";

interface DashboardFollowUpListProps {
  pendingFollowUps: any[];
}

export default function DashboardFollowUpList({ pendingFollowUps: initialFollowUps }: DashboardFollowUpListProps) {
  const router = useRouter();

  const handleRefresh = () => {
    router.refresh();
  };

  return (
    <div className="follow-up-list">
      {initialFollowUps.length === 0 ? (
        <p className="empty-state">No upcoming follow-ups scheduled.</p>
      ) : (
        initialFollowUps.map((fu: any) => (
          <div key={fu.id} className="follow-up-item">
            <div className="fu-content">
              <div className="fu-info">
                <strong>{fu.client.name}</strong>
                <span>{new Date(fu.date).toLocaleDateString()}</span>
              </div>
              <p>{fu.notes || "No notes"}</p>
            </div>
            <CompleteButton id={fu.id} onComplete={handleRefresh} />
          </div>
        ))
      )}
    </div>
  );
}
