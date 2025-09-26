"use client";

import GlobalNavbar from "@/app/components/GlobalNavbar";
import Footer from "@/app/components/Footer";
import Profile from "@/app/components/Profile";

export default function ProfilePage() {
  return (
    <main className="bg-[var(--background)] text-[var(--foreground)] min-h-screen flex flex-col">
      <GlobalNavbar />

      <section className="max-w-5xl mx-auto px-6 py-10 w-full">
        <Profile />
      </section>

      <Footer />
    </main>
  );
}
