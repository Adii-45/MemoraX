import React from "react";
import { Link } from "react-router-dom";
import { Play, BarChart2, Trash2, Award } from "lucide-react";
import moment from "moment";

const QuizCard = ({ quiz, onDelete }) => {
  return (
    <div className="group relative bg-neutral-900 border border-neutral-800 hover:border-primary/40 rounded-2xl p-4 transition-all duration-200 flex flex-col justify-between">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(quiz);
        }}
        className="absolute top-4 right-4 p-2 text-neutral-500 hover:text-rose-400 hover:bg-neutral-800 rounded-lg transition-all duration-200 opacity-100"
      >
        <Trash2 className="w-4 h-4" strokeWidth={2} />
      </button>

      <div className="space-y-4">
        {/* Status Badge */}
        <div className="inline-flex items-center gap-1.5 py-1 rounded-lg text-xs font-semibold">
          <div className="flex items-center gap-1.5 bg-primary/10 border border-primary/20 rounded-lg px-3 py-1">
            <Award className="w-3.5 h-3.5 text-primary" strokeWidth={2.5} />
            <span className="text-primary">Score: {quiz.score}</span>
          </div>
        </div>

        <div>
          <h3
            className="text-base font-semibold text-white mb-1 line-clamp-2"
            title={quiz.title}
          >
            {quiz.title ||
              `Quiz - ${moment(quiz.createdAt).format("MMM DD, YYYY")}`}
          </h3>
          <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide">
            Created {moment(quiz.createdAt).format("MMM DD, YYYY")}
          </p>
        </div>

        {/* Quiz Info */}
        <div className="flex items-center gap-3 pt-2 border-t border-neutral-800">
          <div className="px-3 py-1.5 bg-neutral-800 border border-neutral-700 rounded-lg">
            <span className="text-sm font-semibold text-neutral-300">
              {quiz.questions.length}{" "}
              {quiz.questions.length === 1 ? "Question" : "Questions"}
            </span>
          </div>
        </div>
      </div>

      {/* Actions Button */}
      <div className="mt-2 pt-4 border-t border-neutral-800">
        {quiz?.userAnswers?.length > 0 ? (
          <Link to={`/quizzes/${quiz._id}/results`}>
            {/* <button className="group/btn w-full inline-flex items-center justify-center gap-2 h-11 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-xl transition-all duration-200 active:scale-95 cursor-pointer">
              <BarChart2 className="w-4 h-4" strokeWidth={2.5} />
              View Results
            </button> */}
            <button className="group w-full relative inline-flex items-center justify-center gap-2 h-11 rounded-xl font-semibold text-sm text-neutral-300 bg-neutral-800 hover:bg-neutral-700 hover:text-white border border-neutral-700 transition-all duration-300 ease-out active:scale-90 overflow-hidden">
              {/* Glow effect */}
              <span className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition duration-300" />

              <BarChart2
                className="w-4 h-4 transition-transform duration-300 group-hover:scale-110"
                strokeWidth={2.5}
              />

              <span className="relative">View Results</span>
            </button>
          </Link>
        ) : (
          <Link to={`/quizzes/${quiz._id}`}>
            <button className="group/btn relative w-full h-11 bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white font-semibold text-sm rounded-xl transition-all duration-200 shadow-[0_8px_30px_rgb(0,0,0,0.12)] active:scale-95 overflow-hidden">
              <span className="relative z-10 flex items-center justify-center gap-2">
                <Play className="w-4 h-4" strokeWidth={2.5} />
                Start Quiz
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
            </button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default QuizCard;
