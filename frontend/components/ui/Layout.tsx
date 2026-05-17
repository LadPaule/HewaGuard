"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, MapPin, BarChart3, AlertTriangle, TrendingUp, Menu,
} from "lucide-react";
import ThemeToggle from "./ThemeToggle";

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
    <div className="min-h-screen flex">
      <aside
        className={`bg-brand-dark text-white w-64 ${
          sidebarOpen ? "block" : "hidden"
        } md:block transition-all`}
      >
        <div className="p-4 flex items-center gap-2">
          <Image
            src="/logo2.png"
            alt="HewaGuard Logo"
            width={90}
            height={90}
            priority
            style={{ width: "auto", height: "auto", alignSelf: "center" }}
          />
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
      <div className="flex-1 flex flex-col bg-white dark:bg-gray-900 transition-colors">
        <header className="bg-gray-100 dark:bg-gray-800 shadow-sm p-4 flex items-center justify-between transition-colors">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <Menu size={24} />
          </button>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            HewaGuard
          </h2>
          <ThemeToggle />
        </header>
        <main className="p-6 flex-1 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
          {children}
        </main>
      </div>
    </div>
  );
}