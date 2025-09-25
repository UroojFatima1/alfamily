"use client";

import { useState } from "react";
import BaseModal from "@/app/components/BaseModal";

export default function RideRequestModal({ isOpen, onClose, onSuccess }) {
  const [form, setForm] = useState({
    pickupType: "home-office",
    pickup: "",
    drop: "",
    date: "",
    time: "",
    notes: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };
  const today = new Date().toISOString().split("T")[0];

  const validate = () => {
    const newErrors = {};
    if (!form.pickup.trim()) newErrors.pickup = "Pickup location is required";
    if (!form.drop.trim()) newErrors.drop = "Drop location is required";
    if (!form.date) newErrors.date = "Date is required";
    if (!form.time) newErrors.time = "Time is required";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log("Ride Request Submitted:", form);
      onClose();
      if (onSuccess) {
        onSuccess(form); 
      }
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
        <div>
          <input
            type="text"
            placeholder="Pickup Location"
            value={form.pickup}
            onChange={(e) => handleChange("pickup", e.target.value)}
            className="input"
          />
          {errors.pickup && <p className="text-red-500 text-sm">{errors.pickup}</p>}
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
          {errors.drop && <p className="text-red-500 text-sm">{errors.drop}</p>}
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
    {errors.date && <p className="text-red-500 text-sm">{errors.date}</p>}
  </div>
  <div className="flex-1">
    <input
      type="time"
      value={form.time}
      onChange={(e) => handleChange("time", e.target.value)}
      className="input"
    />
    {errors.time && <p className="text-red-500 text-sm">{errors.time}</p>}
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

        <button type="submit" className="btn-primary w-full">
          Submit Request
        </button>
      </form>
    </BaseModal>
  );
}
