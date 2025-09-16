import { GameUnit } from "../../lib/stores/useBlashCroyale";
import { UNITS } from "../../lib/game/units";

interface UnitProps {
  unit: GameUnit;
}

export default function Unit({ unit }: UnitProps) {
  const unitData = UNITS[unit.type];
  const color = unit.isPlayer ? '#2196F3' : '#F44336';
  
  // Different appearances based on unit type
  const getUnitAppearance = () => {
    const y = unitData.isFlying ? 2.5 : 0.5; // Flying units higher
    
    switch (unit.type) {
      case 'skeleton':
        return (
          <group position={[unit.position.x, y, unit.position.z]}>
            <mesh>
              <boxGeometry args={[0.4, 0.8, 0.4]} />
              <meshBasicMaterial color={color} />
            </mesh>
            <mesh position={[0, 0.6, 0]}>
              <sphereGeometry args={[0.15]} />
              <meshBasicMaterial color="#EEEEEE" />
            </mesh>
          </group>
        );
        
      case 'wizard':
        return (
          <group position={[unit.position.x, y, unit.position.z]}>
            <mesh>
              <coneGeometry args={[0.4, 1.2, 6]} />
              <meshBasicMaterial color={color} />
            </mesh>
            <mesh position={[0, 0.8, 0]}>
              <sphereGeometry args={[0.2]} />
              <meshBasicMaterial color={unit.isPlayer ? '#FFD700' : '#8B4513'} />
            </mesh>
            <mesh position={[0, 1.2, 0]}>
              <coneGeometry args={[0.15, 0.4, 4]} />
              <meshBasicMaterial color="#9C27B0" />
            </mesh>
          </group>
        );
        
      case 'knight':
        return (
          <group position={[unit.position.x, y, unit.position.z]}>
            <mesh>
              <boxGeometry args={[0.7, 1.1, 0.7]} />
              <meshBasicMaterial color={color} />
            </mesh>
            <mesh position={[0, 0.8, 0]}>
              <sphereGeometry args={[0.2]} />
              <meshBasicMaterial color={unit.isPlayer ? '#C0C0C0' : '#8B4513'} />
            </mesh>
            <mesh position={[0.3, 0.5, 0]}>
              <boxGeometry args={[0.1, 0.6, 0.3]} />
              <meshBasicMaterial color="#C0C0C0" />
            </mesh>
          </group>
        );
        
      case 'dragon':
        return (
          <group position={[unit.position.x, y, unit.position.z]}>
            <mesh>
              <sphereGeometry args={[0.5, 8, 6]} />
              <meshBasicMaterial color={unit.isPlayer ? '#4CAF50' : '#F44336'} />
            </mesh>
            <mesh position={[0.3, 0, 0]}>
              <coneGeometry args={[0.2, 0.6, 4]} />
              <meshBasicMaterial color={unit.isPlayer ? '#2E7D32' : '#C62828'} />
            </mesh>
            <mesh position={[-0.8, 0.1, 0.6]} rotation={[0, 0, Math.PI/4]}>
              <planeGeometry args={[0.8, 0.4]} />
              <meshBasicMaterial color={unit.isPlayer ? '#81C784' : '#EF5350'} />
            </mesh>
            <mesh position={[-0.8, 0.1, -0.6]} rotation={[0, 0, -Math.PI/4]}>
              <planeGeometry args={[0.8, 0.4]} />
              <meshBasicMaterial color={unit.isPlayer ? '#81C784' : '#EF5350'} />
            </mesh>
          </group>
        );
        
      case 'hog_rider':
        return (
          <group position={[unit.position.x, y, unit.position.z]}>
            <mesh position={[0, -0.2, 0]}>
              <boxGeometry args={[1.0, 0.6, 0.8]} />
              <meshBasicMaterial color="#8D6E63" />
            </mesh>
            <mesh>
              <boxGeometry args={[0.5, 1.0, 0.5]} />
              <meshBasicMaterial color={color} />
            </mesh>
            <mesh position={[0, 0.7, 0]}>
              <sphereGeometry args={[0.18]} />
              <meshBasicMaterial color={unit.isPlayer ? '#FFEB3B' : '#FF5722'} />
            </mesh>
          </group>
        );
        
      case 'archer':
        return (
          <group position={[unit.position.x, y, unit.position.z]}>
            <mesh>
              <boxGeometry args={[0.5, 0.9, 0.5]} />
              <meshBasicMaterial color={color} />
            </mesh>
            <mesh position={[0, 0.6, 0]}>
              <sphereGeometry args={[0.17]} />
              <meshBasicMaterial color={unit.isPlayer ? '#FFB74D' : '#D84315'} />
            </mesh>
            <mesh position={[0.2, 0.4, 0]}>
              <boxGeometry args={[0.05, 0.7, 0.05]} />
              <meshBasicMaterial color="#8D6E63" />
            </mesh>
          </group>
        );
        
      case 'goblin':
        return (
          <group position={[unit.position.x, y, unit.position.z]}>
            <mesh>
              <boxGeometry args={[0.4, 0.7, 0.4]} />
              <meshBasicMaterial color={color} />
            </mesh>
            <mesh position={[0, 0.5, 0]}>
              <sphereGeometry args={[0.15]} />
              <meshBasicMaterial color={unit.isPlayer ? '#4CAF50' : '#FF5722'} />
            </mesh>
            <mesh position={[0.15, 0.3, 0]}>
              <boxGeometry args={[0.05, 0.4, 0.05]} />
              <meshBasicMaterial color="#9E9E9E" />
            </mesh>
          </group>
        );
        
      case 'robot':
        return (
          <group position={[unit.position.x, y, unit.position.z]}>
            <mesh>
              <boxGeometry args={[0.6, 1.0, 0.6]} />
              <meshBasicMaterial color={unit.isPlayer ? '#607D8B' : '#424242'} />
            </mesh>
            <mesh position={[0, 0.7, 0]}>
              <boxGeometry args={[0.4, 0.4, 0.4]} />
              <meshBasicMaterial color={unit.isPlayer ? '#90A4AE' : '#616161'} />
            </mesh>
            <mesh position={[-0.1, 0.7, 0.15]}>
              <sphereGeometry args={[0.05]} />
              <meshBasicMaterial color="#F44336" />
            </mesh>
            <mesh position={[0.1, 0.7, 0.15]}>
              <sphereGeometry args={[0.05]} />
              <meshBasicMaterial color="#F44336" />
            </mesh>
          </group>
        );
        
      case 'mega_knight':
        return (
          <group position={[unit.position.x, y, unit.position.z]}>
            <mesh>
              <boxGeometry args={[0.9, 1.4, 0.9]} />
              <meshBasicMaterial color={color} />
            </mesh>
            <mesh position={[0, 1.0, 0]}>
              <sphereGeometry args={[0.25]} />
              <meshBasicMaterial color={unit.isPlayer ? '#C0C0C0' : '#8B4513'} />
            </mesh>
            <mesh position={[0.4, 0.7, 0]}>
              <boxGeometry args={[0.15, 0.8, 0.4]} />
              <meshBasicMaterial color="#9E9E9E" />
            </mesh>
            <mesh position={[-0.4, 0.7, 0]}>
              <boxGeometry args={[0.15, 0.8, 0.4]} />
              <meshBasicMaterial color="#9E9E9E" />
            </mesh>
          </group>
        );
        
      default:
        return (
          <group position={[unit.position.x, y, unit.position.z]}>
            <mesh>
              <boxGeometry args={[0.6, 1, 0.6]} />
              <meshBasicMaterial color={color} />
            </mesh>
            <mesh position={[0, 0.8, 0]}>
              <sphereGeometry args={[0.2]} />
              <meshBasicMaterial color={unit.isPlayer ? '#64B5F6' : '#EF5350'} />
            </mesh>
          </group>
        );
    }
  };

  return (
    <>
      {getUnitAppearance()}
      
      {/* Health bar */}
      <mesh position={[unit.position.x, (unitData.isFlying ? 3.2 : 1.2), unit.position.z]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.8, 0.1]} />
        <meshBasicMaterial color="#FF0000" />
      </mesh>
      <mesh position={[unit.position.x, (unitData.isFlying ? 3.21 : 1.21), unit.position.z]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.8 * (unit.health / unit.maxHealth), 0.08]} />
        <meshBasicMaterial color="#00FF00" />
      </mesh>

      {/* Direction indicator */}
      <mesh position={[unit.position.x, (unitData.isFlying ? 2.6 : 0.6), unit.position.z + (unit.isPlayer ? 0.4 : -0.4)]}>
        <coneGeometry args={[0.1, 0.3, 3]} />
        <meshBasicMaterial color="#FFFF00" />
      </mesh>
    </>
  );
}
