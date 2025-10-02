"use client";
import { Users, Route, Clock, CheckCircle2 } from "lucide-react";

export default function DemandSummary({ totalRiders, matching, pending, accepted }) {
  const stats = [
    { icon: Users, value: totalRiders, label: "Total Riders Waiting" },
    { icon: Route, value: matching, label: "Matching Your Route" },
    { icon: Clock, value: pending, label: "Pending Requests" },
    { icon: CheckCircle2, value: accepted, label: "Accepted" },
  ];

  return (
    <div className="bg-[var(--card)] rounded-xl p-6 shadow-soft">
      <h4 className="text-lg font-semibold mb-4">Demand Summary</h4>
      <div className="grid grid-cols-2 gap-4">
        {stats.map(({ icon: Icon, value, label }, i) => (
          <div
            key={i}
            className="bg-[var(--background)] rounded-xl p-4 flex flex-col items-center justify-center text-center shadow-inner"
          >
            <Icon className="w-7 h-7 text-[var(--accent)] mb-1" />
            <p className="text-xl font-bold">{value}</p>
            <span className="text-xs text-[var(--muted)]">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
