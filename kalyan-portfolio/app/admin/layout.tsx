import type { Metadata } from "next";
import { Sidebar } from "@/components/admin/Sidebar";

export const metadata: Metadata = {
  title: "Admin — Portfolio CMS",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-bg text-text">
      <Sidebar />
      <div className="flex-1 min-w-0">
        <main className="p-4 sm:p-6 lg:p-10 max-w-4xl">{children}</main>
      </div>
    </div>
  );
}
