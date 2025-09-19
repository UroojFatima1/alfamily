"use client";

import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import RideCard from "@/app/components/RideCard";

export default function RiderDashboard() {
  const activeRequests = []; // empty = show "No Active Requests"
  const pastRides = [
    {
      id: 1,
      name: "Mike Wilson",
      dept: "IT Department",
      pickup: "Admin Building",
      drop: "Bank Alfalah BA building",
      time: "1:15 PM",
      status: "Completed",
    },
    {
      id: 2,
      name: "Mike Wilson",
      dept: "IT Department",
      pickup: "Admin Building",
      drop: "Bank Alfalah BA building",
      time: "1:15 PM",
      status: "Completed",
    },
  ];

  return (
    <main className="bg-[var(--background)] text-[var(--foreground)] min-h-screen flex flex-col">
      <Navbar />

      <section className="max-w-5xl mx-auto px-6 py-10 w-full space-y-8">
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
          <button className="btn-primary px-8 py-3 text-lg flex items-center gap-2">
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
    </main>
  );
}
