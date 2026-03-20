import React, { useState, useEffect } from "react";
import { Plus, Trash2, Brain } from "lucide-react";
import toast from "react-hot-toast";
import moment from "moment";

import flashcardService from "../../services/flashcardService";
import aiService from "../../services/aiService";
import Spinner from "../common/Spinner";
import Modal from "../common/Modal";

const FlashCardManager = ({ documentId }) => {
  const [flashcardsSets, setFlashcardsSets] = useState([]);
  const [selectedSet, setSelectedSet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [setToDelete, setSetToDelete] = useState(null);

  const fetchFlashcardsSets = async () => {
    setLoading(true);
    try {
      const res = await flashcardService.getFlashcardsForDocument(documentId);
      setFlashcardsSets(res.data); // ✅ correct
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch flashcards");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (documentId) fetchFlashcardsSets();
  }, [documentId]);

  const handleGenerateFlashcards = async () => {
    setGenerating(true);
    try {
      await aiService.generateFlashcards(documentId);
      toast.success("Generated!");
      fetchFlashcardsSets();
    } catch {
      toast.error("Failed");
    } finally {
      setGenerating(false);
    }
  };

  const handleDeleteRequest = (e, set) => {
    e.stopPropagation();
    setSetToDelete(set); // ✅ FIXED
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!setToDelete) return;
    setDeleting(true);

    try {
      await flashcardService.deleteFlashcardSet(setToDelete._id);
      toast.success("Deleted Successfully");
      fetchFlashcardsSets();
    } catch {
      toast.error("Delete failed");
    } finally {
      setDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <div className="bg-white p-6 rounded-2xl shadow space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">
            Flashcard Sets ({flashcardsSets.length})
          </h3>

          <button
            onClick={handleGenerateFlashcards}
            disabled={generating}
            className="bg-gradient-to-r from-primary to-primary-dark text-white px-4 h-10 rounded-xl"
          >
            {generating ? "Generating..." : "Generate"}
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {flashcardsSets.map((set) => (
            <div
              key={set._id}
              onClick={() => setSelectedSet(set)}
              className="border p-4 rounded-xl cursor-pointer hover:shadow"
            >
              <button
                onClick={(e) => handleDeleteRequest(e, set)}
                className="float-right text-red-500"
              >
                <Trash2 size={16} />
              </button>

              <Brain className="mb-2" />

              <h4 className="font-semibold">Flashcard Set</h4>
              <p className="text-xs text-gray-500">
                {moment(set.createdAt).format("MMM D, YYYY")}
              </p>

              <p className="text-sm mt-2">{set.cards?.length || 0} cards</p>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Set"
      >
        <p className="text-sm text-gray-500">
          Are you sure you want to delete this set?
        </p>

        <div className="flex justify-end gap-2 mt-4">
          <button onClick={() => setIsDeleteModalOpen(false)}>Cancel</button>

          <button
            onClick={handleConfirmDelete}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </Modal>
    </>
  );
};

export default FlashCardManager;
