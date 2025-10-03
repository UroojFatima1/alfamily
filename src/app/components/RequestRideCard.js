import Image from "next/image";

export default function RequestRideCard({
  name,
  rating,
  totalRides,
  vehicle,
  details,
  location,
  time,
  seatsLeft,
}) {
  return (
    <div className="bg-[var(--card)] rounded-xl shadow-soft p-5 space-y-3">
      {/* Top Section: Avatar + Name + Rating */}
      <div className="flex items-center gap-3">
        <Image
          src="/images/avatar.png"
          alt={name}
          width={40}
          height={40}
          className="rounded-full"
        />
        <div>
          <h4 className="font-semibold">{name}</h4>
          <p className="text-sm text-[var(--muted)]">
            ⭐ {rating} ({totalRides} rides)
          </p>
        </div>
      </div>

      {/* Vehicle Info */}
      <div className="bg-gray-800/40 rounded-lg px-4 py-2 text-sm">
        <p className="font-medium">{vehicle}</p>
        <p className="text-[var(--muted)]">{details}</p>
      </div>

      {/* Location & Time */}
      <div className="text-sm space-y-1">
        <p>
          📍 <span className="font-medium">{location}</span>
        </p>
        <p className="text-[var(--muted)]">🕒 {time}</p>
      </div>

      {/* Seat Status */}
      {seatsLeft > 0 ? (
        <p className="text-sm text-yellow-400">Only {seatsLeft} seat left!</p>
      ) : (
        <p className="text-sm text-red-500">Fully Booked</p>
      )}

      {/* Action Button */}
      <button
        className={`w-full py-2 rounded-lg font-semibold ${
          seatsLeft > 0
            ? "bg-[var(--accent)] text-black hover:bg-yellow-400"
            : "bg-gray-700 text-gray-400 cursor-not-allowed"
        }`}
        disabled={seatsLeft === 0}
      >
        {seatsLeft > 0 ? "Request Seat" : "Request Seat"}
      </button>
    </div>
  );
}
