"use client";
import { useEffect, useState, useCallback } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const [dark, setDark] = useState<boolean | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = stored === "dark" || (!stored && prefersDark);
    setDark(isDark);
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggle = useCallback(() => {
    setDark((prev) => {
      const newDark = !prev;
      if (newDark) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
      return newDark;
    });
  }, []);


  if (dark === null) return null;

  return (
    <button
      onClick={toggle}
      className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
      aria-label="Toggle dark mode"
    >
      {dark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}