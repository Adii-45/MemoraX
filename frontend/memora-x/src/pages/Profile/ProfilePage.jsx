import React, { useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/common/Button";
import { User, Mail, Lock } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import authService from "../../services/authService";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const { user } = useAuth();

  const [passwordLoading, setPasswordLoading] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmNewPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setPasswordLoading(true);

      // 🔥 Replace with your API call
      console.log({
        currentPassword,
        newPassword,
      });

      await authService.changePassword({ currentPassword, newPassword });

      toast.success("Password updated successfully");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update password");
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Profile Settings" />

      {/* Profile Header */}
      <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center text-lg font-semibold">
            {user?.username?.[0] || "U"}
          </div>
          <div>
            <p className="text-lg font-semibold text-neutral-800">
              {user?.username || "Username"}
            </p>
            <p className="text-sm text-neutral-500">
              {user?.email || "email@example.com"}
            </p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-6">User Information</h3>

        <div className="space-y-5">
          <div>
            <label className="text-sm text-neutral-600 mb-1 block">
              Username
            </label>
            <div className="flex items-center gap-2 bg-neutral-50 border rounded-lg px-3 py-2">
              <User size={16} className="text-neutral-500" />
              <span className="text-neutral-800">
                {user?.username || "-"}
              </span>
            </div>
          </div>

          <div>
            <label className="text-sm text-neutral-600 mb-1 block">
              Email Address
            </label>
            <div className="flex items-center gap-2 bg-neutral-50 border rounded-lg px-3 py-2">
              <Mail size={16} className="text-neutral-500" />
              <span className="text-neutral-800">
                {user?.email || "-"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password */}
      <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-6">Change Password</h3>

        <form onSubmit={handleChangePassword} className="space-y-5">
          {[
            {
              label: "Current Password",
              value: currentPassword,
              set: setCurrentPassword,
            },
            {
              label: "New Password",
              value: newPassword,
              set: setNewPassword,
            },
            {
              label: "Confirm New Password",
              value: confirmNewPassword,
              set: setConfirmNewPassword,
            },
          ].map((field, i) => (
            <div key={i} className="space-y-1">
              <label className="text-sm font-medium text-neutral-700">
                {field.label}
              </label>

              <div className="relative group">
                <Lock
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-primary transition"
                />

                <input
                  type="password"
                  value={field.value}
                  onChange={(e) => field.set(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 text-sm border border-neutral-300 rounded-lg bg-neutral-50 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                  required
                />
              </div>
            </div>
          ))}

          <p className="text-xs text-neutral-500">
            Password should be at least 6 characters.
          </p>

          <div className="pt-2">
            <Button
              type="submit"
              disabled={passwordLoading}
              className="w-full h-11 text-sm font-medium shadow-md hover:shadow-lg transition-all"
            >
              {passwordLoading ? "Updating Password..." : "Update Password"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;