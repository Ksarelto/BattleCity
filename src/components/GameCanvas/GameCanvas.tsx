import { useEffect, useRef } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { GameEngine } from '@/services/engine/GameEngine';
import { useGameStore } from '@/store/gameStore';
import type { GameCanvasProps } from './types';
import './GameCanvas.styles.css';

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
  const { difficulty, sfxVolume, muted } = useGameStore(
    useShallow((s) => ({
      difficulty: s.settings.difficulty,
      sfxVolume: s.settings.sfxVolume,
      muted: s.settings.muted,
    })),
  );

  const sessionRef = useRef({ stageNumber, twoPlayer, customLevel, difficulty, sfxVolume, muted });

  const onGameOverRef = useRef(onGameOver);
  const onStageClearRef = useRef(onStageClear);
  const onEngineReadyRef = useRef(onEngineReady);
  onGameOverRef.current = onGameOver;
  onStageClearRef.current = onStageClear;
  onEngineReadyRef.current = onEngineReady;

  // Single mount per session — StrictMode-safe cleanup via `active` + destroy().
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const session = sessionRef.current;
    let active = true;
    let engine: GameEngine | null = null;

    const start = async () => {
      try {
        const instance = new GameEngine({
          container,
          stageNumber: session.stageNumber,
          twoPlayer: session.twoPlayer,
          customLevel: session.customLevel,
          difficulty: session.difficulty,
          sfxVolume: session.sfxVolume,
          muted: session.muted,
          onHudUpdate: setHud,
          onGameOver: () => onGameOverRef.current?.(),
          onStageClear: () => onStageClearRef.current?.(),
        });
        engine = instance;

        if (!active) {
          instance.destroy();
          return;
        }

        await instance.start();

        if (!active) {
          instance.destroy();
          return;
        }

        engineRef.current = instance;
        onEngineReadyRef.current?.(instance);
      } catch (error) {
        console.error('Failed to start Battle City engine:', error);
      }
    };

    void start();

    return () => {
      active = false;
      const instance = engineRef.current ?? engine;
      engineRef.current = null;
      engine = null;
      instance?.destroy();
    };
  }, [setHud]);

  useEffect(() => {
    engineRef.current?.applyAudioSettings(sfxVolume, muted);
  }, [sfxVolume, muted]);

  return (
    <div className="game-canvas-wrapper">
      <div ref={containerRef} className="game-canvas" role="img" aria-label="Battle City game canvas" />
    </div>
  );
}
