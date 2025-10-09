"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";
import BaseModal from "@/app/components/BaseModal";

export default function RideRequestModal({ isOpen, onClose, onSuccess }) {
  const [form, setForm] = useState({
    pickupType: "home-office",
    pickup: "",
    drop: "",
    pickupCoords: null,
    dropCoords: null,
    date: "",
    time: "",
    notes: "",
  });
  const [errors, setErrors] = useState({});
  const [locating, setLocating] = useState({ pickup: false, drop: false });
  const today = new Date().toISOString().split("T")[0];

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.pickup.trim()) newErrors.pickup = "Pickup location is required";
    if (!form.drop.trim()) newErrors.drop = "Drop location is required";
    if (!form.date) newErrors.date = "Date is required";
    if (!form.time) newErrors.time = "Time is required";
    return newErrors;
  };


  const getLocation = async (type) => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported by your browser.");
      return;
    }


    setLocating((prev) => ({ ...prev, [type]: true }));

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await res.json();
          const address = data.display_name || "Unknown location";

          if (type === "pickup") {
            setForm((prev) => ({
              ...prev,
              pickup: address,
              pickupCoords: { latitude, longitude },
            }));
          } else {
            setForm((prev) => ({
              ...prev,
              drop: address,
              dropCoords: { latitude, longitude },
            }));
          }
          alert(`${type} location fetched:`, address);
        } catch {
          alert("Failed to fetch address.");
        } finally {
          setLocating((prev) => ({ ...prev, [type]: false }));
        }
      },
      () => {
        alert("Unable to retrieve your location.");
        setLocating((prev) => ({ ...prev, [type]: false }));
      }
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log("Ride Request Submitted:", form);
      onClose();
      if (onSuccess) onSuccess(form);
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-xl font-bold mb-4">Request a Ride 🚖</h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar"
      >
        {/* Pickup Type */}
        <div className="grid grid-cols-2 gap-0 rounded-lg overflow-hidden border border-gray-600">
          <button
            type="button"
            className={`py-2 font-semibold ${
              form.pickupType === "home-office"
                ? "bg-[var(--accent)] text-[var(--background)]"
                : "bg-[var(--background)] text-[var(--foreground)]"
            }`}
            onClick={() => handleChange("pickupType", "home-office")}
          >
            Home → Office
          </button>
          <button
            type="button"
            className={`py-2 font-semibold ${
              form.pickupType === "office-home"
                ? "bg-[var(--accent)] text-[var(--background)]"
                : "bg-[var(--background)] text-[var(--foreground)]"
            }`}
            onClick={() => handleChange("pickupType", "office-home")}
          >
            Office → Home
          </button>
        </div>

        {/* Pickup Location */}
        <div className="relative flex items-center">
          <input
            type="text"
            placeholder="Pickup Location"
            value={form.pickup}
            onChange={(e) => handleChange("pickup", e.target.value)}
            className="input flex-1 pr-10"
          />
          <button
            type="button"
            onClick={() => getLocation("pickup")}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-10"
          >
            {locating.pickup ? (
              <svg
                className="animate-spin h-5 w-5 text-[var(--accent)]"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
            ) : (
              <MapPin className="w-5 h-5 text-[var(--accent)] drop-shadow-[0_0_3px_rgba(255,255,255,0.5)]" />
            )}
          </button>
        </div>
        {errors.pickup && <p className="text-red-500 text-sm">{errors.pickup}</p>}

        {/* Drop Location */}
        <div className="relative flex items-center">
          <input
            type="text"
            placeholder="Drop Location"
            value={form.drop}
            onChange={(e) => handleChange("drop", e.target.value)}
            className="input flex-1 pr-10"
          />
          <button
            type="button"
            onClick={() => getLocation("drop")}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-10"
          >
            {locating.drop ? (
              <svg
                className="animate-spin h-5 w-5 text-[var(--accent)]"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
            ) : (
              <MapPin className="w-5 h-5 text-red-400 drop-shadow-[0_0_3px_rgba(255,255,255,0.5)]" />
            )}
          </button>
        </div>
        {errors.drop && <p className="text-red-500 text-sm">{errors.drop}</p>}

        {/* Date & Time */}
        <div className="flex gap-3">
          <div className="flex-1">
            <input
              type="date"
              min={today}
              value={form.date}
              onChange={(e) => handleChange("date", e.target.value)}
              className="input"
            />
            {errors.date && (
              <p className="text-red-500 text-sm">{errors.date}</p>
            )}
          </div>
          <div className="flex-1">
            <input
              type="time"
              value={form.time}
              onChange={(e) => handleChange("time", e.target.value)}
              className="input"
            />
            {errors.time && (
              <p className="text-red-500 text-sm">{errors.time}</p>
            )}
          </div>
        </div>

        {/* Notes */}
        <textarea
          placeholder="Notes (Optional)"
          value={form.notes}
          onChange={(e) => handleChange("notes", e.target.value)}
          className="input"
          rows="3"
        />

        {/* Submit */}
        <button type="submit" className="btn-primary w-full">
          Submit Request
        </button>
      </form>
    </BaseModal>
  );
}
