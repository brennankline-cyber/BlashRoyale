import { GameUnit, TowerData } from "../stores/useBlashCroyale";
import { UNITS } from "./units";

export function findNearestTarget(
  unit: GameUnit,
  allUnits: GameUnit[],
  playerTowers: any,
  enemyTowers: any
): { x: number; z: number } | undefined {
  
  // Hog rider only targets towers
  if (unit.type === 'hog_rider') {
    return findTowerTarget(unit, playerTowers, enemyTowers);
  }
  
  // Check for enemy units in range first (unless hog rider)
  const enemyUnits = allUnits.filter(u => u.isPlayer !== unit.isPlayer);
  const nearbyEnemies = enemyUnits.filter(enemy => {
    const distance = Math.sqrt(
      Math.pow(enemy.position.x - unit.position.x, 2) + 
      Math.pow(enemy.position.z - unit.position.z, 2)
    );
    return distance <= 3; // Range for prioritizing enemy units
  });
  
  // If enemy unit in range, target it
  if (nearbyEnemies.length > 0) {
    const closest = nearbyEnemies.reduce((prev, curr) => {
      const distancePrev = Math.sqrt(
        Math.pow(prev.position.x - unit.position.x, 2) + 
        Math.pow(prev.position.z - unit.position.z, 2)
      );
      const distanceCurr = Math.sqrt(
        Math.pow(curr.position.x - unit.position.x, 2) + 
        Math.pow(curr.position.z - unit.position.z, 2)
      );
      return distanceCurr < distancePrev ? curr : prev;
    });
    return { x: closest.position.x, z: closest.position.z };
  }
  
  // Otherwise target towers with priority logic
  return findTowerTarget(unit, playerTowers, enemyTowers);
}

function findTowerTarget(
  unit: GameUnit,
  playerTowers: any,
  enemyTowers: any
): { x: number; z: number } | undefined {
  
  // Tower targeting with priority logic - updated positions
  const towers = unit.isPlayer ? 
    [
      { pos: [-6, 0, -6], health: playerTowers.left.health, type: 'archer', side: 'left' },
      { pos: [6, 0, -6], health: playerTowers.right.health, type: 'archer', side: 'right' },
      { pos: [0, 0, -8], health: playerTowers.king.health, type: 'king', side: 'center' }
    ] :
    [
      { pos: [-6, 0, 6], health: enemyTowers.left.health, type: 'archer', side: 'left' },
      { pos: [6, 0, 6], health: enemyTowers.right.health, type: 'archer', side: 'right' },
      { pos: [0, 0, 8], health: enemyTowers.king.health, type: 'king', side: 'center' }
    ];

  // Filter alive towers
  const aliveTowers = towers.filter(tower => tower.health > 0);
  if (aliveTowers.length === 0) return undefined;

  // Determine which side unit is on
  const unitSide = unit.position.x < -2 ? 'left' : unit.position.x > 2 ? 'right' : 'center';
  
  // Priority targeting logic
  let targetTowers = [];
  
  // Check if archer tower on unit's side is alive
  const sameSideArcher = aliveTowers.find(tower => tower.side === unitSide && tower.type === 'archer');
  const oppositeSideArcher = aliveTowers.find(tower => tower.side !== unitSide && tower.side !== 'center' && tower.type === 'archer');
  const kingTower = aliveTowers.find(tower => tower.type === 'king');
  
  if (sameSideArcher) {
    // Target same side archer tower first
    targetTowers = [sameSideArcher];
  } else if (kingTower) {
    // If same side archer is destroyed, target king tower
    targetTowers = [kingTower];
  } else if (oppositeSideArcher) {
    // Target opposite side archer if available
    targetTowers = [oppositeSideArcher];
  } else {
    // Fallback to any alive tower
    targetTowers = aliveTowers;
  }
  
  // Find closest target from priority towers
  const closestTower = targetTowers.reduce((prev, curr) => {
    const distancePrev = Math.sqrt(
      Math.pow(prev.pos[0] - unit.position.x, 2) + 
      Math.pow(prev.pos[2] - unit.position.z, 2)
    );
    const distanceCurr = Math.sqrt(
      Math.pow(curr.pos[0] - unit.position.x, 2) + 
      Math.pow(curr.pos[2] - unit.position.z, 2)
    );
    return distanceCurr < distancePrev ? curr : prev;
  });
  
  return { x: closestTower.pos[0], z: closestTower.pos[2] };
}

export function processCombat(
  units: GameUnit[],
  playerTowers: any,
  enemyTowers: any
) {
  const now = Date.now();
  const updatedUnits = [...units];
  const updatedPlayerTowers = { ...playerTowers };
  const updatedEnemyTowers = { ...enemyTowers };

  for (let i = 0; i < updatedUnits.length; i++) {
    const unit = updatedUnits[i];
    const unitData = UNITS[unit.type];

    if (now - unit.lastAttackTime < (1000 / unitData.attackSpeed)) {
      continue; // Still on cooldown
    }

    // Find enemies in range
    const enemiesInRange = updatedUnits.filter(enemy => {
      if (enemy.isPlayer === unit.isPlayer) return false;
      const distance = Math.sqrt(
        Math.pow(enemy.position.x - unit.position.x, 2) + 
        Math.pow(enemy.position.z - unit.position.z, 2)
      );
      return distance <= unitData.range;
    });

    // Attack nearest enemy with proper damage
    if (enemiesInRange.length > 0) {
      const target = enemiesInRange.reduce((prev, curr) => {
        const distancePrev = Math.sqrt(
          Math.pow(prev.position.x - unit.position.x, 2) + 
          Math.pow(prev.position.z - unit.position.z, 2)
        );
        const distanceCurr = Math.sqrt(
          Math.pow(curr.position.x - unit.position.x, 2) + 
          Math.pow(curr.position.z - unit.position.z, 2)
        );
        return distanceCurr < distancePrev ? curr : prev;
      });
      
      // Apply damage
      target.health = Math.max(0, target.health - unitData.damage);
      unit.lastAttackTime = now;
      console.log(`${unit.type} (${unit.isPlayer ? 'player' : 'enemy'}) attacks ${target.type} for ${unitData.damage} damage. Target health: ${target.health}`);
      continue;
    }

    // Attack towers if in range - updated positions
    const towers = unit.isPlayer ? 
      [
        { ref: updatedPlayerTowers.left, pos: [-6, -6] },
        { ref: updatedPlayerTowers.right, pos: [6, -6] },
        { ref: updatedPlayerTowers.king, pos: [0, -8] }
      ] :
      [
        { ref: updatedEnemyTowers.left, pos: [-6, 6] },
        { ref: updatedEnemyTowers.right, pos: [6, 6] },
        { ref: updatedEnemyTowers.king, pos: [0, 8] }
      ];

    for (const tower of towers) {
      if (tower.ref.health <= 0) continue;
      
      const distance = Math.sqrt(
        Math.pow(tower.pos[0] - unit.position.x, 2) + 
        Math.pow(tower.pos[1] - unit.position.z, 2)
      );

      if (distance <= unitData.range + 1) {
        tower.ref.health -= unitData.damage;
        unit.lastAttackTime = now;
        break;
      }
    }
  }

  return {
    units: updatedUnits,
    playerTowers: updatedPlayerTowers,
    enemyTowers: updatedEnemyTowers
  };
}