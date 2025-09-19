export default function RideCard({ ride, role }) {
  const statusColors = {
    Pending: "bg-yellow-500/20 text-yellow-400",
    Accepted: "bg-green-500/20 text-green-400",
    Completed: "bg-gray-500/20 text-gray-400",
  };

  return (
    <div className="bg-[var(--card)] rounded-xl shadow-soft p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between">
      {/* Left */}
      <div>
        <h4 className="font-semibold">{ride.name}</h4>
        <p className="text-sm text-[var(--muted)]">{ride.dept}</p>
        <p className="text-sm mt-2">
          <span className="font-medium">Pickup:</span> {ride.pickup}
        </p>
        <p className="text-sm">
          <span className="font-medium">Drop:</span> {ride.drop}
        </p>
        <p className="text-sm text-[var(--muted)] mt-1">{ride.time}</p>
      </div>

      {/* Right */}
      <div className="mt-4 sm:mt-0 flex flex-col items-end gap-2">
        <span
          className={`px-3 py-1 text-xs rounded-full font-semibold ${statusColors[ride.status]}`}
        >
          {ride.status}
        </span>

        {role === "driver" && ride.status === "Pending" && (
          <div className="flex gap-2">
            <button className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600">
              Decline
            </button>
            <button className="px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600">
              Accept
            </button>
          </div>
        )}

        {role === "driver" && ride.status === "Accepted" && (
          <button className="px-4 py-2 rounded-lg bg-[var(--accent)] text-black font-semibold hover:bg-yellow-400">
            Start Ride
          </button>
        )}

        {role === "rider" && ride.status === "Completed" && (
          <span className="text-sm text-gray-400">Completed</span>
        )}
      </div>
    </div>
  );
}
