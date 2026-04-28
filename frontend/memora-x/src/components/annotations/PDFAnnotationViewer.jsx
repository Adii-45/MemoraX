import React, { useState, useEffect, useCallback, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  PenTool,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import toast from "react-hot-toast";

import AnnotationCanvas from "./AnnotationCanvas";
import AnnotationToolbar from "./AnnotationToolbar";
import annotationService from "../../services/annotationService";
import Spinner from "../common/Spinner";

// Configure pdf.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const PDFAnnotationViewer = ({ pdfUrl, documentId }) => {
  // PDF state
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageWidth, setPageWidth] = useState(0);
  const [pageHeight, setPageHeight] = useState(0);
  const [pdfLoading, setPdfLoading] = useState(true);
  const [pdfError, setPdfError] = useState(false);
  const [scale, setScale] = useState(1.0);

  // Annotation state
  const [annotationMode, setAnnotationMode] = useState(false);
  const [isToolbarOpen, setIsToolbarOpen] = useState(false);
  const [tool, setTool] = useState("pen");
  const [color, setColor] = useState("#3b82f6");
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [saving, setSaving] = useState(false);

  // Per-page annotations: { [pageNumber]: Line[] }
  const [pageAnnotations, setPageAnnotations] = useState({});
  const [redoStacks, setRedoStacks] = useState({});

  // Current drawing line
  const [currentLine, setCurrentLine] = useState(null);

  const containerRef = useRef(null);
  const pageContainerRef = useRef(null);

  // Load saved annotations on mount
  useEffect(() => {
    const loadAnnotations = async () => {
      try {
        const response = await annotationService.getAnnotations(documentId);
        if (response.data && Array.isArray(response.data)) {
          const loaded = {};
          response.data.forEach((page) => {
            loaded[page.pageNumber] = page.lines || [];
          });
          setPageAnnotations(loaded);
        }
      } catch (error) {
        console.error("Failed to load annotations:", error);
      }
    };

    if (documentId) {
      loadAnnotations();
    }
  }, [documentId]);

  // Measure container width for responsive sizing
  useEffect(() => {
    const measure = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const availableWidth = rect.width - (isToolbarOpen ? 232 : 0) - 32;
        setPageWidth(Math.max(availableWidth, 400));
      }
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [isToolbarOpen]);

  const onDocumentLoadSuccess = useCallback(({ numPages: total }) => {
    setNumPages(total);
    setPdfLoading(false);
    setPdfError(false);
  }, []);

  const onDocumentLoadError = useCallback(() => {
    setPdfLoading(false);
    setPdfError(true);
  }, []);

  const onPageRenderSuccess = useCallback((page) => {
    setPageHeight(page.height);
  }, []);

  // --- Page Navigation ---
  const goToPage = (page) => {
    const p = Math.min(Math.max(1, page), numPages);
    setCurrentPage(p);
  };

  // --- Annotation Handlers ---
  const getCurrentLines = () => pageAnnotations[currentPage] || [];
  const getCurrentRedoStack = () => redoStacks[currentPage] || [];

  const handleDrawStart = useCallback(
    (pos) => {
      const newLine = {
        tool,
        points: [pos.x, pos.y],
        color: tool === "highlighter" ? color : color,
        strokeWidth: tool === "highlighter" ? strokeWidth * 3 : strokeWidth,
        opacity: tool === "highlighter" ? 0.3 : 1,
      };
      setCurrentLine(newLine);
    },
    [tool, color, strokeWidth]
  );

  const handleDrawMove = useCallback(
    (pos) => {
      if (!currentLine) return;
      setCurrentLine((prev) => ({
        ...prev,
        points: [...prev.points, pos.x, pos.y],
      }));
    },
    [currentLine]
  );

  const handleDrawEnd = useCallback(() => {
    if (!currentLine) return;

    // Only add if the line has enough points
    if (currentLine.points.length >= 4) {
      setPageAnnotations((prev) => ({
        ...prev,
        [currentPage]: [...(prev[currentPage] || []), currentLine],
      }));
      // Clear redo stack on new draw
      setRedoStacks((prev) => ({
        ...prev,
        [currentPage]: [],
      }));
    }

    setCurrentLine(null);
  }, [currentLine, currentPage]);

  const handleErase = useCallback(
    (pos) => {
      const lines = pageAnnotations[currentPage] || [];
      const eraserRadius = strokeWidth * 2;

      const remaining = lines.filter((line) => {
        // Check if any point in the line is within eraser radius
        for (let i = 0; i < line.points.length; i += 2) {
          const dx = line.points[i] - pos.x;
          const dy = line.points[i + 1] - pos.y;
          if (Math.sqrt(dx * dx + dy * dy) < eraserRadius) {
            return false;
          }
        }
        return true;
      });

      if (remaining.length !== lines.length) {
        const removed = lines.filter((l) => !remaining.includes(l));
        setPageAnnotations((prev) => ({
          ...prev,
          [currentPage]: remaining,
        }));
        setRedoStacks((prev) => ({
          ...prev,
          [currentPage]: [...(prev[currentPage] || []), ...removed],
        }));
      }
    },
    [pageAnnotations, currentPage, strokeWidth]
  );

  const handleUndo = useCallback(() => {
    const lines = pageAnnotations[currentPage] || [];
    if (lines.length === 0) return;

    const lastLine = lines[lines.length - 1];
    setPageAnnotations((prev) => ({
      ...prev,
      [currentPage]: lines.slice(0, -1),
    }));
    setRedoStacks((prev) => ({
      ...prev,
      [currentPage]: [...(prev[currentPage] || []), lastLine],
    }));
  }, [pageAnnotations, currentPage]);

  const handleRedo = useCallback(() => {
    const stack = redoStacks[currentPage] || [];
    if (stack.length === 0) return;

    const lastRedo = stack[stack.length - 1];
    setRedoStacks((prev) => ({
      ...prev,
      [currentPage]: stack.slice(0, -1),
    }));
    setPageAnnotations((prev) => ({
      ...prev,
      [currentPage]: [...(prev[currentPage] || []), lastRedo],
    }));
  }, [redoStacks, currentPage]);

  const handleClearPage = useCallback(() => {
    const lines = pageAnnotations[currentPage] || [];
    if (lines.length === 0) return;

    setRedoStacks((prev) => ({
      ...prev,
      [currentPage]: [...(prev[currentPage] || []), ...lines],
    }));
    setPageAnnotations((prev) => ({
      ...prev,
      [currentPage]: [],
    }));
  }, [pageAnnotations, currentPage]);

  const handleSave = async () => {
    setSaving(true);
    try {
      // Convert pageAnnotations to array format for backend
      const pages = Object.entries(pageAnnotations)
        .filter(([_, lines]) => lines.length > 0)
        .map(([pageNumber, lines]) => ({
          pageNumber: Number(pageNumber),
          lines,
        }));

      await annotationService.saveAnnotations(documentId, pages);
      toast.success("Annotations saved!");
    } catch (error) {
      toast.error(error.message || "Failed to save annotations");
    } finally {
      setSaving(false);
    }
  };

  const toggleAnnotationMode = () => {
    if (annotationMode) {
      setAnnotationMode(false);
      setIsToolbarOpen(false);
    } else {
      setAnnotationMode(true);
      setIsToolbarOpen(true);
    }
  };

  const handleZoomIn = () => setScale((s) => Math.min(s + 0.15, 2.5));
  const handleZoomOut = () => setScale((s) => Math.max(s - 0.15, 0.5));

  // Lines to render = saved lines + current drawing line
  const visibleLines = [
    ...getCurrentLines(),
    ...(currentLine ? [currentLine] : []),
  ];

  const scaledWidth = pageWidth * scale;
  const scaledHeight = pageHeight * scale;

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden">
      {/* Header bar */}
      <div className="flex items-center justify-between p-3 bg-neutral-900/50 border-b border-neutral-800">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-neutral-300">
            Document Viewer
          </span>

          {numPages > 0 && (
            <span className="text-xs text-neutral-500 bg-neutral-800 px-2 py-0.5 rounded-md">
              {numPages} pages
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Zoom controls */}
          <div className="flex items-center gap-1 mr-2">
            <button
              onClick={handleZoomOut}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all duration-200"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" strokeWidth={2} />
            </button>
            <span className="text-xs text-neutral-500 font-mono min-w-[3rem] text-center">
              {Math.round(scale * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all duration-200"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" strokeWidth={2} />
            </button>
          </div>

          {/* Annotation toggle */}
          <button
            onClick={toggleAnnotationMode}
            className={`
              inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200
              ${annotationMode
                ? "bg-primary/20 text-primary ring-1 ring-primary/40"
                : "text-neutral-400 hover:text-white hover:bg-neutral-800"
              }
            `}
          >
            {annotationMode ? (
              <>
                <X className="w-3.5 h-3.5" strokeWidth={2.5} />
                Exit Annotate
              </>
            ) : (
              <>
                <PenTool className="w-3.5 h-3.5" strokeWidth={2} />
                Annotate
              </>
            )}
          </button>

          {/* Open in new tab */}
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
      </div>

      {/* Main content area */}
      <div ref={containerRef} className="relative flex">
        {/* Annotation Toolbar */}
        <AnnotationToolbar
          tool={tool}
          setTool={setTool}
          color={color}
          setColor={setColor}
          strokeWidth={strokeWidth}
          setStrokeWidth={setStrokeWidth}
          onUndo={handleUndo}
          onRedo={handleRedo}
          onSave={handleSave}
          onClearPage={handleClearPage}
          canUndo={getCurrentLines().length > 0}
          canRedo={getCurrentRedoStack().length > 0}
          saving={saving}
          isOpen={isToolbarOpen}
          onClose={() => setIsToolbarOpen(false)}
        />

        {/* PDF + Canvas area */}
        <div
          className={`flex-1 overflow-auto bg-neutral-950 transition-all duration-200 ${
            isToolbarOpen ? "ml-[232px]" : ""
          }`}
          style={{ height: "70vh" }}
        >
          {pdfLoading && (
            <div className="flex items-center justify-center h-full">
              <Spinner />
            </div>
          )}

          {pdfError && (
            <div className="flex flex-col items-center justify-center h-full gap-3">
              <p className="text-neutral-400 text-sm">Failed to load PDF</p>
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary text-sm hover:underline"
              >
                Try opening in a new tab
              </a>
            </div>
          )}

          <Document
            file={pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading=""
            className="flex flex-col items-center"
          >
            <div className="flex flex-col items-center py-4 px-4">
              {/* Page container with annotation overlay */}
              <div
                ref={pageContainerRef}
                className="relative shadow-2xl shadow-black/40"
                style={{ width: scaledWidth, height: scaledHeight || "auto" }}
              >
                <Page
                  pageNumber={currentPage}
                  width={scaledWidth}
                  onRenderSuccess={onPageRenderSuccess}
                  renderTextLayer={true}
                  renderAnnotationLayer={true}
                  loading=""
                />

                {/* Annotation canvas overlay */}
                {pageHeight > 0 && (
                  <AnnotationCanvas
                    width={scaledWidth}
                    height={scaledHeight}
                    lines={visibleLines}
                    tool={tool}
                    color={color}
                    strokeWidth={strokeWidth}
                    annotationMode={annotationMode}
                    onDrawStart={handleDrawStart}
                    onDrawMove={handleDrawMove}
                    onDrawEnd={handleDrawEnd}
                    onErase={handleErase}
                  />
                )}
              </div>

              {/* Page navigation */}
              {numPages > 1 && (
                <div className="flex items-center gap-3 mt-4 py-2">
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" strokeWidth={2} />
                  </button>

                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={currentPage}
                      onChange={(e) => goToPage(Number(e.target.value))}
                      min={1}
                      max={numPages}
                      className="w-12 h-8 text-center bg-neutral-800 border border-neutral-700 rounded-lg text-white text-sm font-medium focus:outline-none focus:border-neutral-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <span className="text-sm text-neutral-500">
                      / {numPages}
                    </span>
                  </div>

                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage >= numPages}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-4 h-4" strokeWidth={2} />
                  </button>
                </div>
              )}
            </div>
          </Document>
        </div>
      </div>
    </div>
  );
};

export default PDFAnnotationViewer;
