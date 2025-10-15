"use client";
import { useState, useEffect } from "react";
import GlobalNavbar from "@/app/components/GlobalNavbar";
import Footer from "@/app/components/Footer";
import RoleSwitcher from "@/app/components/RoleSwitcher";
import OverviewCard from "@/app/components/OverviewCard";
import AvailableRides from "@/app/components/AvailableRides";
import { useRouter } from "next/navigation";

export default function RequestRide()
{
  const [fullName, setFullName] = useState("User");
  const [department, setDepartment] = useState("IT Department");

  useEffect(() =>
  {
    try
    {
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      const userInfo = storedUser?.user || storedUser;
      if (userInfo?.fullName) setFullName(userInfo.fullName);
      if (userInfo?.department) setDepartment(userInfo.department);
    } catch (err)
    {
      console.error("Error parsing user data:", err);
    }
  }, []);

  const router = useRouter();

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
      price: 5000
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
      price: 2000
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
      price: 700
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

  const handleRoleChange = (role) =>
  {
    if (role === "rider")
    {
      router.push("rider/profile#bottom");
    }
  };

  return (
    <main className="bg-[var(--background)] text-[var(--foreground)] min-h-screen flex flex-col">
      <GlobalNavbar />

      <section className="flex-1 px-6 py-8 space-y-10 max-w-6xl mx-auto w-full">
        <div>
          <h2 className="text-3xl font-bold">Welcome {fullName} 👋</h2>
          <p className="text-[var(--muted)] mt-1">Ready for your next ride?</p>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Your Dashboard</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            <div className="bg-[var(--card)] rounded-2xl shadow-soft p-6 flex flex-col">
              <RoleSwitcher onRoleChange={handleRoleChange} />
            </div>
            <div className="bg-[var(--card)] rounded-2xl shadow-soft p-6 flex flex-col">
              <OverviewCard availableSeats={17} activeDrivers={6} />
            </div>
          </div>
        </div>

        <div>
          <AvailableRides rides={rides} />
        </div>
      </section>

      <Footer />
    </main>
  );
}
