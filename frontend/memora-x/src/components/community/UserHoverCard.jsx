import React, { useState, useRef, useEffect, useCallback } from "react";
import { User, Calendar } from "lucide-react";
import communityService from "../../services/communityService";

// Global in-memory cache for user profiles
const profileCache = new Map();

const UserHoverCard = ({ userId, children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const triggerRef = useRef(null);
  const cardRef = useRef(null);
  const hoverTimeoutRef = useRef(null);
  const leaveTimeoutRef = useRef(null);

  // Fetch user profile with caching
  const fetchProfile = useCallback(async () => {
    if (!userId) return;

    // Check cache first
    if (profileCache.has(userId)) {
      setProfile(profileCache.get(userId));
      return;
    }

    try {
      setLoading(true);
      setError(false);
      const res = await communityService.getUserProfile(userId);
      if (res.success) {
        profileCache.set(userId, res.data);
        setProfile(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch user profile:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Compute position relative to viewport
  const computePosition = useCallback(() => {
    if (!triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();
    const cardWidth = 300;
    const cardHeight = 200;
    const gap = 8;

    let top = rect.bottom + gap;
    let left = rect.left;

    // Prevent right overflow
    if (left + cardWidth > window.innerWidth - 16) {
      left = window.innerWidth - cardWidth - 16;
    }

    // Prevent left overflow
    if (left < 16) {
      left = 16;
    }

    // If card overflows bottom, show above trigger
    if (top + cardHeight > window.innerHeight - 16) {
      top = rect.top - cardHeight - gap;
    }

    // If still overflows top, just show below
    if (top < 16) {
      top = rect.bottom + gap;
    }

    setPosition({ top, left });
  }, []);

  const showCard = useCallback(() => {
    clearTimeout(leaveTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      computePosition();
      setIsVisible(true);
      fetchProfile();
    }, 200);
  }, [computePosition, fetchProfile]);

  const hideCard = useCallback(() => {
    clearTimeout(hoverTimeoutRef.current);
    leaveTimeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 250);
  }, []);

  const handleClick = useCallback((e) => {
    e.stopPropagation();
    clearTimeout(hoverTimeoutRef.current);
    clearTimeout(leaveTimeoutRef.current);
    computePosition();
    setIsVisible((prev) => !prev);
    fetchProfile();
  }, [computePosition, fetchProfile]);

  // Card stay open when hovering the card itself
  const handleCardEnter = useCallback(() => {
    clearTimeout(leaveTimeoutRef.current);
  }, []);

  const handleCardLeave = useCallback(() => {
    hideCard();
  }, [hideCard]);

  // Close on outside click
  useEffect(() => {
    if (!isVisible) return;

    const handleOutsideClick = (e) => {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(e.target) &&
        cardRef.current &&
        !cardRef.current.contains(e.target)
      ) {
        setIsVisible(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isVisible]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      clearTimeout(hoverTimeoutRef.current);
      clearTimeout(leaveTimeoutRef.current);
    };
  }, []);

  // Format join date
  const formatJoinDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  // Get initials from username
  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      {/* Trigger wrapper */}
      <span
        ref={triggerRef}
        onMouseEnter={showCard}
        onMouseLeave={hideCard}
        onClick={handleClick}
        className="inline-flex items-center cursor-pointer"
        role="button"
        tabIndex={0}
        aria-label="View user profile"
      >
        {children}
      </span>

      {/* Popover card */}
      {isVisible && (
        <div
          ref={cardRef}
          onMouseEnter={handleCardEnter}
          onMouseLeave={handleCardLeave}
          className="user-hover-card"
          style={{
            position: "fixed",
            top: `${position.top}px`,
            left: `${position.left}px`,
            zIndex: 9999,
          }}
        >
          <div className="user-hover-card__inner">
            {/* Loading skeleton */}
            {loading && !profile && (
              <div className="user-hover-card__skeleton">
                <div className="user-hover-card__skeleton-avatar" />
                <div className="user-hover-card__skeleton-lines">
                  <div className="user-hover-card__skeleton-line user-hover-card__skeleton-line--name" />
                  <div className="user-hover-card__skeleton-line user-hover-card__skeleton-line--bio" />
                  <div className="user-hover-card__skeleton-line user-hover-card__skeleton-line--date" />
                </div>
              </div>
            )}

            {/* Error state */}
            {error && !profile && (
              <div className="user-hover-card__error">
                <User size={20} />
                <span>Could not load profile</span>
              </div>
            )}

            {/* Profile content */}
            {profile && (
              <>
                {/* Banner strip */}
                <div className="user-hover-card__banner" />

                {/* Profile body */}
                <div className="user-hover-card__body">
                  {/* Avatar */}
                  <div className="user-hover-card__avatar-wrapper">
                    {profile.profileImage ? (
                      <img
                        src={profile.profileImage}
                        alt={profile.username}
                        className="user-hover-card__avatar-img"
                      />
                    ) : (
                      <div className="user-hover-card__avatar-fallback">
                        <span>{getInitials(profile.username)}</span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="user-hover-card__info">
                    <h4 className="user-hover-card__name">
                      {profile.username}
                    </h4>

                    {profile.bio && (
                      <p className="user-hover-card__bio">{profile.bio}</p>
                    )}

                    <div className="user-hover-card__divider" />

                    <div className="user-hover-card__meta">
                      <Calendar size={13} />
                      <span>Joined {formatJoinDate(profile.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default UserHoverCard;
