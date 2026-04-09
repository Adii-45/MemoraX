import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import quizService from "../../services/quizService";
import PageHeader from "../../components/common/PageHeader";
import Spinner from "../../components/common/Spinner";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Trophy,
  Target,
  BookOpen,
} from "lucide-react";

const QuizResultPage = () => {
  const { quizId } = useParams();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await quizService.getQuizResults(quizId);
        setResults(response.data);
      } catch (error) {
        toast.error("Failed to fetch results");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [quizId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner />
      </div>
    );
  }

  if (!results) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-neutral-400 text-lg">Quiz results not found.</p>
      </div>
    );
  }

  const { quiz, results: detailedResults } = results;

  const score = quiz.score;
  const totalQuestions = detailedResults.length;
  const correctAnswers = detailedResults.filter((r) => r.isCorrect).length;
  const incorrectAnswers = totalQuestions - correctAnswers;

  const getScoreColor = (score) => {
    if (score >= 80) return "from-emerald-500 to-teal-500";
    if (score >= 60) return "from-amber-500 to-orange-500";
    return "from-rose-500 to-red-500";
  };

  const getScoreMessage = (score) => {
    if (score >= 90) return "Outstanding! 🎉";
    if (score >= 80) return "Great job! 🎉";
    if (score >= 70) return "Good effort 👍";
    if (score >= 60) return "Not bad 🙂";
    return "Keep practicing 💪";
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Back */}
      <div className="mb-6">
        <Link
          to={`/documents/${quiz.document._id}`}
          className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Document
        </Link>
      </div>

      <PageHeader title={`${quiz.title || "Quiz"} Results`} />

      {/* Score Card */}
      <div className="bg-neutral-900 border border-neutral-700 p-8 rounded-2xl shadow mb-8 text-center">
        <Trophy className="w-10 h-10 mx-auto text-indigo-500 mb-4" />

        <p className="text-sm text-neutral-400 mb-2">Your Score</p>

        <div
          className={`text-5xl font-bold bg-gradient-to-r ${getScoreColor(
            score
          )} bg-clip-text text-transparent`}
        >
          {score}%
        </div>

        <p className="mt-2 text-neutral-300">{getScoreMessage(score)}</p>

        {/* Stats */}
        <div className="flex justify-center gap-4 mt-6 flex-wrap">
          <div className="px-4 py-2 bg-neutral-800 rounded-xl">
            {totalQuestions} Total
          </div>
          <div className="px-4 py-2 bg-green-900/30 rounded-xl text-green-400">
            {correctAnswers} Correct
          </div>
          <div className="px-4 py-2 bg-red-900/30 rounded-xl text-red-400">
            {incorrectAnswers} Incorrect
          </div>
        </div>
      </div>

      {/* Review */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-neutral-400" />
          <h3 className="text-lg font-semibold">Questions Review</h3>
        </div>

        {detailedResults.map((result, index) => {
          // ✅ USER ANSWER INDEX
          const userIndex = result.options.findIndex(
            (opt) => opt === result.selectedAnswer
          );

          // ✅ FIXED CORRECT ANSWER LOGIC
          let correctIndex;

          if (
            typeof result.correctAnswer === "string" &&
            result.correctAnswer.match(/^\d+$/)
          ) {
            // If backend sends "1", "2", "01"
            correctIndex = parseInt(result.correctAnswer, 10) - 1;
          } else {
            // If backend sends actual string
            correctIndex = result.options.findIndex(
              (opt) => opt === result.correctAnswer
            );
          }

          return (
            <div key={index} className="p-5 rounded-2xl bg-neutral-900 shadow border border-neutral-700">
              <p className="font-semibold mb-3">
                Q{index + 1}. {result.question}
              </p>

              <div className="space-y-2">
                {result.options.map((option, i) => {
                  const isUser = i === userIndex;
                  const isCorrect = i === correctIndex;

                  return (
                    <div
                      key={i}
                      className={`p-3 rounded-xl border transition ${
                        isCorrect
                          ? "bg-green-900/30 border-green-500"
                          : isUser
                          ? "bg-red-900/30 border-red-500"
                          : "bg-neutral-800 border-neutral-700"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{option}</span>

                        {isCorrect && (
                          <span className="text-green-400 text-xs font-semibold">
                            Correct Answer
                          </span>
                        )}

                        {isUser && !isCorrect && (
                          <span className="text-red-400 text-xs font-semibold">
                            Your Answer
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Result Tag */}
              <div className="mt-3 text-sm flex items-center gap-2">
                {result.isCorrect ? (
                  <>
                    <CheckCircle2 className="text-green-500 w-4 h-4" />
                    Correct
                  </>
                ) : (
                  <>
                    <XCircle className="text-red-500 w-4 h-4" />
                    Incorrect
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QuizResultPage;
