"use client";

import { useState, useEffect } from "react";
import GlobalNavbar from "@/app/components/GlobalNavbar";
import Footer from "@/app/components/Footer";
import RideCard from "@/app/components/RideCard";
import OfferRideModal from "../offer/page";

export default function DriverDashboard()
{
  const [showOffer, setShowOffer] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [activeOffers, setActiveOffers] = useState([]);
  const [fullName, setFullName] = useState("User");
  const [department, setDepartment] = useState("Transport Department");

  useEffect(() =>
  {
    try
    {
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      const userInfo = storedUser?.user || {};
      if (userInfo.fullName) setFullName(userInfo.fullName);
      if (userInfo.department) setDepartment(userInfo.department);
    } catch (err)
    {
      console.error("Error parsing user data:", err);
    }
  }, []);

  const pastOffers = [
    {
      id: 1,
      name: fullName,
      dept: department,
      pickup: "Bank Alfalah BA Building",
      drop: "Admin Building",
      time: "5:30 PM",
      status: "Completed",
    },
    {
      id: 2,
      name: fullName,
      dept: department,
      pickup: "Clifton Block 5",
      drop: "Main Office",
      time: "8:30 AM",
      status: "Completed",
    },
  ];

  // ✅ FIXED handleSuccess
  const handleSuccess = (form) =>
  {
    const newOffer = {
      id: Date.now(),
      name: fullName,
      dept: department,
      pickup: form.pickup || "Not specified",
      drop: form.drop || "Not specified",
      seats: form.seats || "Not specified",
      ac: form.ac === "yes" ? "AC" : "Non-AC",
      date: form.date || "Not specified",
      time: form.time || "Not specified",
      notes: form.notes || "",
      pickupCoords: form.pickupCoords || null,
      dropCoords: form.dropCoords || null,
      status: "Pending",
    };

    setActiveOffers((prev) => [...prev, newOffer]);
    setSuccessMessage("✅ Ride offered successfully!");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const handleCancel = (id) =>
  {
    setActiveOffers((prev) => prev.filter((offer) => offer.id !== id));
    setSuccessMessage("❌ Ride offer cancelled.");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  return (
    <main className="bg-[var(--background)] text-[var(--foreground)] min-h-screen flex flex-col">
      <GlobalNavbar />

      <section className="max-w-5xl mx-auto px-6 py-10 w-full space-y-8">
        {successMessage && (
          <div className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-md text-center">
            {successMessage}
          </div>
        )}

        <div className="bg-[var(--card)] rounded-2xl p-6 shadow-soft">
          <h2 className="text-2xl font-bold">
            Welcome <span className="text-[var(--accent)]">{fullName} 👋</span>
          </h2>
          <p className="mt-1 text-sm text-[var(--muted)]">{department}</p>
          <p className="mt-2 text-[var(--muted)]">
            Want to request a ride instead?{" "}
            <button className="text-[var(--accent)] font-semibold hover:underline">
              Switch to Rider?
            </button>
          </p>
        </div>

        <div className="flex justify-center">
          <button
            className="btn-primary px-8 py-3 text-lg flex items-center gap-2"
            onClick={() => setShowOffer(true)}
          >
            🚘 Offer a Ride
          </button>
        </div>

        {/* Active Offers */}
        <div>
          <h3 className="text-xl font-bold mb-4">My Ride Offers</h3>
          {activeOffers.length === 0 ? (
            <div className="bg-[var(--card)] rounded-xl p-6 text-center text-[var(--muted)]">
              <div className="text-4xl mb-2">🚗</div>
              <p>No Active Offers</p>
              <p className="text-sm mt-1">
                You don’t have any active ride offers at the moment.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {activeOffers.map((offer) => (
                <RideCard
                  key={offer.id}
                  ride={offer}
                  role="driver"
                  onCancel={handleCancel}
                />
              ))}
            </div>
          )}
        </div>

        {/* Past Offers */}
        <div>
          <h3 className="text-xl font-bold mb-4">Past Offers</h3>
          <div className="flex flex-col gap-4">
            {pastOffers.map((offer) => (
              <RideCard key={offer.id} ride={offer} role="driver" />
            ))}
          </div>
        </div>
      </section>

      <Footer />

      <OfferRideModal
        isOpen={showOffer}
        onClose={() => setShowOffer(false)}
        onSuccess={handleSuccess}
      />
    </main>
  );
}
