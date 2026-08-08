import { useCallback, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { GameCanvas } from '@/components/GameCanvas';
import { GameHud } from '@/components/GameHud';
import { TouchControls } from '@/components/TouchControls';
import type { Direction } from '@/models';
import { loadPlaytestLevel } from '@/pages/EditorScreen';
import type { GameEngine } from '@/services/engine/GameEngine';
import { menuMusic } from '@/services/audio/MenuMusic';
import { useGameStore } from '@/store/gameStore';
import { useTouchEnabled } from './utils/useTouchEnabled';
import './GameScreen.styles.css';

export function GameScreen() {
  const [params] = useSearchParams();
  const twoPlayer = params.get('mode') === '2p';
  const playtest = params.get('playtest') === '1';
  const customLevel = playtest ? loadPlaytestLevel() ?? undefined : undefined;
  const navigate = useNavigate();
  const addHighScore = useGameStore((s) => s.addHighScore);
  const touchEnabled = useTouchEnabled();
  const engineRef = useRef<GameEngine | null>(null);

  useEffect(() => {
    menuMusic.stop();
  }, []);

  const handleStageClear = useCallback(() => {
    if (playtest) return;
    const engine = engineRef.current;
    if (!engine) return;
    const world = engine.getWorld();
    const nextStage = world.stageNumber + 1;
    setTimeout(() => {
      engine.loadStage(nextStage, {
        score: world.score,
        lives: world.lives,
        extraLifeAwarded: world.extraLifeAwarded,
      });
    }, 500);
  }, [playtest]);

  const handleGameOver = useCallback(() => {
    const hud = useGameStore.getState().hud;
    addHighScore({ name: 'PLAYER', score: hud.score, stage: hud.stageNumber });
  }, [addHighScore]);

  const handleTouchInput = (direction: Direction | null, fire: boolean) => {
    engineRef.current?.getInput().setTouchInput(direction, fire);
  };

  return (
    <div className="screen game-screen">
      <GameHud />
      <div className="game-area">
        <GameCanvas
          stageNumber={1}
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
