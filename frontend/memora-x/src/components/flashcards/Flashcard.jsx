import { useState } from "react";
import { Star, RotateCcw } from "lucide-react";

const Flashcard = ({ flashcard, onToogleStar }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="relative w-full h-72" style={{ perspective: "1000px" }}>
      <div
        className="relative w-full h-full transition-transform duration-500 transform-gpu cursor-pointer"
        style={{
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
        onClick={handleFlip}
      >
        {/* Front */}
        <div
          className="absolute inset-0 w-full h-full bg-neutral-900 border border-neutral-800 rounded-2xl p-8 flex flex-col justify-between"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          {/* Top */}
          <div className="flex items-start justify-between">
            <div className="bg-neutral-800 text-[10px] text-neutral-400 rounded px-3 py-1 uppercase font-medium">
              {flashcard.difficulty || "EASY"}
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onToogleStar(flashcard._id);
              }}
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 ${
                flashcard.isStarred
                  ? "bg-gradient-to-br from-amber-400 to-yellow-500 text-white shadow-md"
                  : "bg-neutral-800 text-neutral-500 hover:bg-neutral-700 hover:text-amber-500"
              }`}
            >
              <Star
                className="w-4 h-4"
                strokeWidth={2}
                fill={flashcard.isStarred ? "currentColor" : "none"}
              />
            </button>
          </div>

          {/* Question */}
          <div className="flex flex-col items-center justify-center px-4 py-4">
            <p className="text-lg font-semibold text-white text-center leading-relaxed">
              {flashcard.question}
            </p>
          </div>

          {/* Hint */}
          <div className="flex items-center justify-center gap-2 text-xs text-neutral-500 font-medium">
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Click to reveal answer</span>
          </div>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 w-full h-full bg-gradient-to-br from-primary to-primary-dark border border-primary/40 rounded-2xl shadow-lg p-8 flex flex-col justify-between"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          {/* Top */}
          <div className="flex justify-end">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToogleStar(flashcard._id);
              }}
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 ${
                flashcard.isStarred
                  ? "bg-white/30 text-white border border-white/40"
                  : "bg-white/20 text-white/70 hover:bg-white/30 hover:text-white border border-white/20"
              }`}
            >
              <Star
                className="w-4 h-4"
                strokeWidth={2}
                fill={flashcard.isStarred ? "currentColor" : "none"}
              />
            </button>
          </div>

          {/* Answer */}
          <div className="flex-1 flex items-center justify-center px-4 py-6">
            <p className="text-base text-white text-center leading-relaxed font-medium">
              {flashcard.answer}
            </p>
          </div>

          {/* Hint */}
          <div className="flex items-center justify-center gap-2 text-xs text-white/70 font-medium">
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Click to flip back</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Flashcard;
