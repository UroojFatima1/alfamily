"use client";
import { Users, CarFront } from "lucide-react";

export default function OverviewCard({ availableSeats, activeDrivers }) {
  return (
    <div className="flex flex-col gap-6">
      <h4 className="text-lg font-semibold">Overview</h4>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[var(--background)] rounded-xl p-5 flex flex-col items-center justify-center text-center shadow-inner">
          <Users className="w-8 h-8 text-[var(--accent)] mb-2" />
          <p className="text-2xl font-bold">{availableSeats}</p>
          <span className="text-sm text-[var(--muted)]">Seats Available</span>
        </div>
        <div className="bg-[var(--background)] rounded-xl p-5 flex flex-col items-center justify-center text-center shadow-inner">
          <CarFront className="w-8 h-8 text-[var(--accent)] mb-2" />
          <p className="text-2xl font-bold">{activeDrivers}</p>
          <span className="text-sm text-[var(--muted)]">Active Drivers</span>
        </div>
      </div>
    </div>
  );
}
