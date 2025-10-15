"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import OtpModal from "@/app/components/OtpModal";

export default function RiderSignup()
{
  const router = useRouter();
  const [showOtp, setShowOtp] = useState(false);
  const [apiMessage, setApiMessage] = useState({ type: "", text: "" });
  const [submitting, setSubmitting] = useState(false);
  const [userId, setUserId] = useState(null);

  const [form, setForm] = useState({
    empid: "",
    fullName: "",
    email: "",
    mobile: "",
    department: "",
    designation: "",
    password: "",
    cnic: "",
  });

  const [errors, setErrors] = useState({});

  // Handle input change
  const handleChange = (field, value) =>
  {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  // Format mobile number
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

  // Format CNIC
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

  // Validate form
  const validate = () =>
  {
    let newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    const mobileRegex = /^\+92-\d{3}-\d{7}$/;
    const cnicRegex = /^\d{5}-\d{7}-\d{1}$/;
    const empidRegex = /^\d{5}$/;

    if (!form.empid) newErrors.empid = "Employee ID is required";
    else if (!empidRegex.test(form.empid))
      newErrors.empid = "Must be 5 digits (e.g., 12345)";

    if (!form.fullName) newErrors.fullName = "Full name is required";

    if (!form.email) newErrors.email = "Email is required";
    else if (!emailRegex.test(form.email))
      newErrors.email = "Invalid email format";

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

    return newErrors;
  };

  // Handle submit
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
        role: "rider",
        fullName: form.fullName,
        email: form.email,
        mobile: form.mobile,
        department: form.department,
        designation: form.designation,
        password: form.password,
        cnic: form.cnic,
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
        text: "✅ OTP sent! Please verify your email.",
      });
    } catch (err)
    {
      setApiMessage({ type: "error", text: "❌ " + err.message });
    } finally
    {
      setSubmitting(false);
    }
  };

  // Handle OTP verification
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
        text: "🎉 Registration successful! Redirecting to login...",
      });

      setTimeout(() => router.push("/"), 2000);
    } catch (err)
    {
      setApiMessage({ type: "error", text: "❌ " + err.message });
    }
  };

  return (
    <main className="bg-[var(--background)] text-[var(--foreground)] min-h-screen flex flex-col overflow-hidden">
      <Navbar />

      <section className="flex-1 flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-lg bg-[var(--card)] rounded-2xl shadow-soft flex flex-col h-auto max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-gray-700 text-center">
            <h2 className="text-2xl font-bold">Rider Registration 🙋</h2>
            <p className="text-[var(--muted)] text-sm mt-1">
              Register as a rider and request rides from colleagues.
            </p>
          </div>

          {/* Scrollable Form */}
          <form
            onSubmit={handleSubmit}
            className="flex-1 overflow-y-auto px-6 py-4 space-y-4 custom-scrollbar"
          >
            {/* Employee ID */}
            <div>
              <input
                type="text"
                placeholder="Employee ID (5 digits)"
                maxLength={5}
                className="input"
                value={form.empid}
                onChange={(e) =>
                  handleChange("empid", e.target.value.replace(/[^0-9]/g, ""))
                }
              />
              {errors.empid && (
                <p className="text-red-500 text-sm">{errors.empid}</p>
              )}
            </div>

            {/* Other Inputs */}
            {[
              ["fullName", "Full Name", "text"],
              ["email", "Official Email", "email"],
              ["mobile", "Mobile Number (+92-XXX-XXXXXXX)", "tel"],
              ["designation", "Designation", "text"],
              ["password", "Password", "password"],
              ["cnic", "CNIC (12345-6789012-3)", "text"],
            ].map(([key, placeholder, type]) => (
              <div key={key}>
                <input
                  type={type}
                  placeholder={placeholder}
                  className="input"
                  value={form[key]}
                  onChange={(e) =>
                    key === "mobile"
                      ? handleChange("mobile", formatMobile(e.target.value))
                      : key === "cnic"
                        ? handleChange("cnic", formatCnic(e.target.value))
                        : handleChange(key, e.target.value)
                  }
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

          {/* API Message */}
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

      {/* OTP Modal */}
      <OtpModal
        isOpen={showOtp}
        onClose={() => setShowOtp(false)}
        onVerify={handleVerifyOtp}
      />
    </main>
  );
}
