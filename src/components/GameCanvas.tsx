import { useEffect, useRef } from 'react';
import { GameEngine } from '@/game/core/gameEngine';
import type { LevelData } from '@/types/game';
import { useGameStore } from '@/store/gameStore';

interface GameCanvasProps {
  stageNumber?: number;
  twoPlayer?: boolean;
  customLevel?: LevelData;
  onGameOver?: () => void;
  onStageClear?: () => void;
  onEngineReady?: (engine: GameEngine) => void;
}

export function GameCanvas({
  stageNumber = 1,
  twoPlayer = false,
  customLevel,
  onGameOver,
  onStageClear,
  onEngineReady,
}: GameCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<GameEngine | null>(null);
  const setHud = useGameStore((s) => s.setHud);
  const settings = useGameStore((s) => s.settings);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let engine: GameEngine | null = null;
    let mounted = true;

    const init = async () => {
      engine = new GameEngine({
        container,
        stageNumber,
        twoPlayer,
        customLevel,
        difficulty: settings.difficulty,
        onHudUpdate: setHud,
        onGameOver: () => onGameOver?.(),
        onStageClear: () => onStageClear?.(),
      });
      if (!mounted) {
        engine.destroy();
        return;
      }
      engineRef.current = engine;
      onEngineReady?.(engine);
      await engine.start();
    };

    init();

    return () => {
      mounted = false;
      engine?.destroy();
      engineRef.current = null;
    };
  }, [stageNumber, twoPlayer, customLevel, settings.difficulty, setHud, onGameOver, onStageClear, onEngineReady]);

  return (
    <div className="game-canvas-wrapper">
      <div ref={containerRef} className="game-canvas" />
    </div>
  );
}
