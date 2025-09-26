"use client";

export default function Popup({ isOpen, type = "info", message, onClose }) {
  if (!isOpen) return null;

  const colors = {
    success: "bg-green-600",
    error: "bg-red-600",
    info: "bg-blue-600",
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="w-full max-w-sm rounded-lg shadow-lg bg-[var(--card)] overflow-hidden">
        <div className={`p-4 ${colors[type]} text-white font-semibold`}>
          {type === "success" && "✅ Success"}
          {type === "error" && "❌ Error"}
          {type === "info" && "ℹ️ Info"}
        </div>
        <div className="p-4">
          <p className="text-[var(--foreground)]">{message}</p>
        </div>
        <div className="flex justify-end p-3 border-t border-gray-700">
          <button
            className="px-4 py-2 rounded-md bg-[var(--accent)] text-white hover:opacity-90"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
