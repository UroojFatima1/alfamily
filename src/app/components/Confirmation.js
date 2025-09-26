"use client";

import Image from "next/image";

export default function BookingConfirmation({ ride, onGoToRides }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-10 space-y-8">
      {/* Success Icon */}
      <div className="bg-green-500 w-20 h-20 flex items-center justify-center rounded-full shadow-lg">
        <svg
          className="w-10 h-10 text-white"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      {/* Booking Confirmation */}
      <div className="text-center">
        <h2 className="text-3xl font-bold">Booking Confirmed!</h2>
        <p className="mt-2 text-[var(--muted)]">
          Your seat has been reserved with{" "}
          <span className="text-[var(--accent)] font-semibold">{ride.driver}</span>
        </p>
      </div>

      {/* Ride Info Card */}
      <div className="bg-[var(--card)] rounded-2xl shadow-soft w-full max-w-md p-6 space-y-4">
        {/* Driver */}
        <div className="flex items-center gap-4 border-b border-gray-700 pb-4">
          <Image
            src={ride.avatar || "/images/default-avatar.png"}
            alt={ride.driver}
            width={50}
            height={50}
            className="rounded-full"
          />
          <div>
            <p className="font-semibold">{ride.driver}</p>
            <p className="text-sm text-[var(--muted)] flex items-center gap-2">
              ⭐ {ride.rating} • {ride.car}
            </p>
          </div>
        </div>

        {/* Ride Details */}
        <div className="space-y-2 text-sm">
          <p>
            <span className="font-medium">Pickup Time: </span>
            {ride.pickupTime}
          </p>
          <p>
            <span className="font-medium">Pickup Location: </span>
            {ride.pickupLocation}
          </p>
          <p>
            <span className="font-medium">Destination: </span>
            {ride.destination}
          </p>
          <p>
            <span className="font-medium">Fare: </span>
            <span className="text-[var(--accent)] font-semibold">{ride.fare}</span>
          </p>
        </div>
      </div>

      {/* Button */}
      <button
        className="btn-primary px-8 py-3 text-lg"
        onClick={onGoToRides}
      >
        Go to my rides
      </button>
    </div>
  );
}
