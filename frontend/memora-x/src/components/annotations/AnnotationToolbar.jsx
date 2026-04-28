import React from "react";
import {
  Pen,
  Highlighter,
  Eraser,
  Undo2,
  Redo2,
  Save,
  Trash2,
  X,
  ChevronRight,
} from "lucide-react";

const PRESET_COLORS = [
  "#3b82f6", // blue
  "#ef4444", // red
  "#22c55e", // green
  "#f59e0b", // amber
  "#8b5cf6", // violet
  "#ec4899", // pink
  "#06b6d4", // cyan
  "#ffffff", // white
];

const AnnotationToolbar = ({
  tool,
  setTool,
  color,
  setColor,
  strokeWidth,
  setStrokeWidth,
  onUndo,
  onRedo,
  onSave,
  onClearPage,
  canUndo,
  canRedo,
  saving,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const ToolButton = ({ icon: Icon, label, toolName, onClick, active, disabled, danger }) => (
    <button
      onClick={onClick || (() => setTool(toolName))}
      disabled={disabled}
      title={label}
      className={`
        w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-200
        ${active
          ? "bg-primary/20 text-primary ring-1 ring-primary/40"
          : danger
          ? "text-neutral-400 hover:text-red-400 hover:bg-red-500/10"
          : "text-neutral-400 hover:text-white hover:bg-neutral-800"
        }
        disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-neutral-400
      `}
    >
      <Icon className="w-[18px] h-[18px]" strokeWidth={2} />
    </button>
  );

  return (
    <div className="absolute left-0 top-0 bottom-0 z-30 flex">
      {/* Toolbar panel */}
      <div className="w-56 bg-neutral-900/95 backdrop-blur-xl border-r border-neutral-800 flex flex-col shadow-2xl shadow-black/50 animate-in slide-in-from-left duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-neutral-800">
          <span className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
            Annotate
          </span>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-neutral-500 hover:text-white hover:bg-neutral-800 transition-all duration-200"
          >
            <X className="w-4 h-4" strokeWidth={2} />
          </button>
        </div>

        {/* Tools section */}
        <div className="p-3 space-y-4 flex-1 overflow-y-auto custom-scrollbar">
          {/* Drawing tools */}
          <div>
            <label className="block text-[10px] font-semibold text-neutral-500 uppercase tracking-wider mb-2">
              Tools
            </label>
            <div className="flex gap-1.5">
              <ToolButton icon={Pen} label="Pen" toolName="pen" active={tool === "pen"} />
              <ToolButton icon={Highlighter} label="Highlighter" toolName="highlighter" active={tool === "highlighter"} />
              <ToolButton icon={Eraser} label="Eraser" toolName="eraser" active={tool === "eraser"} />
            </div>
          </div>

          {/* Color picker */}
          {tool !== "eraser" && (
            <div>
              <label className="block text-[10px] font-semibold text-neutral-500 uppercase tracking-wider mb-2">
                Color
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {PRESET_COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className={`
                      w-9 h-9 rounded-lg transition-all duration-200 border-2
                      ${color === c
                        ? "border-white scale-110 shadow-lg"
                        : "border-transparent hover:border-neutral-600 hover:scale-105"
                      }
                    `}
                    style={{ backgroundColor: c }}
                    title={c}
                  />
                ))}
              </div>
              {/* Custom color */}
              <div className="mt-2 flex items-center gap-2">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent p-0"
                />
                <span className="text-xs text-neutral-500 font-mono uppercase">
                  {color}
                </span>
              </div>
            </div>
          )}

          {/* Stroke width */}
          <div>
            <label className="block text-[10px] font-semibold text-neutral-500 uppercase tracking-wider mb-2">
              {tool === "eraser" ? "Eraser Size" : "Stroke Width"} — {strokeWidth}px
            </label>
            <input
              type="range"
              min="1"
              max={tool === "eraser" ? 30 : 12}
              value={strokeWidth}
              onChange={(e) => setStrokeWidth(Number(e.target.value))}
              className="w-full h-1.5 bg-neutral-800 rounded-full appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-[10px] text-neutral-600 mt-1">
              <span>1</span>
              <span>{tool === "eraser" ? "30" : "12"}</span>
            </div>
          </div>

          {/* Undo / Redo */}
          <div>
            <label className="block text-[10px] font-semibold text-neutral-500 uppercase tracking-wider mb-2">
              History
            </label>
            <div className="flex gap-1.5">
              <ToolButton icon={Undo2} label="Undo" onClick={onUndo} disabled={!canUndo} />
              <ToolButton icon={Redo2} label="Redo" onClick={onRedo} disabled={!canRedo} />
            </div>
          </div>

          {/* Clear page */}
          <div>
            <ToolButton icon={Trash2} label="Clear page annotations" onClick={onClearPage} danger />
            <span className="text-[10px] text-neutral-600 mt-1 block">Clear this page</span>
          </div>
        </div>

        {/* Save button at bottom */}
        <div className="p-3 border-t border-neutral-800">
          <button
            onClick={onSave}
            disabled={saving}
            className="w-full h-10 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary-dark text-white text-sm font-semibold transition-all duration-200 hover:from-primary-dark hover:to-primary active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" strokeWidth={2} />
                Save
              </>
            )}
          </button>
        </div>
      </div>

      {/* Collapse handle visual */}
      <div className="w-1 bg-gradient-to-b from-primary/20 via-primary/5 to-transparent" />
    </div>
  );
};

export default AnnotationToolbar;
