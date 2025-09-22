import { create } from "zustand";
import { UNITS, UnitType } from "../game/units";
import { CARDS } from "../game/cards";
import { playAI, resetAI } from "../game/ai";
import { processCombat, findNearestTarget } from "../game/combat";

export type GamePhase = "loading" | "menu" | "battle" | "shop";

export interface TowerData {
  health: number;
  maxHealth: number;
}

export interface GameUnit {
  id: string;
  type: UnitType;
  position: { x: number; z: number };
  health: number;
  maxHealth: number;
  isPlayer: boolean;
  target?: { x: number; z: number };
  lastAttackTime: number;
}

export interface Projectile {
  id: string;
  type: 'arrow' | 'fireball' | 'cannonball';
  start: { x: number; y: number; z: number };
  end: { x: number; y: number; z: number };
  progress: number; // 0 to 1
  damage: number;
  targetUnitId?: string;
}

export interface GameState {
  // Game Phase
  gamePhase: GamePhase;
  setGamePhase: (phase: GamePhase) => void;

  // Player Stats
  playerGold: number;
  ownedEmoticons: number[];
  purchaseEmoticon: (id: number, cost: number) => void;
  showEmoticon: string | null;
  displayEmoticon: (emoji: string) => void;

  // Battle State
  gameTime: number;
  playerElixir: number;
  playerCrowns: number;
  enemyCrowns: number;
  
  // Towers
  playerTowers: {
    left: TowerData;
    king: TowerData;
    right: TowerData;
  };
  enemyTowers: {
    left: TowerData;
    king: TowerData;
    right: TowerData;
  };

  // Units and Cards
  units: GameUnit[];
  projectiles: Projectile[];
  currentHand: number[];

  // Actions
  startBattle: () => void;
  updateGame: () => void;
  placeCard: (cardId: number, position: [number, number]) => void;
}

const INITIAL_TOWER_HEALTH = 2000; // Archer towers - increased health
const INITIAL_KING_HEALTH = 4000; // King tower - increased health

