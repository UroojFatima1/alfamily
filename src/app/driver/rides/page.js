// src/app/driver/page.js
import Footer from "@/app/components/Footer";
import RoleSwitcher from "@/app/components/RoleSwitcher";
import DemandSummary from "@/app/components/DemandSummary";
import OfferRideCard from "@/app/components/OfferRideCard";
import RiderRequestList from "@/app/components/RiderRequestList";
import GlobalNavbar from "@/app/components/GlobalNavbar";

export default function OfferRides() {
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
      { id: 1, name: "Ahmed", avatar: "/images/ahmed.png" },
      { id: 2, name: "Sara", avatar: "/images/sara.png" },
    ],
  };

  const requests = [
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
  ];

  return (
    <main className="bg-[var(--background)] text-[var(--foreground)] min-h-screen flex flex-col">
      <GlobalNavbar />

      <section className="flex-1 px-6 py-8 space-y-8 max-w-6xl mx-auto w-full">
        {/* Welcome Header */}
        <div>
          <h2 className="text-3xl font-bold">Welcome Sarah 🚘</h2>
          <p className="text-[var(--muted)] mt-1">Ready for your next ride?</p>
        </div>

        {/* Role Switcher */}
        <RoleSwitcher activeRole="driver" />

        {/* Demand Summary + Ride Info */}
        <DemandSummary {...demand} />
        <OfferRideCard {...yourRide} />

        {/* Current Requests */}
        <RiderRequestList requests={requests} />
      </section>

      <Footer />
    </main>
  );
}
