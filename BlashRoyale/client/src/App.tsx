import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import "@fontsource/inter";
import { useBlashCroyale } from "./lib/stores/useBlashCroyale";
import LoadingScreen from "./components/game/LoadingScreen";
import MainMenu from "./components/game/MainMenu";
import BattleArena from "./components/game/BattleArena";
import Shop from "./components/game/Shop";

// Main App component
function App() {
  const { gamePhase } = useBlashCroyale();
  const [showCanvas, setShowCanvas] = useState(false);

  // Show the canvas once everything is loaded
  useEffect(() => {
    setShowCanvas(true);
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      {showCanvas && (
        <>
          {gamePhase === 'loading' && <LoadingScreen />}
          {gamePhase === 'menu' && <MainMenu />}
          {gamePhase === 'battle' && <BattleArena />}
          {gamePhase === 'shop' && <Shop />}
        </>
      )}
    </div>
  );
}

export default App;