export const useBlashCroyale = create<GameState>((set, get) => ({
  // Game Phase
  gamePhase: "loading",
  setGamePhase: (phase) => set({ gamePhase: phase }),

  // Player Stats
  playerGold: 0,
  ownedEmoticons: [],
  showEmoticon: null,
  purchaseEmoticon: (id, cost) => {
    const state = get();
    if (state.playerGold >= cost && !state.ownedEmoticons.includes(id)) {
      set({
        playerGold: state.playerGold - cost,
        ownedEmoticons: [...state.ownedEmoticons, id]
      });
    }
  },

  displayEmoticon: (emoji) => {
    set({ showEmoticon: emoji });
    setTimeout(() => {
      set({ showEmoticon: null });
    }, 3000);
  },

  // Battle State
  gameTime: 180, // 3 minutes
  playerElixir: 5,
  playerCrowns: 0,
  enemyCrowns: 0,

  // Towers
  playerTowers: {
    left: { health: INITIAL_TOWER_HEALTH, maxHealth: INITIAL_TOWER_HEALTH },
    king: { health: INITIAL_KING_HEALTH, maxHealth: INITIAL_KING_HEALTH },
    right: { health: INITIAL_TOWER_HEALTH, maxHealth: INITIAL_TOWER_HEALTH }
  },
  enemyTowers: {
    left: { health: INITIAL_TOWER_HEALTH, maxHealth: INITIAL_TOWER_HEALTH },
    king: { health: INITIAL_KING_HEALTH, maxHealth: INITIAL_KING_HEALTH },
    right: { health: INITIAL_TOWER_HEALTH, maxHealth: INITIAL_TOWER_HEALTH }
  },

  // Units and Cards
  units: [],
  projectiles: [],
  currentHand: [0, 1, 2, 3], // Always 4 cards

  // Actions
  startBattle: () => {
    resetAI(); // Reset AI state for determinism
    set({
      gameTime: 180,
      playerElixir: 5,
      playerCrowns: 0,
      enemyCrowns: 0,
      units: [],
      projectiles: [],
      currentHand: [0, 1, 2, 3], // Reset hand for determinism
      playerTowers: {
        left: { health: INITIAL_TOWER_HEALTH, maxHealth: INITIAL_TOWER_HEALTH },
        king: { health: INITIAL_KING_HEALTH, maxHealth: INITIAL_KING_HEALTH },
        right: { health: INITIAL_TOWER_HEALTH, maxHealth: INITIAL_TOWER_HEALTH }
      },
      enemyTowers: {
        left: { health: INITIAL_TOWER_HEALTH, maxHealth: INITIAL_TOWER_HEALTH },
        king: { health: INITIAL_KING_HEALTH, maxHealth: INITIAL_KING_HEALTH },
        right: { health: INITIAL_TOWER_HEALTH, maxHealth: INITIAL_TOWER_HEALTH }
      }
    });
  },

  updateGame: () => {
    const state = get();
    const now = Date.now();

    // Update game time
    const newGameTime = Math.max(0, state.gameTime - 0.1);
    
    // Generate elixir (even slower)

    //BRENNAN CHANGED SO WHEN HALF THE GAME IS OVER THE ELIXIR COUNT GOES FASTER NOT SLOWER

    const elixirRate = state.gameTime > 90 ? 0.3 : 0.6; // Even slower elixir generation
    const newElixir = Math.min(10, state.playerElixir + (0.1 * elixirRate));

    // Move units
    const updatedUnits = state.units.map(unit => {
      const unitData = UNITS[unit.type];
      let newPosition = { ...unit.position };
      let newTarget = unit.target;

      // Find target if none
      if (!newTarget) {
        newTarget = findNearestTarget(unit, state.units, state.playerTowers, state.enemyTowers);
      }

      // Check if unit is in attack range before moving - mutual combat stop
      let isAttacking = false;
      
      // Check if attacking enemies - both units stop when in combat range  
      const enemiesInRange = state.units.filter(enemy => {
        if (enemy.isPlayer === unit.isPlayer) return false;
        const distance = Math.sqrt(
          Math.pow(enemy.position.x - unit.position.x, 2) + 
          Math.pow(enemy.position.z - unit.position.z, 2)
        );
        return distance <= Math.max(unitData.range, 2); // Larger range for mutual stop
      });
      
      // Check if attacking towers
      const towers = unit.isPlayer ? 
        [
          { pos: [-6, 0, 6], health: state.enemyTowers.left.health },
          { pos: [6, 0, 6], health: state.enemyTowers.right.health },
          { pos: [0, 0, 8], health: state.enemyTowers.king.health }
        ] :
        [
          { pos: [-6, 0, -6], health: state.playerTowers.left.health },
          { pos: [6, 0, -6], health: state.playerTowers.right.health },
          { pos: [0, 0, -8], health: state.playerTowers.king.health }
        ];
        
      const towersInRange = towers.filter(tower => {
        if (tower.health <= 0) return false;
        const distance = Math.sqrt(
          Math.pow(tower.pos[0] - unit.position.x, 2) + 
          Math.pow(tower.pos[2] - unit.position.z, 2)
        );
        return distance <= unitData.range + 1;
      });
      
      isAttacking = enemiesInRange.length > 0 || towersInRange.length > 0;
      
      // Only move if not attacking
      if (!isAttacking && newTarget) {
        const dx = newTarget.x - unit.position.x;
        const dz = newTarget.z - unit.position.z;
        const distance = Math.sqrt(dx * dx + dz * dz);

        if (distance > 1) {
          let speed = unitData.speed * 0.05; // Faster movement
          
          // Apply movement restrictions for ground units crossing river - ALL units must use bridges except flying
          if (!unitData.isFlying) {
            // Check if unit is trying to cross river (z between -1 and 1)
            const currentZ = unit.position.z;
            const targetZ = newTarget.z;
            
            if ((currentZ < -1.5 && targetZ > 1.5) || (currentZ > 1.5 && targetZ < -1.5)) {
              // Force movement through bridges at x positions -6, 6 (aligned with paths)
              const bridges = [-6, 6];
              const closestBridge = bridges.reduce((prev, curr) => 
                Math.abs(curr - unit.position.x) < Math.abs(prev - unit.position.x) ? curr : prev
              );
              
              // If not at bridge, move towards it first - stricter enforcement
              if (Math.abs(unit.position.x - closestBridge) > 1.5) {
                newPosition.x += unit.position.x < closestBridge ? speed : -speed;
                newPosition.z = unit.position.z; // Don't move in Z direction
              } else {
                // At bridge, can cross
                newPosition.x += (dx / distance) * speed;
                newPosition.z += (dz / distance) * speed;
              }
            } else {
              // Normal movement
              newPosition.x += (dx / distance) * speed;
              newPosition.z += (dz / distance) * speed;
            }
          } else {
            // Flying units can move freely
            newPosition.x += (dx / distance) * speed;
            newPosition.z += (dz / distance) * speed;
          }
        }
        
        // Clamp units to arena bounds
        newPosition.x = Math.max(-9, Math.min(9, newPosition.x));
        newPosition.z = Math.max(-15, Math.min(15, newPosition.z));
      }

      return {
        ...unit,
        position: newPosition,
        target: newTarget
      };
    });

    // Process combat
    const { units: combatUnits, playerTowers, enemyTowers } = processCombat(
      updatedUnits,
      state.playerTowers,
      state.enemyTowers
    );

    // Tower shooting (archer towers only) - create arrow projectiles
    const newProjectiles: Projectile[] = [];

    //BRENNAN CHANGED THE SHOOTING RATE VALUE TO MAKE TOWERS SHOOT MORE OFTEN

    const shouldShoot = Math.random() < 0.1; // 3% chance per frame for tower shooting
    
    if (shouldShoot) {
      // Enemy towers shooting at player units
      combatUnits.filter(unit => !unit.isPlayer).forEach(unit => {
        // Check enemy left tower
        if (state.enemyTowers.left.health > 0) {
          const distance = Math.sqrt(
            Math.pow(unit.position.x - (-6), 2) + 
            Math.pow(unit.position.z - 6, 2)
          );
          if (distance <= 6) {
            newProjectiles.push({
              id: Math.random().toString(36),
              type: 'arrow',
              start: { x: -6, y: 2, z: 6 },
              end: { x: unit.position.x, y: 1, z: unit.position.z },
              progress: 0,
              damage: 150,
              targetUnitId: unit.id
            });
          }
        }
        
        // Check enemy right tower
        if (state.enemyTowers.right.health > 0) {
          const distance = Math.sqrt(
            Math.pow(unit.position.x - 6, 2) + 
            Math.pow(unit.position.z - 6, 2)
          );
          if (distance <= 6) {
            newProjectiles.push({
              id: Math.random().toString(36),
              type: 'arrow',
              start: { x: 6, y: 2, z: 6 },
              end: { x: unit.position.x, y: 1, z: unit.position.z },
              progress: 0,
              damage: 150,
              targetUnitId: unit.id
            });
          }
        }
      });
      
      // Player towers shooting at enemy units
      combatUnits.filter(unit => unit.isPlayer).forEach(unit => {
        // Check player left tower
        if (state.playerTowers.left.health > 0) {
          const distance = Math.sqrt(
            Math.pow(unit.position.x - (-6), 2) + 
            Math.pow(unit.position.z - (-6), 2)
          );
          if (distance <= 6) {
            newProjectiles.push({
              id: Math.random().toString(36),
              type: 'arrow',
              start: { x: -6, y: 2, z: -6 },
              end: { x: unit.position.x, y: 1, z: unit.position.z },
              progress: 0,
              damage: 150,
              targetUnitId: unit.id
            });
          }
        }
        
        // Check player right tower
        if (state.playerTowers.right.health > 0) {
          const distance = Math.sqrt(
            Math.pow(unit.position.x - 6, 2) + 
            Math.pow(unit.position.z - (-6), 2)
          );
          if (distance <= 6) {
            newProjectiles.push({
              id: Math.random().toString(36),
              type: 'arrow',
              start: { x: 6, y: 2, z: -6 },
              end: { x: unit.position.x, y: 1, z: unit.position.z },
              progress: 0,
              damage: 150,
              targetUnitId: unit.id
            });
          }
        }
      });
    }
    
    // Update existing projectiles
    const updatedProjectiles = [...state.projectiles, ...newProjectiles].map(projectile => {
      const newProgress = Math.min(1, projectile.progress + 0.05); // Projectile speed
      return { ...projectile, progress: newProgress };
    });
    
    // Apply damage from completed projectiles
    const projectileHits = updatedProjectiles.filter(p => p.progress >= 1);
    const towerDamagedUnits = combatUnits.map(unit => {
      let newHealth = unit.health;
      
      projectileHits.forEach(projectile => {
        if (projectile.targetUnitId === unit.id) {
          newHealth -= projectile.damage;
        }
      });
      
      return { ...unit, health: newHealth };
    });
    
    // Remove completed projectiles
    const activeProjectiles = updatedProjectiles.filter(p => p.progress < 1);
    
    // Remove dead units
    const aliveUnits = towerDamagedUnits.filter(unit => unit.health > 0);

    // Count crowns
    let playerCrowns = state.playerCrowns;
    let enemyCrowns = state.enemyCrowns;

    // Check for tower destruction and update crowns correctly
    if (state.enemyTowers.left.health > 0 && enemyTowers.left.health <= 0) playerCrowns++;
    if (state.enemyTowers.right.health > 0 && enemyTowers.right.health <= 0) playerCrowns++;
    if (state.enemyTowers.king.health > 0 && enemyTowers.king.health <= 0) playerCrowns++;

    if (state.playerTowers.left.health > 0 && playerTowers.left.health <= 0) enemyCrowns++;
    if (state.playerTowers.right.health > 0 && playerTowers.right.health <= 0) enemyCrowns++;
    if (state.playerTowers.king.health > 0 && playerTowers.king.health <= 0) enemyCrowns++;
    
    // End game if king tower is destroyed
    if ((state.enemyTowers.king.health > 0 && enemyTowers.king.health <= 0) || 
        (state.playerTowers.king.health > 0 && playerTowers.king.health <= 0)) {
      const won = enemyTowers.king.health <= 0;
      set({ 
        playerGold: state.playerGold + (won ? 200 : 100),
        gamePhase: "menu" 
      });
      return;
    }

    // AI plays cards - collect spawned units to avoid state overwrite
    const aiSpawnedUnits: GameUnit[] = [];
    playAI(state, (cardId: number, position: [number, number]) => {
      const card = CARDS[cardId as keyof typeof CARDS];
      if (card) {
        const unitData = UNITS[card.spawnUnit as keyof typeof UNITS];
        const healthMultiplier = card.cost * 200; // Health based on elixir cost - increased
        const adjustedHealth = Math.max(100, healthMultiplier); // Minimum 100 health
        const newUnit: GameUnit = {
          id: Math.random().toString(36),
          type: card.spawnUnit,
          position: { x: position[0], z: position[1] },
          health: adjustedHealth,
          maxHealth: adjustedHealth,
          isPlayer: false,
          lastAttackTime: 0
        };
        aiSpawnedUnits.push(newUnit);
      }
    });

    // Check game end
    if (newGameTime <= 0 || enemyCrowns >= 3 || playerCrowns >= 3) {
      const won = playerCrowns > enemyCrowns; // Fixed: player wins when player has more crowns
      set({ 
        playerGold: state.playerGold + (won ? 100 : 50),
        gamePhase: "menu" 
      });
      return;
    }

    set({
      gameTime: newGameTime,
      playerElixir: newElixir,
      units: [...aliveUnits, ...aiSpawnedUnits], // Merge alive units with AI spawned units
      projectiles: activeProjectiles,
      playerTowers,
      enemyTowers,
      playerCrowns,
      enemyCrowns
    });
  },

  placeCard: (cardId, position) => {
    const state = get();
    const card = CARDS[cardId];
    
    if (!card || Math.floor(state.playerElixir) < card.cost) return;

    // Create unit with health based on elixir cost - increased health
    const unitData = UNITS[card.spawnUnit as keyof typeof UNITS];
    const healthMultiplier = card.cost * 200; // Doubled health multiplier
    const adjustedHealth = Math.max(100, healthMultiplier); // Minimum 100 health
    const newUnit: GameUnit = {
      id: Math.random().toString(36),
      type: card.spawnUnit,
      position: { x: position[0], z: position[1] },
      health: adjustedHealth,
      maxHealth: adjustedHealth,
      isPlayer: true,
      lastAttackTime: 0
    };

    // Update hand - always maintain 4 cards, cycle to next card with safeguards
    const newHand = [...state.currentHand];
    const usedIndex = newHand.indexOf(cardId);
    const totalCards = Object.keys(CARDS).length;
    
    if (usedIndex !== -1) {
      let nextCard;
      let attempts = 0;
      do {
        nextCard = Math.floor(Math.random() * totalCards);
        attempts++;
        // Prevent infinite loop if deck size <= hand size
        if (attempts > totalCards * 2) {
          nextCard = (cardId + 1) % totalCards; // Fallback to next card
          break;
        }
      } while (newHand.includes(nextCard));
      newHand[usedIndex] = nextCard;
    }
    
    // Ensure we always have exactly 4 cards with safeguards
    while (newHand.length < 4) {
      let newCard;
      let attempts = 0;
      do {
        newCard = Math.floor(Math.random() * totalCards);
        attempts++;
        if (attempts > totalCards * 2) {
          newCard = newHand.length % totalCards; // Fallback
          break;
        }
      } while (newHand.includes(newCard));
      newHand.push(newCard);
    }

    set({
      playerElixir: state.playerElixir - card.cost,
      units: [...state.units, newUnit],
      currentHand: newHand
    });
  }
}));
