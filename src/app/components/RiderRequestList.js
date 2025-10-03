"use client";
export default function RiderRequestList({ requests }) {
  const statusColors = {
    Pending: "bg-yellow-500/20 text-yellow-400",
    Accepted: "bg-green-500/20 text-green-400",
    Completed: "bg-gray-500/20 text-gray-400",
  };

  return (
    <div className="space-y-4">
      {requests.map((req) => (
        <div
          key={req.id}
          className="bg-[var(--card)] p-4 rounded-xl shadow-soft flex justify-between items-start"
        >
          {/* Rider Info */}
          <div>
            <h4 className="font-semibold">{req.name}</h4>
            <p className="text-sm text-[var(--muted)]">{req.role}</p>
            <p className="text-sm mt-1">
              <span className="font-medium">Pickup:</span> {req.pickup}
            </p>
            <p className="text-sm">
              <span className="font-medium">Drop:</span> {req.drop}
            </p>
          </div>

          {/* Right Side: Status + Actions */}
          <div className="flex flex-col items-end gap-2">
            {/* Status pill */}
            <span
              className={`px-3 py-1 text-xs rounded-full font-medium ${statusColors[req.status]}`}
            >
              {req.status}
            </span>

            {/* Buttons */}
            {req.status === "Pending" && (
              <div className="flex gap-2">
                <button className="px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600">
                  Accept
                </button>
                <button className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600">
                  Decline
                </button>
              </div>
            )}

            {req.status === "Accepted" && (
              <button className="px-4 py-2 rounded-lg bg-[var(--accent)] text-black font-semibold hover:bg-yellow-400">
                Start Ride
              </button>
            )}

            {req.status === "Completed" && (
              <span className="text-sm text-gray-400">Completed</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
