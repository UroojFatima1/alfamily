"use client";

import { useState } from "react";

export default function Profile() {
  const [role, setRole] = useState("rider");

  return (
    <div className="w-full max-w-4xl bg-[var(--card)] rounded-2xl shadow-soft p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col items-center text-center">
        <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-4xl">
          👤
        </div>
        <h2 className="text-2xl font-bold mt-4">John Anderson</h2>
        <p className="text-[var(--muted)]">
          IT Department / Senior Developer
        </p>
      </div>

      {/* Personal Info */}
      <div className="bg-[var(--background)] rounded-xl p-6 shadow-inner space-y-2">
        <h3 className="font-semibold text-lg border-b border-gray-600 pb-2">
          Personal Information
        </h3>
        <p><span className="font-semibold">Full Name:</span> John Anderson</p>
        <p><span className="font-semibold">Email:</span> john.anderson@company.com</p>
        <p><span className="font-semibold">Mobile:</span> +92-312-0254584</p>
        <p><span className="font-semibold">Department:</span> IT Department</p>
        <p><span className="font-semibold">Designation:</span> Senior Developer</p>
      </div>

      {/* Contact Info */}
      <div className="bg-[var(--background)] rounded-xl p-6 shadow-inner space-y-2">
        <h3 className="font-semibold text-lg border-b border-gray-600 pb-2">
          Contact Information
        </h3>
        <p><span className="font-semibold">Alternate Email:</span> john.personal@email.com</p>
        <p><span className="font-semibold">Emergency Contact:</span> +92-311-9876543</p>
        <p><span className="font-semibold">Office Extension:</span> 2456</p>
      </div>

      {/* Vehicle Info */}
      <div className="bg-[var(--background)] rounded-xl p-6 shadow-inner space-y-2">
        <h3 className="font-semibold text-lg border-b border-gray-600 pb-2">
          Vehicle Information
        </h3>
        <p><span className="font-semibold">Type:</span> Sedan</p>
        <p><span className="font-semibold">Model:</span> Honda Accord 2022</p>
        <p><span className="font-semibold">Registration #:</span> ABC-1234</p>
        <p><span className="font-semibold">Seating Capacity:</span> 4 Passengers</p>
        <p><span className="font-semibold">AC:</span> Yes</p>
        <p><span className="font-semibold">Ride Availability:</span> Yes</p>
      </div>

      {/* Switch Role */}
      <div className="bg-[var(--background)] rounded-xl p-6 shadow-inner">
        <h3 className="font-semibold text-lg mb-4">Switch Role</h3>
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setRole("rider")}
            className={`flex-1 px-6 py-3 rounded-lg border ${
              role === "rider"
                ? "bg-[var(--accent)] text-black font-semibold"
                : "border-gray-600 text-[var(--muted)] hover:border-[var(--accent)]"
            }`}
          >
            Rider
          </button>
          <button
            onClick={() => setRole("driver")}
            className={`flex-1 px-6 py-3 rounded-lg border ${
              role === "driver"
                ? "bg-[var(--accent)] text-black font-semibold"
                : "border-gray-600 text-[var(--muted)] hover:border-[var(--accent)]"
            }`}
          >
            Driver
          </button>
        </div>

        {/* Conditional Driver Form */}
        {role === "driver" && (
          <div className="space-y-4">
            <h4 className="font-semibold mb-2">Additional Information</h4>

            <select className="input">
              <option value="">Select vehicle type</option>
              <option value="Car">Car</option>
              <option value="Bike">Bike</option>
              <option value="Van">Van</option>
            </select>

            <input type="text" className="input" placeholder="Enter your model" />
            <input type="text" className="input" placeholder="Enter registration number" />
            <input type="number" className="input" placeholder="Enter seating capacity" />

            <div>
              <span className="block text-sm text-[var(--muted)] mb-1">
                Willing to offer rides?
              </span>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 border border-gray-600 rounded-lg px-4 py-2 cursor-pointer">
                  <input type="radio" name="offerRide" value="yes" /> Yes
                </label>
                <label className="flex items-center gap-2 border border-gray-600 rounded-lg px-4 py-2 cursor-pointer">
                  <input type="radio" name="offerRide" value="no" /> No
                </label>
              </div>
            </div>

            <div className="flex items-center justify-between border border-gray-600 rounded-lg px-4 py-3">
              <span className="text-sm text-[var(--muted)]">AC Available?</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:bg-[var(--accent)] transition"></div>
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition peer-checked:translate-x-5"></div>
              </label>
            </div>

            {/* Save / Cancel */}
            <div className="flex gap-4 mt-4">
              <button className="btn-primary flex-1">Save Changes</button>
              <button className="border border-gray-600 rounded-lg px-6 py-2 flex-1 hover:border-[var(--accent)]">
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
