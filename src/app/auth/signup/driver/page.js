"use client";

import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

export default function DriverSignup() {
  return (
    <main className="bg-[var(--background)] text-[var(--foreground)] h-screen flex flex-col overflow-hidden">
      {/* Navbar */}
      <Navbar />

      {/* Centered Form */}
      <section className="flex-1 flex items-center justify-center px-6 py-6 overflow-hidden">
        <div className="w-full max-w-lg bg-[var(--card)] rounded-2xl shadow-soft flex flex-col h-full max-h-[85vh]">
          
          {/* Header */}
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-2xl font-bold text-center">Driver Registration 🚗</h2>
            <p className="text-[var(--muted)] text-center text-sm mt-1">
              Register as a driver and offer rides to your colleagues.
            </p>
          </div>

          {/* Scrollable Form */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {/* Basic Info */}
            <input type="text" placeholder="Full Name" className="input" />
            <input type="email" placeholder="Official Email" className="input" />
            <input type="tel" placeholder="Mobile Number" className="input" />

            {/* Department Dropdown */}
            <div className="relative">
            <select
                className="input appearance-none font-normal text-[var(--foreground)] pr-10"
                defaultValue=""
            >
                <option value="" disabled>
                Select Department
                </option>
                <option value="HR">Human Resources</option>
                <option value="IT">Information Technology</option>
                <option value="Finance">Finance</option>
                <option value="Marketing">Marketing</option>
                <option value="Operations">Operations</option>
                <option value="Other">Other</option>
            </select>

            {/* Custom Arrow */}
            <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                <svg
                className="w-5 h-5 text-[var(--accent)]"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
            </span>
            </div>

            <input type="text" placeholder="Designation" className="input" />
            <input type="password" placeholder="Password" className="input" />
            <input
              type="text"
              placeholder="CNIC (e.g. 12345-6789012-3)"
              className="input"
            />

            {/* Vehicle Details */}
            <input
              type="text"
              placeholder="Vehicle Type (Car/Bike/Van)"
              className="input"
            />
            <input type="text" placeholder="Make & Model" className="input" />
            <input
              type="text"
              placeholder="Registration Number"
              className="input"
            />
            <input
              type="number"
              placeholder="Seating Capacity"
              className="input"
            />

            {/* Willing to Offer Ride (Yes/No) */}
            <div>
              <span className="block text-sm text-[var(--muted)] mb-1">
                Willing to Offer Rides?
              </span>
              <div className="space-y-3">
                <label className="w-full block border border-gray-600 rounded-lg px-4 py-3 cursor-pointer hover:border-[var(--accent)] transition">
                  <input
                    type="radio"
                    name="offerRide"
                    value="yes"
                    className="mr-2"
                  />
                  Yes
                </label>
                <label className="w-full block border border-gray-600 rounded-lg px-4 py-3 cursor-pointer hover:border-[var(--accent)] transition">
                  <input
                    type="radio"
                    name="offerRide"
                    value="no"
                    className="mr-2"
                  />
                  No
                </label>
              </div>
            </div>

            {/* AC Available Toggle Inline */}
            <div className="flex items-center justify-between border border-gray-600 rounded-lg px-4 py-3">
              <span className="text-sm text-[var(--muted)]">AC Available</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:bg-[var(--accent)] transition"></div>
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition peer-checked:translate-x-5"></div>
              </label>
            </div>
          </div>

          {/* Sticky Submit Button */}
          <div className="p-6 border-t border-gray-700">
            <button type="submit" className="btn-primary w-full">
              Continue
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}
