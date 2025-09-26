"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function GlobalNavbar() {
  const router = useRouter();

  const handleLogout = () => {

    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <header className="bg-[var(--card)] shadow-soft sticky top-0 z-50">
      <nav className="container mx-auto flex items-center justify-between px-6 py-4">
        {/* Left side - Logo */}
        <Link href="/home" className="text-lg font-bold text-[var(--primary)]">
          RideApp
        </Link>

        {/* Right side - Navigation Links */}
        <div className="flex items-center gap-6">
          <Link href="/home" className="hover:text-[var(--primary)]">
            Home
          </Link>
          <Link href="/rides" className="hover:text-[var(--primary)]">
            Rides
          </Link>
          <Link href="/profile" className="hover:text-[var(--primary)]">
            Profile
          </Link>
          <button
            onClick={handleLogout}
            className="text-red-500 hover:text-red-600"
          >
            Logout
          </button>
        </div>
      </nav>
    </header>
  );
}
