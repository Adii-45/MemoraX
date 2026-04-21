import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import flashcardService from '../../services/flashcardService';
import PageHeader from "../../components/common/PageHeader";
import Spinner from '../../components/common/Spinner';
import EmptyState from '../../components/common/EmptyState';
import FlashcardSetCard from "../../components/flashcards/FlashcardSetCard";
import DocumentSelectModal from "../../components/common/DocumentSelectModal";
import toast from 'react-hot-toast';

const FlashcardsListPage = () => {
  const [flashcardSets, setFlashcardSets] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ NEW STATES
  const [showModal, setShowModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchFlashcardSets = async () => {
      try {
        const response = await flashcardService.getAllFlashcardSets();
        setFlashcardSets(response.data || []);
      } catch (error) {
        toast.error('Failed to fetch flashcard sets');
      } finally {
        setLoading(false);
      }
    };

    fetchFlashcardSets();
  }, []);

  // ✅ OPEN CONFIRM BOX
  const handleDelete = (id) => {
    setSelectedId(id);
    setShowConfirm(true);
  };

  // ✅ CONFIRM DELETE
  const confirmDelete = async () => {
    try {
      setDeleting(true);

      await flashcardService.deleteFlashcardSet(selectedId);

      setFlashcardSets((prev) =>
        prev.filter((set) => set._id !== selectedId)
      );

      toast.success("Flashcard set deleted");
      setShowConfirm(false);
    } catch (error) {
      toast.error(error.message || "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  const handleProceed = (doc) => {
    setShowModal(false);
    navigate(`/documents/${doc._id}?tab=flashcards&generate=true`);
  };

  const renderContent = () => {
    if (loading) return <Spinner />;

    if (!flashcardSets.length) {
      return (
        <EmptyState
          title="No Flashcard Sets"
          description="Start by creating one!"
        />
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {flashcardSets.map((set) => (
          <FlashcardSetCard
            key={set._id}
            flashcardSet={set}
            onDelete={handleDelete}
          />
        ))}
      </div>
    );
  };

  return (
    <div>
      <PageHeader title="All Flashcard Sets">
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-md hover:shadow-blue-500/20 transition"
        >
          <Plus className="w-4 h-4" /> New Flashcards
        </button>
      </PageHeader>

      {renderContent()}

      {/* ✅ CUSTOM DELETE MODAL */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl w-full max-w-md p-6">
            
            <h2 className="text-lg font-semibold text-white mb-2">
              Delete Flashcard Set
            </h2>
            <p className="text-sm text-neutral-400 mb-6">
              Are you sure you want to delete this set? This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-neutral-400 hover:text-white hover:bg-neutral-800"
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-red-500 hover:bg-red-600 text-white"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Document Selection Modal */}
      <DocumentSelectModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onProceed={handleProceed}
        title="Select a Document for Flashcards"
      />
    </div>
  );
};

export default FlashcardsListPage;