"use client";
import { useRef, useState, useEffect } from "react";
import RequestRideCard from "@/app/components/RequestRideCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function AvailableRides({ rides }) {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const cardWidth = 300;  // each card width
  const gap = 24;         // Tailwind gap-6 = 1.5rem = 24px
  const visibleCards = 3; // show ~3 but let next peek

  const containerWidth = visibleCards * cardWidth + (visibleCards - 1) * gap;

  const updateScrollButtons = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth);
  };

  useEffect(() => {
    updateScrollButtons();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScrollButtons);
    window.addEventListener("resize", updateScrollButtons);
    return () => {
      el.removeEventListener("scroll", updateScrollButtons);
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, []);

  const scrollLeft = () => {
    scrollRef.current.scrollBy({
      left: -(cardWidth + gap) * visibleCards,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({
      left: (cardWidth + gap) * visibleCards,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative w-full">
      <h3 className="text-xl font-bold mb-4">Available Rides</h3>

      <div className="relative flex items-center">
       {/* Left Arrow */}
{canScrollLeft && (
  <button
    onClick={scrollLeft}
    className="absolute -left-12 z-10 bg-[var(--card)] p-2 rounded-full shadow-md hover:bg-[var(--accent)] hover:text-[var(--background)] transition"
  >
    <ChevronLeft className="w-6 h-6" />
  </button>
)}

        {/* Cards container (aligned with heading, not centered) */}
        <div
          style={{ width: `${containerWidth + cardWidth / 2}px` }} // allow peek of 4th card
          className="overflow-hidden"
        >
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-hidden scroll-smooth"
          >
            {rides.map((ride) => (
              <div
                key={ride.id}
                className="bg-[var(--card)] rounded-xl shadow-soft flex-shrink-0"
                style={{ width: `${cardWidth}px`, height: "360px" }}
              >
                <RequestRideCard {...ride} />
              </div>
            ))}
          </div>
        </div>

       {/* Right Arrow */}
{canScrollRight && (
  <button
    onClick={scrollRight}
    className="absolute -right-12 z-10 bg-[var(--card)] p-2 rounded-full shadow-md hover:bg-[var(--accent)] hover:text-[var(--background)] transition"
  >
    <ChevronRight className="w-6 h-6" />
  </button>
)}
      </div>
    </div>
  );
}
