"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BaseModal from "@/app/components/BaseModal";

export default function LoginModal({ isOpen, onClose }) {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [apiError, setApiError] = useState("");
  const [isForgot, setIsForgot] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
    setSuccess("");
    setApiError("");
  };

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^.{6,}$/; // Allow 6+ chars for now

    if (!form.email) newErrors.email = "Email is required";
    else if (!emailRegex.test(form.email)) newErrors.email = "Invalid email format";

    if (!isForgot) {
      if (!form.password) newErrors.password = "Password is required";
      else if (!passwordRegex.test(form.password))
        newErrors.password = "Password must be at least 6 characters";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);
    setSuccess("");
    setApiError("");

    if (Object.keys(newErrors).length > 0) return;

    if (isForgot) {
      setSuccess("📧 Reset link sent to your email!");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data?.error || "Invalid credentials");

      // Save token + user info in localStorage
      const role = data?.role || (form.email.includes("driver") ? "driver" : "rider");
      localStorage.setItem(
        "user",
        JSON.stringify({
          email: data.email,
          role,
          token: data.token,
        })
      );

      setSuccess("✅ Login successful!");
      setTimeout(() => {
        setForm({ email: "", password: "" });
        onClose();
        router.push(`/${role}/home`);
      }, 1500);
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-xl font-bold mb-4 text-center">
        {isForgot ? "Forgot Password 🔒" : "Login 🔑"}
      </h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar"
      >
        {/* Email */}
        <div>
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className="input"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email}</p>
          )}
        </div>


        {!isForgot && (
          <div>
            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => handleChange("password", e.target.value)}
              className="input"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}
          </div>
        )}


        {apiError && (
          <p className="text-red-500 text-center text-sm">{apiError}</p>
        )}
        {success && (
          <p className="text-green-500 text-center text-sm">{success}</p>
        )}


        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full flex justify-center items-center gap-2"
        >
          {loading && (
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
          {isForgot ? "Send Reset Link" : "Login"}
        </button>

        {!isForgot ? (
          <p className="text-sm text-center">
            <button
              type="button"
              className="text-blue-500 hover:underline"
              onClick={() => {
                setIsForgot(true);
                setErrors({});
                setSuccess("");
                setApiError("");
              }}
            >
              Forgot Password?
            </button>
          </p>
        ) : (
          <p className="text-sm text-center">
            <button
              type="button"
              className="text-blue-500 hover:underline"
              onClick={() => {
                setIsForgot(false);
                setErrors({});
                setSuccess("");
                setApiError("");
              }}
            >
              Back to Login
            </button>
          </p>
        )}
      </form>
    </BaseModal>
  );
}
