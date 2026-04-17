import React, { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  Heart,
  MessageSquare,
  Repeat2,
  Flame,
  UserPlus,
  Info,
  Check,
  CheckCheck,
  Loader2,
} from "lucide-react";
import notificationService from "../../services/notificationService";
import NotificationModal from "./NotificationModal";

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

const NotificationDropdown = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Fetch unread count on mount + periodic poll
  const fetchUnreadCount = useCallback(async () => {
    try {
      const res = await notificationService.getUnreadCount();
      if (res.success) setUnreadCount(res.data.count);
    } catch {
      // silent
    }
  }, []);

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000); // poll every 30s
    return () => clearInterval(interval);
  }, [fetchUnreadCount]);

  // Fetch recent when dropdown opens
  const fetchRecent = useCallback(async () => {
    try {
      setLoading(true);
      const res = await notificationService.getRecent();
      if (res.success) setNotifications(res.data);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open) fetchRecent();
  }, [open, fetchRecent]);

  // Click outside
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ESC key
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const handleMarkAsRead = async (e, notifId) => {
    e.stopPropagation();
    try {
      await notificationService.markAsRead(notifId);
      setNotifications((prev) =>
        prev.map((n) => (n._id === notifId ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch {
      // silent
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch {
      // silent
    }
  };

  const handleNotifClick = async (notif) => {
    // Mark as read
    if (!notif.isRead) {
      try {
        await notificationService.markAsRead(notif._id);
        setNotifications((prev) =>
          prev.map((n) => (n._id === notif._id ? { ...n, isRead: true } : n))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      } catch {
        // silent
      }
    }
    // Navigate to post if exists
    if (notif.post) {
      setOpen(false);
      navigate("/community");
    }
  };

  const handleViewAll = () => {
    setOpen(false);
    setShowModal(true);
  };

  const displayNotifs = notifications.slice(0, 5);

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        {/* Bell Trigger */}
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="relative inline-flex items-center justify-center w-10 h-10 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-xl transition-all duration-200 group"
          aria-haspopup="true"
          aria-expanded={open}
          id="notification-bell"
        >
          <Bell
            size={20}
            strokeWidth={2}
            className="group-hover:scale-110 transition-transform duration-200"
          />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center px-1 text-[10px] font-bold text-white bg-red-500 rounded-full ring-2 ring-neutral-950">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </button>

        {/* Dropdown */}
        <div
          className={`absolute right-0 top-full mt-2 w-80 bg-neutral-900 border border-neutral-800 rounded-xl shadow-xl shadow-black/40 overflow-hidden z-50 transition-all duration-200 ease-out origin-top-right ${
            open
              ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
              : "opacity-0 scale-95 -translate-y-1 pointer-events-none"
          }`}
          role="menu"
          id="notification-dropdown"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800/60">
            <h3 className="text-sm font-semibold text-white">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="flex items-center gap-1 text-xs text-primary hover:text-blue-400 transition-colors font-medium"
              >
                <CheckCheck size={13} />
                Mark all read
              </button>
            )}
          </div>

          {/* Body */}
          <div className="max-h-[320px] overflow-y-auto custom-scrollbar">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 size={20} className="text-primary animate-spin" />
              </div>
            ) : displayNotifs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 gap-2">
                <Bell size={24} className="text-neutral-600" />
                <p className="text-sm text-neutral-500">No notifications yet</p>
              </div>
            ) : (
              displayNotifs.map((notif) => {
                const config = ICON_MAP[notif.type] || ICON_MAP.system;
                const IconComp = config.icon;

                return (
                  <button
                    key={notif._id}
                    onClick={() => handleNotifClick(notif)}
                    className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors duration-150 hover:bg-neutral-800/60 ${
                      !notif.isRead ? "bg-primary/[0.03]" : ""
                    }`}
                  >
                    {/* Icon */}
                    <div
                      className={`w-8 h-8 rounded-lg ${config.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}
                    >
                      <IconComp size={15} className={config.color} />
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
                      <p className="text-xs text-neutral-500 mt-0.5">
                        {timeAgo(notif.createdAt)}
                      </p>
                    </div>

                    {/* Unread indicator / mark-read */}
                    {!notif.isRead && (
                      <button
                        onClick={(e) => handleMarkAsRead(e, notif._id)}
                        className="flex-shrink-0 mt-1 p-1 rounded-md text-neutral-500 hover:text-primary hover:bg-neutral-800 transition-colors"
                        title="Mark as read"
                      >
                        <Check size={14} />
                      </button>
                    )}
                  </button>
                );
              })
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="border-t border-neutral-800/60">
              <button
                onClick={handleViewAll}
                className="w-full py-2.5 text-xs font-medium text-primary hover:text-blue-400 hover:bg-neutral-800/40 transition-colors"
              >
                View all notifications
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Full Notifications Modal */}
      {showModal && (
        <NotificationModal
          onClose={() => {
            setShowModal(false);
            fetchUnreadCount();
          }}
        />
      )}
    </>
  );
};

export default NotificationDropdown;
