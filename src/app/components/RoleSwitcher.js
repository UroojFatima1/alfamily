"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Car, User } from "lucide-react";

export default function RoleSwitcher() {
  const router = useRouter();
  const [selected, setSelected] = useState("rider"); // driver pre-selected

  const handleSelect = (role) => {
    setSelected(role);
    router.push(`/auth/signup?role=${role}`);
  };

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Heading */}
      <h4 className="text-lg font-semibold">Switch Role</h4>

      {/* Role cards like OverviewCard */}
      <div className="grid grid-cols-2 gap-4">
        {/* Driver */}
       

        {/* Rider */}
        <button
          onClick={() => handleSelect("rider")}
          className={`rounded-xl p-5 flex flex-col items-center justify-center text-center border transition shadow-inner
            ${
              selected === "rider"
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
         <button
          onClick={() => handleSelect("driver")}
          className={`rounded-xl p-5 flex flex-col items-center justify-center text-center border transition shadow-inner
            ${
              selected === "driver"
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
