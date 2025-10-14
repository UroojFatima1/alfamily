"use client";

import dynamic from "next/dynamic";
import { useState, useEffect, useMemo } from "react";
import { MapPin, LocateFixed } from "lucide-react";
import BaseModal from "@/app/components/BaseModal";


const MapContainer = dynamic(() => import("react-leaflet").then((m) => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((m) => m.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((m) => m.Marker), { ssr: false });

const karachiCenter = [24.8607, 67.0011];

async function getAddress(lat, lon)
{
  try
  {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`);
    const data = await res.json();
    return data.display_name || "Unknown location";
  } catch
  {
    return "Unknown location";
  }
}

function LocationPicker({ type, setForm })
{
  const { useMapEvents } = require("react-leaflet");
  useMapEvents({
    click: async (e) =>
    {
      const { lat, lng } = e.latlng;
      const address = await getAddress(lat, lng);
      setForm((prev) => ({
        ...prev,
        [`${type}`]: address,
        [`${type}Coords`]: { latitude: lat, longitude: lng },
      }));
    },
  });
  return null;
}

export default function RideRequestModal({ isOpen, onClose, onSuccess })
{
  const [form, setForm] = useState({
    pickup: "",
    drop: "",
    pickupCoords: null,
    dropCoords: null,
    date: "",
    time: "",
    requestedSeats: 1,
    notes: "",
    rideDirection: "office-to-home",
  });
  const [selectedMap, setSelectedMap] = useState("pickup");
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState({ pickup: false, drop: false });
  const [userRole, setUserRole] = useState("");
  const today = new Date().toISOString().split("T")[0];

  useEffect(() =>
  {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    setUserRole(storedUser?.user?.role || "");
  }, []);

  const yellowIcon = useMemo(() =>
  {
    if (typeof window === "undefined") return null;
    const L = require("leaflet");
    return new L.Icon({
      iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png",
      shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });
  }, []);

  if (!isOpen) return null;

  const validate = () =>
  {
    const newErrors = {};
    if (!form.pickup) newErrors.pickup = "Pickup location is required";
    if (!form.drop) newErrors.drop = "Drop location is required";
    if (!form.date) newErrors.date = "Date is required";
    if (!form.time) newErrors.time = "Time is required";
    return newErrors;
  };


  const getCurrentLocation = (type) =>
  {
    if (!navigator.geolocation) return;
    setLocating((prev) => ({ ...prev, [type]: true }));

    navigator.geolocation.getCurrentPosition(
      async (pos) =>
      {
        const { latitude, longitude } = pos.coords;
        const address = await getAddress(latitude, longitude);

        setForm((prev) => ({
          ...prev,
          [`${type}`]: address,
          [`${type}Coords`]: { latitude, longitude },
        }));

        setLocating((prev) => ({ ...prev, [type]: false }));
      },
      () => setLocating((prev) => ({ ...prev, [type]: false }))
    );
  };

  const handleSubmit = async (e) =>
  {
    e.preventDefault();
    setApiError("");

    if (userRole === "driver")
    {
      setApiError("Drivers cannot request rides.");
      return;
    }

    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length) return;

    const payload = {
      pickupLocation: {
        latitude: form.pickupCoords?.latitude,
        longitude: form.pickupCoords?.longitude,
        address: form.pickup,
      },
      dropLocation: {
        latitude: form.dropCoords?.latitude,
        longitude: form.dropCoords?.longitude,
        address: form.drop,
      },
      dateTime: new Date(`${form.date}T${form.time}`).toISOString(),
      requestedSeats: Number(form.requestedSeats),
      notes: form.notes,
      rideDirection: form.rideDirection,
    };

    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    const token = storedUser?.token;

    try
    {
      setLoading(true);
      const res = await fetch("/api/rides/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Request failed");
      console.log("✅ Ride requested:", data);
      onSuccess(payload);
      onClose();
    } catch (err)
    {
      console.error("❌ API Error:", err);
      setApiError(err.message);
    } finally
    {
      setLoading(false);
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-xl font-bold mb-4 text-center">Request a Ride 🚗</h2>

      <form onSubmit={handleSubmit} className="space-y-4 max-h-[80vh] overflow-y-auto custom-scrollbar">
        {/* Pickup */}
        <div className="relative">
          <div className="flex items-center relative">
            <input
              type="text"
              placeholder="Pickup Location"
              className="input flex-1 pr-10"
              value={form.pickup}
              onChange={(e) => setForm((p) => ({ ...p, pickup: e.target.value }))}
            />
            <button
              type="button"
              onClick={() => getCurrentLocation("pickup")}
              className="absolute right-3 text-yellow-400"
              title="Use Current Location"
            >
              {locating.pickup ? (
                <svg className="animate-spin h-5 w-5 text-yellow-400" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              ) : (
                <LocateFixed className="w-5 h-5" />
              )}
            </button>
          </div>
          {errors.pickup && <p className="text-red-500 text-sm mt-1">{errors.pickup}</p>}
        </div>

        {/* Drop */}
        <div className="relative">
          <div className="flex items-center relative">
            <input
              type="text"
              placeholder="Drop Location"
              className="input flex-1 pr-10"
              value={form.drop}
              onChange={(e) => setForm((p) => ({ ...p, drop: e.target.value }))}
            />
            <button
              type="button"
              onClick={() => getCurrentLocation("drop")}
              className="absolute right-3 text-yellow-400"
              title="Use Current Location"
            >
              {locating.drop ? (
                <svg className="animate-spin h-5 w-5 text-yellow-400" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              ) : (
                <LocateFixed className="w-5 h-5" />
              )}
            </button>
          </div>
          {errors.drop && <p className="text-red-500 text-sm mt-1">{errors.drop}</p>}
        </div>

        {/* Map */}
        <div className="bg-[var(--card)] p-2 rounded-lg shadow-md">
          <div className="flex justify-between mb-2">
            <p className="text-sm text-gray-400">Click map to select {selectedMap} location</p>
            <div className="space-x-2">
              <button
                type="button"
                onClick={() => setSelectedMap("pickup")}
                className={`px-2 py-1 text-xs rounded ${selectedMap === "pickup" ? "bg-yellow-400 text-black" : "bg-gray-700 text-white"
                  }`}
              >
                Pickup
              </button>
              <button
                type="button"
                onClick={() => setSelectedMap("drop")}
                className={`px-2 py-1 text-xs rounded ${selectedMap === "drop" ? "bg-yellow-400 text-black" : "bg-gray-700 text-white"
                  }`}
              >
                Drop
              </button>
            </div>
          </div>

          <MapContainer center={karachiCenter} zoom={13} style={{ height: "250px", borderRadius: "10px" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='© OpenStreetMap contributors' />

            {selectedMap === "pickup" && (
              <>
                {form.pickupCoords && yellowIcon && (
                  <Marker position={[form.pickupCoords.latitude, form.pickupCoords.longitude]} icon={yellowIcon} />
                )}
                <LocationPicker type="pickup" setForm={setForm} />
              </>
            )}

            {selectedMap === "drop" && (
              <>
                {form.dropCoords && yellowIcon && (
                  <Marker position={[form.dropCoords.latitude, form.dropCoords.longitude]} icon={yellowIcon} />
                )}
                <LocationPicker type="drop" setForm={setForm} />
              </>
            )}
          </MapContainer>
        </div>

        {/* Date / Time */}
        <div className="flex gap-3">
          <div className="flex-1">
            <input
              type="date"
              min={today}
              className="input"
              value={form.date}
              onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
            />
            {errors.date && <p className="text-red-500 text-sm">{errors.date}</p>}
          </div>
          <div className="flex-1">
            <input
              type="time"
              className="input"
              value={form.time}
              onChange={(e) => setForm((p) => ({ ...p, time: e.target.value }))}
            />
            {errors.time && <p className="text-red-500 text-sm">{errors.time}</p>}
          </div>
        </div>

        {/* Seats */}
        <input
          type="number"
          min="1"
          max="4"
          className="input"
          value={form.requestedSeats}
          onChange={(e) => setForm((p) => ({ ...p, requestedSeats: e.target.value }))}
        />

        {/* Notes */}
        <textarea
          placeholder="Notes (optional)"
          className="input"
          rows="3"
          value={form.notes}
          onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
        />

        {/* API or Role Error */}
        {apiError && (
          <div className="bg-red-600 text-white p-2 text-center rounded-md">
            {apiError}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`btn-primary w-full flex justify-center items-center ${userRole === "driver" ? "opacity-50 cursor-not-allowed" : ""
            }`}
        >
          {loading ? "Submitting..." : userRole === "driver" ? "Drivers cannot request rides" : "Submit Request"}
        </button>
      </form>
    </BaseModal>
  );
}
