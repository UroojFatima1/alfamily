"use client";

import { useState } from "react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import OtpModal from "@/app/components/OtpModal";
import Popup from "@/app/components/popup";

export default function DriverSignup() {
  const [showOtp, setShowOtp] = useState(false);
  const [errors, setErrors] = useState({});
  //const [loadingEmp, setLoadingEmp] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Popup state
  const [popup, setPopup] = useState({ open: false, type: "info", message: "" });

  const [form, setForm] = useState({
    empid: "",
    fullName: "",
    email: "",
    mobile: "",
    department: "",
    designation: "",
    password: "",
    cnic: "",
    vehicleType: "",
    model: "",
    registration: "",
    seating: "",
    offerRide: "",
    acAvailable: false,
  });

  // handle form change
  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // validation
  const validate = () => {
    let newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    const mobileRegex = /^\+92-\d{3}-\d{7}$/;
    const cnicRegex = /^\d{5}-\d{7}-\d{1}$/;

    if (!form.empid) newErrors.empid = "Employee Id is required";
    if (!form.fullName) newErrors.fullName = "Full name is required";
    if (!form.email) newErrors.email = "Email is required";
    else if (!emailRegex.test(form.email)) newErrors.email = "Invalid email format";

    if (!form.mobile) newErrors.mobile = "Mobile number is required";
    else if (!mobileRegex.test(form.mobile))
      newErrors.mobile = "Format: +92-XXX-XXXXXXX";

    if (!form.department) newErrors.department = "Department is required";
    if (!form.designation) newErrors.designation = "Designation is required";

    if (!form.password) newErrors.password = "Password is required";
    else if (!passwordRegex.test(form.password))
      newErrors.password = "At least 8 chars, uppercase, lowercase & number";

    if (!form.cnic) newErrors.cnic = "CNIC is required";
    else if (!cnicRegex.test(form.cnic)) newErrors.cnic = "Format: 12345-6789012-3";

    if (!form.vehicleType) newErrors.vehicleType = "Vehicle type is required";
    if (!form.model) newErrors.model = "Make & Model is required";
    if (!form.registration) newErrors.registration = "Registration number is required";
    if (!form.seating) newErrors.seating = "Seating capacity is required";
    if (!form.offerRide) newErrors.offerRide = "Please select Yes or No";

    return newErrors;
  };

  // submit
  const handleSubmit = async () => {
    const newErrors = validate();
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        setSubmitting(true);

        const res = await fetch("https://alfamilys.vercel.app/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            role: "driver",
            fullName: form.fullName,
            email: form.email,
            mobile: form.mobile,
            department: form.department,
            designation: form.designation,
            password: form.password,
            cnic: form.cnic,
            vehicleType: form.vehicleType,
            model: form.model,
            registrationNumber: form.registration,
            seatingCapacity: Number(form.seating),
            willingToOfferRide: form.offerRide === "yes",
            acAvailable: form.acAvailable,
          }),
        });

        const data = await res.json();

        if (res.ok) {
          setShowOtp(true);
          setPopup({ open: true, type: "success", message: "Registered successfully!" });
        } else {
          setPopup({ open: true, type: "error", message: data.message || "Registration failed" });
        }
      } catch (err) {
        setPopup({ open: true, type: "error", message: "Network error" });
      } finally {
        setSubmitting(false);
      }
    }
  };

  return (
    <main className="bg-[var(--background)] text-[var(--foreground)] h-screen flex flex-col overflow-hidden">
      <Navbar />

      <section className="flex-1 flex items-center justify-center px-6 py-6 overflow-hidden">
        <div className="w-full max-w-lg bg-[var(--card)] rounded-2xl shadow-soft flex flex-col h-full max-h-[85vh]">
          {/* Header */}
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-2xl font-bold text-center">Driver Registration 🚗</h2>
            <p className="text-[var(--muted)] text-center text-sm mt-1">
              Register as a driver and offer rides to your colleagues.
            </p>
          </div>

          {/* Scrollable form */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {/* Employee ID */}
            {/*<div className="relative">
              <input
                type="text"
                placeholder="Employee Id"
                className="input"
                value={form.empid}
                onChange={(e) =>
                  handleChange("empid", e.target.value.replace(/\D/g, ""))
                }
                maxLength={5}
              />
              {loadingEmp && (
                <span className="absolute right-3 top-3 animate-spin border-2 border-[var(--accent)] border-t-transparent rounded-full w-5 h-5"></span>
              )}
              {errors.empid && (
                <p className="text-red-500 text-sm">{errors.empid}</p>
              )}
            </div>*/}

            {/* Full Name */}
            <div>
              <input
                type="text"
                placeholder="Full Name"
                className="input"
                value={form.fullName}
                onChange={(e) => handleChange("fullName", e.target.value)}
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm">{errors.fullName}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <input
                type="email"
                placeholder="Official Email"
                className="input"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>

            {/* Mobile */}
            <div>
              <input
                type="tel"
                placeholder="Mobile Number (+92-XXX-XXXXXXX)"
                className="input"
                value={form.mobile}
                onChange={(e) =>
                  handleChange("mobile", e.target.value.replace(/[^0-9+-]/g, ""))
                }
              />
              {errors.mobile && (
                <p className="text-red-500 text-sm">{errors.mobile}</p>
              )}
            </div>

            {/* Department */}
            <div>
              <div className="relative">
                <select
                  className="input appearance-none font-normal text-[var(--foreground)] pr-10"
                  value={form.department}
                  onChange={(e) => handleChange("department", e.target.value)}
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
              {errors.department && (
                <p className="text-red-500 text-sm">{errors.department}</p>
              )}
            </div>

            {/* Designation */}
            <div>
              <input
                type="text"
                placeholder="Designation"
                className="input"
                value={form.designation}
                onChange={(e) => handleChange("designation", e.target.value)}
              />
              {errors.designation && (
                <p className="text-red-500 text-sm">{errors.designation}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <input
                type="password"
                placeholder="Password"
                className="input"
                value={form.password}
                onChange={(e) => handleChange("password", e.target.value)}
              />
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password}</p>
              )}
            </div>

            {/* CNIC */}
            <div>
              <input
                type="text"
                placeholder="CNIC (12345-6789012-3)"
                className="input"
                value={form.cnic}
                onChange={(e) =>
                  handleChange("cnic", e.target.value.replace(/[^0-9-]/g, ""))
                }
              />
              {errors.cnic && (
                <p className="text-red-500 text-sm">{errors.cnic}</p>
              )}
            </div>

            {/* Vehicle Type */}
            <div>
              <div className="relative">
                <select
                  className="input appearance-none font-normal text-[var(--foreground)] pr-10"
                  value={form.vehicleType}
                  onChange={(e) => handleChange("vehicleType", e.target.value)}
                >
                  <option value="" disabled>
                    Select Vehicle Type
                  </option>
                  <option value="Car">Car</option>
                  <option value="Bike">Bike</option>
                  <option value="Van">Van</option>
                </select>
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
              {errors.vehicleType && (
                <p className="text-red-500 text-sm">{errors.vehicleType}</p>
              )}
            </div>

            {/* Model */}
            <div>
              <input
                type="text"
                placeholder="Make & Model"
                className="input"
                value={form.model}
                onChange={(e) => handleChange("model", e.target.value)}
              />
              {errors.model && (
                <p className="text-red-500 text-sm">{errors.model}</p>
              )}
            </div>

            {/* Registration */}
            <div>
              <input
                type="text"
                placeholder="Registration Number"
                className="input"
                value={form.registration}
                onChange={(e) => handleChange("registration", e.target.value)}
              />
              {errors.registration && (
                <p className="text-red-500 text-sm">{errors.registration}</p>
              )}
            </div>

            {/* Seating */}
            <div>
              <input
                type="number"
                placeholder="Seating Capacity"
                className="input"
                value={form.seating}
                onChange={(e) => handleChange("seating", e.target.value)}
              />
              {errors.seating && (
                <p className="text-red-500 text-sm">{errors.seating}</p>
              )}
            </div>

            {/* Offer Ride */}
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
                    checked={form.offerRide === "yes"}
                    onChange={(e) => handleChange("offerRide", e.target.value)}
                  />
                  Yes
                </label>
                <label className="w-full block border border-gray-600 rounded-lg px-4 py-3 cursor-pointer hover:border-[var(--accent)] transition">
                  <input
                    type="radio"
                    name="offerRide"
                    value="no"
                    checked={form.offerRide === "no"}
                    onChange={(e) => handleChange("offerRide", e.target.value)}
                  />
                  No
                </label>
              </div>
              {errors.offerRide && (
                <p className="text-red-500 text-sm">{errors.offerRide}</p>
              )}
            </div>

            {/* AC Available */}
            <div className="flex items-center justify-between border border-gray-600 rounded-lg px-4 py-3">
              <span className="text-sm text-[var(--muted)]">AC Available</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={form.acAvailable}
                  onChange={(e) => handleChange("acAvailable", e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:bg-[var(--accent)] transition"></div>
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition peer-checked:translate-x-5"></div>
              </label>
            </div>
          </div>

          {/* Submit */}
          <div className="p-6 border-t border-gray-700">
            <button
              type="button"
              className="btn-primary w-full"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Continue"}
            </button>
          </div>
        </div>
      </section>

      <Footer />

      {/* OTP Modal */}
      <OtpModal isOpen={showOtp} onClose={() => setShowOtp(false)} />

      {/* Popup */}
      <Popup
        isOpen={popup.open}
        type={popup.type}
        message={popup.message}
        onClose={() => setPopup({ ...popup, open: false })}
      />
    </main>
  );
}
