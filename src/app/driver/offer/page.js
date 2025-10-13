'use client';

import dynamic from "next/dynamic";
import { useState, useMemo } from "react";
import { LocateFixed } from "lucide-react";
import BaseModal from "@/app/components/BaseModal";

const MapContainer = dynamic(() => import("react-leaflet").then(m => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then(m => m.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then(m => m.Marker), { ssr: false });

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

// Click listener for map
function LocationPicker({ type, setForm })
{
  const { useMapEvents } = require("react-leaflet");
  useMapEvents({
    click: async (e) =>
    {
      const { lat, lng } = e.latlng;
      const address = await getAddress(lat, lng);
      setForm(prev => ({
        ...prev,
        [type]: address,
        [`${type}Coords`]: { latitude: lat, longitude: lng }
      }));
    },
  });
  return null;
}

export default function OfferRideModal({ isOpen, onClose, onSuccess })
{
  const [form, setForm] = useState({
    pickupType: "home-office",
    pickup: "",
    drop: "",
    pickupCoords: null,
    dropCoords: null,
    seats: "",
    date: "",
    time: "",
    notes: "",
    ac: "yes",
  });
  const [selectedMap, setSelectedMap] = useState("pickup");
  const [errors, setErrors] = useState({});
  const [locating, setLocating] = useState({ pickup: false, drop: false });
  const today = new Date().toISOString().split("T")[0];

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

  const handleChange = (field, value) =>
  {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: "" }));
  };

  const getCurrentLocation = (type) =>
  {
    if (!navigator.geolocation) return;
    setLocating(prev => ({ ...prev, [type]: true }));
    navigator.geolocation.getCurrentPosition(
      async (pos) =>
      {
        const { latitude, longitude } = pos.coords;
        const address = await getAddress(latitude, longitude);
        setForm(prev => ({
          ...prev,
          [type]: address,
          [`${type}Coords`]: { latitude, longitude },
        }));
        setLocating(prev => ({ ...prev, [type]: false }));
      },
      () => setLocating(prev => ({ ...prev, [type]: false }))
    );
  };

  const validate = () =>
  {
    const newErrors = {};
    if (!form.pickup.trim()) newErrors.pickup = "Pickup location is required";
    if (!form.drop.trim()) newErrors.drop = "Drop location is required";
    if (!form.seats || Number(form.seats) <= 0) newErrors.seats = "Seats must be at least 1";
    if (!form.date) newErrors.date = "Date is required";
    if (!form.time) newErrors.time = "Time is required";
    return newErrors;
  };

  const handleSubmit = (e) =>
  {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length) return;

    console.log("Offer Ride Submitted:", form);
    onClose();
    if (onSuccess) onSuccess(form);
  };

  if (!isOpen) return null;

  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-xl font-bold mb-4 text-center">Offer a Ride 🚗</h2>

      <form onSubmit={handleSubmit} className="space-y-4 max-h-[80vh] overflow-y-auto custom-scrollbar">
        {/* Pickup Type */}
        <div className="grid grid-cols-2 gap-0 rounded-lg overflow-hidden border border-gray-600">
          <button
            type="button"
            className={`py-2 font-semibold ${form.pickupType === "home-office"
              ? "bg-[var(--accent)] text-[var(--background)]"
              : "bg-[var(--background)] text-[var(--foreground)]"
              }`}
            onClick={() => handleChange("pickupType", "home-office")}
          >
            Home → Office
          </button>
          <button
            type="button"
            className={`py-2 font-semibold ${form.pickupType === "office-home"
              ? "bg-[var(--accent)] text-[var(--background)]"
              : "bg-[var(--background)] text-[var(--foreground)]"
              }`}
            onClick={() => handleChange("pickupType", "office-home")}
          >
            Office → Home
          </button>
        </div>

        {/* Pickup Location */}
        <div className="relative">
          <input
            type="text"
            placeholder="Pickup Location"
            value={form.pickup}
            onChange={(e) => handleChange("pickup", e.target.value)}
            className="input pr-10"
          />
          <button
            type="button"
            onClick={() => getCurrentLocation("pickup")}
            className="absolute right-3 top-2 text-yellow-400"
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
          {errors.pickup && <p className="text-red-500 text-sm">{errors.pickup}</p>}
        </div>

        {/* Drop Location */}
        <div className="relative">
          <input
            type="text"
            placeholder="Drop Location"
            value={form.drop}
            onChange={(e) => handleChange("drop", e.target.value)}
            className="input pr-10"
          />
          <button
            type="button"
            onClick={() => getCurrentLocation("drop")}
            className="absolute right-3 top-2 text-yellow-400"
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
          {errors.drop && <p className="text-red-500 text-sm">{errors.drop}</p>}
        </div>

        {/* Map Picker */}
        <div className="bg-[var(--card)] p-2 rounded-lg shadow-md">
          <div className="flex justify-between mb-2">
            <p className="text-sm text-gray-400">Click map to set {selectedMap} location</p>
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

        {/* Seats, Date, Time, etc */}
        <div className="flex gap-3">
          <div className="flex-1">
            <input type="date" min={today} value={form.date} onChange={(e) => handleChange("date", e.target.value)} className="input" />
            {errors.date && <p className="text-red-500 text-sm">{errors.date}</p>}
          </div>
          <div className="flex-1">
            <input type="time" value={form.time} onChange={(e) => handleChange("time", e.target.value)} className="input" />
            {errors.time && <p className="text-red-500 text-sm">{errors.time}</p>}
          </div>
        </div>

        <input
          type="number"
          min="1"
          placeholder="Available Seats"
          value={form.seats}
          onChange={(e) => handleChange("seats", e.target.value)}
          className="input"
        />
        {errors.seats && <p className="text-red-500 text-sm">{errors.seats}</p>}

        <textarea
          placeholder="Notes (Optional)"
          value={form.notes}
          onChange={(e) => handleChange("notes", e.target.value)}
          className="input"
          rows="3"
        />

        <div className="flex gap-4">
          <label className="flex items-center gap-2 border border-gray-600 rounded-lg px-4 py-2 cursor-pointer">
            <input
              type="radio"
              name="ac"
              value="yes"
              checked={form.ac === "yes"}
              onChange={(e) => handleChange("ac", e.target.value)}
            />
            AC
          </label>
          <label className="flex items-center gap-2 border border-gray-600 rounded-lg px-4 py-2 cursor-pointer">
            <input
              type="radio"
              name="ac"
              value="no"
              checked={form.ac === "no"}
              onChange={(e) => handleChange("ac", e.target.value)}
            />
            Non AC
          </label>
        </div>

        <button type="submit" className="btn-primary w-full">Submit Offer</button>
      </form>
    </BaseModal>
  );
}