"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Car, Menu, X } from "lucide-react";

export default function GlobalNavbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [role, setRole] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

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
    if (!role) return "/";
    return `/${role}/${page}`;
  };

  const navLinks = [
    { name: "Home", path: getPath("home") },
    { name: "Rides", path: getPath("rides") },
    { name: "Profile", path: getPath("profile") },
  ];

  return (
    <header className="bg-[var(--card)] shadow-soft sticky top-0 z-50">
      <nav className="container mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href={getPath("home")} className="flex items-center gap-2">
          <Car className="w-6 h-6 text-[var(--accent)]" />
          <span className="font-bold text-lg">Alfamily</span>
        </Link>

        {/* Desktop Links */}
        {role && (
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.path}
                className={`link-hover ${
                  pathname === link.path ? "text-yellow-400 font-semibold" : ""
                }`}
              >
                {link.name}
              </Link>
            ))}
            <button onClick={handleLogout} className="logout-hover">
              Logout
            </button>
          </div>
        )}

        {/* Mobile Hamburger */}
        {role && (
          <button
            className="md:hidden text-[var(--accent)]"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        )}
      </nav>

      {/* Mobile Menu */}
      {menuOpen && role && (
        <div className="md:hidden bg-[var(--card)] border-t border-gray-700 px-6 py-4 space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.path}
              onClick={() => setMenuOpen(false)}
              className={`block ${
                pathname === link.path ? "text-yellow-400 font-semibold" : "text-white"
              }`}
            >
              {link.name}
            </Link>
          ))}
          <button
            onClick={() => {
              setMenuOpen(false);
              handleLogout();
            }}
            className="block w-full text-left text-red-500 font-semibold"
          >
            Logout
          </button>
        </div>
      )}
    </header>
  );
}
