import React, { useEffect, useCallback } from "react";
import { X } from "lucide-react";

const ImageModal = ({ src, alt, onClose }) => {
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [handleKeyDown]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm animate-fadeIn"
      onClick={handleBackdropClick}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-neutral-800/80 hover:bg-neutral-700 text-white transition-colors"
      >
        <X size={20} />
      </button>

      {/* Image */}
      <img
        src={src}
        alt={alt || "Full view"}
        className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-2xl animate-zoomIn"
      />
    </div>
  );
};

export default ImageModal;
