import React from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Sparkles, TrendingUp, Trash2 } from "lucide-react";
import moment from "moment";

const FlashcardSetCard = ({ flashcardSet, onDelete }) => {
  const navigate = useNavigate();

  const handleStudyNow = () => {
    navigate(`/documents/${flashcardSet.documentId?._id}/flashcards`);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    onDelete(flashcardSet._id);
  };

  const totalCards = flashcardSet?.cards?.length || 0;

  const reviewedCount =
    flashcardSet?.cards?.filter((card) => card.lastReviewed)?.length || 0;

  const progressPercentage =
    totalCards > 0 ? Math.round((reviewedCount / totalCards) * 100) : 0;

  return (
    <div
      className="group relative bg-neutral-900 border border-neutral-800 hover:border-primary/40 rounded-2xl p-6 cursor-pointer transition-all duration-200 flex flex-col justify-between"
      onClick={handleStudyNow}
    >
      {/* 🗑 DELETE BUTTON */}
      <button
        onClick={handleDeleteClick}
        className="absolute top-4 right-4 p-2.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all"
      >
        <Trash2 size={16} />
      </button>

      <div className="space-y-4">
        {/* Icon + Title */}
        <div className="flex items-start gap-4 pr-10">
          <div className="shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-primary" strokeWidth={2} />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-white line-clamp-2 mb-1">
              {flashcardSet?.documentId?.title || "Untitled"}
            </h3>
            <p className="text-sm text-neutral-500">
              {moment(flashcardSet.createdAt).fromNow()}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3 pt-2">
          <div className="px-3 py-1.5 bg-neutral-800 border border-neutral-700 rounded-lg">
            <span className="text-sm font-semibold text-neutral-300">
              {totalCards} {totalCards === 1 ? "Card" : "Cards"}
            </span>
          </div>

          {reviewedCount > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-lg">
              <TrendingUp className="w-3.5 h-3.5 text-primary" />
              <span className="text-sm font-semibold text-primary">
                {progressPercentage}%
              </span>
            </div>
          )}
        </div>

        {/* Progress */}
        {totalCards > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span>Progress</span>
              <span>
                {reviewedCount}/{totalCards}
              </span>
            </div>

            <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-primary-dark"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Button */}
      <div className="mt-6 pt-4 border-t border-neutral-800">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleStudyNow();
          }}
          className="w-full h-11 bg-gradient-to-r from-primary/10 to-primary/20 hover:from-primary hover:to-primary-dark text-primary hover:text-white font-semibold text-sm rounded-xl transition-all"
        >
          <span className="flex items-center justify-center gap-2">
            <Sparkles size={16} />
            Study Now
          </span>
        </button>
      </div>
    </div>
  );
};

export default FlashcardSetCard;
