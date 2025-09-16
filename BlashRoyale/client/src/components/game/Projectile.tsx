import { useRef, useEffect } from "react";
import * as THREE from "three";
import { Projectile } from "../../lib/stores/useBlashCroyale";

interface ProjectileProps {
  projectile: Projectile;
}

export default function ProjectileComponent({ projectile }: ProjectileProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    if (!meshRef.current) return;

    // Interpolate position based on progress
    const { start, end, progress } = projectile;
    const x = start.x + (end.x - start.x) * progress;
    const y = start.y + (end.y - start.y) * progress + Math.sin(progress * Math.PI) * 0.5; // Arc
    const z = start.z + (end.z - start.z) * progress;

    meshRef.current.position.set(x, y, z);

    // Point the projectile towards its destination
    const direction = new THREE.Vector3(end.x - start.x, 0, end.z - start.z).normalize();
    meshRef.current.lookAt(meshRef.current.position.clone().add(direction));
  });

  const getProjectileGeometry = () => {
    switch (projectile.type) {
      case 'arrow':
        return <cylinderGeometry args={[0.02, 0.02, 0.5]} />;
      case 'fireball':
        return <sphereGeometry args={[0.1]} />;
      case 'cannonball':
        return <sphereGeometry args={[0.15]} />;
      default:
        return <boxGeometry args={[0.1, 0.1, 0.1]} />;
    }
  };

  const getProjectileMaterial = () => {
    switch (projectile.type) {
      case 'arrow':
        return <meshBasicMaterial color="#8B4513" />;
      case 'fireball':
        return <meshBasicMaterial color="#FF4500" />;
      case 'cannonball':
        return <meshBasicMaterial color="#333333" />;
      default:
        return <meshBasicMaterial color="#FFFFFF" />;
    }
  };

  return (
    <mesh ref={meshRef}>
      {getProjectileGeometry()}
      {getProjectileMaterial()}
    </mesh>
  );
}