import React, { useState, useEffect, useRef } from 'react';
import { X, Minus, Square, Maximize2 } from 'lucide-react';
import Draggable from 'react-draggable';
import { motion } from 'framer-motion';

interface WindowProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  isActive: boolean;
  onClose: () => void;
  onFocus: () => void;
  onMinimize: () => void;
  initialPosition?: { x: number; y: number };
  isMinimized: boolean;
}

const Window: React.FC<WindowProps> = ({
  title,
  icon,
  children,
  isActive,
  onClose,
  onFocus,
  onMinimize,
  initialPosition = { x: 20, y: 20 },
  isMinimized,
}) => {
  const [isMaximized, setIsMaximized] = useState(false);
  const [position, setPosition] = useState(initialPosition);
  const [parentSize, setParentSize] = useState({ width: 0, height: 0 });
  const nodeRef = useRef<HTMLDivElement>(null);
  const TASKBAR_HEIGHT = 48;
  const TITLE_BAR_HEIGHT = 32;
  const CONTENT_PADDING = 16;

  useEffect(() => {
    const updateParentSize = () => {
      const parentElement = nodeRef.current?.parentElement;
      if (parentElement) {
        setParentSize({
          width: parentElement.clientWidth,
          height: parentElement.clientHeight - TASKBAR_HEIGHT
        });
      }
    };

    updateParentSize();
    window.addEventListener('resize', updateParentSize);
    return () => window.removeEventListener('resize', updateParentSize);
  }, []);

  // Focus window when it's restored from minimized state
  useEffect(() => {
    if (!isMinimized) {
      onFocus();
    }
  }, [isMinimized, onFocus]);

  const handleDrag = (_e: any, data: { x: number; y: number }) => {
    if (!isMaximized) {
      setPosition({ x: data.x, y: data.y });
    }
  };

  const handleMaximize = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMaximized(!isMaximized);
    if (!isMaximized) {
      setPosition({ x: 0, y: 0 });
    }
  };

  if (isMinimized) {
    return null;
  }

  return (
    <Draggable
      handle=".window-handle"
      position={isMaximized ? { x: 0, y: 0 } : position}
      onDrag={handleDrag}
      disabled={isMaximized}
      bounds="parent"
      nodeRef={nodeRef}
    >
      <motion.div
        ref={nodeRef}
        className={`absolute bg-[#ECE9D8] shadow-xl ${isActive ? 'z-50' : 'z-40'}`}
        onClick={onFocus}
        style={{
          width: isMaximized ? parentSize.width : '800px',
          height: isMaximized ? parentSize.height : '600px',
          maxWidth: parentSize.width,
          maxHeight: parentSize.height,
          top: 0
        }}
        initial={{ opacity: 1, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.1 }}
      >
        <div className="window-handle flex items-center justify-between bg-gradient-to-r from-[#0A246A] to-[#A6CAF0] p-1 cursor-move">
          <div className="flex items-center gap-2 px-2">
            {icon}
            <span className="text-white font-bold">{title}</span>
          </div>
          <div className="flex">
            <button onClick={onMinimize} className="p-1 hover:bg-[#2F71CD]">
              <Minus size={16} className="text-white" />
            </button>
            <button onClick={handleMaximize} className="p-1 hover:bg-[#2F71CD]">
              {isMaximized ? <Square size={16} className="text-white" /> : <Maximize2 size={16} className="text-white" />}
            </button>
            <button onClick={onClose} className="p-1 hover:bg-[#E81123]">
              <X size={16} className="text-white" />
            </button>
          </div>
        </div>
        <div className="p-2 bg-white m-1 overflow-auto" style={{
          height: isMaximized 
            ? `calc(100% - ${TITLE_BAR_HEIGHT + CONTENT_PADDING}px)`
            : 'calc(100% - 40px)'
        }}>
          {children}
        </div>
      </motion.div>
    </Draggable>
  );
};

export default Window;
