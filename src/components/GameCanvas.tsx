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
  const difficulty = useGameStore((s) => s.settings.difficulty);

  const onGameOverRef = useRef(onGameOver);
  const onStageClearRef = useRef(onStageClear);
  const onEngineReadyRef = useRef(onEngineReady);
  onGameOverRef.current = onGameOver;
  onStageClearRef.current = onStageClear;
  onEngineReadyRef.current = onEngineReady;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let active = true;
    let engine: GameEngine | null = null;

    const start = async () => {
      try {
        engine = new GameEngine({
          container,
          stageNumber,
          twoPlayer,
          customLevel,
          difficulty,
          onHudUpdate: setHud,
          onGameOver: () => onGameOverRef.current?.(),
          onStageClear: () => onStageClearRef.current?.(),
        });

        if (!active) {
          engine.destroy();
          return;
        }

        await engine.start();

        if (!active) {
          engine.destroy();
          return;
        }

        engineRef.current = engine;
        onEngineReadyRef.current?.(engine);
      } catch (error) {
        console.error('Failed to start Battle City engine:', error);
      }
    };

    void start();

    return () => {
      active = false;
      engineRef.current?.destroy();
      engineRef.current = null;
      engine?.destroy();
      engine = null;
    };
  }, [stageNumber, twoPlayer, customLevel, difficulty, setHud]);

  return (
    <div className="game-canvas-wrapper">
      <div ref={containerRef} className="game-canvas" />
    </div>
  );
}
