import { TowerData } from "../../lib/stores/useBlashCroyale";

interface TowerProps {
  position: [number, number, number];
  color: 'blue' | 'red';
  tower: TowerData;
  isKing?: boolean;
}

export default function Tower({ position, color, tower, isKing = false }: TowerProps) {
  const baseColor = color === 'blue' ? '#2196F3' : '#F44336';
  const size = isKing ? [2, 3, 2] : [1.5, 2, 1.5];
  
  if (tower.health <= 0) {
    return (
      <group position={position}>
        {/* Destroyed tower - detailed rubble */}
        <mesh position={[0, 0.2, 0]}>
          <boxGeometry args={[size[0] * 0.7, 0.4, size[2] * 0.7]} />
          <meshBasicMaterial color="#666666" />
        </mesh>
        <mesh position={[0.3, 0.15, 0.2]}>
          <boxGeometry args={[0.3, 0.3, 0.3]} />
          <meshBasicMaterial color="#888888" />
        </mesh>
        <mesh position={[-0.2, 0.1, -0.3]}>
          <boxGeometry args={[0.2, 0.2, 0.2]} />
          <meshBasicMaterial color="#555555" />
        </mesh>
      </group>
    );
  }

  return (
    <group position={position}>
      {/* Tower foundation */}
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[size[0] * 0.8, size[0] * 0.9, 0.2, 8]} />
        <meshBasicMaterial color={color === 'blue' ? '#1565C0' : '#C62828'} />
      </mesh>
      
      {/* Tower base with details */}
      <mesh position={[0, size[1] / 2, 0]}>
        <boxGeometry args={[size[0], size[1], size[2]]} />
        <meshBasicMaterial color={baseColor} />
      </mesh>
      
      {/* Tower windows */}
      <mesh position={[size[0] * 0.45, size[1] * 0.7, 0]}>
        <boxGeometry args={[0.1, 0.3, 0.2]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      <mesh position={[-size[0] * 0.45, size[1] * 0.7, 0]}>
        <boxGeometry args={[0.1, 0.3, 0.2]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      <mesh position={[0, size[1] * 0.7, size[2] * 0.45]}>
        <boxGeometry args={[0.2, 0.3, 0.1]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      <mesh position={[0, size[1] * 0.7, -size[2] * 0.45]}>
        <boxGeometry args={[0.2, 0.3, 0.1]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      
      {/* Tower battlements */}
      <mesh position={[size[0] * 0.3, size[1] + 0.1, size[2] * 0.3]}>
        <boxGeometry args={[0.2, 0.2, 0.2]} />
        <meshBasicMaterial color={baseColor} />
      </mesh>
      <mesh position={[-size[0] * 0.3, size[1] + 0.1, size[2] * 0.3]}>
        <boxGeometry args={[0.2, 0.2, 0.2]} />
        <meshBasicMaterial color={baseColor} />
      </mesh>
      <mesh position={[size[0] * 0.3, size[1] + 0.1, -size[2] * 0.3]}>
        <boxGeometry args={[0.2, 0.2, 0.2]} />
        <meshBasicMaterial color={baseColor} />
      </mesh>
      <mesh position={[-size[0] * 0.3, size[1] + 0.1, -size[2] * 0.3]}>
        <boxGeometry args={[0.2, 0.2, 0.2]} />
        <meshBasicMaterial color={baseColor} />
      </mesh>
      
      {/* Tower top */}
      <mesh position={[0, size[1] + 0.3, 0]}>
        <coneGeometry args={[size[0] * 0.6, 0.6, 4]} />
        <meshBasicMaterial color={color === 'blue' ? '#1976D2' : '#D32F2F'} />
      </mesh>
      
      {/* Health bar background */}
      <mesh position={[0, size[1] + 0.8, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[size[0], 0.2]} />
        <meshBasicMaterial color="#FF0000" />
      </mesh>
      {/* Health bar foreground */}
      <mesh position={[0, size[1] + 0.81, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[size[0] * (tower.health / tower.maxHealth), 0.18]} />
        <meshBasicMaterial color="#00FF00" />
      </mesh>
      
      {/* Health text */}
      <mesh position={[0, size[1] + 1.0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[size[0] * 0.8, 0.15]} />
        <meshBasicMaterial color="#FFFFFF" transparent opacity={0.8} />
      </mesh>
      
      {/* Crown indicator for king tower */}
      {isKing && (
        <>
          <mesh position={[0, size[1] + 1.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.8, 0.8]} />
            <meshBasicMaterial color="#FFD700" transparent opacity={0.9} />
          </mesh>
          <mesh position={[0, size[1] + 1.4, 0]}>
            <coneGeometry args={[0.3, 0.4, 6]} />
            <meshBasicMaterial color="#FFD700" />
          </mesh>
        </>
      )}
    </group>
  );
}
