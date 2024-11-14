import { useState, useEffect } from 'react';

interface Position {
  x: number;
  y: number;
}

interface WindowSize {
  width: number;
  height: number;
}

export const useWindowSnap = (initialPos: Position, windowSize: WindowSize) => {
  const [position, setPosition] = useState(initialPos);
  const [isDragging, setIsDragging] = useState(false);

  const snapThreshold = 20; // pixels from edge to trigger snap

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragStop = (newPos: Position) => {
    setIsDragging(false);
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    // Snap to left half
    if (newPos.x < snapThreshold) {
      setPosition({
        x: 0,
        y: 0,
      });
      return;
    }

    // Snap to right half
    if (newPos.x + windowSize.width > screenWidth - snapThreshold) {
      setPosition({
        x: screenWidth - windowSize.width,
        y: 0,
      });
      return;
    }

    // Snap to top
    if (newPos.y < snapThreshold) {
      setPosition({
        x: newPos.x,
        y: 0,
      });
      return;
    }

    setPosition(newPos);
  };

  return {
    position,
    setPosition,
    handleDragStart,
    handleDragStop,
    isDragging,
  };
};
