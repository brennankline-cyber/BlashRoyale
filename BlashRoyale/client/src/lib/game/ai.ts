import type { GameState } from "../stores/useBlashCroyale";
import { CARDS } from "./cards";

let aiElixir = 5;
let lastAIPlay = 0;
let lastElixirTick = 0;

// Reset AI state for new battles
export function resetAI() {
  aiElixir = 5;
  lastAIPlay = 0;
  lastElixirTick = Date.now();
}

export function playAI(
  gameState: any, 
  playCard: (cardId: number, position: [number, number]) => void
) {
  const now = Date.now();
  
  // AI gains elixir over time (same rate as player) - proper timing
  if (now - lastElixirTick > 100) { // Update every 100ms like player
    const deltaTime = (now - lastElixirTick) / 1000; // Convert to seconds
    const elixirRate = gameState.gameTime > 90 ? 0.3 : 0.15;
    aiElixir = Math.min(10, aiElixir + (deltaTime * elixirRate));
    lastElixirTick = now;
  }

  // AI decision making with same restrictions as player
  if (now - lastAIPlay > 4000 && Math.floor(aiElixir) >= 2) { // AI plays every 4 seconds minimum
    const availableCards = Object.values(CARDS).filter(card => card.cost <= Math.floor(aiElixir));
    
    if (availableCards.length > 0) {
      const randomCard = availableCards[Math.floor(Math.random() * availableCards.length)];
      
      // AI places units on their side (positive Z) - top half only
      const x = (Math.random() - 0.5) * 16; // -8 to 8
      const z = 1 - Math.random() * 11; // 1 to 12 (enemy side only - top half)
      
      playCard(randomCard.id, [x, z]);
      aiElixir -= randomCard.cost;
      lastAIPlay = now;
    }
  }
}
