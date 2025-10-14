"use client";

import { useState, useEffect } from "react";
import Footer from "@/app/components/Footer";
import RoleSwitcher from "@/app/components/RoleSwitcher";
import DemandSummary from "@/app/components/DemandSummary";
import OfferRideCard from "@/app/components/OfferRideCard";
import RiderRequestList from "@/app/components/RiderRequestList";
import GlobalNavbar from "@/app/components/GlobalNavbar";
import BaseModal from "@/app/components/BaseModal"; // ensure this exists

export default function OfferRides()
{
  const [user, setUser] = useState(null);
  const [requests, setRequests] = useState([]);
  const [popup, setPopup] = useState(null);

  useEffect(() =>
  {
    const storedUser = localStorage.getItem("user");
    if (storedUser)
    {
      const parsed = JSON.parse(storedUser);
      setUser(parsed.user || parsed);
    }

    // initial requests
    setRequests([
      {
        id: 1,
        name: "Emma Davis",
        role: "Marketing Dept.",
        pickup: "Bank Alfalah BA building",
        drop: "Downtown Station",
        status: "Accepted",
      },
      {
        id: 2,
        name: "John Miller",
        role: "Engineering Dept.",
        pickup: "Alfalah Campus Gate",
        drop: "Bank Alfalah BA building",
        status: "Pending",
      },
      {
        id: 3,
        name: "Ali Khan",
        role: "Finance Dept.",
        pickup: "BA Office",
        drop: "Main Boulevard",
        status: "New",
      },
    ]);
  }, []);

  const showPopup = (msg) =>
  {
    setPopup(msg);
    setTimeout(() => setPopup(null), 1500);
  };

  const handleAction = (id, action) =>
  {
    setRequests((prev) =>
      prev.map((r) =>
      {
        if (r.id !== id) return r;
        if (action === "accept") return { ...r, status: "Accepted" };
        if (action === "decline") return { ...r, status: "Declined" };
        if (action === "start") return { ...r, status: "Pending" };
        if (action === "finish") return { ...r, status: "Completed" };
        return r;
      })
    );


    if (action === "accept") showPopup("Ride Accepted ✅");
    else if (action === "decline") showPopup("Ride Declined ❌");
    else if (action === "start") showPopup("Ride Started 🚘");
    else if (action === "finish") showPopup("Ride Completed 🎉");
  };

  if (!user)
  {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p>Loading Rides...</p>
      </main>
    );
  }

  const displayName =
    user.fullname || user.name || user.username || user.firstName || "User";

  const demand = {
    totalRiders: 9,
    matching: 3,
    pending: 2,
    accepted: 1,
  };

  const yourRide = {
    vehicle: "Toyota Camry 2022 - ABC-1234",
    seatsFilled: 2,
    totalSeats: 4,
    bookedRiders: [
      { id: 1, name: "Ahmed", avatar: "/images/avatar.png" },
      { id: 2, name: "Sara", avatar: "/images/avatar2.png" },
    ],
  };

  return (
    <main className="bg-[var(--background)] text-[var(--foreground)] min-h-screen flex flex-col">
      <GlobalNavbar />

      <section className="flex-1 px-6 py-8 space-y-8 max-w-6xl mx-auto w-full">
        {/* Welcome Header */}
        <div>
          <h2 className="text-3xl font-bold">Welcome {displayName} 🚘</h2>
          <p className="text-[var(--muted)] mt-1">Ready for your next ride?</p>
        </div>

        <RoleSwitcher activeRole="driver" />

        <DemandSummary {...demand} />
        <OfferRideCard {...yourRide} />

        {/* Request List */}
        <RiderRequestList requests={requests} onAction={handleAction} />
      </section>

      <Footer />

      {/* Popup Modal */}
      {popup && (
        <BaseModal isOpen={true} onClose={() => setPopup(null)}>
          <div className="text-center text-lg font-semibold p-4">{popup}</div>
        </BaseModal>
      )}
    </main>
  );
}
