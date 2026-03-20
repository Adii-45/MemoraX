import React, { useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Download } from "lucide-react";

const Modal = ({ isOpen, onClose, title, children }) => {
  const printAreaRef = useRef(null);
  const scrollRef = useRef(null);

  const handleExtractPDF = async () => {
    const element = printAreaRef.current;
    const scrollEl = scrollRef.current;
    if (!element) return;

    // Temporarily expand scrollable area for full content capture
    if (scrollEl) {
      scrollEl.style.maxHeight = "none";
      scrollEl.style.overflow = "visible";
    }

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
      scrollY: 0,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
    });

    // Restore scroll constraints
    if (scrollEl) {
      scrollEl.style.maxHeight = "";
      scrollEl.style.overflow = "";
    }

    const pdf = new jsPDF({ orientation: "portrait", unit: "px", format: "a4" });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Reserve space at the bottom of each page for the footer
    const footerHeight = 30;
    const contentHeight = pageHeight - footerHeight;
    const ratio = pageWidth / canvas.width;
    const scaledTotalHeight = canvas.height * ratio;
    const totalPages = Math.ceil(scaledTotalHeight / contentHeight);

    const generatedDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    let yOffset = 0;
    let pageNum = 1;

    while (yOffset < scaledTotalHeight) {
      if (yOffset > 0) pdf.addPage();

      const srcY = yOffset / ratio;
      const srcH = Math.min(contentHeight / ratio, canvas.height - srcY);

      const pageCanvas = document.createElement("canvas");
      pageCanvas.width = canvas.width;
      pageCanvas.height = srcH;
      pageCanvas
        .getContext("2d")
        .drawImage(canvas, 0, srcY, canvas.width, srcH, 0, 0, canvas.width, srcH);

      pdf.addImage(pageCanvas.toDataURL("image/png"), "PNG", 0, 0, pageWidth, srcH * ratio);

      // Footer separator line
      pdf.setDrawColor(210, 210, 220);
      pdf.line(24, pageHeight - footerHeight + 4, pageWidth - 24, pageHeight - footerHeight + 4);

      // Footer text: left = branding, center = date, right = page number
      pdf.setFontSize(8);
      pdf.setTextColor(160, 160, 175);
      pdf.text("MemoraX", 24, pageHeight - 12);
      pdf.text(generatedDate, pageWidth / 2, pageHeight - 12, { align: "center" });
      pdf.text(`Page ${pageNum} of ${totalPages}`, pageWidth - 24, pageHeight - 12, { align: "right" });

      yOffset += contentHeight;
      pageNum++;
    }

    const fileName = title
      ? `${title.replace(/\s+/g, "_").toLowerCase()}.pdf`
      : "document.pdf";

    pdf.save(fileName);
  };

  if (!isOpen) return null;

  const generatedDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">

      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* MODAL */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-6 z-10 animate-in fade-in zoom-in-95 duration-200">

        {/* MODAL UI HEADER — close button lives here, NOT captured in PDF */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            ✕
          </button>
        </div>

        {/* SCROLL WRAPPER */}
        <div ref={scrollRef} className="max-h-[60vh] overflow-y-auto pr-2">

          {/* PRINT AREA — clean document layout, captured for PDF */}
          <div ref={printAreaRef} className="bg-white px-8 py-5">

            {/* PDF DOCUMENT HEADER — replaces modal chrome in the exported file */}
            <div className="mb-6 pb-4 border-b-2 border-slate-200">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-1">
                MemoraX
              </p>
              <h1 className="text-2xl font-bold text-slate-900 leading-tight">{title}</h1>
              <p className="text-xs text-slate-400 mt-1.5">Generated on {generatedDate}</p>
            </div>

            {/* DOCUMENT CONTENT — typography overrides for clean PDF rendering */}
            <div
              className="
                text-slate-700
                [&_p]:mb-3 [&_p]:leading-7
                [&_h1]:text-xl [&_h1]:font-bold [&_h1]:text-slate-900 [&_h1]:mt-6 [&_h1]:mb-3
                [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-slate-800 [&_h2]:mt-5 [&_h2]:mb-2
                [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-slate-800 [&_h3]:mt-4 [&_h3]:mb-2
                [&_ul]:mb-3 [&_ul]:ml-5 [&_ul]:list-disc
                [&_ol]:mb-3 [&_ol]:ml-5 [&_ol]:list-decimal
                [&_li]:mb-1.5 [&_li]:leading-6
                [&_blockquote]:border-l-4 [&_blockquote]:border-indigo-200 [&_blockquote]:pl-4
                [&_blockquote]:italic [&_blockquote]:text-slate-500 [&_blockquote]:my-4
                [&_strong]:font-semibold [&_strong]:text-slate-900
                [&_hr]:my-6 [&_hr]:border-slate-200
              "
            >
              {children}
            </div>

          </div>
        </div>

        {/* FOOTER */}
        <div className="flex items-center justify-end gap-3 mt-5 pt-4 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-slate-500 hover:text-slate-700 transition-colors"
          >
            Close
          </button>
          <button
            onClick={handleExtractPDF}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition-colors shadow-sm"
          >
            <Download className="w-4 h-4" />
            Extract as PDF
          </button>
        </div>

      </div>
    </div>
  );
};

export default Modal;
