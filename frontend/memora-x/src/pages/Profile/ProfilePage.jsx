import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/common/Button";
import {
  User,
  Mail,
  Lock,
  Camera,
  Loader2,
  Calendar,
  Pencil,
  Check,
  X,
  AlertCircle,
  FileText,
  Eye,
  EyeOff,
  ShieldCheck,
  Bell,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import authService from "../../services/authService";
import notificationService from "../../services/notificationService";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const { user, updateUser } = useAuth();

  // ── Page-level loading ──
  const [pageLoading, setPageLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  // ── Avatar ──
  const [imageLoading, setImageLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  // ── Edit mode ──
  const [isEditing, setIsEditing] = useState(false);
  const [editUsername, setEditUsername] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editBio, setEditBio] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);

  // ── Inline validation ──
  const [fieldErrors, setFieldErrors] = useState({});

  // ── Notification Settings ──
  const [notifSettings, setNotifSettings] = useState({
    likes: true,
    comments: true,
    reposts: true,
    streaks: true,
    system: true,
  });
  const [notifLoading, setNotifLoading] = useState(true);

  // ── Password ──
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  // ── Fetch profile ──
  const fetchProfile = useCallback(async () => {
    try {
      setPageLoading(true);
      const response = await authService.getProfile();
      if (response.success) {
        setProfile(response.data);
        updateUser({
          username: response.data.username,
          email: response.data.email,
          profileImage: response.data.profileImage,
          bio: response.data.bio,
          createdAt: response.data.createdAt,
        });
      }
    } catch (err) {
      console.error("Failed to fetch profile:", err);
      toast.error("Failed to load profile data");
    } finally {
      setPageLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
    fetchNotifSettings();
  }, [fetchProfile]);

  // ── Fetch notification settings ──
  const fetchNotifSettings = async () => {
    try {
      setNotifLoading(true);
      const res = await notificationService.getSettings();
      if (res.success) setNotifSettings(res.data);
    } catch (err) {
      console.error("Failed to fetch notification settings:", err);
    } finally {
      setNotifLoading(false);
    }
  };

  // ── Toggle a notification setting ──
  const handleToggleNotif = async (key) => {
    const newValue = !notifSettings[key];
    // Optimistic update
    setNotifSettings((prev) => ({ ...prev, [key]: newValue }));
    try {
      await notificationService.updateSettings({ [key]: newValue });
    } catch (err) {
      // Revert on error
      setNotifSettings((prev) => ({ ...prev, [key]: !newValue }));
      toast.error("Failed to update notification settings");
    }
  };

  // ── Has changes? ──
  const hasChanges = useMemo(() => {
    if (!profile || !isEditing) return false;
    return (
      editUsername.trim() !== (profile.username || "") ||
      editEmail.trim() !== (profile.email || "") ||
      editBio !== (profile.bio || "")
    );
  }, [isEditing, editUsername, editEmail, editBio, profile]);

  // ── Start / Cancel editing ──
  const startEditing = () => {
    setEditUsername(profile?.username || "");
    setEditEmail(profile?.email || "");
    setEditBio(profile?.bio || "");
    setFieldErrors({});
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setFieldErrors({});
  };

  // ── Inline validation helpers ──
  const validateFields = () => {
    const errors = {};
    if (!editUsername.trim() || editUsername.trim().length < 2) {
      errors.username = "Username must be at least 2 characters";
    }
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!editEmail.trim() || !emailRegex.test(editEmail.trim())) {
      errors.email = "Please enter a valid email address";
    }
    if (editBio.length > 200) {
      errors.bio = "Bio cannot exceed 200 characters";
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ── Save profile ──
  const handleSaveProfile = async () => {
    if (!validateFields()) return;

    try {
      setProfileSaving(true);
      const response = await authService.updateProfile({
        username: editUsername.trim(),
        email: editEmail.trim(),
        bio: editBio,
      });

      if (response.success) {
        setProfile(response.data);
        updateUser({
          username: response.data.username,
          email: response.data.email,
          bio: response.data.bio,
        });
        setIsEditing(false);
        setFieldErrors({});
        toast.success("Profile updated successfully");
      }
    } catch (err) {
      console.error("Failed to update profile:", err);
      toast.error(err?.error || "Failed to update profile");
    } finally {
      setProfileSaving(false);
    }
  };

  // ── Avatar upload ──
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);

    try {
      setImageLoading(true);
      const formData = new FormData();
      formData.append("image", file);

      const response = await authService.changeProfileImage(formData);

      if (response.success) {
        setProfile((prev) => ({
          ...prev,
          profileImage: response.data.profileImage,
        }));
        updateUser({ profileImage: response.data.profileImage });
        toast.success("Profile photo updated");
        setImagePreview(null);
      }
    } catch (err) {
      console.error(err);
      toast.error(err?.error || "Failed to update profile photo");
      setImagePreview(null);
    } finally {
      setImageLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // ── Password change ──
  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setPasswordLoading(true);
      await authService.changePassword({ currentPassword, newPassword });
      toast.success("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (err) {
      console.error(err);
      toast.error(err?.error || "Failed to update password");
    } finally {
      setPasswordLoading(false);
    }
  };

  // ── Date format ──
  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const avatarUrl = imagePreview || profile?.profileImage;

  // ── Loading state ──
  if (pageLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Profile Settings" />
        <div className="flex items-center justify-center py-24">
          <div className="flex flex-col items-center gap-3">
            <Loader2 size={28} className="text-primary animate-spin" />
            <p className="text-sm text-neutral-500">Loading profile…</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <PageHeader title="Profile Settings" />

      {/* ════════════════════ PROFILE HEADER ════════════════════ */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
        {/* Subtle gradient banner — compact */}
        <div className="h-20 bg-gradient-to-br from-primary/20 via-indigo-900/15 to-neutral-900" />

        <div className="px-6 pb-5 -mt-10">
          <div className="flex items-end gap-4">
            {/* ── Circular Avatar ── */}
            <div
              className={`relative w-20 h-20 rounded-full ring-[3px] ring-neutral-900 flex-shrink-0 overflow-hidden group transition-transform duration-200 hover:scale-[1.03]
                ${imageLoading ? "cursor-not-allowed opacity-70" : "cursor-pointer"}`}
              onClick={() => !imageLoading && fileInputRef.current?.click()}
              title={!imageLoading ? "Change Photo" : undefined}
              id="profile-avatar"
            >
              {avatarUrl ? (
                <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary to-primary-dark text-white flex items-center justify-center text-xl font-bold select-none">
                  {profile?.username?.[0]?.toUpperCase() || "U"}
                </div>
              )}

              {/* Hover overlay */}
              {!imageLoading && (
                <div className="absolute inset-0 bg-black/55 flex flex-col items-center justify-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Camera size={16} className="text-white" />
                  <span className="text-[10px] text-white/90 font-medium">Change Photo</span>
                </div>
              )}

              {/* Upload spinner */}
              {imageLoading && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <Loader2 size={18} className="text-white animate-spin" />
                </div>
              )}
            </div>

            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
              disabled={imageLoading}
            />

            {/* ── Name / Email / Joined ── */}
            <div className="flex-1 min-w-0 pb-0.5">
              <h2 className="text-lg font-bold text-white truncate leading-tight" id="profile-display-name">
                {profile?.username || "Username"}
              </h2>
              <p className="text-sm text-neutral-400 truncate">{profile?.email}</p>
              <p className="text-xs text-neutral-500 mt-0.5 flex items-center gap-1">
                <Calendar size={11} className="text-neutral-500" />
                Joined {formatDate(profile?.createdAt)}
              </p>
            </div>
          </div>

          {/* ── Bio (read-only display) ── */}
          {!isEditing && (
            <p className="mt-4 text-sm text-neutral-400 leading-relaxed max-w-2xl">
              {profile?.bio || (
                <span className="italic text-neutral-600">No bio yet — tell others about yourself.</span>
              )}
            </p>
          )}
        </div>
      </div>

      {/* ════════════════════ PROFILE INFORMATION ════════════════════ */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
        {/* Section header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-base font-semibold text-white">Profile Information</h3>

          {!isEditing && (
            <button
              onClick={startEditing}
              className="flex items-center gap-1.5 text-sm text-primary hover:text-blue-400 transition-colors font-medium"
              id="btn-edit-profile"
            >
              <Pencil size={14} />
              Edit Profile
            </button>
          )}
        </div>

        {isEditing ? (
          /* ── EDIT MODE ── */
          <div className="space-y-6">
            {/* Username */}
            <EditField
              id="edit-username"
              label="Username"
              icon={User}
              value={editUsername}
              onChange={(v) => {
                setEditUsername(v);
                if (fieldErrors.username) setFieldErrors((e) => ({ ...e, username: null }));
              }}
              placeholder="Enter username"
              maxLength={30}
              error={fieldErrors.username}
            />

            {/* Email */}
            <EditField
              id="edit-email"
              label="Email Address"
              icon={Mail}
              type="email"
              value={editEmail}
              onChange={(v) => {
                setEditEmail(v);
                if (fieldErrors.email) setFieldErrors((e) => ({ ...e, email: null }));
              }}
              placeholder="Enter email"
              error={fieldErrors.email}
            />

            {/* Bio — special textarea */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="edit-bio" className="text-sm font-medium text-neutral-200">
                  Bio
                </label>
                <span className={`text-xs tabular-nums ${editBio.length > 200 ? "text-red-400" : "text-neutral-500"}`}>
                  {editBio.length}/200
                </span>
              </div>
              <textarea
                id="edit-bio"
                value={editBio}
                onChange={(e) => {
                  setEditBio(e.target.value);
                  if (fieldErrors.bio) setFieldErrors((er) => ({ ...er, bio: null }));
                }}
                rows={3}
                maxLength={200}
                className={`w-full px-4 py-3 text-sm leading-relaxed border rounded-xl bg-neutral-800/80 text-white placeholder-neutral-500 outline-none transition-all resize-none
                  ${fieldErrors.bio
                    ? "border-red-500/60 focus:border-red-500 focus:ring-2 focus:ring-red-500/15"
                    : "border-neutral-700 focus:border-primary focus:ring-2 focus:ring-primary/15"
                  }`}
                placeholder="Tell others about yourself…"
              />
              {fieldErrors.bio && <p className="text-xs text-red-400 mt-1">{fieldErrors.bio}</p>}
            </div>

            {/* ── Bottom action bar ── */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-neutral-800">
              <button
                onClick={cancelEditing}
                disabled={profileSaving}
                className="px-4 py-2 text-sm font-medium text-neutral-400 hover:text-neutral-200 transition-colors rounded-lg disabled:opacity-50"
                id="btn-cancel-edit"
              >
                Cancel
              </button>
              <Button
                onClick={handleSaveProfile}
                disabled={profileSaving || !hasChanges}
                className="min-w-[140px] h-10 text-sm"
                id="btn-save-profile"
              >
                {profileSaving ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    Saving…
                  </>
                ) : (
                  <>
                    <Check size={15} />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          /* ── VIEW MODE ── */
          <div className="space-y-5">
            <InfoRow icon={User} label="Username" value={profile?.username} />
            <InfoRow icon={Mail} label="Email Address" value={profile?.email} />
            <InfoRow
              icon={FileText}
              label="Bio"
              value={
                profile?.bio || (
                  <span className="text-neutral-600 italic text-sm">Not set</span>
                )
              }
            />
            <InfoRow icon={Calendar} label="Member Since" value={formatDate(profile?.createdAt)} />
          </div>
        )}
      </div>

      {/* ════════════════════ CHANGE PASSWORD ════════════════════ */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
        {/* Section header with icon */}
        <div className="flex items-center gap-2.5 mb-1">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-500/10">
            <ShieldCheck size={16} className="text-amber-400" />
          </div>
          <h3 className="text-base font-semibold text-white">Change Password</h3>
        </div>
        <p className="text-xs text-neutral-500 mb-6 ml-[42px]">
          Use a strong password with at least 6 characters that you haven't used before.
        </p>

        <form onSubmit={handleChangePassword} className="space-y-5 max-w-lg">
          <PasswordField
            id="pw-current"
            label="Current Password"
            value={currentPassword}
            onChange={setCurrentPassword}
            placeholder="Enter your current password"
            show={showCurrentPw}
            toggleShow={() => setShowCurrentPw((s) => !s)}
          />

          {/* Divider */}
          <div className="border-t border-neutral-800" />

          <PasswordField
            id="pw-new"
            label="New Password"
            value={newPassword}
            onChange={setNewPassword}
            placeholder="Enter a new password"
            show={showNewPw}
            toggleShow={() => setShowNewPw((s) => !s)}
          />

          <PasswordField
            id="pw-confirm"
            label="Confirm New Password"
            value={confirmNewPassword}
            onChange={setConfirmNewPassword}
            placeholder="Confirm your new password"
            show={showConfirmPw}
            toggleShow={() => setShowConfirmPw((s) => !s)}
          />

          <div className="pt-2">
            <Button
              type="submit"
              disabled={passwordLoading}
              className="w-full sm:w-auto min-w-[200px] h-10 text-sm font-medium"
              id="btn-change-password"
            >
              {passwordLoading ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  Updating…
                </>
              ) : (
                "Update Password"
              )}
            </Button>
          </div>
        </form>
      </div>

      {/* ════════════════════ NOTIFICATION PREFERENCES ════════════════════ */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
        <div className="flex items-center gap-2.5 mb-1">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
            <Bell size={16} className="text-primary" />
          </div>
          <h3 className="text-base font-semibold text-white">Notification Preferences</h3>
        </div>
        <p className="text-xs text-neutral-500 mb-6 ml-[42px]">
          Choose which notifications you want to receive.
        </p>

        {notifLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 size={20} className="text-primary animate-spin" />
          </div>
        ) : (
          <div className="space-y-4 max-w-lg">
            <ToggleRow
              label="Likes"
              description="When someone likes your post"
              checked={notifSettings.likes}
              onChange={() => handleToggleNotif("likes")}
            />
            <ToggleRow
              label="Comments"
              description="When someone comments on your post"
              checked={notifSettings.comments}
              onChange={() => handleToggleNotif("comments")}
            />
            <ToggleRow
              label="Reposts"
              description="When someone reposts your content"
              checked={notifSettings.reposts}
              onChange={() => handleToggleNotif("reposts")}
            />
            <ToggleRow
              label="Streak Reminders"
              description="Daily reminders to keep your streak going"
              checked={notifSettings.streaks}
              onChange={() => handleToggleNotif("streaks")}
            />
            <ToggleRow
              label="System"
              description="Updates, announcements, and tips"
              checked={notifSettings.system}
              onChange={() => handleToggleNotif("system")}
            />
          </div>
        )}
      </div>
    </div>
  );
};

/* ═══════════ Sub-components ═══════════ */

/** Toggle switch row for notification preferences */
const ToggleRow = ({ label, description, checked, onChange }) => (
  <div className="flex items-center justify-between py-2">
    <div>
      <p className="text-sm font-medium text-neutral-200">{label}</p>
      <p className="text-xs text-neutral-500">{description}</p>
    </div>
    <button
      onClick={onChange}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/30 ${
        checked ? "bg-primary" : "bg-neutral-700"
      }`}
      role="switch"
      aria-checked={checked}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  </div>
);

/** Read-only info row for view mode */
const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3">
    <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-neutral-800 border border-neutral-700/40 flex-shrink-0">
      <Icon size={15} className="text-neutral-500" />
    </div>
    <div className="min-w-0 flex-1 pt-0.5">
      <p className="text-xs text-neutral-500 mb-0.5">{label}</p>
      <p className="text-sm text-neutral-200 break-words">{value || "—"}</p>
    </div>
  </div>
);

/** Editable text input with icon and inline error */
const EditField = ({ id, label, icon: Icon, type = "text", value, onChange, placeholder, maxLength, error }) => (
  <div className="space-y-1.5">
    <label htmlFor={id} className="text-sm font-medium text-neutral-200">
      {label}
    </label>
    <div className="relative group">
      <Icon
        size={16}
        className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors
          ${error ? "text-red-400" : "text-neutral-500 group-focus-within:text-primary"}`}
      />
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={maxLength}
        className={`w-full pl-10 pr-4 py-2.5 text-sm border rounded-xl bg-neutral-800/80 text-white placeholder-neutral-500 outline-none transition-all
          ${error
            ? "border-red-500/60 focus:border-red-500 focus:ring-2 focus:ring-red-500/15"
            : "border-neutral-700 focus:border-primary focus:ring-2 focus:ring-primary/15"
          }`}
        placeholder={placeholder}
      />
    </div>
    {error && (
      <p className="flex items-center gap-1 text-xs text-red-400">
        <AlertCircle size={12} /> {error}
      </p>
    )}
  </div>
);

/** Password input with show/hide toggle */
const PasswordField = ({ id, label, value, onChange, placeholder, show, toggleShow }) => (
  <div className="space-y-1.5">
    <label htmlFor={id} className="text-sm font-medium text-neutral-200">
      {label}
    </label>
    <div className="relative group">
      <Lock
        size={16}
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-primary transition-colors"
      />
      <input
        id={id}
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-10 pr-10 py-2.5 text-sm border border-neutral-700 rounded-xl bg-neutral-800/80 text-white placeholder-neutral-500 focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none transition-all"
        placeholder={placeholder}
        required
      />
      <button
        type="button"
        onClick={toggleShow}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 transition-colors"
        tabIndex={-1}
        aria-label={show ? "Hide password" : "Show password"}
      >
        {show ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  </div>
);

export default ProfilePage;