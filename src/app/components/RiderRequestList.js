"use client";

export default function RiderRequestList({ requests }) {
  return (
    <div className="space-y-4">
      <h4 className="text-lg font-semibold">Current Requests</h4>
      {requests.map((req) => (
        <div key={req.id} className="bg-[var(--card)] rounded-xl p-5 shadow-soft space-y-3">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold">{req.name}</p>
              <span className="text-sm text-[var(--muted)]">{req.role}</span>
            </div>
            {req.status === "Accepted" && (
              <span className="bg-green-600 text-white text-xs px-3 py-1 rounded-lg">
                Accepted
              </span>
            )}
          </div>

          <div className="text-sm space-y-1">
            <p><span className="text-[var(--muted)]">Pickup:</span> {req.pickup}</p>
            <p><span className="text-[var(--muted)]">Drop:</span> {req.drop}</p>
          </div>

          {req.status === "Accepted" ? (
            <div className="flex gap-3">
              <button className="flex-1 border border-[var(--accent)] rounded-lg py-2 hover:bg-[var(--accent)] hover:text-[var(--background)] transition">Chat</button>
              <button className="flex-1 btn-primary">Start Ride</button>
            </div>
          ) : (
            <div className="flex gap-3">
              <button className="flex-1 bg-red-600 text-white rounded-lg py-2 hover:bg-red-700 transition">Decline</button>
              <button className="flex-1 bg-green-600 text-white rounded-lg py-2 hover:bg-green-700 transition">Accept</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
