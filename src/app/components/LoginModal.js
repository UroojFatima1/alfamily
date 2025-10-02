"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BaseModal from "@/app/components/BaseModal";

export default function LoginModal({ isOpen, onClose }) {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [isForgot, setIsForgot] = useState(false);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
    setSuccess("");
  };

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

    if (!form.email) newErrors.email = "Email is required";
    else if (!emailRegex.test(form.email)) newErrors.email = "Invalid email";

    if (!isForgot) {
      if (!form.password) newErrors.password = "Password is required";
      else if (!passwordRegex.test(form.password))
        newErrors.password =
          "Password must be at least 8 characters and include a special character";
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      if (isForgot) {
        setSuccess("📧 Reset link sent to your email!");
      } else {
        // 👉 Decide role from email (or later from API response)
        const role = form.email.includes("driver") ? "driver" : "rider";

        // ✅ Save user in localStorage
        localStorage.setItem(
          "user",
          JSON.stringify({
            email: form.email,
            role: role,
            token: "mock-jwt-token", // replace with real API token
          })
        );

        setSuccess("✅ Login successful!");
        setTimeout(() => {
          setForm({ email: "", password: "" });
          setErrors({});
          setSuccess("");
          onClose();
          router.push(`/${role}/home`);
        }, 1200);
      }
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

        {success && <p className="text-green-500 text-sm">{success}</p>}

        <button type="submit" className="btn-primary w-full">
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
