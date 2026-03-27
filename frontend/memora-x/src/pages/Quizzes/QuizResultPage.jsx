import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import quizService from '../../services/quizService';
import PageHeader from '../../components/common/PageHeader';
import Spinner from '../../components/common/Spinner';
import toast from 'react-hot-toast';
import { ArrowLeft, CheckCircle2, XCircle, Trophy, Target, BookOpen } from 'lucide-react';

const QuizResultPage = () => {

  const {quizId} = useParams();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await quizService.getQuizResults(quizId);
        setResults(data);
      } catch (error) {
        toast.error("Failed to fetch results");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [quizId]);

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-[60vh]'>
        <Spinner />
      </div>
    );
  }

  if (!results || !results.data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className=" text-slate-600 text-lg">Quiz results not found.</p>
        </div>
      </div>
    );
  }

  const { data: { quiz, results: detailedResults } } = results;
  const score = quiz.score;
  const totalQuestions = detailedResults.length;
  const correctAnswers = detailedResults.filter(result => result.isCorrect).length;
  const incorrectAnswers = totalQuestions - correctAnswers;

  const getScoreColor = (score) => {
    if (score >= 80) return 'from-emerald-500 to-teal-500';
    if (score >= 60) return 'from-amber-500 to-orange-500';
    return 'from-rose-500 to-red-500';
  };

  const getScoreMessage = (score) => {
    if (score >= 90) return 'Outstanding! Keep it up! 🎉';
    if (score >= 80) return 'Great job! Keep it up! 🎉';
    if (score >= 70) return 'Good job! Keep it up! 🎉';
    if (score >= 60) return 'Not bad! Keep it up! 🎉';
    return 'Keep practicing! 🎉';
  };
  return (
    <div className="max-w-5xl mx-auto">
      {/* {Back button} */}
      <div className="mb-6">
        <Link to={`/documents/${quiz.document._id}`} 
        className="group inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={2} />
        Back to Document
        </Link>
      </div>

      <PageHeader title={`${quiz.title} || Quiz'}Results`} />

      {/* {Score Card} */}
      <div className="bg-white/80 backdrop-blur-xl border-2 border-slate-200 rounded-2xl shadow-xl shadow-slate-200/50 p-8 mb-8">
        <div className="text-center space-y-6">
          <div className="inline-flex items-center justify-center w-15 h-15 rounded-xl bg-linear-to-br from-emerald-100 to-teal-100 shadow-lg shadow-emerald-500/25">
            <Trophy className="w-7 h-7 text-emerald-600" strokeWidth={2} />
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-2">
                Your Score
                </p>
              <div className={`inline-block text-5xl font-bold bg-linear-to-r ${getScoreColor(score)} bg-clip-text text-transparent mb-2`} >
                {score}%
                </div>
                <p className="text-lg font-medium text-slate-700">
                  {getScoreMessage(score)}
                </p>
            </div>

            {/* Stats */}
            <div className="flex items-center justify gap-4 pt-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl">
                <Target className="w-4 h-4 text-slate-600" strokeWidth={2} />
                <span className="text-sm font-semibold text-slate-700">{totalQuestions} Total</span>
                </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-xl">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" strokeWidth={2} />
                <span className="text-sm font-semibold text-emerald-700">{correctAnswers} Correct</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-rose-50 border border-rose-200 rounded-xl">
                  <XCircle className="w-4 h-4 text-rose-600" strokeWidth={2} />
                  <span className="text-sm font-semibold text-rose-700">{incorrectAnswers} Incorrect
                  </span>
                </div>
              </div>

          </div>
        </div> 

        {/* {Questions Review } */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <BookOpen className="w-4 h-4 text-slate-600" strokeWidth={2} />
            <h3 className="text-lg font-semibold text-slate-900">Questions Review</h3>
          </div>

          {detailedResults.map((result, index) => {
            const userAnswerIndex = result.options.findIndex(opt => opt === result.selectedAnswer);
            const correctAnswerIndex = result.correctAnswer.startsWith('0')
            ? parseInt(result.correctAnswer.substring(1)) - 1
            : result.options.findIndex(opt => opt === result.correctAnswer);
            const isCorrect = result.isCorrect;

            return (
              <div key={index} className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-700">
    </div> 


  )
}

export default QuizResultPage