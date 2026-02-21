"use client";

import { useTheme } from "@/app/providers";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { data: session } = useSession();

  return (
    <nav className="navbar">
      <div className="container nav-content">
        <Link href="/" className="brand">
          CRM<span>Tool</span>
        </Link>
        <div className="nav-actions">
          <button onClick={toggleTheme} className="theme-btn" title="Toggle Theme">
            {theme === "light" ? "🌙" : "☀️"}
          </button>
          <div className="user-menu">
            <span className="user-name">{session?.user?.name}</span>
            <button onClick={() => signOut()} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
      </div>

    </nav>
  );
}
