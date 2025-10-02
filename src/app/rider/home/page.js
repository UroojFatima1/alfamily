"use client";

import { useState } from "react";
import GlobalNavbar from "@/app/components/GlobalNavbar";
import Footer from "@/app/components/Footer";
import RideCard from "@/app/components/RideCard";
import RideRequestModal from "../request/page";

export default function RiderDashboard() {
  const [showRequest, setShowRequest] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [activeRequests, setActiveRequests] = useState([]); // ✅ now in state

  const pastRides = [
    { id: 1, name: "Mike Wilson", dept: "IT Department", pickup: "Admin Building", drop: "Bank Alfalah BA building", time: "1:15 PM", status: "Completed" },
    { id: 2, name: "Mike Wilson", dept: "IT Department", pickup: "Admin Building", drop: "Bank Alfalah BA building", time: "1:15 PM", status: "Completed" },
  ];

  // ✅ Handle ride request success
  const handleSuccess = (rideForm) => {
    const newRide = {
      id: Date.now(),
      name: "Sarah Johnson", // later can come from logged-in user
      dept: "IT Department",
      pickup: rideForm.pickup,
      drop: rideForm.drop,
      time: rideForm.time,
      status: "Pending",
    };

    setActiveRequests((prev) => [...prev, newRide]); // add ride
    setSuccessMessage("✅ Ride request created successfully!");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  return (
    <main className="bg-[var(--background)] text-[var(--foreground)] min-h-screen flex flex-col">
      <GlobalNavbar />

      <section className="max-w-5xl mx-auto px-6 py-10 w-full space-y-8">
        {/* ✅ Success Message */}
        {successMessage && (
          <div className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-md text-center">
            {successMessage}
          </div>
        )}

        {/* Welcome */}
        <div className="bg-[var(--card)] rounded-2xl p-6 shadow-soft">
          <h2 className="text-2xl font-bold">
            Welcome <span className="text-[var(--accent)]">Sarah 👋</span>
          </h2>
          <p className="mt-2 text-[var(--muted)]">
            Ready for your next ride?{" "}
            <button className="text-[var(--accent)] font-semibold hover:underline">
              Switch to Driver?
            </button>
          </p>
        </div>

        {/* Request a Ride Button */}
        <div className="flex justify-center">
          <button
            className="btn-primary px-8 py-3 text-lg flex items-center gap-2"
            onClick={() => setShowRequest(true)}
          >
            🚗 Request a Ride
          </button>
        </div>

        {/* Active Requests */}
        <div>
          <h3 className="text-xl font-bold mb-4">My Ride Requests</h3>
          {activeRequests.length === 0 ? (
            <div className="bg-[var(--card)] rounded-xl p-6 text-center text-[var(--muted)]">
              <div className="text-4xl mb-2">🚘</div>
              <p>No Active Requests</p>
              <p className="text-sm mt-1">
                You don’t have any active ride requests at the moment.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {activeRequests.map((ride) => (
                <RideCard key={ride.id} ride={ride} role="rider" />
              ))}
            </div>
          )}
        </div>

        {/* Past Rides */}
        <div>
          <h3 className="text-xl font-bold mb-4">Past Rides</h3>
          <div className="space-y-4">
            {pastRides.map((ride) => (
              <RideCard key={ride.id} ride={ride} role="rider" />
            ))}
          </div>
        </div>
      </section>

      <Footer />

      {/* Ride Request Modal */}
      <RideRequestModal
        isOpen={showRequest}
        onClose={() => setShowRequest(false)}
        onSuccess={handleSuccess} // ✅ add ride to active requests
      />
    </main>
  );
}
