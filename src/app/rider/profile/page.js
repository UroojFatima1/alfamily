"use client";

import { useEffect, useState } from "react";
import GlobalNavbar from "@/app/components/GlobalNavbar";
import Footer from "@/app/components/Footer";
import Profile from "@/app/components/Profile";

export default function ProfilePage()
{
  const [user, setUser] = useState(null);

  useEffect(() =>
  {
    const storedUser = localStorage.getItem("user");
    if (storedUser)
    {
      const parsed = JSON.parse(storedUser);
      setUser(parsed.user || parsed);
    }
  }, []);

  if (!user)
  {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p>Loading profile...</p>
      </main>
    );
  }

  return (
    <main className="bg-[var(--background)] text-[var(--foreground)] min-h-screen flex flex-col">
      <GlobalNavbar />
      <section className="max-w-5xl mx-auto px-6 py-10 w-full">
        <Profile user={user} initialRole={user.role} />
      </section>
      <Footer />
    </main>
  );
}
