import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  X,
  Bell,
  Heart,
  MessageSquare,
  Repeat2,
  Flame,
  UserPlus,
  Info,
  CheckCheck,
  Loader2,
} from "lucide-react";
import notificationService from "../../services/notificationService";

const ICON_MAP = {
  like_post: { icon: Heart, color: "text-red-400", bg: "bg-red-500/10" },
  comment_post: { icon: MessageSquare, color: "text-blue-400", bg: "bg-blue-500/10" },
  repost_post: { icon: Repeat2, color: "text-green-400", bg: "bg-green-500/10" },
  streak_reminder: { icon: Flame, color: "text-amber-400", bg: "bg-amber-500/10" },
  new_follower: { icon: UserPlus, color: "text-purple-400", bg: "bg-purple-500/10" },
  system: { icon: Info, color: "text-neutral-400", bg: "bg-neutral-500/10" },
};

const timeAgo = (dateStr) => {
  const now = new Date();
  const date = new Date(dateStr);
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const NotificationModal = ({ onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const fetchAll = useCallback(async (p = 1) => {
    try {
      setLoading(true);
      const res = await notificationService.getAll(p);
      if (res.success) {
        setNotifications(res.data);
        setTotalPages(res.pagination?.totalPages || 1);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll(page);
  }, [page, fetchAll]);

  // ESC to close
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch {
      // silent
    }
  };

  const handleNotifClick = async (notif) => {
    if (!notif.isRead) {
      try {
        await notificationService.markAsRead(notif._id);
        setNotifications((prev) =>
          prev.map((n) => (n._id === notif._id ? { ...n, isRead: true } : n))
        );
      } catch {
        // silent
      }
    }
    if (notif.post) {
      onClose();
      navigate("/community");
    }
  };

  const hasUnread = notifications.some((n) => !n.isRead);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg mx-4 max-h-[80vh] bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl flex flex-col animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Bell size={16} className="text-primary" />
            </div>
            <h2 className="text-base font-semibold text-white">
              All Notifications
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {hasUnread && (
              <button
                onClick={handleMarkAllAsRead}
                className="flex items-center gap-1.5 text-xs font-medium text-primary hover:text-blue-400 transition-colors px-2 py-1 rounded-lg hover:bg-neutral-800"
              >
                <CheckCheck size={14} />
                Mark all read
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-500 hover:text-white hover:bg-neutral-800 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 size={24} className="text-primary animate-spin" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <Bell size={32} className="text-neutral-700" />
              <p className="text-sm text-neutral-500">No notifications yet</p>
            </div>
          ) : (
            notifications.map((notif) => {
              const config = ICON_MAP[notif.type] || ICON_MAP.system;
              const IconComp = config.icon;

              return (
                <button
                  key={notif._id}
                  onClick={() => handleNotifClick(notif)}
                  className={`w-full flex items-start gap-3 px-5 py-3.5 text-left transition-colors duration-150 hover:bg-neutral-800/50 border-b border-neutral-800/30 last:border-b-0 ${
                    !notif.isRead ? "bg-primary/[0.04]" : ""
                  }`}
                >
                  {/* Icon */}
                  <div
                    className={`w-9 h-9 rounded-lg ${config.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}
                  >
                    <IconComp size={16} className={config.color} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm leading-snug ${
                        !notif.isRead
                          ? "text-neutral-200 font-medium"
                          : "text-neutral-400"
                      }`}
                    >
                      {notif.message}
                    </p>
                    <p className="text-xs text-neutral-500 mt-1">
                      {timeAgo(notif.createdAt)}
                    </p>
                  </div>

                  {/* Unread dot */}
                  {!notif.isRead && (
                    <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2" />
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 px-5 py-3 border-t border-neutral-800">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 text-xs font-medium text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-xs text-neutral-500 tabular-nums">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1.5 text-xs font-medium text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationModal;
