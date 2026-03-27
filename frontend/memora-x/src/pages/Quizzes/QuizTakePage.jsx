import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react'
import quizService from '../../services/quizService'
import PageHeader from '../../components/common/PageHeader'
import Spinner from '../../components/common/Spinner'
import toast from 'react-hot-toast'
import Button from '../../components/common/Button'

const QuizTakePage = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await quizService.getQuizById(quizId);
        setQuiz(res.data);
      } catch {
        toast.error("Failed to fetch quiz");
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId]);

  const handleOptionChange = (questionId, optionIndex) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleSubmitQuiz = async () => {
    setSubmitting(true);

    try {
      const formattedAnswers = Object.keys(selectedAnswers).map((questionId) => {
        const questionIndex = quiz.questions.findIndex(q => q._id === questionId);
        const optionIndex = selectedAnswers[questionId];

        return {
          questionIndex,
          selectedAnswer: quiz.questions[questionIndex].options[optionIndex], // ✅ FIX
        };
      });

      await quizService.submitQuiz(quizId, formattedAnswers);
      toast.success("Quiz submitted!");
      navigate(`/quizzes/${quizId}/results`);
    } catch (err) {
      toast.error("Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Spinner />;

  const currentQuestion = quiz.questions[currentQuestionIndex];

  return (
    <div className="max-w-3xl mx-auto">
      <PageHeader title={quiz.title} />

      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span>Q {currentQuestionIndex + 1} / {quiz.questions.length}</span>
        </div>

        <div className="h-2 bg-slate-200 rounded-full">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
            style={{ width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Card */}
      <div className="bg-white p-6 rounded-2xl shadow-xl">
        <h2 className="text-lg font-semibold mb-6">
          {currentQuestion.question}
        </h2>

        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedAnswers[currentQuestion._id] === index;

            return (
              <label
                key={index}
                className={`flex items-center p-4 rounded-xl border cursor-pointer transition ${
                  isSelected
                    ? "border-indigo-500 bg-indigo-50 shadow-md"
                    : "border-slate-200 hover:border-indigo-300 hover:bg-slate-50"
                }`}
              >
                <input
                  type="radio"
                  checked={isSelected}
                  onChange={() =>
                    handleOptionChange(currentQuestion._id, index)
                  }
                  className="hidden"
                />

                <div className={`w-5 h-5 rounded-full border mr-3 flex items-center justify-center ${
                  isSelected ? "bg-indigo-500 border-indigo-500" : ""
                }`}>
                  {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                </div>

                <span className="flex-1">{option}</span>

                {isSelected && (
                  <CheckCircle2 className="text-indigo-500" />
                )}
              </label>
            );
          })}
        </div>
      </div>

      {/* Nav */}
      <div className="flex justify-between mt-6">
        <Button
          onClick={() => setCurrentQuestionIndex(p => p - 1)}
          disabled={currentQuestionIndex === 0}
        >
          <ChevronLeft /> Prev
        </Button>

        {currentQuestionIndex === quiz.questions.length - 1 ? (
          <Button onClick={handleSubmitQuiz} disabled={submitting}>
            Submit
          </Button>
        ) : (
          <Button onClick={() => setCurrentQuestionIndex(p => p + 1)}>
            Next <ChevronRight />
          </Button>
        )}
      </div>
    </div>
  );
};

export default QuizTakePage;