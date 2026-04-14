import React, { useState, useRef } from "react";
import { Image as ImageIcon, X, Loader2 } from "lucide-react";
import communityService from "../../services/communityService";
import toast from "react-hot-toast";

const CreatePost = ({ onPostCreated }) => {
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Image size must be less than 10MB");
        return;
      }
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() && !image) return;

    try {
      setIsSubmitting(true);
      const formData = new FormData();
      if (content.trim()) formData.append("content", content.trim());
      if (image) formData.append("image", image);

      const res = await communityService.createPost(formData);
      if (res.success) {
        setContent("");
        clearImage();
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

        {imagePreview && (
          <div className="relative mt-3 inline-block">
            <img
              src={imagePreview}
              alt="Preview"
              className="max-h-64 rounded-lg object-cover border border-neutral-800"
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

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-neutral-800/60">
          <div>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleImageChange}
              disabled={isSubmitting}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isSubmitting}
              className="flex items-center gap-2 text-primary hover:text-primary-dark transition-colors font-medium text-sm disabled:opacity-50"
            >
              <ImageIcon size={20} />
              <span>Attach Image</span>
            </button>
          </div>

          <button
            type="submit"
            disabled={(!content.trim() && !image) || isSubmitting}
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
