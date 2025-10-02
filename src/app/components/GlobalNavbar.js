"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Car, LogIn } from "lucide-react";

export default function GlobalNavbar() {
  const router = useRouter();
  const [role, setRole] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setRole(parsed.role || null);
      } catch {
        setRole(null);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setRole(null); 
    router.replace("/"); 
  };

  const getPath = (page) => {
    if (!role) return `/`; 
    return `/${role}/${page}`;
  };

  return (
    <header className="bg-[var(--card)] shadow-soft sticky top-0 z-50">
      <nav className="container mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
         <Link href={getPath("home")} className="flex items-center gap-2">
          <Car className="w-6 h-6 text-[var(--accent)]" />
          <span className="font-bold text-lg">Alfamily</span>
        </Link>

        {/* Links only when logged in */}
        {role && (
          <div className="flex items-center gap-6">
            <Link href={getPath("home")} className="link-hover">
              Home
            </Link>
            <Link href={getPath("rides")} className="link-hover">
              Rides
            </Link>
            <Link href={getPath("profile")} className="link-hover">
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="logout-hover"
            >
              Logout
            </button>
          </div>
        )}
      </nav>
    </header>
  );
}
