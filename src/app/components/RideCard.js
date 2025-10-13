"use client";

export default function RideCard({ ride, role, onCancel })
{
  return (
    <div className="bg-[var(--card)] rounded-xl p-5 shadow-md flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <h4 className="font-semibold text-lg">{ride.name}</h4>
        <span
          className={`text-sm font-semibold px-3 py-1 rounded-full ${ride.status === "Completed"
              ? "bg-green-500/20 text-green-400"
              : "bg-yellow-500/20 text-yellow-400"
            }`}
        >
          {ride.status}
        </span>
      </div>

      <p className="text-sm text-[var(--muted)]">{ride.dept}</p>

      {/* Pickup / Drop locations */}
      <div className="mt-2 text-sm">
        <p>
          <strong>Pickup:</strong> {ride.pickup}
        </p>
        <p>
          <strong>Drop:</strong> {ride.drop}
        </p>
      </div>

      {/* Time */}
      <p className="text-sm text-gray-400">
        🕒 <strong>{ride.time}</strong>
      </p>

      {/* Cancel Button (for active rides/offers only) */}
      {ride.status === "Pending" && (
        <button
          onClick={() => onCancel && onCancel(ride.id)}
          className="btn-secondary mt-3 w-full"
        >
          ❌ Cancel
        </button>
      )}
    </div>
  );
}
