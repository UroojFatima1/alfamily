"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Profile({ user, initialRole = "rider" })
{
  const [role, setRole] = useState(initialRole);
  const [pendingRole, setPendingRole] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showDriverForm, setShowDriverForm] = useState(false);

  const router = useRouter();

  const [driverData, setDriverData] = useState({
    vehicleType: "Car",
    model: "",
    registrationNumber: "",
    seatingCapacity: 4,
    willingToOfferRide: true,
    acAvailable: true,
  });

  const handleSwitch = (newRole) =>
  {
    if (role === newRole) return;
    setPendingRole(newRole);
    setMessage("");
  };

  const handleDriverChange = (field, value) =>
  {
    setDriverData((prev) => ({ ...prev, [field]: value }));
  };

  const confirmSwitch = async (confirm) =>
  {
    if (!confirm || !pendingRole)
    {
      setPendingRole(null);
      return;
    }

    if (pendingRole === "driver")
    {
      const storedDriver = localStorage.getItem("driverData");
      if (!storedDriver)
      {
        setShowDriverForm(true);
        setPendingRole(null);
        return;
      }
      await switchToDriver(JSON.parse(storedDriver));
    } else
    {
      await switchToRider();
    }
  };

  // ✅ Utility: Update cookie and localStorage
  const updateUserRole = (newRole, driverPayload = null) =>
  {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    const updatedUser = { ...storedUser, role: newRole };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    document.cookie = `user=${encodeURIComponent(JSON.stringify(updatedUser))}; path=/; max-age=31536000; SameSite=Lax`;

    if (driverPayload)
    {
      localStorage.setItem("driverData", JSON.stringify(driverPayload));
    }
  };

  // Switch to Driver
  const switchToDriver = async (driverPayload) =>
  {
    setLoading(true);
    try
    {
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      const token = storedUser?.token;

      const res = await fetch("/api/users/switch", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: "driver", ...driverPayload }),
      });

      const text = await res.text();
      const data = text ? JSON.parse(text) : {};
      if (!res.ok) throw new Error(data.error || "Failed to switch role");

      // ✅ Update storage + cookie
      updateUserRole("driver", driverPayload);

      setRole("driver");
      setMessage("✅ Successfully switched to Driver!");
      router.push("/driver/home");
    } catch (err)
    {
      setMessage(`❌ ${err.message}`);
    } finally
    {
      setLoading(false);
      setShowDriverForm(false);
      setPendingRole(null);
    }
  };

  // Switch to Rider
  const switchToRider = async () =>
  {
    setLoading(true);
    try
    {
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      const token = storedUser?.token;

      const res = await fetch("/api/users/switch", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: "rider" }),
      });

      const text = await res.text();
      const data = text ? JSON.parse(text) : {};
      if (!res.ok) throw new Error(data.error || "Failed to switch to rider");

      // ✅ Update storage + cookie
      updateUserRole("rider");

      setRole("rider");
      setMessage("✅ Switched back to Rider!");
      router.push("/rider/home");
    } catch (err)
    {
      setMessage(`❌ ${err.message}`);
    } finally
    {
      setLoading(false);
      setPendingRole(null);
    }
  };

  const handleSubmitDriverForm = async (e) =>
  {
    e.preventDefault();
    await switchToDriver(driverData);
  };

  return (
    <div className="w-full max-w-4xl bg-[var(--card)] rounded-2xl shadow-soft p-8 space-y-8">
      {/* Profile Header */}
      <div className="flex flex-col items-center text-center">
        <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-4xl">
          👤
        </div>
        <h2 className="text-2xl font-bold mt-4">{user.fullName}</h2>
        <p className="text-[var(--muted)] capitalize">
          {role === "driver" ? "Driver" : "Rider"} / {user.designation}
        </p>
      </div>

      {/* Personal Info */}
      <div className="bg-[var(--background)] rounded-xl p-6 shadow-inner space-y-2">
        <h3 className="font-semibold text-lg border-b border-gray-600 pb-2">
          Personal Information
        </h3>
        <p><span className="font-semibold">Full Name:</span> {user.fullName}</p>
        <p><span className="font-semibold">Email:</span> {user.email}</p>
        <p><span className="font-semibold">Mobile:</span> {user.mobile}</p>
        <p><span className="font-semibold">Department:</span> {user.department}</p>
        <p><span className="font-semibold">Designation:</span> {user.designation}</p>
        <p><span className="font-semibold">CNIC:</span> {user.cnic}</p>
        <p><span className="font-semibold">Verified:</span> {user.isVerified ? "✅ Yes" : "❌ No"}</p>
        <p><span className="font-semibold">Joined:</span> {new Date(user.createdAt).toLocaleDateString()}</p>
      </div>

      {/* Vehicle Info */}
      {role === "driver" && (
        <div className="bg-[var(--background)] rounded-xl p-6 shadow-inner space-y-2">
          <h3 className="font-semibold text-lg border-b border-gray-600 pb-2">
            Vehicle Information
          </h3>
          <p><span className="font-semibold">Type:</span> Car</p>
          <p><span className="font-semibold">Model:</span> {driverData.model || "Toyota Corolla"}</p>
          <p><span className="font-semibold">Registration #:</span> {driverData.registrationNumber || "LEA-1234"}</p>
          <p><span className="font-semibold">Seating Capacity:</span> {driverData.seatingCapacity} Passengers</p>
          <p><span className="font-semibold">AC:</span> Yes</p>
          <p><span className="font-semibold">Ride Availability:</span> Yes</p>
        </div>
      )}

      {/* Role Switcher */}
      <div className="bg-[var(--background)] rounded-xl p-6 shadow-inner">
        <h3 className="font-semibold text-lg mb-4">Switch Role</h3>
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => handleSwitch("rider")}
            className={`flex-1 px-6 py-3 rounded-lg border ${role === "rider"
              ? "bg-[var(--accent)] text-black font-semibold"
              : "border-gray-600 text-[var(--muted)] hover:border-[var(--accent)]"
              }`}
          >
            Rider
          </button>
          <button
            onClick={() => handleSwitch("driver")}
            className={`flex-1 px-6 py-3 rounded-lg border ${role === "driver"
              ? "bg-[var(--accent)] text-black font-semibold"
              : "border-gray-600 text-[var(--muted)] hover:border-[var(--accent)]"
              }`}
          >
            Driver
          </button>
        </div>

        {/* Confirmation */}
        {pendingRole && (
          <div className="p-4 border rounded-lg bg-[var(--background)] space-y-3">
            <p>
              Are you sure you want to switch to{" "}
              <span className="font-semibold">{pendingRole}</span> role?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => confirmSwitch(true)}
                disabled={loading}
                className="btn-primary flex-1"
              >
                {loading ? "Switching..." : "Yes"}
              </button>
              <button
                onClick={() => confirmSwitch(false)}
                className="border border-gray-600 rounded-lg px-6 py-2 flex-1 hover:border-[var(--accent)]"
              >
                No
              </button>
            </div>
          </div>
        )}

        {/* Driver Form */}
        {showDriverForm && (
          <form
            onSubmit={handleSubmitDriverForm}
            className="mt-6 space-y-3 p-4 border rounded-lg bg-[var(--background)]"
          >
            <h4 className="font-semibold text-lg">Enter Driver Details 🚗</h4>
            <input
              type="text"
              placeholder="Model (e.g. Toyota Corolla)"
              className="input w-full"
              value={driverData.model}
              onChange={(e) => handleDriverChange("model", e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Registration Number (e.g. LEA-1234)"
              className="input w-full"
              value={driverData.registrationNumber}
              onChange={(e) =>
                handleDriverChange("registrationNumber", e.target.value)
              }
              required
            />
            <input
              type="number"
              placeholder="Seating Capacity"
              className="input w-full"
              value={driverData.seatingCapacity}
              onChange={(e) =>
                handleDriverChange("seatingCapacity", parseInt(e.target.value))
              }
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? "Saving..." : "Submit & Switch"}
            </button>
          </form>
        )}

        {/* Message */}
        {message && (
          <p className="text-center mt-4 text-sm">
            {message.startsWith("✅") ? (
              <span className="text-green-500">{message}</span>
            ) : (
              <span className="text-red-500">{message}</span>
            )}
          </p>
        )}
      </div>
    </div>
  );
}
