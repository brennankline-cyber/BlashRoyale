import { useEffect } from "react";
import { useBlashCroyale } from "../../lib/stores/useBlashCroyale";

export default function LoadingScreen() {
  const { setGamePhase } = useBlashCroyale();

  useEffect(() => {
    // Simulate loading and show SUPERCELL animation
    const timer = setTimeout(() => {
      setGamePhase('menu');
    }, 3000);

    return () => clearTimeout(timer);
  }, [setGamePhase]);

  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-blue-900 to-purple-900">
      <div className="text-center">
        <div className="animate-pulse">
          <h1 
            className="text-6xl font-bold text-yellow-400 mb-4 tracking-wider"
            style={{
              textShadow: '0 0 20px rgba(255, 255, 255, 0.5)',
              animation: 'fadeIn 2s ease-in-out'
            }}
          >
            SUPERCELL
          </h1>
        </div>
        <div className="w-64 h-2 bg-gray-700 rounded-full mx-auto">
          <div 
            className="h-full bg-yellow-400 rounded-full"
            style={{
              width: '100%',
              animation: 'loadBar 3s ease-in-out'
            }}
          />
        </div>
      </div>
      
      <style>{`
        @keyframes fadeIn {
          0% { opacity: 0; transform: scale(0.8); }
          100% { opacity: 1; transform: scale(1); }
        }
        
        @keyframes loadBar {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
}
