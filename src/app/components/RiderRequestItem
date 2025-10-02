"use client";
import { MapPin } from "lucide-react";

export default function RiderRequestItem({ name, role, pickup, drop, status }) {
  return (
    <div className="p-5 rounded-xl bg-[var(--card)] shadow-soft flex flex-col h-full">
      <h4 className="font-semibold text-lg">{name}</h4>
      <p className="text-sm text-[var(--muted)] mb-2">{role}</p>

      <div className="flex-1 text-sm space-y-1">
        <p className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[var(--accent)]" /> {pickup}
        </p>
        <p className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-red-400" /> {drop}
        </p>
      </div>

      <span
        className={`mt-4 px-3 py-1 rounded-full text-xs font-medium ${
          status === "Accepted"
            ? "bg-green-600/20 text-green-500"
            : "bg-yellow-600/20 text-yellow-400"
        }`}
      >
        {status}
      </span>
    </div>
  );
}
