"use client";

import { useState } from "react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import OtpModal from "@/app/components/OtpModal";

export default function RiderSignup() {
  const [showOtp, setShowOtp] = useState(false);
  const [loadingEmp, setLoadingEmp] = useState(false);
  const [errors, setErrors] = useState({});
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

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));

    if (field === "empid" && /^\d{5}$/.test(value)) {
      fetchEmployee(value);
    }
  };

  const fetchEmployee = async (id) => {
    try {
      setLoadingEmp(true);
      setErrors((prev) => ({ ...prev, empid: "" }));

      const res = await fetch(`/api/employees/${id}`);
      if (!res.ok) throw new Error("Employee not found");

      const data = await res.json();

      setForm((prev) => ({
        ...prev,
        fullName: data.fullName || "",
        email: data.email || "",
        department: data.department || "",
        designation: data.designation || "",
      }));
    } catch (err) {
      setErrors((prev) => ({ ...prev, empid: "Employee not found" }));
    } finally {
      setLoadingEmp(false);
    }
  };

  const validate = () => {
    let newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    const mobileRegex = /^\+92-\d{3}-\d{7}$/;
    const cnicRegex = /^\d{5}-\d{7}-\d{1}$/;

    if (!form.empid) newErrors.empid = "Employee ID is required";
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      setShowOtp(true);
    }
  };

  return (
    <main className="bg-[var(--background)] text-[var(--foreground)] h-screen flex flex-col overflow-hidden">
      <Navbar />

      <section className="flex-1 flex items-center justify-center px-6 py-8 overflow-hidden">
        <div className="w-full max-w-lg bg-[var(--card)] rounded-2xl shadow-soft flex flex-col h-full max-h-[85vh]">
          {/* Header */}
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-2xl font-bold text-center">Rider Registration 🙋</h2>
            <p className="text-[var(--muted)] text-center text-sm mt-1">
              Register as a rider and request rides from colleagues.
            </p>
          </div>

          {/* Scrollable Form */}
          <form
            onSubmit={handleSubmit}
            className="flex-1 overflow-y-auto px-6 py-4 space-y-4"
          >
            {/* Employee ID */}
            <div className="relative">
              <input
                type="text"
                placeholder="Employee ID"
                className="input pr-10"
                maxLength={5}
                value={form.empid}
                onChange={(e) =>
                  handleChange("empid", e.target.value.replace(/[^0-9]/g, ""))
                }
              />
              {loadingEmp && (
                <div className="absolute right-3 top-3">
                  <svg
                    className="animate-spin h-5 w-5 text-[var(--accent)]"
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
                </div>
              )}
              {errors.empid && (
                <p className="text-red-500 text-sm">{errors.empid}</p>
              )}
            </div>

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
                onChange={(e) => {
                  const val = e.target.value.replace(/[^0-9+-]/g, "");
                  handleChange("mobile", val);
                }}
              />
              {errors.mobile && (
                <p className="text-red-500 text-sm">{errors.mobile}</p>
              )}
            </div>

            {/* Department */}
            <div>
              <input
                type="text"
                placeholder="Department"
                className="input"
                value={form.department}
                onChange={(e) => handleChange("department", e.target.value)}
              />
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
                onChange={(e) => {
                  const val = e.target.value.replace(/[^0-9-]/g, "");
                  handleChange("cnic", val);
                }}
              />
              {errors.cnic && (
                <p className="text-red-500 text-sm">{errors.cnic}</p>
              )}
            </div>
          </form>

          {/* Submit */}
          <div className="p-6 border-t border-gray-700">
            <button type="button" className="btn-primary w-full" onClick={handleSubmit}>
              Continue
            </button>
          </div>
        </div>
      </section>

      <Footer />
      <OtpModal isOpen={showOtp} onClose={() => setShowOtp(false)} />
    </main>
  );
}
