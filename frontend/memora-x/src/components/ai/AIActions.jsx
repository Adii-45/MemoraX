import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Sparkles, BookOpen, Lightbulb } from "lucide-react";
import aiService from "../../services/aiService";
import toast from "react-hot-toast";
import MarkdownRenderer from "../common/MarkdownRenderer";
import Modal from "../common/Modal";

const AIActions = () => {
  const { id: documentId } = useParams();

  const [loadingAction, setLoadingAction] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [concept, setConcept] = useState("");

  const handleGeneralSummary = async () => {
    setLoadingAction("summary");

    try {
      const res = await aiService.generateSummary(documentId);

      // SAFE extraction
      const summary = res.summary || res.data?.summary || res.data || "";

      console.log("SUMMARY:", summary);

      if (!summary) {
        toast.error("No summary received");
        return;
      }

      setModalContent(summary);
      setModalTitle("Generated Summary");
      setIsModalOpen(true);
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate summary");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleExplainConcept = async (e) => {
    e.preventDefault();

    if (!concept.trim()) {
      toast.error("Please enter a concept to explain");
      return;
    }

    setLoadingAction("explain");

    try {
      const res = await aiService.explainConcept(documentId, concept);

      // SAFE extraction (same as summary)
      const explanation =
        res.explanation || res.data?.explanation || res.data || "";

      console.log("EXPLANATION:", explanation);

      if (!explanation) {
        toast.error("No explanation received");
        return;
      }

      setModalContent(explanation);
      setModalTitle(`Explanation of "${concept}"`);
      setIsModalOpen(true);
    } catch (error) {
      console.error(error);
      toast.error("Failed to explain concept");
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <>
      <div className="bg-white border rounded-2xl shadow-lg overflow-hidden">
        {/* HEADER */}
        <div className="p-5 border-b flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">AI Assistant</h3>
            <p className="text-xs text-slate-500">Powered by AI</p>
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-6 space-y-6">
          {/* SUMMARY */}
          <div className="flex items-center justify-between p-5 border rounded-xl hover:shadow-md transition">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <BookOpen className="w-4 h-4 text-blue-600" />
                <h4 className="font-semibold">Summarize document</h4>
              </div>
              <p className="text-sm text-slate-500">
                Get a quick summary of the entire document
              </p>
            </div>

            <button
              onClick={handleGeneralSummary}
              disabled={loadingAction === "summary"}
              className="h-10 px-5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loadingAction === "summary" ? "Loading..." : "Summarize"}
            </button>
          </div>

          {/* EXPLAIN */}
          <form
            onSubmit={handleExplainConcept}
            className="p-5 border rounded-xl space-y-3"
          >
            <div className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <h4 className="font-semibold">Explain a concept</h4>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="text"
                value={concept}
                onChange={(e) => setConcept(e.target.value)}
                placeholder="e.g. React Hooks"
                className="flex-1 h-11 px-4 border rounded-lg focus:outline-none focus:border-primary"
              />

              <button
                type="submit"
                disabled={loadingAction === "explain" || !concept.trim()}
                className="h-11 px-5 text-white rounded-lg bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary disabled:opacity-50 whitespace-nowrap"
              >
                {loadingAction === "explain" ? "Loading..." : "Explain"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalTitle}
      >
        <MarkdownRenderer content={modalContent} />
      </Modal>
    </>
  );
};

export default AIActions;
