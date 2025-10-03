"use client";

import { useState } from "react";
import BaseModal from "@/app/components/BaseModal";

export default function OfferRideModal({ isOpen, onClose, onSuccess }) {
  const [form, setForm] = useState({
    pickupType: "home-office",
    pickup: "",
    drop: "",
    seats: "",
    date: "",
    time: "",
    notes: "",
    ac: "yes",
  });
  const [errors, setErrors] = useState({});
  const today = new Date().toISOString().split("T")[0];

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.pickup.trim()) newErrors.pickup = "Pickup location is required";
    if (!form.drop.trim()) newErrors.drop = "Drop location is required";
    if (!form.seats || Number(form.seats) <= 0)
      newErrors.seats = "Seats must be at least 1";
    if (!form.date) newErrors.date = "Date is required";
    if (!form.time) newErrors.time = "Time is required";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log("Offer Ride Submitted:", form);
      onClose();
      if (onSuccess) {
        onSuccess(form);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-xl font-bold mb-4">Offer a Ride 🚗</h2>

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
        <div>
          <input
            type="text"
            placeholder="Pickup Location"
            value={form.pickup}
            onChange={(e) => handleChange("pickup", e.target.value)}
            className="input"
          />
          {errors.pickup && (
            <p className="text-red-500 text-sm">{errors.pickup}</p>
          )}
        </div>

        {/* Drop Location */}
        <div>
          <input
            type="text"
            placeholder="Drop Location"
            value={form.drop}
            onChange={(e) => handleChange("drop", e.target.value)}
            className="input"
          />
          {errors.drop && (
            <p className="text-red-500 text-sm">{errors.drop}</p>
          )}
        </div>

        {/* Seats (Numeric Input) */}
        <div>
          <input
            type="number"
            placeholder="Available Seats"
            min="1"
            value={form.seats}
            onChange={(e) => handleChange("seats", e.target.value)}
            className="input"
          />
          {errors.seats && (
            <p className="text-red-500 text-sm">{errors.seats}</p>
          )}
        </div>

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

        {/* AC Option */}
        <div>
          <span className="block text-sm text-[var(--muted)] mb-1">
            Select AC Option
          </span>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 border border-gray-600 rounded-lg px-4 py-2 cursor-pointer">
              <input
                type="radio"
                name="ac"
                value="yes"
                checked={form.ac === "yes"}
                onChange={(e) => handleChange("ac", e.target.value)}
              />{" "}
              AC
            </label>
            <label className="flex items-center gap-2 border border-gray-600 rounded-lg px-4 py-2 cursor-pointer">
              <input
                type="radio"
                name="ac"
                value="no"
                checked={form.ac === "no"}
                onChange={(e) => handleChange("ac", e.target.value)}
              />{" "}
              Non AC
            </label>
          </div>
        </div>

        <button type="submit" className="btn-primary w-full">
          Submit Offer
        </button>
      </form>
    </BaseModal>
  );
}
