import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import documentService from "../../services/documentService";
import Spinner from "../../components/common/Spinner";
import toast from "react-hot-toast";
import { ArrowLeft, ExternalLink } from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import Tabs from "../../components/common/Tabs";
import ChatInterface from "../../components/chat/ChatInterface";
import AIActions from "../../components/ai/AIActions";
import FlashCardManager from "../../components/flashcards/FlashCardManager";

const DocumentDetailPage = () => {
  const { id } = useParams();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Content");

  useEffect(() => {
    const fetchDocumentDetails = async () => {
      try {
        const response = await documentService.getDocumentById(id);
        setDocument(response.data);
      } catch (error) {
        console.error("ERROR:", error);
        toast.error("Failed to fetch document details");
      } finally {
        setLoading(false);
      }
    };

    fetchDocumentDetails();
  }, [id]);

  // const getPdfUrl = () => {
  //   if (!document?.filePath) return null;

  //   if (
  //     document.filePath.startsWith("http://") ||
  //     document.filePath.startsWith("https://")
  //   ) {
  //     return document.filePath;
  //   }

  //   const baseUrl =
  //     import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

  //   return `${baseUrl}/uploads/${document.filePath}`;
  // };

  const getPdfUrl = () => {
    if (!document || !document.filePath) return null;

    if (
      document.filePath.startsWith("http://") ||
      document.filePath.startsWith("https://")
    ) {
      return document.filePath;
    }

    const baseUrl =
      import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

    return `${baseUrl}${document.filePath}`;
  };

  const renderContent = () => {
    if (loading) return <Spinner />;
    if (!document || !document.filePath) {
      return <div className="text-center p-8">PDF not available.</div>;
    }

    const pdfUrl = document ? getPdfUrl() : null;

    return (
      <div className="bg-white border border-gray-300 rounded-lg overflow-hidden shadow-sm">
        <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-300">
          <span className="text-sm font-medium text-gray-700">
            Document Viewer
          </span>
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            <ExternalLink size={16} />
            Open in new tab
          </a>
        </div>
        {pdfUrl ? (
          <iframe
            src={`https://docs.google.com/gview?url=${encodeURIComponent(
              pdfUrl
            )}&embedded=true`}
            className="w-full h-[70vh] bg-white"
            title="PDF Viewer"
          />
        ) : (
          <div className="text-center p-8">PDF not available</div>
        )}
      </div>
    );
  };

  const renderFlashcardsTab = () => {
    return <FlashCardManager documentId={id} />; // ✅ FIXED
  };

  const tabs = [
    { name: "Content", label: "Content", content: renderContent() },
    { name: "Chat", label: "Chat", content: <ChatInterface /> },
    { name: "AI Actions", label: "AI Actions", content: <AIActions /> },
    { name: "Flashcards", label: "Flashcards", content: renderFlashcardsTab() },
    { name: "Quizzes", label: "Quizzes", content: "Coming soon..." },
  ];

  if (loading) return <Spinner />;
  if (!document) return <div className="text-center p-8">Not found</div>;

  return (
    <div>
      <Link
        to="/documents"
        className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 mb-4"
      >
        <ArrowLeft size={16} />
        Back to Documents
      </Link>

      <PageHeader title={document.title} />
      <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export default DocumentDetailPage;
