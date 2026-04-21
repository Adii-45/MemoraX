import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ClipboardList,
  Trash2,
  BrainCircuit,
  Clock,
  CheckCircle2,
  HelpCircle,
  Play,
} from "lucide-react";
import moment from "moment";
import toast from "react-hot-toast";

import documentService from "../../services/documentService";
import quizService from "../../services/quizService";
import PageHeader from "../../components/common/PageHeader";
import Spinner from "../../components/common/Spinner";

const QuizzesListPage = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllQuizzes = async () => {
      try {
        // 1. Get all documents
        const docResponse = await documentService.getDocuments();
        const documents = docResponse.data || [];

        // 2. Fetch quizzes for each document and flatten
        const quizPromises = documents.map(async (doc) => {
          try {
            const quizResponse = await quizService.getQuizzesForDocument(
              doc._id
            );
            const docQuizzes = quizResponse.data || [];
            // Attach document title to each quiz for display
            return docQuizzes.map((quiz) => ({
              ...quiz,
              documentTitle: doc.title,
            }));
          } catch {
            // If a doc has no quizzes or request fails, skip silently
            return [];
          }
        });

        const results = await Promise.all(quizPromises);
        const allQuizzes = results.flat();

        // Sort by most recent first
        allQuizzes.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setQuizzes(allQuizzes);
      } catch (error) {
        toast.error("Failed to fetch quizzes");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllQuizzes();
  }, []);

  const handleDelete = (e, quizId) => {
    e.stopPropagation();
    console.log("Delete quiz", quizId);
    // UI-only removal
    setQuizzes((prev) => prev.filter((q) => q._id !== quizId));
    toast.success("Quiz removed");
  };

  const handleCardClick = (quiz) => {
    // If quiz has userAnswers (already attempted), go to results
    if (quiz.userAnswers && quiz.userAnswers.length > 0) {
      navigate(`/quizzes/${quiz._id}/results`);
    } else {
      navigate(`/quizzes/${quiz._id}`);
    }
  };

  const getScoreInfo = (quiz) => {
    if (!quiz.userAnswers || quiz.userAnswers.length === 0) return null;
    const correct = quiz.userAnswers.filter((a) => a.isCorrect).length;
    const total = quiz.questions?.length || quiz.userAnswers.length;
    const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
    return { correct, total, percentage };
  };

  // ── Empty State ──
  const renderEmptyState = () => (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center max-w-md">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-neutral-800 mb-6">
          <ClipboardList
            className="w-10 h-10 text-neutral-500"
            strokeWidth={1.5}
          />
        </div>
        <h3 className="text-xl font-medium text-white tracking-tight mb-2">
          No quizzes yet
        </h3>
        <p className="text-sm text-neutral-500">
          Generate quizzes from your documents to get started
        </p>
      </div>
    </div>
  );

  // ── Quiz Card ──
  const renderQuizCard = (quiz) => {
    const scoreInfo = getScoreInfo(quiz);
    const questionCount = quiz.questions?.length || 0;
    const isAttempted = scoreInfo !== null;

    return (
      <div
        key={quiz._id}
        className="group relative bg-neutral-900 border border-neutral-800 rounded-2xl p-5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between cursor-pointer"
        onClick={() => handleCardClick(quiz)}
      >
        {/* Header Section */}
        <div>
          <div className="flex items-start justify-between gap-3 mb-4">
            {/* Icon */}
            <div className="shrink-0 w-12 h-12 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center shadow-[0_8px_30px_rgb(0,0,0,0.12)] group-hover:scale-110 transition-transform duration-300">
              <BrainCircuit
                className="w-6 h-6 text-white"
                strokeWidth={2}
              />
            </div>

            {/* Delete Button — hidden by default, fades in on hover */}
            <button
              onClick={(e) => handleDelete(e, quiz._id)}
              className="opacity-0 group-hover:opacity-100 p-2 rounded-md text-neutral-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
            >
              <Trash2 className="w-4 h-4" strokeWidth={2} />
            </button>
          </div>

          {/* Title */}
          <h3
            className="text-base font-semibold text-white truncate mb-1"
            title={quiz.documentTitle || "Untitled Quiz"}
          >
            {quiz.documentTitle || "Untitled Quiz"}
          </h3>

          {/* Subtitle — document source */}
          <p className="text-xs text-neutral-500 mb-3 truncate">
            Quiz
          </p>

          {/* Stats Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Question count */}
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-neutral-800 border border-neutral-700 rounded-lg">
              <HelpCircle
                className="w-3.5 h-3.5 text-neutral-400"
                strokeWidth={2}
              />
              <span className="text-xs font-semibold text-neutral-300">
                {questionCount} {questionCount === 1 ? "Question" : "Questions"}
              </span>
            </div>

            {/* Score badge — only if attempted */}
            {scoreInfo && (
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-primary/10 border border-primary/20 rounded-lg">
                <CheckCircle2
                  className="w-3.5 h-3.5 text-primary"
                  strokeWidth={2}
                />
                <span className="text-xs font-semibold text-primary">
                  {scoreInfo.percentage}%
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 pt-4 border-t border-neutral-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-neutral-500">
              <Clock className="w-3.5 h-3.5" strokeWidth={2} />
              <span>{moment(quiz.createdAt).fromNow()}</span>
            </div>

            {/* Status badge */}
            <div
              className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${
                isAttempted
                  ? "bg-emerald-500/10 text-emerald-400"
                  : "bg-amber-500/10 text-amber-400"
              }`}
            >
              {isAttempted ? (
                <>
                  <CheckCircle2 className="w-3 h-3" />
                  Completed
                </>
              ) : (
                <>
                  <Play className="w-3 h-3" />
                  Not attempted
                </>
              )}
            </div>
          </div>
        </div>

        {/* Hover Gradient Overlay */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none" />
      </div>
    );
  };

  // ── Main Render ──
  return (
    <div className="min-h-screen">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#262626_1px,transparent_1px)] bg-[size:16px_16px] opacity-30 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <PageHeader
          title="My Quizzes"
          subtitle="View and manage all your quizzes"
        />

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <Spinner />
          </div>
        ) : quizzes.length === 0 ? (
          renderEmptyState()
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {quizzes.map((quiz) => renderQuizCard(quiz))}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizzesListPage;
