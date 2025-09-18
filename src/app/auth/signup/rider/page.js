"use client";

import Navbar from  "@/app/components/Navbar";
import Footer from  "@/app/components/Footer";

export default function RiderSignup() {
  return (
    <main className="bg-[var(--background)] text-[var(--foreground)] min-h-screen flex flex-col">
      <Navbar />

      {/* Centered Form */}
      <section className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-lg bg-[var(--card)] p-8 rounded-2xl shadow-soft space-y-6">
          <h2 className="text-3xl font-bold text-center">Rider Registration 🙋</h2>
          <p className="text-[var(--muted)] text-center">
            Register as a rider and request rides from colleagues.
          </p>

          <form className="space-y-4">
            <input type="text" placeholder="Full Name" className="input" />
            <input type="email" placeholder="Official Email" className="input" />
            <input type="tel" placeholder="Mobile Number" className="input" />
            <input type="text" placeholder="Department" className="input" />
            <input type="text" placeholder="Designation" className="input" />
            <input type="password" placeholder="Password" className="input" />
            <input type="password" placeholder="Confirm Password" className="input" />

            <button type="submit" className="btn-primary">Submit</button>
          </form>
        </div>
      </section>

      <Footer />
    </main>
  );
}
