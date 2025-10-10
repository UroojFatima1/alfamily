"use client";

import { useState, useEffect } from "react";
import GlobalNavbar from "@/app/components/GlobalNavbar";
import Footer from "@/app/components/Footer";
import RideCard from "@/app/components/RideCard";
import RideRequestModal from "../request/page";

export default function RiderDashboard() {
  const [showRequest, setShowRequest] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [activeRequests, setActiveRequests] = useState([]);
  const [fullName, setFullName] = useState("User");
  const [department, setDepartment] = useState("IT Department");

  useEffect(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      const userInfo = storedUser?.user || {};
      if (userInfo.fullName) setFullName(userInfo.fullName);
      if (userInfo.department) setDepartment(userInfo.department);
    } catch (err) {
      console.error("Error parsing user data:", err);
    }
  }, []);

  const pastRides = [
    {
      id: 1,
      name: fullName,
      dept: "IT Department",
      pickup: "Admin Building",
      drop: "Bank Alfalah BA Building",
      time: "1:15 PM",
      status: "Completed",
    },
    {
      id: 2,
      name: fullName,
      dept: "Finance",
      pickup: "Main Office",
      drop: "Clifton Block 5",
      time: "5:45 PM",
      status: "Completed",
    },
  ];

  const handleSuccess = (rideForm) => {
    const newRide = {
      id: Date.now(),
      name: fullName || "User",
      dept: department || "IT Department",
      pickup: rideForm?.pickupLocation?.address || "Not specified",
      drop: rideForm?.dropLocation?.address || "Not specified",
      pickupCoords: rideForm?.pickupLocation || null,
      dropCoords: rideForm?.dropLocation || null,
      time: new Date(rideForm?.dateTime).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      status: "Pending",
    };

    setActiveRequests((prev) => [...prev, newRide]);
    setSuccessMessage("✅ Ride request created successfully!");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const handleCancel = (id) => {
    setActiveRequests((prev) => prev.filter((ride) => ride.id !== id));
    setSuccessMessage("❌ Ride request cancelled.");
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

        {/* Welcome Section */}
        <div className="bg-[var(--card)] rounded-2xl p-6 shadow-soft">
          <h2 className="text-2xl font-bold">
            Welcome <span className="text-[var(--accent)]">{fullName} 👋</span>
          </h2>
          <p className="mt-1 text-sm text-[var(--muted)]">{department}</p>
          <p className="mt-2 text-[var(--muted)]">
            Ready for your next ride?{" "}
            <button className="text-[var(--accent)] font-semibold hover:underline">
              Switch to Driver?
            </button>
          </p>
        </div>

        {/* Request Button */}
        <div className="flex justify-center">
          <button
            className="btn-primary px-8 py-3 text-lg flex items-center gap-2"
            onClick={() => setShowRequest(true)}
          >
            🚗 Request a Ride
          </button>
        </div>

        {/* Active Rides */}
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
            <div className="flex flex-col gap-4">
              {activeRequests.map((ride) => (
                <RideCard
                  key={ride.id}
                  ride={ride}
                  role="rider"
                  onCancel={handleCancel}
                />
              ))}
            </div>
          )}
        </div>

        {/* Past Rides */}
        <div>
          <h3 className="text-xl font-bold mb-4">Past Rides</h3>
          <div className="flex flex-col gap-4">
            {pastRides.map((ride) => (
              <RideCard key={ride.id} ride={ride} role="rider" />
            ))}
          </div>
        </div>
      </section>

      <Footer />

      <RideRequestModal
        isOpen={showRequest}
        onClose={() => setShowRequest(false)}
        onSuccess={handleSuccess}
      />
    </main>
  );
}
