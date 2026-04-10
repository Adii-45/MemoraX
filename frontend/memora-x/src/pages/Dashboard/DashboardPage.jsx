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
import FeatureUsageChart from "../../components/dashboard/FeatureUsageChart";
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
        <AnalyticsCard title="Study Activity (Last 30 Days)" className="lg:col-span-2">
          <ActivityChart data={dashboardData.studyActivity} />
        </AnalyticsCard>

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

      {/* Row 4: Feature Usage */}
      <div className="grid grid-cols-1 gap-6 mb-8">
        <AnalyticsCard
          title="Feature Usage"
          subtitle="What you use most"
          className="w-full"
        >
          <FeatureUsageChart data={dashboardData.featureUsage} />
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
          <div className="space-y-3">
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
              .map((activity, index) => (
                <div
                  key={activity.id || index}
                  className="flex items-center justify-between p-4 rounded-xl border border-neutral-800 hover:bg-neutral-800/50 transition"
                >
                  <div>
                    <p className="text-sm font-medium text-white">
                      {activity.type === "document"
                        ? "Accessed Document: "
                        : "Attempted Quiz: "}
                      <span className="text-neutral-300">
                        {activity.description}
                      </span>
                    </p>
                    <p className="text-xs text-neutral-500 mt-1">
                      {activity.timestamp
                        ? new Date(activity.timestamp).toLocaleString()
                        : "No date available"}
                    </p>
                  </div>

                  <a
                    href={activity.link}
                    className="text-sm font-semibold text-primary hover:underline"
                  >
                    View
                  </a>
                </div>
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