export type UnitType = 'skeleton' | 'wizard' | 'robot' | 'dragon' | 'hog_rider' | 'knight' | 'archer' | 'goblin' | 'mega_knight';

export interface UnitData {
  name: string;
  health: number;
  damage: number;
  speed: number;
  range: number;
  attackSpeed: number; // attacks per second
  targets: 'ground' | 'air' | 'both';
  isFlying: boolean;
  cost: number;
}

export const UNITS: Record<UnitType, UnitData> = {
  skeleton: {
    name: 'Skeleton',
    health: 67,
    damage: 67,
    speed: 1.0,
    range: 1,
    attackSpeed: 1,
    targets: 'ground',
    isFlying: false,
    cost: 1
  },
  wizard: {
    name: 'Wizard',
    health: 340,
    damage: 130,
    speed: 0.7,
    range: 5.5,
    attackSpeed: 1.4,
    targets: 'both',
    isFlying: false,
    cost: 5
  },
  robot: {
    name: 'Robot',
    health: 500,
    damage: 150,
    speed: 0.8,
    range: 1.2,
    attackSpeed: 1.2,
    targets: 'ground',
    isFlying: false,
    cost: 4
  },
  dragon: {
    name: 'Baby Dragon',
    health: 800,
    damage: 100,
    speed: 1.0,
    range: 3.5,
    attackSpeed: 1.6,
    targets: 'both',
    isFlying: true,
    cost: 4
  },
  hog_rider: {
    name: 'Hog Rider',
    health: 415,
    damage: 105,
    speed: 1.5,
    range: 1,
    attackSpeed: 1.6,
    targets: 'ground',
    isFlying: false,
    cost: 4
  },
  knight: {
    name: 'Knight',
    health: 600,
    damage: 120,
    speed: 1.0,
    range: 1,
    attackSpeed: 1.2,
    targets: 'ground',
    isFlying: false,
    cost: 3
  },
  archer: {
    name: 'Archer',
    health: 125,
    damage: 40,
    speed: 1.0,
    range: 5.0,
    attackSpeed: 1.2,
    targets: 'both',
    isFlying: false,
    cost: 3
  },
  goblin: {
    name: 'Goblin',
    health: 100,
    damage: 80,
    speed: 1.3,
    range: 1,
    attackSpeed: 1.1,
    targets: 'ground',
    isFlying: false,
    cost: 2
  },
  mega_knight: {
    name: 'Mega Knight',
    health: 1200,
    damage: 240,
    speed: 0.7,
    range: 1,
    attackSpeed: 1.8,
    targets: 'ground',
    isFlying: false,
    cost: 7
  }
};
