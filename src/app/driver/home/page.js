"use client";

import GlobalNavbar from "@/app/components/GlobalNavbar";
import Footer from "@/app/components/Footer";
import RideCard from "@/app/components/RideCard";

export default function DriverDashboard() {
  const rideRequests = [
    {
      id: 1,
      name: "John Miller",
      dept: "Engineering Dept.",
      pickup: "Main Campus Gate",
      drop: "Bank Alfalah BA building",
      time: "2:30 PM",
      status: "Pending",
    },
    {
      id: 2,
      name: "Emma Davis",
      dept: "Marketing Dept.",
      pickup: "Main Campus Gate",
      drop: "Downtown Station",
      time: "4:00 PM",
      status: "Accepted",
    },
    {
      id: 3,
      name: "Mike Wilson",
      dept: "IT Department",
      pickup: "Admin Building",
      drop: "Downtown Station",
      time: "1:15 PM",
      status: "Completed",
    },
  ];

  return (
    <main className="bg-[var(--background)] text-[var(--foreground)] min-h-screen flex flex-col">
      <GlobalNavbar/>

      <section className="max-w-5xl mx-auto px-6 py-10 w-full space-y-8">
        {/* Welcome */}
        <div className="bg-[var(--card)] rounded-2xl p-6 shadow-soft">
          <h2 className="text-2xl font-bold">
            Welcome <span className="text-[var(--accent)]">Sarah 👋</span>
          </h2>
          <p className="mt-2 text-[var(--muted)]">
            Ready for your next ride?{" "}
            <button className="text-[var(--accent)] font-semibold hover:underline">
              Switch to Rider?
            </button>
          </p>
        </div>

        {/* Ride Requests */}
        <div>
          <h3 className="text-xl font-bold mb-4">Ride Requests</h3>
          <div className="space-y-4">
            {rideRequests.map((ride) => (
              <RideCard key={ride.id} ride={ride} role="driver" />
            ))}
          </div>
        </div>

        {/* Offer a Ride Button */}
        <div className="flex justify-center mt-8">
          <button className="btn-primary px-8 py-3 text-lg">Offer a Ride</button>
        </div>
      </section>

      <Footer />
    </main>
  );
}
