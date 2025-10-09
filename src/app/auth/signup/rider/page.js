"use client";

import { useState } from "react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import OtpModal from "@/app/components/OtpModal";

export default function RiderSignup() {
  const [showOtp, setShowOtp] = useState(false);
  const [apiMessage, setApiMessage] = useState({ type: "", text: "" });
  const [submitting, setSubmitting] = useState(false);
  const [userId, setUserId] = useState(null);

  const [form, setForm] = useState({
    // empid: "", // 🔸 commented as requested
    fullName: "",
    email: "",
    mobile: "",
    department: "",
    designation: "",
    password: "",
    cnic: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };


  const formatMobile = (value) => {
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


  const formatCnic = (value) => {
    let cleaned = value.replace(/[^0-9]/g, "");
    if (cleaned.length <= 5) return cleaned;
    if (cleaned.length <= 12)
      return `${cleaned.slice(0, 5)}-${cleaned.slice(5)}`;
    if (cleaned.length <= 13)
      return `${cleaned.slice(0, 5)}-${cleaned.slice(5, 12)}-${cleaned.slice(12)}`;
    return `${cleaned.slice(0, 5)}-${cleaned.slice(5, 12)}-${cleaned.slice(12, 13)}`;
  };


  const validate = () => {
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
      newErrors.password =
        "At least 8 chars, uppercase, lowercase & number required";

    if (!form.cnic) newErrors.cnic = "CNIC is required";
    else if (!cnicRegex.test(form.cnic))
      newErrors.cnic = "Format: 12345-6789012-3";

    return newErrors;
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiMessage({ type: "", text: "" });

    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: "rider",
          fullName: form.fullName,
          email: form.email,
          mobile: form.mobile,
          department: form.department,
          designation: form.designation,
          password: form.password,
          cnic: form.cnic,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to register");

      setUserId(data.userId);
      setShowOtp(true);
       setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (err) {
      setApiMessage({ type: "error", text: "❌ " + err.message });
    } finally {
      setSubmitting(false);
    }
  };


  const handleVerifyOtp = async (otp) => {
    if (!userId) return;
    try {
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
    } catch (err) {
      setApiMessage({ type: "error", text: "❌ " + err.message });
    }
  };

  return (
    <main className="bg-[var(--background)] text-[var(--foreground)] min-h-screen flex flex-col overflow-hidden">
      <Navbar />

   
      <section className="flex-1 flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-lg bg-[var(--card)] rounded-2xl shadow-soft flex flex-col h-full max-h-[85vh]">
         
          <div className="p-6 border-b border-gray-700 text-center">
            <h2 className="text-2xl font-bold">Rider Registration 🙋</h2>
            <p className="text-[var(--muted)] text-sm mt-1">
              Register as a rider and request rides from colleagues.
            </p>
          </div>

         
          <form
            onSubmit={handleSubmit}
            className="flex-1 overflow-y-auto px-6 py-4 space-y-4 custom-scrollbar"
          >
            {/* 🔸 Employee ID field commented out
            <div>
              <input
                type="text"
                placeholder="Employee ID (optional)"
                className="input opacity-60"
                value={form.empid}
                disabled
              />
            </div>
            */}

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

            <div>
              <input
                type="tel"
                placeholder="Mobile Number (+92-312-8907654)"
                className="input"
                value={form.mobile}
                onChange={(e) =>
                  handleChange("mobile", formatMobile(e.target.value))
                }
              />
              {errors.mobile && (
                <p className="text-red-500 text-sm">{errors.mobile}</p>
              )}
            </div>

            {/* Department */}
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
              {errors.department && (
                <p className="text-red-500 text-sm mt-2">{errors.department}</p>
              )}
            </div>

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

            <div>
              <input
                type="text"
                placeholder="CNIC (12345-6789012-3)"
                className="input"
                value={form.cnic}
                onChange={(e) => handleChange("cnic", formatCnic(e.target.value))}
              />
              {errors.cnic && (
                <p className="text-red-500 text-sm">{errors.cnic}</p>
              )}
            </div>

       
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
              className={`text-center text-sm px-4 py-2 ${
                apiMessage.type === "success"
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
