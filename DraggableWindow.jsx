import React, { useState, useRef, useEffect } from "react";
import { GripVertical, Minimize2, Maximize2, X } from "lucide-react";
import { motion } from "framer-motion";

export default function DraggableWindow({ title, children, onClose, initialPosition = { x: 100, y: 100 } }) {
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const windowRef = useRef(null);

  const handleMouseDown = (e) => {
    if (e.target.closest('.window-header')) {
      setIsDragging(true);
      setDragOffset({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  return (
    <motion.div
      ref={windowRef}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed z-50 bg-[var(--nea-bg-surface)] border border-[var(--nea-border-default)] rounded-lg shadow-2xl"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: isMinimized ? '300px' : '400px',
        maxHeight: isMinimized ? 'auto' : '600px'
      }}
    >
      <div
        className="window-header flex items-center justify-between p-3 bg-[var(--nea-bg-surface-hover)] border-b border-[var(--nea-border-default)] cursor-move"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-2">
          <GripVertical className="w-4 h-4 text-[var(--nea-text-secondary)]" />
          <h3 className="text-sm font-semibold text-white">{title}</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="hover:bg-[var(--nea-bg-surface)] p-1 rounded transition-colors"
          >
            {isMinimized ? (
              <Maximize2 className="w-4 h-4 text-[var(--nea-text-secondary)]" />
            ) : (
              <Minimize2 className="w-4 h-4 text-[var(--nea-text-secondary)]" />
            )}
          </button>
          <button
            onClick={onClose}
            className="hover:bg-red-500/20 p-1 rounded transition-colors"
          >
            <X className="w-4 h-4 text-red-400" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <div className="p-4 overflow-y-auto max-h-[540px] styled-scrollbar">
          {children}
        </div>
      )}
    </motion.div>
  );
}