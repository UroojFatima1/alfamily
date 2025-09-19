"use client";

import { useState, useEffect } from "react";

export default function OtpModal({ isOpen, onClose }) {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [timer, setTimer] = useState(60);
  const [resendEnabled, setResendEnabled] = useState(false);

  // Timer
  useEffect(() => {
    if (isOpen && timer > 0) {
      const countdown = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(countdown);
    } else if (timer === 0) {
      setResendEnabled(true);
    }
  }, [timer, isOpen]);

  // OTP input
  const handleChange = (value, index) => {
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="bg-[var(--card)] rounded-2xl shadow-lg w-full max-w-md p-8 text-center space-y-6 relative">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-[var(--muted)] hover:text-[var(--accent)]"
        >
          ✕
        </button>

        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-14 h-14 rounded-full bg-[var(--accent)] flex items-center justify-center">
            <svg
              className="w-7 h-7 text-[var(--background)]"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 11c0 .667.333 1 1 1s1-.333 1-1-.333-1-1-1-1 .333-1 1zm0 4h.01M21 12c0 4.971-4.029 9-9 9s-9-4.029-9-9 4.029-9 9-9 9 4.029 9 9z"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold">OTP Verification</h2>
        <p className="text-[var(--muted)] text-sm">
          We’ve sent a 6-digit OTP to your official email.
        </p>

        {/* OTP Inputs */}
        <div className="flex justify-center gap-3">
          {otp.map((digit, i) => (
            <input
              key={i}
              id={`otp-${i}`}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(e.target.value, i)}
              className="w-12 h-12 text-center text-lg font-bold rounded-lg border border-gray-600 bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            />
          ))}
        </div>

        {/* Resend */}
        <div className="text-sm text-[var(--muted)] space-y-2">
          {!resendEnabled ? (
            <p>
              Resend OTP in{" "}
              <span className="text-[var(--accent)] font-semibold">
                00:{timer.toString().padStart(2, "0")}
              </span>
            </p>
          ) : (
            <button
              onClick={() => {
                setTimer(60);
                setResendEnabled(false);
              }}
              className="text-[var(--accent)] font-semibold hover:underline"
            >
              Resend OTP
            </button>
          )}
        </div>

        {/* Verify */}
        <button className="btn-primary w-full">Verify</button>
      </div>
    </div>
  );
}
