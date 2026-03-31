import React, { useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/common/Button";
import Spinner from "../../components/common/Spinner";
import { User, Mail, Lock } from "lucide-react";

const ProfilePage = () => {
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const handleChangePassword = (e) => {
    e.preventDefault();
    console.log("Password change submitted");
  };

  return (
    <div>
      <PageHeader title="Profile Settings" />

      <div className="space-y-8">
        {/* User Info */}
        <div className="bg-white border border-neutral-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">
            User Information
          </h3>

          <div className="space-y-4">
            <div>
              <label>Username</label>
              <div className="relative">
                <div className="absolute left-3 top-2">
                  <User size={16} />
                </div>
                <p className="pl-8">{username}</p>
              </div>
            </div>

            <div>
              <label>Email Address</label>
              <div className="relative">
                <div className="absolute left-3 top-2">
                  <Mail size={16} />
                </div>
                <p className="pl-8">{email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Change Password */}
        <div className="bg-white border border-neutral-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">
            Change Password
          </h3>

          <form onSubmit={handleChangePassword}>
            {/* Current */}
            <div>
              <label>Current Password</label>
              <div className="relative">
                <div className="absolute left-3 top-2">
                  <Lock size={16} />
                </div>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) =>
                    setCurrentPassword(e.target.value)
                  }
                  className="pl-8 border"
                />
              </div>
            </div>

            {/* New */}
            <div>
              <label>New Password</label>
              <div className="relative">
                <div className="absolute left-3 top-2">
                  <Lock size={16} />
                </div>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) =>
                    setNewPassword(e.target.value)
                  }
                  className="pl-8 border"
                />
              </div>
            </div>

            {/* Confirm */}
            <div>
              <label>Confirm New Password</label>
              <div className="relative">
                <div className="absolute left-3 top-2">
                  <Lock size={16} />
                </div>
                <input
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) =>
                    setConfirmNewPassword(e.target.value)
                  }
                  className="pl-8 border"
                />
              </div>
            </div>

            <Button type="submit" disabled={passwordLoading}>
              {passwordLoading ? "Changing..." : "Change Password"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;