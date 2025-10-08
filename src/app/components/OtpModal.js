"use client";

import { useState, useEffect } from "react";

export default function OtpModal({ isOpen, onClose, onVerify, userData })
{
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [timer, setTimer] = useState(60);
  const [resendEnabled, setResendEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Reset on open
  useEffect(() =>
  {
    if (isOpen)
    {
      setOtp(Array(6).fill(""));
      setTimer(60);
      setResendEnabled(false);
      setError("");
      setSuccessMsg("");
    }
  }, [isOpen]);

  // Countdown for resend
  useEffect(() =>
  {
    if (isOpen && timer > 0)
    {
      const countdown = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(countdown);
    } else if (timer === 0)
    {
      setResendEnabled(true);
    }
  }, [timer, isOpen]);

  // OTP input handler
  const handleChange = (value, index) =>
  {
    if (/^\d?$/.test(value))
    {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5)
      {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  // Handle Verify
  const handleVerify = async () =>
  {
    const enteredOtp = otp.join("");
    if (enteredOtp.length !== 6)
    {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);
    setError("");
    try
    {
      await onVerify(enteredOtp);
      setSuccessMsg("OTP verified successfully!");
      setTimeout(onClose, 1200);
    } catch (err)
    {
      setError(err.message || "Verification failed");
    } finally
    {
      setLoading(false);
    }
  };

  // Handle Resend OTP → re-hit register API
  const handleResend = async () =>
  {
    if (!userData) return;
    setResending(true);
    setError("");
    setSuccessMsg("");

    try
    {
      const res = await fetch("https://alfamilys.vercel.app/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to resend OTP");

      setTimer(60);
      setResendEnabled(false);
      setSuccessMsg("OTP resent successfully!");
    } catch (err)
    {
      setError(err.message || "Failed to resend OTP");
    } finally
    {
      setResending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-[var(--card)] rounded-2xl shadow-lg w-full max-w-md p-8 text-center space-y-6 relative">
        {/* Close */}
        <button
          onClick={onClose}
          disabled={loading || resending}
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

        {/* Timer / Resend */}
        <div className="text-sm text-[var(--muted)]">
          {!resendEnabled ? (
            <p>
              Resend OTP in{" "}
              <span className="text-[var(--accent)] font-semibold">
                00:{timer.toString().padStart(2, "0")}
              </span>
            </p>
          ) : (
            <button
              onClick={handleResend}
              disabled={resending}
              className="text-[var(--accent)] font-semibold hover:underline disabled:opacity-60"
            >
              {resending ? "Resending..." : "Resend OTP"}
            </button>
          )}
        </div>

        {/* Error / Success */}
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {successMsg && <p className="text-green-500 text-sm">{successMsg}</p>}

        {/* Verify Button */}
        <button
          onClick={handleVerify}
          disabled={loading}
          className="btn-primary w-full flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
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
          {loading ? "Verifying..." : "Verify"}
        </button>
      </div>
    </div>
  );
}
