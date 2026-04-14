import React, { useState, useRef } from "react";
import { Image as ImageIcon, Paperclip, X, Loader2, FileText } from "lucide-react";
import communityService from "../../services/communityService";
import toast from "react-hot-toast";

const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const CreatePost = ({ onPostCreated }) => {
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const imageInputRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > MAX_FILE_SIZE) {
        toast.error("Image size must be less than 10MB");
        return;
      }
      setImage(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > MAX_FILE_SIZE) {
        toast.error("File size must be less than 10MB");
        return;
      }
      if (!ALLOWED_FILE_TYPES.includes(selectedFile.type)) {
        toast.error("Only PDF and DOC/DOCX files are allowed");
        return;
      }
      setFile(selectedFile);
    }
  };

  const clearImage = () => {
    setImage(null);
    setImagePreview(null);
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };

  const clearFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() && !image && !file) return;

    try {
      setIsSubmitting(true);
      const formData = new FormData();
      if (content.trim()) formData.append("content", content.trim());
      if (image) formData.append("image", image);
      if (file) formData.append("file", file);

      const res = await communityService.createPost(formData);
      if (res.success) {
        setContent("");
        clearImage();
        clearFile();
        toast.success("Post created successfully!");
        if (onPostCreated) {
          onPostCreated(res.data);
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to create post");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-5 mb-8 shadow-sm">
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="What's on your mind? Share with the community..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={isSubmitting}
          className="w-full bg-transparent border-none resize-none text-neutral-200 placeholder-neutral-500 focus:ring-0 text-lg min-h-[80px] custom-scrollbar focus:outline-none"
        />

        {/* Image Preview */}
        {imagePreview && (
          <div className="relative mt-3 inline-block">
            <img
              src={imagePreview}
              alt="Preview"
              className="max-h-64 rounded-lg object-contain bg-black border border-neutral-800"
            />
            <button
              type="button"
              onClick={clearImage}
              className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white p-1 rounded-full transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* File Preview */}
        {file && (
          <div className="mt-3 flex items-center gap-3 bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <FileText size={18} className="text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-neutral-200 truncate">
                {file.name}
              </p>
              <p className="text-xs text-neutral-500">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <button
              type="button"
              onClick={clearFile}
              className="text-neutral-500 hover:text-neutral-300 p-1 rounded-full hover:bg-neutral-800 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        )}

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-neutral-800/60">
          <div className="flex items-center gap-3">
            {/* Image Upload */}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={imageInputRef}
              onChange={handleImageChange}
              disabled={isSubmitting}
            />
            <button
              type="button"
              onClick={() => imageInputRef.current?.click()}
              disabled={isSubmitting}
              className="flex items-center gap-2 text-primary hover:text-primary-dark transition-colors font-medium text-sm disabled:opacity-50"
            >
              <ImageIcon size={20} />
              <span>Image</span>
            </button>

            {/* File Upload */}
            <input
              type="file"
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
              disabled={isSubmitting}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isSubmitting}
              className="flex items-center gap-2 text-neutral-400 hover:text-neutral-200 transition-colors font-medium text-sm disabled:opacity-50"
            >
              <Paperclip size={18} />
              <span>File</span>
            </button>
          </div>

          <button
            type="submit"
            disabled={(!content.trim() && !image && !file) || isSubmitting}
            className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary-dark text-white px-6 py-2 rounded-xl font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Posting...
              </>
            ) : (
              "Post"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
