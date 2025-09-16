import { useBlashCroyale } from "../../lib/stores/useBlashCroyale";

export default function MainMenu() {
  const { setGamePhase, playerGold } = useBlashCroyale();

  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-green-400 to-blue-600">
      <div className="text-center space-y-8">
        <h1 className="text-7xl font-bold text-white mb-12 tracking-wider" 
            style={{ textShadow: '0 0 20px rgba(0, 0, 0, 0.7)' }}>
          BLASH CROYALE
        </h1>
        
        <div className="space-y-4">
          <button
            onClick={() => setGamePhase('battle')}
            className="w-64 h-16 bg-red-600 hover:bg-red-700 text-white text-xl font-bold rounded-lg shadow-2xl transform hover:scale-105 transition-all"
            style={{ textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)' }}
          >
            ⚔️ BATTLE
          </button>
          
          <button
            onClick={() => setGamePhase('shop')}
            className="w-64 h-16 bg-yellow-600 hover:bg-yellow-700 text-white text-xl font-bold rounded-lg shadow-2xl transform hover:scale-105 transition-all"
            style={{ textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)' }}
          >
            🛒 SHOP
          </button>
        </div>
        
        <div className="mt-8">
          <div className="bg-black bg-opacity-50 rounded-lg p-4 inline-block">
            <span className="text-yellow-400 text-2xl font-bold">💰 {playerGold} Gold</span>
          </div>
        </div>
      </div>
    </div>
  );
}
