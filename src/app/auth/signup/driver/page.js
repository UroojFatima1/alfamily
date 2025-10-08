"use client";

import { useState } from "react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import OtpModal from "@/app/components/OtpModal";
import Popup from "@/app/components/popup";

export default function DriverSignup()
{
  const [showOtp, setShowOtp] = useState(false);
  const [userId, setUserId] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [popup, setPopup] = useState({ open: false, type: "info", message: "" });

  const [form, setForm] = useState({
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

  const handleChange = (field, value) =>
  {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // Validate form
  const validate = () =>
  {
    let newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    const mobileRegex = /^\+92-\d{3}-\d{7}$/;
    const cnicRegex = /^\d{5}-\d{7}-\d{1}$/;

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
    else if (!cnicRegex.test(form.cnic))
      newErrors.cnic = "Format: 12345-6789012-3";

    if (!form.vehicleType) newErrors.vehicleType = "Vehicle type is required";
    if (!form.model) newErrors.model = "Make & Model is required";
    if (!form.registration) newErrors.registration = "Registration number is required";
    if (!form.seating) newErrors.seating = "Seating capacity is required";
    if (!form.offerRide) newErrors.offerRide = "Please select Yes or No";

    return newErrors;
  };

  // Submit form
  const handleSubmit = async () =>
  {
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setSubmitting(true);
    document.body.style.cursor = "wait";
    try
    {
      const payload = {
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
        registration: form.registration,
        seating: Number(form.seating),
        offerRide: form.offerRide === "yes",
        acAvailable: form.acAvailable,
      };

      console.log("Driver Payload:", payload);

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      console.log("Response Status:", res.status);
      const data = await res.json().catch(() => ({}));
      console.log("Response Body:", data);

      if (res.ok && data.userId)
      {
        setUserId(data.userId);
        setShowOtp(true);
        setPopup({
          open: true,
          type: "success",
          message: "OTP sent! Please verify to complete registration.",
        });
      } else
      {
        setPopup({
          open: true,
          type: "error",
          message: data.message || "Registration failed",
        });
      }
    } catch (err)
    {
      console.error("Driver register error:", err);
      setPopup({ open: true, type: "error", message: "Network error" });
    } finally
    {
      setSubmitting(false);
      document.body.style.cursor = "default";
    }
  };

  // Verify OTP
  const handleVerifyOtp = async (enteredOtp) =>
  {
    try
    {
      const res = await fetch("https://alfamilys.vercel.app/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, otp: enteredOtp }),
      });

      const data = await res.json();
      if (res.ok)
      {
        setPopup({
          open: true,
          type: "success",
          message: "Driver verified successfully! ✅",
        });
        setShowOtp(false);
      } else
      {
        throw new Error(data.message || "Invalid OTP");
      }
    } catch (err)
    {
      throw new Error(err.message || "Verification failed");
    }
  };

  return (
    <main className="bg-[var(--background)] text-[var(--foreground)] min-h-screen flex flex-col">
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

          {/* Scrollable Form */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {[
              ["fullName", "Full Name", "text"],
              ["email", "Official Email", "email"],
              ["mobile", "Mobile Number (+92-XXX-XXXXXXX)", "tel"],
              ["designation", "Designation", "text"],
              ["password", "Password", "password"],
              ["cnic", "CNIC (12345-6789012-3)", "text"],
              ["model", "Make & Model", "text"],
              ["registration", "Registration Number", "text"],
              ["seating", "Seating Capacity", "number"],
            ].map(([key, placeholder, type]) => (
              <div key={key}>
                <input
                  type={type}
                  placeholder={placeholder}
                  className="input"
                  value={form[key]}
                  onChange={(e) => handleChange(key, e.target.value)}
                />
                {errors[key] && (
                  <p className="text-red-500 text-sm">{errors[key]}</p>
                )}
              </div>
            ))}

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
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </span>
              </div>
              {errors.department && (
                <p className="text-red-500 text-sm">{errors.department}</p>
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
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </span>
              </div>
              {errors.vehicleType && (
                <p className="text-red-500 text-sm">{errors.vehicleType}</p>
              )}
            </div>

            {/* Offer Ride */}
            <div className="mt-2">
              <span className="block text-sm text-[var(--muted)] mb-1">
                Willing to Offer Rides?
              </span>
              <div className="flex gap-4">
                {["yes", "no"].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => handleChange("offerRide", opt)}
                    className={`flex-1 py-2 rounded-lg border text-center transition ${form.offerRide === opt
                      ? "bg-[var(--accent)] text-white border-[var(--accent)]"
                      : "border-gray-600 hover:border-[var(--accent)] text-[var(--foreground)]"
                      }`}
                  >
                    {opt === "yes" ? "Yes" : "No"}
                  </button>
                ))}
              </div>
              {errors.offerRide && (
                <p className="text-red-500 text-sm">{errors.offerRide}</p>
              )}
            </div>

            {/* AC Toggle */}
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

      <OtpModal
        isOpen={showOtp}
        onClose={() => setShowOtp(false)}
        onVerify={handleVerifyOtp}
      />

      <Popup
        isOpen={popup.open}
        type={popup.type}
        message={popup.message}
        onClose={() => setPopup({ ...popup, open: false })}
      />
    </main>
  );
}
