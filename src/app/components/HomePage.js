"use client";

import { useRouter } from "next/navigation";
import { Car, User } from "lucide-react";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function HomePage() {
  const router = useRouter();

  return (
    <main className="bg-[var(--background)] text-[var(--foreground)]">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[var(--background)] to-[var(--card)]">
        <div className="container mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
              Welcome to <span className="text-[var(--accent)]">Alfamily</span>
            </h1>
            <p className="text-lg text-[var(--muted)] max-w-lg">
              The internal ride-sharing platform for{" "}
              <span className="font-semibold text-white">Bank Alfalah</span>{" "}
              employees. Seamlessly connect with colleagues, offer or request
              rides, and make your daily commute smarter.
            </p>

            <div className="flex gap-4 mt-6">
                        <button
            onClick={() => router.push("/auth/signup/driver")}
            className="px-6 py-3 rounded-xl font-semibold bg-[var(--accent)] text-[var(--background)] hover:bg-yellow-400 transition flex items-center gap-2"
            >
            <Car className="w-5 h-5" /> Register as Driver
            </button>

            <button
            onClick={() => router.push("/auth/signup/rider")}
            className="px-6 py-3 rounded-xl font-semibold border border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-[var(--background)] transition flex items-center gap-2"
            >
            <User className="w-5 h-5" /> Register as Rider
            </button>

            </div>
          </div>

          {/* Right image */}
          <div className="hidden md:block">
            <img
              src="/images/ride-sharing-illustration.png"
              alt="Ride Sharing"
              className="rounded-2xl shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-16 text-center">
        <h2 className="text-3xl font-bold mb-10">
          Why Use <span className="text-[var(--accent)]">Alfamily?</span>
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6 bg-[var(--card)] rounded-2xl shadow-soft">
            <h3 className="text-xl font-semibold mb-2">Secure Login</h3>
            <p className="text-[var(--muted)]">
              Employees sign up with official email + OTP for complete security.
            </p>
          </div>
          <div className="p-6 bg-[var(--card)] rounded-2xl shadow-soft">
            <h3 className="text-xl font-semibold mb-2">Smart Matching</h3>
            <p className="text-[var(--muted)]">
              Riders and drivers are matched automatically based on route &
              timing.
            </p>
          </div>
          <div className="p-6 bg-[var(--card)] rounded-2xl shadow-soft">
            <h3 className="text-xl font-semibold mb-2">Eco-Friendly</h3>
            <p className="text-[var(--muted)]">
              Reduce traffic and carbon footprint while saving travel costs.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}
