import React, { useState, useEffect } from "react";
import Spinner from "../../components/common/Spinner";
import progressService from "../../services/progressService";
import toast from "react-hot-toast";
import {
  FileText,
  BookOpen,
  BrainCircuit,
  Clock,
  Trophy,
} from "lucide-react";
import StatCard from "../../components/dashboard/StatCard";
import AnalyticsCard from "../../components/dashboard/AnalyticsCard";
import ActivityChart from "../../components/dashboard/ActivityChart";
import QuizPerformanceChart from "../../components/dashboard/QuizPerformanceChart";
import FlashcardPieChart from "../../components/dashboard/FlashcardPieChart";
import WeeklyConsistencyChart from "../../components/dashboard/WeeklyConsistencyChart";
import { chartTheme } from "../../components/dashboard/chartTheme";

const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await progressService.getDashboardData();
        setDashboardData(data.data);
      } catch (_error) {
        toast.error("Failed to fetch dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <Spinner />;

  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-neutral-500 text-sm">
          No dashboard data available
        </p>
      </div>
    );
  }

  const analyticsStats = [
    {
      title: "Total Documents",
      value: dashboardData.totalDocuments || 0,
      icon: <FileText className="w-5 h-5" />,
      accentColor: chartTheme.colors.primary,
    },
    {
      title: "Total Flashcards",
      value: dashboardData.totalFlashcards || 0,
      icon: <BookOpen className="w-5 h-5" />,
      accentColor: chartTheme.colors.secondary,
    },
    {
      title: "Total Quizzes",
      value: dashboardData.totalQuizzes || 0,
      icon: <BrainCircuit className="w-5 h-5" />,
      accentColor: chartTheme.colors.tertiary,
    },
    {
      title: "Average Score",
      value: `${dashboardData.averageScore || 0}%`,
      icon: <Trophy className="w-5 h-5" />,
      accentColor: chartTheme.colors.success,
    },
  ];

  const getRelativeTime = (timestamp) => {
    if (!timestamp) return "No date available";
    const diffInSeconds = Math.floor((new Date() - new Date(timestamp)) / 1000);
    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 172800) return "Yesterday";
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  return (
    <div className="max-w-6xl mx-auto">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-white">
          Dashboard
        </h1>
        <p className="text-neutral-400 mt-1 text-sm">
          Track your learning progress and insights
        </p>
      </div>
      
      {/* Analytics Overview */}
      <div className="mb-6">
        <h2 className="text-2xl font-medium text-white tracking-tight">
          Analytics Overview
        </h2>
        <p className="text-neutral-400 text-sm mt-1">
          Track your learning progress and study habits.
        </p>
      </div>

      {/* Row 1: Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
        {analyticsStats.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            trend={stat.trend}
            accentColor={stat.accentColor}
          />
        ))}
      </div>

      {/* Row 2: Study Activity (larger) & Quiz Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <ActivityChart data={dashboardData.studyActivity} />
        </div>

        <AnalyticsCard title="Quiz Performance" subtitle="Score per attempt" className="lg:col-span-1">
          <QuizPerformanceChart data={dashboardData.quizPerformance} />
        </AnalyticsCard>
      </div>

      {/* Row 3: Flashcard Mastery & Weekly Consistency */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <AnalyticsCard title="Flashcard Mastery">
          <FlashcardPieChart data={dashboardData.flashcardStats} />
        </AnalyticsCard>

        <AnalyticsCard title="Weekly Consistency" subtitle="Sessions per day">
          <WeeklyConsistencyChart data={dashboardData.weeklyConsistency} />
        </AnalyticsCard>
      </div>



      {/* Recent Activity */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-neutral-800 flex items-center justify-center">
            <Clock className="w-5 h-5 text-neutral-400" />
          </div>
          <h3 className="text-xl font-semibold text-white">
            Recent Activity
          </h3>
        </div>

        {dashboardData?.recentActivity?.documents?.length > 0 ||
        dashboardData?.recentActivity?.quizzes?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              ...(dashboardData.recentActivity.documents || []).map(
                (doc) => ({
                  id: doc._id,
                  description: doc.title,
                  timestamp: doc.lastAccessed,
                  link: `/documents/${doc._id}`,
                  type: "document",
                })
              ),
              ...(dashboardData.recentActivity.quizzes || []).map((quiz) => ({
                id: quiz._id,
                description: quiz.title,
                timestamp: quiz.lastAccessed,
                link: `/quizzes/${quiz._id}`,
                type: "quiz",
              })),
            ]
              .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
              .slice(0, 6)
              .map((activity, index) => (
                <a
                  key={activity.id || index}
                  href={activity.link}
                  className="group flex flex-col p-5 rounded-2xl border border-neutral-800 bg-neutral-900 hover:bg-neutral-800 transition-all duration-200 hover:border-neutral-700 shadow-sm"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2.5 rounded-xl bg-neutral-800 text-neutral-300 group-hover:text-primary group-hover:bg-primary/10 transition-colors">
                      {activity.type === "document" ? <FileText size={20} /> : <BrainCircuit size={20} />}
                    </div>
                    <span className="text-xs font-semibold text-neutral-500">
                      {getRelativeTime(activity.timestamp)}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white mb-1 truncate">
                      {activity.description}
                    </h4>
                    <p className="text-xs text-neutral-400">
                      {activity.type === "document" ? "Accessed Document" : "Attempted Quiz"}
                    </p>
                  </div>
                </a>
              ))}
          </div>
        ) : (
          <p className="text-sm text-neutral-500 text-center py-6">
            No recent activity yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;