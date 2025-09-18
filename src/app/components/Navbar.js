"use client";

import { Car } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="bg-[var(--card)] shadow-soft sticky top-0 z-50">
      <nav className="container mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Car className="w-6 h-6 text-[var(--accent)]" />
          <span className="font-bold text-lg">Alfamily</span>
        </Link>

        {/* Links */}
        <div className="hidden md:flex gap-6 text-sm font-medium">
        
          <Link href="/auth/login" className="hover:text-[var(--accent)]">
            Login
          </Link>
          <Link href="/rides/request" className="hover:text-[var(--accent)]">
            Request Ride
          </Link>
          <Link href="/rides/offer" className="hover:text-[var(--accent)]">
            Offer Ride
          </Link>
        </div>
      </nav>
    </header>
  );
}
