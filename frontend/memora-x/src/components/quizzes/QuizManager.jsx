import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

import quizService from "../../services/quizService";
import aiService from "../../services/aiService";
import Spinner from "../common/Spinner";
import Button from "../common/Button";
import Modal from "../common/Modal";
import QuizCard from "./QuizCard";
import EmptyState from "../common/EmptyState";

const QuizManager = ({ documentId }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [numQuestions, setNumQuestions] = useState(5);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const hasHandledGenerate = useRef(false);

  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const data = await quizService.getQuizzesForDocument(documentId);
      setQuizzes(data.data);
    } catch (error) {
      toast.error("Failed to fetch quizzes");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (documentId) {
      fetchQuizzes();
    }
  }, [documentId]);

  const handleGenerateQuiz = async (e) => {
    e.preventDefault();
    setGenerating(true);
    try {
      await aiService.generateQuiz(documentId, { numQuestions });
      toast.success("Quiz generated successfully");
      setIsGenerateModalOpen(false);
      fetchQuizzes();
    } catch (error) {
      toast.error(error.message || "Failed to generate quiz");
    } finally {
      setGenerating(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("generate") === "true" && documentId && !hasHandledGenerate.current) {
      if (params.get("tab") === "quizzes") {
        hasHandledGenerate.current = true;
        // Remove generate from URL to prevent infinite loops
        params.delete("generate");
        navigate({ search: params.toString() }, { replace: true });

        setIsGenerateModalOpen(true);
      }
    }
  }, [documentId, location.search, navigate]);

  const handleDeleteRequest = (quiz) => {
    setSelectedQuiz(quiz);
    setIsDeleteModalOpen(true);
  };

  // ✅ FIXED DELETE LOGIC
  const handleConfirmDelete = async () => {
    if (!selectedQuiz) return;

    setDeleting(true);
    try {
      await quizService.deleteQuiz(selectedQuiz._id);

      toast.success("Quiz deleted successfully");

      setIsDeleteModalOpen(false);
      setSelectedQuiz(null);

      fetchQuizzes();
    } catch (error) {
      toast.error(error.message || "Failed to delete quiz");
    } finally {
      setDeleting(false);
    }
  };

  const renderQuizContent = () => {
    if (loading) {
      return <Spinner />;
    }

    if (quizzes.length === 0) {
      return (
        <EmptyState
          title="No Quizzes"
          description="Generate a quiz from your document to text your knowledge."
        />
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {quizzes.map((quiz) => (
          <QuizCard key={quiz._id} quiz={quiz} onDelete={handleDeleteRequest} />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
      <div className="flex justify-end gap-2 mb-4">
        <button
          onClick={() => setIsGenerateModalOpen(true)}
          className="flex items-center gap-2 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-white px-4 h-10 rounded-lg text-sm transition-all"
        >
          <Plus size={16} />
          Generate More
        </button>
      </div>

      {renderQuizContent()}

      {/* ✅ GENERATE MODAL */}
      {isGenerateModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl w-full max-w-md p-6 animate-fadeIn">
            <h2 className="text-xl font-semibold text-white mb-4">
              Generate Quiz
            </h2>

            <form onSubmit={handleGenerateQuiz} className="space-y-4">
              <div>
                <label className="text-sm text-neutral-400 mb-1 block">
                  Number of Questions
                </label>
                <input
                  type="number"
                  value={numQuestions}
                  onChange={(e) => setNumQuestions(e.target.value)}
                  min={1}
                  max={20}
                  className="w-full border border-neutral-800 bg-neutral-950 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-neutral-600"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsGenerateModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-sm text-neutral-400 hover:text-white hover:bg-neutral-800"
                >
                  Cancel
                </button>

                <Button type="submit">Generate</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ✅ DELETE MODAL (ADDED) */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h2 className="text-lg font-semibold mb-2 text-white">
              Delete Quiz
            </h2>
            <p className="text-sm text-neutral-400 mb-6">
              Are you sure you want to delete this quiz? This action cannot be undone.
            </p>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 rounded-lg text-sm text-neutral-400 hover:text-white hover:bg-neutral-800"
              >
                Cancel
              </button>

              <Button
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="bg-red-500 hover:bg-red-600"
              >
                {deleting ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizManager;