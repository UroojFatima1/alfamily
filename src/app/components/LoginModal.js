"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BaseModal from "@/app/components/BaseModal";

export default function LoginModal({ isOpen, onClose })
{
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [apiError, setApiError] = useState("");
  const [isForgot, setIsForgot] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) =>
  {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
    setSuccess("");
    setApiError("");
  };

  const validate = () =>
  {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!form.email) newErrors.email = "Email is required";
    else if (!emailRegex.test(form.email))
      newErrors.email = "Invalid email format";

    if (!isForgot)
    {
      if (!form.password) newErrors.password = "Password is required";
      else if (form.password.length < 6)
        newErrors.password = "Password must be at least 6 characters";
    }

    return newErrors;
  };

  const handleSubmit = async (e) =>
  {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);
    setSuccess("");
    setApiError("");

    if (Object.keys(newErrors).length > 0) return;

    if (isForgot)
    {
      setSuccess("📧 Reset link sent to your email!");
      return;
    }

    setLoading(true);

    try
    {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data?.error || "Invalid credentials");

      // ✅ Extract role correctly (your API nests it under user.role)
      const role = data?.user?.role || data?.role || "rider";

      // ✅ Store data locally for frontend
      localStorage.setItem("user", JSON.stringify(data));

      // ✅ Save in cookies for middleware
      document.cookie = `token=${data.token}; path=/; secure; samesite=strict`;
      document.cookie = `user=${encodeURIComponent(
        JSON.stringify(data.user || {})
      )}; path=/; secure; samesite=strict`;

      setSuccess("✅ Login successful!");
      setTimeout(() =>
      {
        setForm({ email: "", password: "" });
        onClose();
        router.push(`/${role}/home`);
      }, 1200);
    } catch (err)
    {
      setApiError(err.message);
    } finally
    {
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

        {/* Password */}
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

        {/* Messages */}
        {apiError && (
          <p className="text-red-500 text-center text-sm">{apiError}</p>
        )}
        {success && (
          <p className="text-green-500 text-center text-sm">{success}</p>
        )}

        {/* Submit */}
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

        {/* Forgot / Back */}
        <p className="text-sm text-center">
          <button
            type="button"
            className="text-blue-500 hover:underline"
            onClick={() =>
            {
              setIsForgot(!isForgot);
              setErrors({});
              setSuccess("");
              setApiError("");
            }}
          >
            {isForgot ? "Back to Login" : "Forgot Password?"}
          </button>
        </p>
      </form>
    </BaseModal>
  );
}
