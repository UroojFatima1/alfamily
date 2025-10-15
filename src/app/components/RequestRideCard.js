"use client";
import { useState } from "react";
import Image from "next/image";
import { Loader2 } from "lucide-react";

export default function RequestRideCard({
  name,
  rating,
  totalRides,
  vehicle,
  details,
  location,
  time,
  seatsLeft,
  price, // ✅ new prop
})
{
  const [loading, setLoading] = useState(false);
  const [requested, setRequested] = useState(false);

  const handleRequest = () =>
  {
    setLoading(true);

    // simulate loading for 2 seconds
    setTimeout(() =>
    {
      setLoading(false);
      setRequested(true);
    }, 2000);
  };

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
          <h4 className="font-semibold text-base">{name}</h4>
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

      {/* ✅ Price Tag (synchronized style) */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-[var(--muted)]">💰 Fare</span>
        <span className="font-medium text-[var(--text)]">
          {price ? `PKR ${price}` : "Not available"}
        </span>
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
        onClick={handleRequest}
        disabled={seatsLeft === 0 || loading || requested}
        className={`w-full py-2 rounded-lg font-semibold transition-all ${requested
            ? "bg-gray-700 text-gray-400 cursor-not-allowed"
            : loading
              ? "bg-gray-400 text-gray-800 cursor-wait"
              : seatsLeft > 0
                ? "bg-[var(--accent)] text-black hover:bg-yellow-400"
                : "bg-gray-700 text-gray-400 cursor-not-allowed"
          }`}
      >
        {loading ? (
          <div className="flex justify-center items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading...
          </div>
        ) : requested ? (
          "Requested"
        ) : (
          "Request Seat"
        )}
      </button>
    </div>
  );
}
