import type { LevelData } from '@/models';
import type { GameEngine } from '@/services/engine/GameEngine';

export interface GameCanvasProps {
  stageNumber?: number;
  twoPlayer?: boolean;
  customLevel?: LevelData;
  onGameOver?: () => void;
  onStageClear?: () => void;
  onEngineReady?: (engine: GameEngine) => void;
}
