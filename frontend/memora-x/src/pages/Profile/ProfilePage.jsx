import React, { useState, useRef } from "react";
import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/common/Button";
import { User, Mail, Lock, Camera, Loader2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import authService from "../../services/authService";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  
  const [imageLoading, setImageLoading] = useState(false);
  const fileInputRef = useRef(null);

  const [passwordLoading, setPasswordLoading] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setImageLoading(true);
      const formData = new FormData();
      formData.append("image", file);

      const response = await authService.changeProfileImage(formData);
      
      if (response.success) {
        updateUser({ profileImage: response.data.profileImage });
        toast.success("Profile image updated");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.error || "Failed to update profile image");
    } finally {
      setImageLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

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
      <div className="bg-neutral-900 border border-neutral-700 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div 
            className={`relative w-14 h-14 rounded-full flex items-center justify-center text-lg font-semibold overflow-hidden group ${imageLoading ? "cursor-not-allowed opacity-70" : "cursor-pointer"}`}
            onClick={() => !imageLoading && fileInputRef.current?.click()}
            title={!imageLoading ? "Change photo" : undefined}
          >
            {user?.profileImage ? (
               <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
            ) : (
               <div className="w-full h-full bg-primary text-white flex items-center justify-center">
                 {user?.username?.[0] || "U"}
               </div>
            )}
            
            {!imageLoading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera size={16} className="text-white" />
              </div>
            )}

            {imageLoading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Loader2 size={16} className="text-white animate-spin" />
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
          <div>
            <p className="text-lg font-semibold text-white">
              {user?.username || "Username"}
            </p>
            <p className="text-sm text-neutral-400">
              {user?.email || "email@example.com"}
            </p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="bg-neutral-900 border border-neutral-700 rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-6">User Information</h3>

        <div className="space-y-5">
          <div>
            <label className="text-sm text-neutral-400 mb-1 block">
              Username
            </label>
            <div className="flex items-center gap-2 bg-neutral-800 border border-neutral-600 rounded-lg px-3 py-2">
              <User size={16} className="text-neutral-400" />
              <span className="text-white">
                {user?.username || "-"}
              </span>
            </div>
          </div>

          <div>
            <label className="text-sm text-neutral-400 mb-1 block">
              Email Address
            </label>
            <div className="flex items-center gap-2 bg-neutral-800 border border-neutral-600 rounded-lg px-3 py-2">
              <Mail size={16} className="text-neutral-400" />
              <span className="text-white">
                {user?.email || "-"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password */}
      <div className="bg-neutral-900 border border-neutral-700 rounded-xl p-6 shadow-sm">
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
              <label className="text-sm font-medium text-neutral-300">
                {field.label}
              </label>

              <div className="relative group">
                <Lock
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-primary transition"
                />

                <input
                  type="password"
                  value={field.value}
                  onChange={(e) => field.set(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 text-sm border border-neutral-600 rounded-lg bg-neutral-800 text-white placeholder-neutral-500 focus:bg-neutral-800 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                  required
                />
              </div>
            </div>
          ))}

          <p className="text-xs text-neutral-400">
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