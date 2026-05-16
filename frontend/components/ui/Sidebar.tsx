"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, MapPin, BarChart3, AlertTriangle, TrendingUp, Menu 
} from "lucide-react";

const sidebarLinks = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/devices", label: "Devices", icon: MapPin },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/predictions", label: "Predictions", icon: TrendingUp },
  { href: "/alerts", label: "Alerts", icon: AlertTriangle },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className={`bg-brand-dark text-white w-64 ${sidebarOpen ? "block" : "hidden"} md:block transition-all`}>
        <div className="p-4 font-bold text-2xl flex items-center gap-2">
          <span className="text-brand-green">Hewa</span>Guard
        </div>
        <nav className="mt-8">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 hover:bg-brand-blue transition-colors ${
                  isActive ? "bg-brand-blue font-semibold" : ""
                }`}
              >
                <Icon size={20} />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm p-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-2 rounded hover:bg-gray-100"
          >
            <Menu size={24} />
          </button>
          <h2 className="text-xl font-semibold text-brand-dark">HewaGuard Uganda</h2>
          <div className="w-8" /> {/* spacer */}
        </header>
        <main className="p-6 flex-1">{children}</main>
      </div>
    </div>
  );
}