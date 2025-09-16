import { useMemo } from 'react';

// Pre-calculated random positions for environment elements
const generateRandomElements = () => {
  const trees = [];
  const rocks = [];
  const grassPatches = [];
  
  // Generate trees around the arena edges
  for (let i = 0; i < 12; i++) {
    const isLeft = i < 6;
    trees.push({
      id: i,
      position: [
        isLeft ? -8 - Math.random() * 2 : 8 + Math.random() * 2,
        0,
        -12 + Math.random() * 24
      ] as [number, number, number],
      scale: 0.8 + Math.random() * 0.4
    });
  }
  
  // Generate rocks scattered around
  for (let i = 0; i < 8; i++) {
    rocks.push({
      id: i,
      position: [
        -7 + Math.random() * 14,
        0,
        -14 + Math.random() * 28
      ] as [number, number, number],
      scale: 0.3 + Math.random() * 0.4,
      rotation: Math.random() * Math.PI * 2
    });
  }
  
  // Generate grass patches for variety
  for (let i = 0; i < 20; i++) {
    grassPatches.push({
      id: i,
      position: [
        -9 + Math.random() * 18,
        0.01,
        -15 + Math.random() * 30
      ] as [number, number, number],
      scale: 1 + Math.random() * 2,
      rotation: Math.random() * Math.PI * 2
    });
  }
  
  return { trees, rocks, grassPatches };
};

export default function EnvironmentDetails() {
  const { trees, rocks, grassPatches } = useMemo(generateRandomElements, []);
  
  return (
    <>
      {/* Enhanced grass background with variations */}
      <mesh position={[0, -0.01, -1]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[22, 34]} />
        <meshBasicMaterial color="#388E3C" />
      </mesh>
      
      {/* Grass patches for texture variation */}
      {grassPatches.map(patch => (
        <mesh 
          key={`grass-${patch.id}`}
          position={patch.position}
          rotation={[-Math.PI / 2, 0, patch.rotation]}
        >
          <circleGeometry args={[patch.scale, 8]} />
          <meshBasicMaterial color="#66BB6A" transparent opacity={0.7} />
        </mesh>
      ))}
      
      {/* Trees around arena edges */}
      {trees.map(tree => (
        <group key={`tree-${tree.id}`} position={tree.position}>
          {/* Tree trunk */}
          <mesh position={[0, tree.scale * 0.6, 0]}>
            <cylinderGeometry args={[0.1 * tree.scale, 0.15 * tree.scale, tree.scale * 1.2, 6]} />
            <meshBasicMaterial color="#8D6E63" />
          </mesh>
          {/* Tree foliage - multiple spheres for fuller look */}
          <mesh position={[0, tree.scale * 1.3, 0]}>
            <sphereGeometry args={[0.6 * tree.scale, 8, 6]} />
            <meshBasicMaterial color="#2E7D32" />
          </mesh>
          <mesh position={[0.2 * tree.scale, tree.scale * 1.1, 0.1 * tree.scale]}>
            <sphereGeometry args={[0.4 * tree.scale, 6, 5]} />
            <meshBasicMaterial color="#388E3C" />
          </mesh>
          <mesh position={[-0.1 * tree.scale, tree.scale * 1.5, -0.2 * tree.scale]}>
            <sphereGeometry args={[0.3 * tree.scale, 6, 5]} />
            <meshBasicMaterial color="#43A047" />
          </mesh>
        </group>
      ))}
      
      {/* Rocks scattered around */}
      {rocks.map(rock => (
        <mesh 
          key={`rock-${rock.id}`}
          position={rock.position}
          rotation={[0, rock.rotation, 0]}
        >
          <dodecahedronGeometry args={[rock.scale]} />
          <meshBasicMaterial color="#616161" />
        </mesh>
      ))}
      
      {/* Flowers near paths */}
      <mesh position={[-5, 0.02, -2]}>
        <sphereGeometry args={[0.1]} />
        <meshBasicMaterial color="#FF5722" />
      </mesh>
      <mesh position={[-5.2, 0.02, -1.8]}>
        <sphereGeometry args={[0.08]} />
        <meshBasicMaterial color="#FF9800" />
      </mesh>
      <mesh position={[5, 0.02, 2]}>
        <sphereGeometry args={[0.1]} />
        <meshBasicMaterial color="#E91E63" />
      </mesh>
      <mesh position={[5.3, 0.02, 2.2]}>
        <sphereGeometry args={[0.09]} />
        <meshBasicMaterial color="#9C27B0" />
      </mesh>
      
      {/* Enhanced lighting effects */}
      <pointLight position={[-8, 5, -8]} intensity={0.3} color="#FFD54F" />
      <pointLight position={[8, 5, 8]} intensity={0.3} color="#FFD54F" />
      
      {/* Ambient particles effect (static positions) */}
      {Array.from({ length: 15 }).map((_, i) => (
        <mesh 
          key={`particle-${i}`}
          position={[
            -8 + Math.random() * 16,
            2 + Math.random() * 3,
            -12 + Math.random() * 24
          ]}
        >
          <sphereGeometry args={[0.02]} />
          <meshBasicMaterial color="#FFEB3B" transparent opacity={0.6} />
        </mesh>
      ))}
    </>
  );
}