"use client";
import { useState } from "react";
import { Car, User } from "lucide-react";

export default function RoleSwitcher({ activeRole = "rider", onRoleChange })
{
  const [selected, setSelected] = useState(activeRole);

  const handleSelect = (role) =>
  {
    setSelected(role);

    if (typeof onRoleChange === "function")
    {
      onRoleChange(role);
    }

    if (role === "driver")
    {
      const driverSection = document.getElementById("driver-form");
      if (driverSection)
      {
        driverSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else
    {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Heading */}
      <h4 className="text-lg font-semibold">Switch Role</h4>

      {/* Role Cards */}
      <div className="grid grid-cols-2 gap-4">
        {/* Rider */}
        <button
          onClick={() => handleSelect("rider")}
          className={`rounded-xl p-5 flex flex-col items-center justify-center text-center border transition shadow-inner
            ${selected === "rider"
              ? "bg-[var(--accent)] text-[var(--background)] border-[var(--accent)] shadow-md"
              : "bg-[var(--background)] border-gray-700 hover:border-[var(--accent)]"
            }`}
        >
          <User className="w-8 h-8 mb-2" />
          <p className="text-lg font-bold">Rider</p>
          <span className="text-sm text-[var(--muted)]">
            Request rides from colleagues
          </span>
        </button>

        {/* Driver */}
        <button
          onClick={() => handleSelect("driver")}
          className={`rounded-xl p-5 flex flex-col items-center justify-center text-center border transition shadow-inner
            ${selected === "driver"
              ? "bg-[var(--accent)] text-[var(--background)] border-[var(--accent)] shadow-md"
              : "bg-[var(--background)] border-gray-700 hover:border-[var(--accent)]"
            }`}
        >
          <Car className="w-8 h-8 mb-2" />
          <p className="text-lg font-bold">Driver</p>
          <span className="text-sm text-[var(--muted)]">
            Offer rides to colleagues
          </span>
        </button>
      </div>
    </div>
  );
}
