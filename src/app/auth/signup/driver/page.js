"use client";

import { useState } from "react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import OtpModal from "@/app/components/OtpModal";

export default function DriverSignup()
{
  const [showOtp, setShowOtp] = useState(false);
  const [apiMessage, setApiMessage] = useState({ type: "", text: "" });
  const [submitting, setSubmitting] = useState(false);
  const [userId, setUserId] = useState(null);

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

  const [errors, setErrors] = useState({});

  const handleChange = (field, value) =>
  {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const formatMobile = (value) =>
  {
    let cleaned = value.replace(/[^0-9]/g, "");
    if (cleaned.startsWith("92")) cleaned = "+" + cleaned;
    else if (cleaned.startsWith("0")) cleaned = "+92" + cleaned.slice(1);
    else if (!cleaned.startsWith("+92")) cleaned = "+92" + cleaned;

    if (cleaned.length > 3 && cleaned.length <= 6)
      cleaned = cleaned.slice(0, 3) + "-" + cleaned.slice(3);
    else if (cleaned.length > 6 && cleaned.length <= 10)
      cleaned = cleaned.slice(0, 3) + "-" + cleaned.slice(3, 6) + "-" + cleaned.slice(6);
    else if (cleaned.length > 10)
      cleaned = cleaned.slice(0, 3) + "-" + cleaned.slice(3, 6) + "-" + cleaned.slice(6, 13);
    return cleaned;
  };


  const formatCnic = (value) =>
  {
    let cleaned = value.replace(/[^0-9]/g, "");
    if (cleaned.length <= 5) return cleaned;
    if (cleaned.length <= 12)
      return `${cleaned.slice(0, 5)}-${cleaned.slice(5)}`;
    if (cleaned.length <= 13)
      return `${cleaned.slice(0, 5)}-${cleaned.slice(5, 12)}-${cleaned.slice(12)}`;
    return `${cleaned.slice(0, 5)}-${cleaned.slice(5, 12)}-${cleaned.slice(12, 13)}`;
  };


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

  const handleSubmit = async (e) =>
  {
    e.preventDefault();
    setApiMessage({ type: "", text: "" });

    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setSubmitting(true);
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
        registrationNumber: form.registration,
        seatingCapacity: Number(form.seating),
        willingToOfferRide: form.offerRide === "yes",
        acAvailable: form.acAvailable,
      };

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to register");

      setUserId(data.userId);
      setShowOtp(true);
      setApiMessage({
        type: "success",
        text: "✅ OTP sent! Please verify your email to complete registration.",
      });
    } catch (err)
    {
      setApiMessage({ type: "error", text: err.message });
    } finally
    {
      setSubmitting(false);
    }
  };


  const handleVerifyOtp = async (otp) =>
  {
    if (!userId) return;
    try
    {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Invalid OTP");

      setShowOtp(false);
      setApiMessage({
        type: "success",
        text: "🎉 Registration successful! You can now log in.",
      });
    } catch (err)
    {
      setApiMessage({ type: "error", text: "❌ " + err.message });
    }
  };

  return (
    <main className="bg-[var(--background)] text-[var(--foreground)] min-h-screen flex flex-col overflow-hidden">
      <Navbar />

      <section className="flex-1 flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-lg bg-[var(--card)] rounded-2xl shadow-soft flex flex-col h-full max-h-[85vh]">
          {/* Header */}
          <div className="p-6 border-b border-gray-700 text-center">
            <h2 className="text-2xl font-bold">Driver Registration 🚗</h2>
            <p className="text-[var(--muted)] text-sm mt-1">
              Register as a driver and offer rides to your colleagues.
            </p>
          </div>

          {/* Scrollable Form */}
          <form
            onSubmit={handleSubmit}
            className="flex-1 overflow-y-auto px-6 py-4 space-y-4 custom-scrollbar"
          >
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
                  onChange={(e) =>
                  {
                    if (key === "mobile")
                      handleChange("mobile", formatMobile(e.target.value));
                    else if (key === "cnic")
                      handleChange("cnic", formatCnic(e.target.value));
                    else handleChange(key, e.target.value);
                  }}
                />
                {errors[key] && (
                  <p className="text-red-500 text-sm">{errors[key]}</p>
                )}
              </div>
            ))}

            {/* Department */}
            <div>
              <select
                className="input appearance-none font-normal text-[var(--foreground)]"
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
              {errors.department && (
                <p className="text-red-500 text-sm">{errors.department}</p>
              )}
            </div>

            {/* Vehicle Type */}
            <div>
              <select
                className="input appearance-none font-normal text-[var(--foreground)]"
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
              {errors.vehicleType && (
                <p className="text-red-500 text-sm">{errors.vehicleType}</p>
              )}
            </div>

            {/* Offer Ride */}
            <div>
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

            {/* Submit */}
            <button
              type="submit"
              className="btn-primary w-full flex justify-center items-center gap-2 mt-6"
              disabled={submitting}
            >
              {submitting && (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
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
              )}
              Continue
            </button>
          </form>

          {/* Bottom Message */}
          {apiMessage.text && (
            <div
              className={`text-center text-sm px-4 py-2 ${apiMessage.type === "success"
                ? "bg-green-600/20 text-green-400"
                : "bg-red-600/20 text-red-400"
                }`}
            >
              {apiMessage.text}
            </div>
          )}
        </div>
      </section>

      <Footer />

      <OtpModal
        isOpen={showOtp}
        onClose={() => setShowOtp(false)}
        onVerify={handleVerifyOtp}
      />
    </main>
  );
}
