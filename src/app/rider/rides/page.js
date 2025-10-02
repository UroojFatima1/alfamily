import GlobalNavbar from "@/app/components/GlobalNavbar";
import Footer from "@/app/components/Footer";
import RoleSwitcher from "@/app/components/RoleSwitcher";
import OverviewCard from "@/app/components/OverviewCard";
import AvailableRides from "@/app/components/AvailableRides";

export default function RequestRide() {
  const rides = [
    {
      id: 1,
      name: "Michael Chen",
      rating: 4.8,
      totalRides: 127,
      vehicle: "Toyota Camry 2022",
      details: "AC · 1 seat booked · 1 remaining",
      location: "123 Main Street, Downtown",
      time: "Today, 8:30 AM",
      seatsLeft: 1,
    },
    {
      id: 2,
      name: "David Wilson",
      rating: 4.7,
      totalRides: 89,
      vehicle: "Honda Accord 2021",
      details: "No AC · 4 seats booked · 0 remaining",
      location: "456 Business Ave, Office",
      time: "Today, 9:00 AM",
      seatsLeft: 0,
    },
    {
      id: 3,
      name: "Alex Rodriguez",
      rating: 4.9,
      totalRides: 105,
      vehicle: "BMW 320i 2023",
      details: "AC · 2 seats booked · 3 remaining",
      location: "789 Tech Park, Silicon Valley",
      time: "Today, 10:15 AM",
      seatsLeft: 3,
    },
    {
      id: 4,
      name: "Sophia Khan",
      rating: 4.6,
      totalRides: 73,
      vehicle: "Suzuki WagonR 2019",
      details: "AC · 3 seats booked · 1 remaining",
      location: "Metro Station, Block A",
      time: "Today, 7:45 AM",
      seatsLeft: 1,
    },
  ];

  return (
    <main className="bg-[var(--background)] text-[var(--foreground)] min-h-screen flex flex-col">
      <GlobalNavbar />

      <section className="flex-1 px-6 py-8 space-y-10 max-w-6xl mx-auto w-full">
        {/* Greeting */}
        <div>
          <h2 className="text-3xl font-bold">Welcome Sarah 👋</h2>
          <p className="text-[var(--muted)] mt-1">Ready for your next ride?</p>
        </div>

        {/* Dashboard Section */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Your Dashboard</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            <div className="bg-[var(--card)] rounded-2xl shadow-soft p-6 flex flex-col">
              <RoleSwitcher />
            </div>
            <div className="bg-[var(--card)] rounded-2xl shadow-soft p-6 flex flex-col">
              <OverviewCard availableSeats={17} activeDrivers={6} />
            </div>
          </div>
        </div>

        {/* Available Rides */}
        <AvailableRides rides={rides} />
      </section>

      <Footer />
    </main>
  );
}
