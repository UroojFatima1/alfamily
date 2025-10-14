"use client";

export default function OfferRideCard({ vehicle, seatsFilled, totalSeats, bookedRiders })
{
  return (
    <div className="bg-[var(--card)] rounded-xl p-6 shadow-soft">
      <h4 className="text-lg font-semibold mb-3">Your Ride <span className="text-yellow-400 text-sm ml-2">• Offered</span></h4>

      <div className="w-full bg-gray-700 rounded-full h-3 mb-3">
        <div
          className="bg-[var(--accent)] h-3 rounded-full"
          style={{ width: `${(seatsFilled / totalSeats) * 100}%` }}
        />
      </div>

      <p className="text-sm mb-2">{seatsFilled} of {totalSeats} seats filled</p>
      <p className="text-sm text-[var(--muted)] mb-4">{vehicle}</p>

      <div className="flex -space-x-3 mb-4">
        {bookedRiders.map((rider) => (
          <img
            key={rider.id}
            src={rider.avatar}
            alt={rider.name}
            className="w-10 h-10 rounded-full border-2 border-[var(--background)]"
          />
        ))}
      </div>

    </div>
  );
}
