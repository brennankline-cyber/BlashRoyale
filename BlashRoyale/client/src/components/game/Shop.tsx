import { useBlashCroyale } from "../../lib/stores/useBlashCroyale";

const EMOTICONS = [
  { id: 1, emoji: "✝️", name: "Cross", cost: 0 },
  { id: 2, emoji: "😢", name: "Crying", cost: 100 },
  { id: 3, emoji: "😤", name: "Angry", cost: 150 },
  { id: 4, emoji: "😎", name: "Cool", cost: 150 },
  { id: 5, emoji: "🤔", name: "Thinking", cost: 200 },
  { id: 6, emoji: "🎉", name: "Party", cost: 250 },
];

export default function Shop() {
  const { setGamePhase, playerGold, purchaseEmoticon, ownedEmoticons } = useBlashCroyale();

  const handlePurchase = (emoticon: typeof EMOTICONS[0]) => {
    if (playerGold >= emoticon.cost && !ownedEmoticons.includes(emoticon.id)) {
      purchaseEmoticon(emoticon.id, emoticon.cost);
    }
  };

  return (
    <div className="w-full h-full bg-gradient-to-b from-purple-600 to-pink-600 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-5xl font-bold text-white" style={{ textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)' }}>
            🛒 SHOP
          </h1>
          <div className="flex items-center space-x-4">
            <div className="bg-black bg-opacity-50 rounded-lg p-4">
              <span className="text-yellow-400 text-2xl font-bold">💰 {playerGold} Gold</span>
            </div>
            <button
              onClick={() => setGamePhase('menu')}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold"
            >
              ← BACK
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {EMOTICONS.map(emoticon => {
            const isOwned = ownedEmoticons.includes(emoticon.id);
            const canAfford = playerGold >= emoticon.cost;
            
            return (
              <div
                key={emoticon.id}
                className={`bg-white rounded-lg p-6 text-center shadow-2xl transform hover:scale-105 transition-all ${
                  isOwned ? 'opacity-50' : ''
                }`}
              >
                <div className="text-6xl mb-4">{emoticon.emoji}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{emoticon.name}</h3>
                <div className="text-yellow-600 font-bold text-lg mb-4">💰 {emoticon.cost} Gold</div>
                
                <button
                  onClick={() => handlePurchase(emoticon)}
                  disabled={isOwned || !canAfford}
                  className={`w-full py-2 px-4 rounded-lg font-bold transition-all ${
                    isOwned 
                      ? 'bg-green-500 text-white cursor-default' 
                      : canAfford
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                  }`}
                >
                  {isOwned ? '✓ OWNED' : canAfford ? 'BUY' : 'NOT ENOUGH GOLD'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
