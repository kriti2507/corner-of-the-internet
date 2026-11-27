import type { Metadata } from "next";
import { AdminPanel } from "@/components/admin-panel";

export const metadata: Metadata = { title: "Notebook admin", robots: { index: false, follow: false } };

export default function AdminPage() {
  return (
    <div className="wrap admin">
      <h1 style={{ fontSize: "var(--step-3)" }}>Notebook admin</h1>
      <p style={{ color: "var(--muted)", marginTop: "0.4rem" }}>Every note across the site, newest first. Remove spam or reply as Kriti.</p>
      <AdminPanel />
    </div>
  );
}
