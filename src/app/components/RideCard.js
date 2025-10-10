export default function RideCard({ ride, role, onCancel, onAccept, onDecline, onStart }) {
  const statusColors = {
    Pending: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/40",
    Accepted: "bg-green-500/20 text-green-400 border border-green-500/40",
    Completed: "bg-gray-500/20 text-gray-400 border border-gray-500/40",
  };

  return (
    <div className="bg-[var(--card)] rounded-xl shadow-soft p-5 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
      {/* LEFT */}
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-lg truncate">{ride.name}</h4>
        <p className="text-sm text-[var(--muted)]">{ride.dept}</p>

        <div className="mt-2 text-sm space-y-1">
          <p className="break-words">
            <span className="font-medium">Pickup:</span>{" "}
            <span className="text-[var(--foreground)]">{ride.pickup}</span>
          </p>
          <p className="break-words">
            <span className="font-medium">Drop:</span>{" "}
            <span className="text-[var(--foreground)]">{ride.drop}</span>
          </p>
        </div>

        <p className="text-sm text-[var(--muted)] mt-2">{ride.time}</p>
      </div>

      {/* RIGHT */}
      <div className="flex flex-col items-end justify-center gap-3 ml-4 w-36">
        <span
          className={`px-3 py-1 text-xs rounded-full font-semibold text-center w-full ${statusColors[ride.status] || "bg-gray-200 text-gray-700"}`}
        >
          {ride.status}
        </span>

        {/* Rider Actions */}
        {role === "rider" && ride.status === "Pending" && (
          <button
            onClick={() => onCancel?.(ride.id)}
            className="px-4 py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700 w-full"
          >
            Cancel
          </button>
        )}

        {/* Driver Actions */}
        {role === "driver" && ride.status === "Pending" && (
          <div className="flex flex-col gap-2 w-full">
            <button
              onClick={() => onAccept?.(ride.id)}
              className="px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 text-sm w-full"
            >
              Accept
            </button>
            <button
              onClick={() => onDecline?.(ride.id)}
              className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 text-sm w-full"
            >
              Decline
            </button>
          </div>
        )}

        {role === "driver" && ride.status === "Accepted" && (
          <button
            onClick={() => onStart?.(ride.id)}
            className="px-4 py-2 rounded-lg bg-[var(--accent)] text-black font-semibold hover:bg-yellow-400 w-full"
          >
            Start Ride
          </button>
        )}
      </div>
    </div>
  );
}
