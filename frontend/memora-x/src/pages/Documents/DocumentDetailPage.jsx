import React, { useState, useEffect } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import documentService from "../../services/documentService";
import Spinner from "../../components/common/Spinner";
import toast from "react-hot-toast";
import { ArrowLeft } from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import Tabs from "../../components/common/Tabs";
import ChatInterface from "../../components/chat/ChatInterface";
import AIActions from "../../components/ai/AIActions";
import FlashCardManager from "../../components/flashcards/FlashCardManager";
import QuizManager from "../../components/quizzes/QuizManager";
import PDFAnnotationViewer from "../../components/annotations/PDFAnnotationViewer";

const DocumentDetailPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get("tab");
    if (tabParam === "flashcards") return "Flashcards";
    if (tabParam === "quizzes") return "Quizzes";
    return "Content";
  });

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
      return <div className="text-center p-8 text-neutral-400">PDF not available.</div>;
    }

    const pdfUrl = document ? getPdfUrl() : null;

    if (!pdfUrl) {
      return <div className="text-center p-8 text-neutral-400">PDF not available</div>;
    }

    return (
      <PDFAnnotationViewer pdfUrl={pdfUrl} documentId={id} />
    );
  };

  const renderFlashcardsTab = () => {
    return <FlashCardManager documentId={id} />; // ✅ FIXED
  };

  const renderQuizzesTab = () => {
    return <QuizManager documentId={id} />;
  };

  const tabs = [
    { name: "Content", label: "Content", content: renderContent() },
    { name: "Chat", label: "Chat", content: <ChatInterface /> },
    { name: "AI Actions", label: "AI Actions", content: <AIActions /> },
    { name: "Flashcards", label: "Flashcards", content: renderFlashcardsTab() },
    { name: "Quizzes", label: "Quizzes", content: renderQuizzesTab() },
  ];

  if (loading) return <Spinner />;
  if (!document) return <div className="text-center p-8 text-neutral-400">Not found</div>;

  return (
    <div>
      <Link
        to="/documents"
        className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-white mb-4"
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
