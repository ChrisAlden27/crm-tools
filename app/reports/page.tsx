import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function ReportsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  // Get some high-level stats for reports
  const totalClients = await prisma.client.count({
    where: { userId: session.user.id },
  });

  const totalFollowUps = await prisma.followUp.count({
    where: { userId: session.user.id },
  });

  const completedFollowUps = await prisma.followUp.count({
    where: { 
      userId: session.user.id,
      status: "completed"
    },
  });

  const completionRate = totalFollowUps > 0 
    ? Math.round((completedFollowUps / totalFollowUps) * 100) 
    : 0;

  return (
    <main className="page-layout">
      <Navbar />
      <div className="container reports-container">
        <header className="page-header animate-fade-in">
          <h1>Reports & Analytics</h1>
          <p>Overview of your CRM activity and performance.</p>
        </header>

        <div className="reports-grid animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <div className="card report-card">
            <h3>Growth Metrics</h3>
            <div className="metric-item">
              <span>Total Clients</span>
              <strong>{totalClients}</strong>
            </div>
            <div className="metric-item">
              <span>Total Interactions</span>
              <strong>{totalFollowUps}</strong>
            </div>
          </div>

          <div className="card report-card">
            <h3>Efficiency</h3>
            <div className="metric-item">
              <span>Completion Rate</span>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${completionRate}%` }}></div>
              </div>
              <strong>{completionRate}%</strong>
            </div>
          </div>

          <div className="card report-card full-width">
            <h3>Recent Activity</h3>
            <table className="report-table">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Action</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {/* We can fetch and map recent followups here if needed */}
                <tr className="empty-row">
                  <td colSpan={4}>Detailed activity tracking coming soon...</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="page-actions animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <Link href="/" className="btn-secondary">Back to Dashboard</Link>
        </div>
      </div>
    </main>
  );
}
