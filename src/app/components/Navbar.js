"use client";

import { Car, LogIn } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import LoginModal from "./LoginModal";

export default function Navbar() {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <header className="bg-[var(--card)] shadow-soft sticky top-0 z-50">
      <nav className="container mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Car className="w-6 h-6 text-[var(--accent)]" />
          <span className="font-bold text-lg">Alfamily</span>
        </Link>

        {/* Login Button */}
        <button
          onClick={() => setShowLogin(true)}
          className="px-5 py-2 rounded-lg font-semibold border border-[var(--accent)] 
                     text-[var(--accent)] hover:bg-[var(--accent)] 
                     hover:text-[var(--background)] transition flex items-center gap-2"
        >
          <LogIn className="w-4 h-4" /> Login
        </button>
      </nav>

      {/* Login Modal */}
      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
    </header>
  );
}
