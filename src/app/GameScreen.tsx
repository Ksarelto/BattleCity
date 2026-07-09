import { useCallback, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { GameCanvas } from '@/components/GameCanvas';
import { GameHud } from '@/components/GameHud';
import { TouchControls, useTouchEnabled } from '@/components/TouchControls';
import { loadPlaytestLevel } from '@/app/EditorScreen';
import type { GameEngine } from '@/game/core/gameEngine';
import { useGameStore } from '@/store/gameStore';

export function GameScreen() {
  const [params] = useSearchParams();
  const twoPlayer = params.get('mode') === '2p';
  const playtest = params.get('playtest') === '1';
  const customLevel = playtest ? loadPlaytestLevel() ?? undefined : undefined;
  const [stage, setStage] = useState(1);
  const navigate = useNavigate();
  const addHighScore = useGameStore((s) => s.addHighScore);
  const touchEnabled = useTouchEnabled();
  const engineRef = useRef<GameEngine | null>(null);

  const handleStageClear = useCallback(() => {
    if (playtest) return;
    const engine = engineRef.current;
    if (!engine) return;
    const world = engine.getWorld();
    const nextStage = stage + 1;
    setTimeout(() => {
      engine.loadStage(nextStage, {
        score: world.score,
        lives: world.lives,
        extraLifeAwarded: world.extraLifeAwarded,
      });
      setStage(nextStage);
    }, 500);
  }, [stage, playtest]);

  const handleGameOver = useCallback(() => {
    const hud = useGameStore.getState().hud;
    addHighScore({ name: 'PLAYER', score: hud.score, stage: hud.stageNumber });
  }, [addHighScore]);

  const handleTouchInput = (direction: import('@/types/game').Direction | null, fire: boolean) => {
    engineRef.current?.getInput().setTouchInput(direction, fire);
  };

  return (
    <div className="screen game-screen">
      <GameHud />
      <div className="game-area">
        <GameCanvas
          stageNumber={stage}
          twoPlayer={twoPlayer}
          customLevel={customLevel}
          onEngineReady={(e) => { engineRef.current = e; }}
          onStageClear={handleStageClear}
          onGameOver={handleGameOver}
        />
      </div>
      {touchEnabled && <TouchControls onInput={handleTouchInput} />}
      <div className="game-controls">
        <Link to="/" className="menu-btn small">MENU</Link>
        <button type="button" className="menu-btn small" onClick={() => navigate(0)}>RESTART</button>
      </div>
    </div>
  );
}
