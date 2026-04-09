import React, { useState, useEffect } from "react";
import Spinner from "../../components/common/Spinner";
import progressService from "../../services/progressService";
import toast from "react-hot-toast";
import { FileText, BookOpen, BrainCircuit, Clock } from "lucide-react";

const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await progressService.getDashboardData();
        setDashboardData(data.data);
      } catch (error) {
        toast.error("Failed to fetch dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <Spinner />;

  if (!dashboardData?.overview) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-neutral-500 text-sm">
          No dashboard data available
        </p>
      </div>
    );
  }

  const stats = [
    {
      label: "Total Documents",
      value: dashboardData.overview.totalDocuments,
      icon: FileText,
    },
    {
      label: "Total Flashcards",
      value: dashboardData.overview.totalFlashcards,
      icon: BookOpen,
    },
    {
      label: "Total Quizzes",
      value: dashboardData.overview.totalQuizzes,
      icon: BrainCircuit,
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

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 transition"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">
                {stat.label}
              </span>
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
                <stat.icon className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="text-3xl font-semibold text-white">
              {stat.value}
            </div>
          </div>
        ))}
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