import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

import {
  ArrowLeft,
  Plus,
  ChevronLeft,
  ChevronRight,
  Trash2,
} from "lucide-react";

import toast from "react-hot-toast";

import flashcardService from "../../services/flashcardService";
import aiService from "../../services/aiService";
import PageHeader from "../../components/common/PageHeader";
import Spinner from "../../components/common/Spinner";
import EmptyState from "../../components/common/EmptyState";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import Flashcard from "../../components/flashcards/Flashcard";

const FlashcardPage = () => {
  const { id: documentId } = useParams();

  const [flashcardSet, setFlashcardSet] = useState(null);
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchFlashcards = async () => {
    setLoading(true);
    try {
      const response = await flashcardService.getFlashcardsForDocument(documentId);

      const set = response.data?.[0];
      setFlashcardSet(set);
      setFlashcards(set?.cards || []);
    } catch (error) {
      toast.error("Failed to fetch flashcards.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlashcards();
  }, [documentId]);

  // Generate flashcards
  const handleGenerateFlashcards = async () => {
    setGenerating(true);
    try {
      await aiService.generateFlashcards(documentId);
      toast.success("Flashcards generated successfully!");
      fetchFlashcards();
    } catch (error) {
      toast.error(error.message || "Failed to generate flashcards.");
    } finally {
      setGenerating(false);
    }
  };

  // Navigation
  const handleNextCard = () => {
    handleReview(currentCardIndex);
    setCurrentCardIndex((prev) => (prev + 1) % flashcards.length);
  };

  const handlePrevCard = () => {
    handleReview(currentCardIndex);
    setCurrentCardIndex(
      (prev) => (prev - 1 + flashcards.length) % flashcards.length
    );
  };

  // Review
  const handleReview = async (index) => {
    const currentCard = flashcards[index];
    if (!currentCard) return;

    try {
      await flashcardService.reviewFlashcard(currentCard._id, index);
    } catch {
      toast.error("Failed to review flashcard.");
    }
  };

  // Star toggle
  const handleToggleStar = async (cardId) => {
    try {
      await flashcardService.toggleStar(cardId);

      setFlashcards((prev) =>
        prev.map((card) =>
          card._id === cardId
            ? { ...card, isStarred: !card.isStarred }
            : card
        )
      );
    } catch {
      toast.error("Failed to update star.");
    }
  };

  // Delete
  const handleDeleteFlashcardSet = async () => {
    setDeleting(true);
    try {
      await flashcardService.deleteFlashcardSet(flashcardSet._id);
      toast.success("Deleted successfully!");
      setIsDeleteModalOpen(false);
      fetchFlashcards();
    } catch (error) {
      toast.error(error.message || "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  // Render content
  const renderFlashcardContent = () => {
    if (loading) return <Spinner />;

    if (flashcards.length === 0) {
      return (
        <EmptyState
          title="No Flashcards Yet"
          description="Generate flashcards to start learning."
        />
      );
    }

    const currentCard = flashcards[currentCardIndex];

    return (
      <div className="flex flex-col items-center gap-6">
        <div className="w-full max-w-xl">
          <Flashcard
            flashcard={currentCard}
            onToggleStar={handleToggleStar}
          />
        </div>

        <div className="flex items-center gap-4">
          <Button onClick={handlePrevCard} variant="secondary">
            <ChevronLeft size={16} /> Previous
          </Button>

          <span className="text-sm font-medium text-neutral-300">
            {currentCardIndex + 1} / {flashcards.length}
          </span>

          <Button onClick={handleNextCard} variant="secondary">
            Next <ChevronRight size={16} />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* Back */}
      <Link
        to={`/documents/${documentId}`}
        className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-white"
      >
        <ArrowLeft size={16} />
        Back to Document
      </Link>

      {/* Header */}
      <PageHeader title="Flashcards">
        <div>
          {!loading ? (
            flashcards.length > 0 ? (
              <Button
                onClick={() => setIsDeleteModalOpen(true)}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                <Trash2 size={16} /> Delete Set
              </Button>
            ) : (
              <Button
                onClick={handleGenerateFlashcards}
                disabled={generating}
                className="bg-indigo-500 hover:bg-indigo-600 text-white"
              >
                {generating ? (
                  <span className="flex items-center gap-2">
                    <Spinner /> Generating...
                  </span>
                ) : (
                  <>
                    <Plus size={16} /> Generate Flashcards
                  </>
                )}
              </Button>
            )
          ) : null}
        </div>
      </PageHeader>

      {/* Content */}
      {renderFlashcardContent()}

      {/* Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Flashcard Set"
      >
        <div className="p-4">
          <p className="mb-4 font-medium text-neutral-300">
            Are you sure you want to delete this set?
          </p>

          <div className="flex justify-end gap-2">
            <Button
              variant="secondary"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>

            <Button
              onClick={handleDeleteFlashcardSet}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default FlashcardPage;