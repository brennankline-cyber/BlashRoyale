import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect } from "react";
import * as THREE from "three";
import { useBlashCroyale } from "../../lib/stores/useBlashCroyale";
import GameUI from "./GameUI";
import Tower from "./Tower";
import Unit from "./Unit";
import ProjectileComponent from "./Projectile";
import EnvironmentDetails from "./EnvironmentDetails";

function Arena() {
  const { 
    playerTowers, 
    enemyTowers, 
    units, 
    projectiles,
    gameTime, 
    startBattle,
    updateGame 
  } = useBlashCroyale();

  useEffect(() => {
    startBattle();
    
    const gameLoop = setInterval(() => {
      updateGame();
    }, 100); // 10 FPS game logic

    return () => clearInterval(gameLoop);
  }, [startBattle, updateGame]);

  return (
    <>
      {/* Enhanced Environment */}
      <EnvironmentDetails />
      
      {/* Arena background - removed since EnvironmentDetails has enhanced version */}
      
      
      {/* River/divide - wider to emphasize crossing points */}
      <mesh position={[0, 0, -0.8]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 1.5]} />
        <meshBasicMaterial color="#2196F3" />
      </mesh>

      {/* Player Towers (Bottom - Blue) - moved forward more */}
      <Tower position={[-6, 0, -6]} color="blue" tower={playerTowers.left} />
      <Tower position={[0, 0, -8]} color="blue" tower={playerTowers.king} isKing />
      <Tower position={[6, 0, -6]} color="blue" tower={playerTowers.right} />

      {/* Enemy Towers (Top - Red) - moved forward more */}
      <Tower position={[-6, 0, 6]} color="red" tower={enemyTowers.left} />
      <Tower position={[0, 0, 8]} color="red" tower={enemyTowers.king} isKing />
      <Tower position={[6, 0, 6]} color="red" tower={enemyTowers.right} />
      
      {/* Two Bridges over river - aligned with paths */}
      <mesh position={[-6, 0, -0.8]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2, 1]} />
        <meshBasicMaterial color="#8D6E63" />
      </mesh>
      <mesh position={[6, 0, -0.8]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2, 1]} />
        <meshBasicMaterial color="#8D6E63" />
      </mesh>
      
      {/* Two paths to archer towers - aligned with bridges */}
      <mesh position={[-6, 0, -3]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2, 6]} />
        <meshBasicMaterial color="#BCAAA4" />
      </mesh>
      <mesh position={[6, 0, -3]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2, 6]} />
        <meshBasicMaterial color="#BCAAA4" />
      </mesh>
      <mesh position={[-6, 0, 3]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2, 6]} />
        <meshBasicMaterial color="#BCAAA4" />
      </mesh>
      <mesh position={[6, 0, 3]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2, 6]} />
        <meshBasicMaterial color="#BCAAA4" />
      </mesh>

      {/* Units */}
      {units.map(unit => (
        <Unit key={unit.id} unit={unit} />
      ))}
      
      {/* Projectiles */}
      {projectiles.map(projectile => (
        <ProjectileComponent key={projectile.id} projectile={projectile} />
      ))}

      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[0, 10, 5]} intensity={0.8} />
    </>
  );
}

export default function BattleArena() {
  const { gameTime, projectiles } = useBlashCroyale();

  return (
    <div className="w-full h-full relative">
      <Canvas
        camera={{ position: [0, 20, 0], rotation: [-Math.PI / 2, 0, 0], fov: 60 }}
        gl={{ antialias: true }}
      >
        <Suspense fallback={null}>
          <Arena />
        </Suspense>
      </Canvas>
      <GameUI />
    </div>
  );
}
