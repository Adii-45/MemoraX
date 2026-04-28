import React, { useState, useEffect, useRef } from "react";
import { Plus, Upload, Trash2, FileText, X, File, CheckCircle2, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

import documentService from "../../services/documentService";
import Spinner from "../../components/common/Spinner";
import Button from "../../components/common/Button";
import DocumentCard from "../../components/documents/DocumentCard";

const DocumentListPage = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  // State for multi-file upload modal
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [files, setFiles] = useState([]);
  // files shape: [{ id, file, title, error, status }]
  // status: 'pending' | 'uploading' | 'success' | 'failed'
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });

  const fileInputRef = useRef(null);

  // State for delete confirmation modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);

  // Drag state
  const [isDragOver, setIsDragOver] = useState(false);

  const fetchDocuments = async () => {
    try {
      const response = await documentService.getDocuments();
      setDocuments(response.data);
    } catch (error) {
      toast.error("Failed to fetch documents");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  // --- Multi-file helpers ---

  const generateId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

  const cleanFileName = (name) => name.replace(/\.[^/.]+$/, "").trim();

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const addFiles = (newFileList) => {
    const newFileArray = Array.from(newFileList).filter(
      (f) => f.type === "application/pdf"
    );

    if (newFileArray.length === 0) {
      toast.error("Please select PDF files only");
      return;
    }

    // Filter out files already added (by name + size)
    const existingKeys = new Set(
      files.map((f) => `${f.file.name}-${f.file.size}`)
    );

    const deduped = newFileArray.filter(
      (f) => !existingKeys.has(`${f.name}-${f.size}`)
    );

    if (deduped.length < newFileArray.length) {
      const skipped = newFileArray.length - deduped.length;
      toast(`${skipped} duplicate file${skipped > 1 ? "s" : ""} skipped`, {
        icon: "ℹ️",
      });
    }

    if (deduped.length === 0) return;

    const newEntries = deduped.map((file) => ({
      id: generateId(),
      file,
      title: cleanFileName(file.name),
      error: "",
      status: "pending",
    }));

    setFiles((prev) => [...prev, ...newEntries]);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(e.target.files);
    }
    // Reset input so re-selecting the same file works
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleTitleEdit = (id, newTitle) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, title: newTitle, error: "" } : f))
    );
  };

  const handleRemoveFile = (id) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFiles(e.dataTransfer.files);
    }
  };

  // Validate all files before upload
  const validateFiles = () => {
    const existingNames = documents.map((doc) =>
      (doc.title || doc.name || "").toLowerCase().trim()
    );

    let hasErrors = false;

    // Count title occurrences within the batch
    const titleCounts = {};
    files.forEach((f) => {
      const key = (f.title || "").toLowerCase().trim();
      titleCounts[key] = (titleCounts[key] || 0) + 1;
    });

    const validated = files.map((f) => {
      const normalizedTitle = (f.title || "").toLowerCase().trim();

      if (!f.title.trim()) {
        // Fallback to file name if title is empty
        return { ...f, title: cleanFileName(f.file.name), error: "" };
      }

      if (existingNames.includes(normalizedTitle)) {
        hasErrors = true;
        return {
          ...f,
          error: "A document with this name already exists",
        };
      }

      if (titleCounts[normalizedTitle] > 1) {
        hasErrors = true;
        return {
          ...f,
          error: "Duplicate title within selected files",
        };
      }

      return { ...f, error: "" };
    });

    setFiles(validated);
    return !hasErrors;
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (files.length === 0) {
      toast.error("Please select at least one file");
      return;
    }

    if (!validateFiles()) {
      toast.error("Please fix the errors before uploading");
      return;
    }

    setUploading(true);
    setUploadProgress({ current: 0, total: files.length });

    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < files.length; i++) {
      const item = files[i];

      // Mark current file as uploading
      setFiles((prev) =>
        prev.map((f) => (f.id === item.id ? { ...f, status: "uploading" } : f))
      );
      setUploadProgress({ current: i + 1, total: files.length });

      const formData = new FormData();
      formData.append("file", item.file);
      formData.append("title", item.title.trim() || cleanFileName(item.file.name));

      try {
        await documentService.uploadDocument(formData);
        successCount++;
        setFiles((prev) =>
          prev.map((f) =>
            f.id === item.id ? { ...f, status: "success" } : f
          )
        );
      } catch (error) {
        failCount++;
        setFiles((prev) =>
          prev.map((f) =>
            f.id === item.id
              ? {
                  ...f,
                  status: "failed",
                  error: error.message || "Upload failed",
                }
              : f
          )
        );
      }
    }

    setUploading(false);

    if (successCount > 0) {
      toast.success(
        `${successCount} document${successCount > 1 ? "s" : ""} uploaded successfully!`
      );
      await fetchDocuments();
    }

    if (failCount > 0) {
      toast.error(`${failCount} document${failCount > 1 ? "s" : ""} failed to upload`);
    }

    // Close modal and reset only if all succeeded
    if (failCount === 0) {
      setIsUploadModalOpen(false);
      setFiles([]);
      setUploadProgress({ current: 0, total: 0 });
    }
  };

  const handleCloseModal = () => {
    if (uploading) return; // Don't close during upload
    setIsUploadModalOpen(false);
    setFiles([]);
    setUploadProgress({ current: 0, total: 0 });
  };

  const handleDeleteRequest = (doc) => {
    setSelectedDoc(doc);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedDoc) return;
    setDeleting(true);
    try {
      await documentService.deleteDocument(selectedDoc._id);
      toast.success(`'${selectedDoc.title}' deleted.`);
      setIsDeleteModalOpen(false);
      setSelectedDoc(null);
      setDocuments(documents.filter((d) => d._id !== selectedDoc._id));
    } catch (error) {
      toast.error(error.message || "Failed to delete document");
    } finally {
      setDeleting(false);
    }
  };

  const hasErrors = files.some((f) => f.error);

  const renderDocuments = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <Spinner />
        </div>
      );
    }

    if (documents.length === 0) {
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center max-w-md">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-neutral-800 mb-6">
              <FileText
                className="w-10 h-10 text-neutral-500"
                strokeWidth={1.5}
              />
            </div>
            <h3 className="text-xl font-medium text-white tracking-tight mb-2">
              No documents yet
            </h3>
            <p className="text-sm text-neutral-500 mb-6">
              Get started by uploading your first document.
            </p>
            <Button onClick={() => setIsUploadModalOpen(true)}>
              <Plus className="w-4 h-4" strokeWidth={2.5} />
              Upload Document
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {documents.map((doc) => (
          <DocumentCard
            key={doc._id}
            document={doc}
            onDelete={handleDeleteRequest}
          />
        ))}
      </div>
    );
  };

  // Status icon for each file row
  const renderStatusIcon = (status) => {
    switch (status) {
      case "uploading":
        return (
          <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin flex-shrink-0" />
        );
      case "success":
        return (
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
        );
      case "failed":
        return (
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen">
      {/* {Subtle background pattern} */}
      <div className="absolute inset-0 bg-[radial-gradient(#262626_1px,transparent_1px)] bg-size-[16px_16px] opacity-30 pointer-events-none " />

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-white tracking-tight mb-2">
              My Documents
            </h1>
            <p className="text-neutral-400 text-sm">
              Manage and organize your learning materials
            </p>
          </div>
          {documents.length > 0 && (
            <Button onClick={() => setIsUploadModalOpen(true)}>
              <Plus className="w-h h-4" strokeWidth={2.5} />
              Upload Document
            </Button>
          )}
        </div>

        {renderDocuments()}
      </div>

      {/* ===== UPLOAD MODAL ===== */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl p-8 max-h-[90vh] flex flex-col">
            {/* {Close button} */}
            <button
              onClick={handleCloseModal}
              disabled={uploading}
              className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <X className="w-5 h-5" strokeWidth={2} />
            </button>

            {/* {Modal Header} */}
            <div className="mb-6">
              <h2 className="text-xl font-medium text-white tracking-tight">
                Upload Documents
              </h2>
              <p className="text-sm text-neutral-400 mt-1">
                Add PDF documents to your library
              </p>
            </div>

            {/* {Upload Form} */}
            <form onSubmit={handleUpload} className="flex flex-col flex-1 min-h-0 gap-5">
              {/* {File Drop Zone} */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wide">
                  PDF Files
                </label>
                <div
                  className={`relative border-2 border-dashed rounded-xl transition-all duration-200 ${
                    isDragOver
                      ? "border-primary bg-primary/5"
                      : "border-neutral-800 bg-neutral-950 hover:border-neutral-700 hover:bg-neutral-900"
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <input
                    ref={fileInputRef}
                    id="file-upload"
                    type="file"
                    multiple
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    onChange={handleFileChange}
                    accept=".pdf"
                    disabled={uploading}
                  />
                  <div className="flex flex-col items-center justify-center py-8 px-6">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-colors duration-200 ${
                      isDragOver ? "bg-primary/20" : "bg-primary/10"
                    }`}>
                      <Upload
                        className="w-6 h-6 text-primary"
                        strokeWidth={2}
                      />
                    </div>
                    <p className="text-xs font-medium text-neutral-300 mb-1">
                      <span className="text-primary">Click to Upload </span>
                      or drag and drop
                    </p>
                    <p className="text-xs text-neutral-500">
                      PDF files up to 10MB each · Multiple files supported
                    </p>
                  </div>
                </div>
              </div>

              {/* {Selected Files List} */}
              {files.length > 0 && (
                <div className="flex flex-col min-h-0">
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wide">
                      Selected Files ({files.length})
                    </label>
                    {!uploading && files.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setFiles([])}
                        className="text-xs text-neutral-500 hover:text-red-400 transition-colors duration-200"
                      >
                        Clear all
                      </button>
                    )}
                  </div>

                  <div className="overflow-y-auto max-h-[30vh] space-y-2 pr-1 custom-scrollbar">
                    {files.map((item) => (
                      <div
                        key={item.id}
                        className={`group rounded-xl border p-3 transition-all duration-200 ${
                          item.error
                            ? "border-red-500/40 bg-red-500/5"
                            : item.status === "success"
                            ? "border-emerald-500/40 bg-emerald-500/5"
                            : item.status === "uploading"
                            ? "border-primary/40 bg-primary/5"
                            : "border-neutral-800 bg-neutral-950 hover:border-neutral-700"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {/* File icon */}
                          <div className="w-9 h-9 rounded-lg bg-neutral-800 flex items-center justify-center flex-shrink-0">
                            <File className="w-4 h-4 text-neutral-400" strokeWidth={2} />
                          </div>

                          {/* Title input + file info */}
                          <div className="flex-1 min-w-0">
                            <input
                              type="text"
                              value={item.title}
                              onChange={(e) =>
                                handleTitleEdit(item.id, e.target.value)
                              }
                              disabled={uploading}
                              className="w-full bg-transparent text-sm font-medium text-white placeholder-neutral-600 outline-none border-b border-transparent focus:border-neutral-600 transition-colors duration-200 pb-0.5 disabled:opacity-70"
                              placeholder="Document title"
                            />
                            <p className="text-[11px] text-neutral-500 mt-0.5 truncate">
                              {item.file.name} · {formatFileSize(item.file.size)}
                            </p>
                          </div>

                          {/* Status icon or remove button */}
                          <div className="flex items-center gap-1 flex-shrink-0">
                            {renderStatusIcon(item.status)}
                            {!uploading && item.status === "pending" && (
                              <button
                                type="button"
                                onClick={() => handleRemoveFile(item.id)}
                                className="w-7 h-7 flex items-center justify-center rounded-lg text-neutral-500 hover:text-red-400 hover:bg-neutral-800 transition-all duration-200 opacity-0 group-hover:opacity-100"
                              >
                                <X className="w-3.5 h-3.5" strokeWidth={2.5} />
                              </button>
                            )}
                            {item.status === "failed" && !uploading && (
                              <button
                                type="button"
                                onClick={() => handleRemoveFile(item.id)}
                                className="w-7 h-7 flex items-center justify-center rounded-lg text-neutral-500 hover:text-red-400 hover:bg-neutral-800 transition-all duration-200"
                              >
                                <X className="w-3.5 h-3.5" strokeWidth={2.5} />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Per-file error */}
                        {item.error && (
                          <p className="text-red-400 text-xs mt-2 ml-12">
                            {item.error}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* {Upload Progress} */}
              {uploading && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-neutral-400">
                    <span>Uploading...</span>
                    <span>
                      {uploadProgress.current} / {uploadProgress.total}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-primary-dark rounded-full transition-all duration-500 ease-out"
                      style={{
                        width: `${
                          (uploadProgress.current / uploadProgress.total) * 100
                        }%`,
                      }}
                    />
                  </div>
                </div>
              )}

              {/* {Action Buttons} */}
              <div className="flex gap-3 pt-2 mt-auto">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={uploading}
                  className="flex-1 h-11 px-4 border-2 border-neutral-700 rounded-xl bg-transparent text-neutral-300 text-sm font-semibold hover:bg-neutral-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <Button
                  type="submit"
                  disabled={uploading || files.length === 0 || hasErrors}
                  variant="primary"
                  className={`flex-1${
                    hasErrors ? " opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {uploading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Uploading {uploadProgress.current}/{uploadProgress.total}...
                    </span>
                  ) : files.length > 1 ? (
                    `Upload ${files.length} Documents`
                  ) : (
                    "Upload Document"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl p-8">
            {/* {Close button} */}
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all duration-200"
            >
              <X className="w-5 h-5" strokeWidth={2} />
            </button>

            {/* {Modal Header} */}
            <div className="mb-6">
              <div className="w-12 h-12 rounded-xl bg-red-500/15 flex items-center justify-center mb-4">
                <Trash2 className="w-6 h-6 text-red-600" strokeWidth={2} />
              </div>
              <h2 className="text-xl font-medium text-white tracking-tight">
                Confirm Deletion
              </h2>
            </div>

            {/* {Content} */}
            <p className="text-sm text-neutral-300 mb-6">
              Are you sure you want to delete the document:{""}
              <span className="font-semibold text-white">
                {selectedDoc?.title}
              </span>
              ? This action cannot be undone.
            </p>

            {/* {Action Buttons} */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={deleting}
                className="flex-1 h-11 px-4 border-2 border-neutral-700 rounded-xl bg-transparent text-neutral-300 text-sm font-semibold hover:bg-neutral-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="flex-1 h-11 px-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-red-500/25 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
              >
                {deleting ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Deleting...
                  </span>
                ) : (
                  "Delete Document"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentListPage;
