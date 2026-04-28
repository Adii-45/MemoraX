import React, { useRef, useCallback } from "react";
import { Stage, Layer, Line } from "react-konva";

const AnnotationCanvas = ({
  width,
  height,
  lines,
  tool,
  color,
  strokeWidth,
  annotationMode,
  onDrawStart,
  onDrawMove,
  onDrawEnd,
  onErase,
}) => {
  const isDrawing = useRef(false);
  const stageRef = useRef(null);

  const getPointerPosition = useCallback(() => {
    const stage = stageRef.current;
    if (!stage) return null;
    return stage.getPointerPosition();
  }, []);

  const handleMouseDown = useCallback(() => {
    if (!annotationMode) return;

    const pos = getPointerPosition();
    if (!pos) return;

    if (tool === "eraser") {
      onErase(pos);
      return;
    }

    isDrawing.current = true;
    onDrawStart(pos);
  }, [annotationMode, tool, getPointerPosition, onDrawStart, onErase]);

  const handleMouseMove = useCallback(() => {
    if (!annotationMode) return;

    const pos = getPointerPosition();
    if (!pos) return;

    if (tool === "eraser") {
      // Continuous erase while dragging
      const stage = stageRef.current;
      if (stage) {
        const isMouseDown = stage.getPointerPosition() && isDrawing.current;
        if (isMouseDown) {
          onErase(pos);
        }
      }
      return;
    }

    if (!isDrawing.current) return;
    onDrawMove(pos);
  }, [annotationMode, tool, getPointerPosition, onDrawMove, onErase]);

  const handleMouseUp = useCallback(() => {
    if (!annotationMode) return;

    if (tool === "eraser") {
      isDrawing.current = false;
      return;
    }

    if (!isDrawing.current) return;
    isDrawing.current = false;
    onDrawEnd();
  }, [annotationMode, tool, onDrawEnd]);

  // Determine cursor style
  const getCursorStyle = () => {
    if (!annotationMode) return "default";
    if (tool === "pen") return "crosshair";
    if (tool === "highlighter") return "crosshair";
    if (tool === "eraser") return "cell";
    return "default";
  };

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width,
        height,
        pointerEvents: annotationMode ? "auto" : "none",
        cursor: getCursorStyle(),
        zIndex: annotationMode ? 20 : 5,
      }}
    >
      <Stage
        ref={stageRef}
        width={width}
        height={height}
        onMouseDown={handleMouseDown}
        onMousemove={handleMouseMove}
        onMouseup={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchMove={handleMouseMove}
        onTouchEnd={handleMouseUp}
      >
        <Layer>
          {lines.map((line, i) => (
            <Line
              key={i}
              points={line.points}
              stroke={line.color}
              strokeWidth={line.strokeWidth}
              tension={0.5}
              lineCap="round"
              lineJoin="round"
              opacity={line.opacity || 1}
              globalCompositeOperation="source-over"
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
};

export default React.memo(AnnotationCanvas);
