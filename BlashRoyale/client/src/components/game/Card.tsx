import { useState, useRef, useEffect } from "react";
import { CardData } from "../../lib/game/cards";

interface CardProps {
  card: CardData;
  onPlay: (position: [number, number]) => void;
  canPlay: boolean;
}

export default function Card({ card, onPlay, canPlay }: CardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState<{x: number, y: number} | null>(null);
  const [showRedHologram, setShowRedHologram] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!canPlay) return;
    setIsDragging(true);
    setShowRedHologram(true);
    // Center card on cursor
    setDragPosition({ x: e.clientX, y: e.clientY });
    e.preventDefault();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    setDragPosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = (e: MouseEvent) => {
    if (!isDragging || !canPlay) {
      setIsDragging(false);
      setDragPosition(null);
      setShowRedHologram(false);
      return;
    }

    // Convert mouse position to game coordinates
    const gameContainer = document.querySelector('canvas')?.getBoundingClientRect();
    
    if (gameContainer) {
      // Normalize mouse position to canvas coordinates
      const canvasX = ((e.clientX - gameContainer.left) / gameContainer.width) * 2 - 1;
      const canvasY = ((e.clientY - gameContainer.top) / gameContainer.height) * 2 - 1;
      
      // Only allow placement on player side (bottom half of screen, canvasY > 0)
      if (canvasY > 0) {
        // Convert to game world coordinates (player side only - bottom half)
        const gameX = Math.max(-9, Math.min(9, canvasX * 9));
        const gameZ = Math.max(-12, Math.min(0, canvasY * 15 - 12));
        
        onPlay([gameX, gameZ]);
      }
    }
    
    setIsDragging(false);
    setDragPosition(null);
    setShowRedHologram(false);
  };

  // Add global mouse event listeners when dragging
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

  const handleClick = () => {
    if (canPlay && !isDragging) {
      // Fallback: place at a random position on player's side
      const x = (Math.random() - 0.5) * 16; // -8 to 8
      const z = -8 + Math.random() * 6; // -8 to -2 (player side)
      onPlay([x, z]);
    }
  };

  return (
    <>
      <div
        ref={cardRef}
        className={`w-16 h-24 rounded-lg border-2 cursor-pointer transform transition-all ${
          canPlay 
            ? 'border-yellow-400 hover:scale-110 hover:-translate-y-2' 
            : 'border-gray-600 opacity-50 cursor-not-allowed'
        } ${isDragging ? 'scale-110 -translate-y-2 z-50' : ''}`}
        style={{
          background: canPlay 
            ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            : 'linear-gradient(135deg, #4a4a4a 0%, #2a2a2a 100%)',
          position: isDragging ? 'fixed' : 'relative',
          left: dragPosition ? dragPosition.x - 32 : 'auto', // Center on cursor
          top: dragPosition ? dragPosition.y - 48 : 'auto', // Center on cursor
          pointerEvents: isDragging ? 'none' : 'auto',
          zIndex: isDragging ? 1000 : 'auto'
        }}
        onClick={handleClick}
        onMouseDown={handleMouseDown}
      >
        <div className="h-full flex flex-col items-center justify-between p-1 text-white">
          <div className="text-xs font-bold text-center leading-tight">{card.name}</div>
          <div className="text-2xl">{card.icon}</div>
          <div className="bg-purple-600 rounded-full w-6 h-6 flex items-center justify-center">
            <span className="text-xs font-bold">{card.cost}</span>
          </div>
        </div>
      </div>
      
      {/* Red hologram overlay on enemy side */}
      {showRedHologram && (
        <div 
          className="fixed inset-0 pointer-events-none z-40"
          style={{
            background: 'linear-gradient(to bottom, rgba(255, 0, 0, 0.15) 0%, rgba(255, 0, 0, 0.15) 50%, transparent 50%, transparent 100%)'
          }}
        >
          <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 text-red-500 text-2xl font-bold bg-black bg-opacity-60 px-4 py-2 rounded">
            ❌ Can't place here!
          </div>
        </div>
      )}
      
      {/* Drag feedback indicator */}
      {isDragging && (
        <div 
          className="fixed text-white bg-black bg-opacity-60 px-2 py-1 rounded text-sm pointer-events-none z-50"
          style={{
            left: dragPosition ? dragPosition.x + 40 : 0,
            top: dragPosition ? dragPosition.y - 20 : 0
          }}
        >
          {canPlay ? "Drop on your side to place" : "Not enough elixir"}
        </div>
      )}
    </>
  );
}