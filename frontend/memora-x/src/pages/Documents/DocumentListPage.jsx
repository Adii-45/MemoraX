import React, { useState, useEffect } from "react";
import { Plus, Upload, Trash2, FileText, X } from "lucide-react";
import toast from "react-hot-toast";

import documentService from "../../services/documentService";
import Spinner from "../../components/common/Spinner";
import Button from "../../components/common/Button";
import DocumentCard from "../../components/documents/DocumentCard";

const DocumentListPage = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  // State for upload modal
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploading, setUploading] = useState(false);
  const [duplicateError, setDuplicateError] = useState("");

  // State for delete confirmation modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);

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

  // Check if a document title already exists (case-insensitive, trimmed)
  const checkDuplicate = (title) => {
    const normalizedTitle = title?.toLowerCase().trim();
    if (!normalizedTitle) {
      setDuplicateError("");
      return false;
    }
    const existingNames = documents.map((doc) =>
      (doc.title || doc.name || "").toLowerCase().trim()
    );
    if (existingNames.includes(normalizedTitle)) {
      setDuplicateError(
        "A document with this name already exists. Please rename your file."
      );
      return true;
    }
    setDuplicateError("");
    return false;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadFile(file);
      const title = file.name.replace(/\.[^/.]+$/, "");
      setUploadTitle(title);
      checkDuplicate(title);
    }
  };

  const handleTitleChange = (e) => {
    const title = e.target.value;
    setUploadTitle(title);
    checkDuplicate(title);
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!uploadFile || !uploadTitle) {
      toast.error("Please provide a title and select a file");
      return;
    }

    // Block upload if duplicate
    if (checkDuplicate(uploadTitle)) {
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append("file", uploadFile);
    formData.append("title", uploadTitle);

    try {
      await documentService.uploadDocument(formData);

      toast.success("Document uploaded successfully!");

      setIsUploadModalOpen(false);
      setUploadFile(null);
      setUploadTitle("");
      setDuplicateError("");

      await fetchDocuments(); // ✅ WAIT FOR REFRESH
    } catch (error) {
      toast.error(error.message || "Upload failed");
    } finally {
      setUploading(false);
    }
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

      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl p-8">
            {/* {Close button} */}
            <button
              onClick={() => setIsUploadModalOpen(false)}
              className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all duration-200"
            >
              <X className="w-5 h-5" strokeWidth={2} />
            </button>

            {/* {Modal Header} */}
            <div className="mb-6">
              <h2 className="text-xl font-medium text-white tracking-tight">
                Upload Document
              </h2>
              <p className="text-sm text-neutral-400 mt-1">
                Add a PDF document to your library
              </p>
            </div>

            {/* {Upload Form} */}
            <form onSubmit={handleUpload} className="space-y-5">
              {/* {Title Input} */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wide">
                  Document Title
                </label>
                <input
                  type="text"
                  value={uploadTitle}
                  onChange={handleTitleChange}
                  required
                  className="w-full h-12 px-2 border-2 border-neutral-800 rounded-xl bg-neutral-950 text-white placeholder-neutral-600 text-sm font-medium transition-all duration-200 focus:outline-none focus:border-neutral-600 focus:bg-neutral-950"
                  placeholder="e.g., React Interview Prep"
                />
              </div>

              {/* {File Upload} */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide">
                  PDF File
                </label>
                <div className="relative border-2 border-dashed border-neutral-800 rounded-xl bg-neutral-950 hover:border-neutral-700 hover:bg-neutral-900 transition-all duration-200">
                  <input
                    id="file-upload"
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    onChange={handleFileChange}
                    accept=".pdf"
                  />
                  <div className="flex flex-col items-center justify-center py-10 px-6">
                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Upload
                        className="w-7 h-7 text-primary"
                        strokeWidth={2}
                      />
                    </div>
                    <p className="text-xs font-medium text-neutral-300 mb-1">
                      {uploadFile ? (
                        <span className="text-primary">{uploadFile.name}</span>
                      ) : (
                        <>
                          <span className="text-primary">Click to Upload </span>
                          {""}
                          or drag and drop
                        </>
                      )}
                    </p>
                    <p className="text-xs text-neutral-500">PDF upto 10Mb</p>
                  </div>
                </div>
              </div>

              {/* Duplicate Error Message */}
              {duplicateError && (
                <p className="text-red-400 text-sm font-medium -mt-1">
                  {duplicateError}
                </p>
              )}

              {/* {Action Buttons} */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  disabled={uploading}
                  className="flex-1 h-11 px-4 border-2 border-neutral-700 rounded-xl bg-transparent text-neutral-300 text-sm font-semibold hover:bg-neutral-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <Button
                  type="submit"
                  disabled={uploading || !!duplicateError}
                  variant="primary"
                  className={`flex-1${duplicateError ? " opacity-50 cursor-not-allowed" : ""}`}
                >
                  {uploading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Uploading...
                    </span>
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
