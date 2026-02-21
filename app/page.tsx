import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import DashboardFollowUpList from "@/components/DashboardFollowUpList";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const clientCount = await prisma.client.count({
    where: { userId: session.user.id },
  });

  // Fetch follow-ups with status 'scheduled'
  const pendingFollowUps = await prisma.followUp.findMany({
    where: {
      userId: session.user.id,
      status: "scheduled",
    },
    include: { client: true },
    orderBy: { date: "asc" },
    take: 5,
  });

  // Calculate follow-ups completed today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const completedToday = await prisma.followUp.count({
    where: {
      userId: session.user.id,
      status: "completed",
      updatedAt: {
        gte: today,
        lt: tomorrow,
      },
    },
  });

  return (
    <main className="dashboard-layout">
      <Navbar />
      <div className="container dashboard-container">
        <header className="dashboard-header animate-fade-in">
          <h1>Dashboard</h1>
          <Link href="/clients/new" className="btn-primary">
            + Add Client
          </Link>
        </header>

        <section className="stats-grid animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <div className="card stat-card">
            <h3>Total Clients</h3>
            <p className="stat-value">{clientCount}</p>
          </div>
          <div className="card stat-card">
            <h3>Pending Follow-ups</h3>
            <p className="stat-value">{pendingFollowUps.length}</p>
          </div>
          <div className="card stat-card">
            <h3>Completed Today</h3>
            <p className="stat-value">{completedToday}</p>
          </div>
        </section>

        <section className="dashboard-content animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <div className="card follow-up-card">
            <div className="card-header">
              <h2>Upcoming Follow-ups</h2>
              <Link href="/calendar" className="view-all">View Calendar</Link>
            </div>
            <DashboardFollowUpList pendingFollowUps={pendingFollowUps} />
          </div>

          <div className="card quick-actions-card">
            <h2>Quick Actions</h2>
            <div className="action-buttons">
              <Link href="/clients" className="action-btn">Manage Clients</Link>
              <Link href="/calendar" className="action-btn">Schedule Follow-up</Link>
              <Link href="/reports" className="action-btn">View Reports</Link>
            </div>
          </div>
        </section>
      </div>

    </main>
  );
}
