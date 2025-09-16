import { UnitType } from './units';

export interface CardData {
  id: number;
  name: string;
  cost: number;
  spawnUnit: UnitType;
  icon: string;
  description: string;
}

export const CARDS: Record<number, CardData> = {
  0: {
    id: 0,
    name: 'Skeletons',
    cost: 1,
    spawnUnit: 'skeleton',
    icon: '💀',
    description: 'Cheap melee units'
  },
  1: {
    id: 1,
    name: 'Knight',
    cost: 3,
    spawnUnit: 'knight',
    icon: '🛡️',
    description: 'Tanky melee fighter'
  },
  2: {
    id: 2,
    name: 'Wizard',
    cost: 5,
    spawnUnit: 'wizard',
    icon: '🧙',
    description: 'Ranged magic damage'
  },
  3: {
    id: 3,
    name: 'Dragon',
    cost: 4,
    spawnUnit: 'dragon',
    icon: '🐲',
    description: 'Flying fire breather'
  },
  4: {
    id: 4,
    name: 'Hog Rider',
    cost: 4,
    spawnUnit: 'hog_rider',
    icon: '🐗',
    description: 'Fast tower destroyer'
  },
  5: {
    id: 5,
    name: 'Archers',
    cost: 3,
    spawnUnit: 'archer',
    icon: '🏹',
    description: 'Ranged ground support'
  },
  6: {
    id: 6,
    name: 'Goblins',
    cost: 2,
    spawnUnit: 'goblin',
    icon: '👹',
    description: 'Fast cheap attackers'
  },
  7: {
    id: 7,
    name: 'Robot',
    cost: 4,
    spawnUnit: 'robot',
    icon: '🤖',
    description: 'Mechanical warrior'
  },
  8: {
    id: 8,
    name: 'Mega Knight',
    cost: 7,
    spawnUnit: 'mega_knight',
    icon: '⚔️',
    description: 'Massive ground smasher'
  }
};
