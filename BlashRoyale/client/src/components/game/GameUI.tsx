import { useState } from "react";
import { useBlashCroyale } from "../../lib/stores/useBlashCroyale";
import Card from "./Card";
import { CARDS } from "../../lib/game/cards";

export default function GameUI() {
  const { 
    gameTime, 
    playerElixir, 
    playerCrowns, 
    enemyCrowns, 
    setGamePhase,
    currentHand,
    placeCard,
    ownedEmoticons,
    showEmoticon,
    displayEmoticon
  } = useBlashCroyale();
  
  const EMOTICONS = [
    { id: 1, emoji: "✝️" },
    { id: 2, emoji: "😢" },
    { id: 3, emoji: "😤" },
    { id: 4, emoji: "😎" },
    { id: 5, emoji: "🤔" },
    { id: 6, emoji: "🎉" },
  ];
  
  const [showEmoticonPicker, setShowEmoticonPicker] = useState(false);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCardPlay = (cardId: number, position: [number, number]) => {
    placeCard(cardId, position);
  };

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Top UI */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center pointer-events-auto">
        <button
          onClick={() => setGamePhase('menu')}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold shadow-lg"
        >
          ← EXIT
        </button>
        
        <div className="flex items-center space-x-6 bg-black bg-opacity-50 rounded-lg p-4">
          <div className="text-white text-xl font-bold">
            ⏱️ {formatTime(gameTime)}
          </div>
          <div className="text-blue-400 text-xl font-bold">
            👑 {playerCrowns}
          </div>
          <div className="text-red-400 text-xl font-bold">
            👑 {enemyCrowns}
          </div>
        </div>
      </div>


      {/* Emoticon System */}
      <div className="absolute bottom-20 right-4 pointer-events-auto">
        <button
          className="bg-yellow-500 hover:bg-yellow-600 text-white p-3 rounded-full shadow-lg"
          onClick={() => setShowEmoticonPicker(!showEmoticonPicker)}
        >
          😄
        </button>
        
        {showEmoticonPicker && (
          <div className="absolute bottom-16 right-0 bg-black bg-opacity-80 rounded-lg p-2 grid grid-cols-3 gap-2">
            {EMOTICONS.filter(e => ownedEmoticons.includes(e.id)).map(emoticon => (
              <button
                key={emoticon.id}
                className="text-2xl p-2 hover:bg-white hover:bg-opacity-20 rounded"
                onClick={() => {
                  displayEmoticon(emoticon.emoji);
                  setShowEmoticonPicker(false);
                }}
              >
                {emoticon.emoji}
              </button>
            ))}
          </div>
        )}
      </div>
      
      {/* Emoticon Display */}
      {showEmoticon && (
        <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div className="text-8xl animate-bounce">{showEmoticon}</div>
        </div>
      )}

      {/* Hand Cards */}
      <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 pointer-events-auto">
        <div className="flex space-x-2 bg-black bg-opacity-50 rounded-lg p-4">
          {currentHand.slice(0, 4).map((cardId, index) => (
            <Card
              key={`${cardId}-${index}`}
              card={CARDS[cardId]}
              onPlay={(position) => handleCardPlay(cardId, position)}
              canPlay={Math.floor(playerElixir) >= CARDS[cardId].cost}
            />
          ))}
        </div>
      </div>
      
      {/* Horizontal Elixir Bar */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 pointer-events-auto">
        <div className="bg-black bg-opacity-50 rounded-lg p-3 flex items-center space-x-3">
          <div className="text-purple-400 text-lg font-bold">⚡</div>
          <div className="w-32 h-4 bg-gray-700 rounded-full relative">
            <div 
              className="absolute left-0 h-full bg-purple-500 rounded-full transition-all duration-300"
              style={{ width: `${(playerElixir / 10) * 100}%` }}
            />
            <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-sm">
              {Math.floor(playerElixir)}/10
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
