import { useGameStore } from '@/store/gameStore';

export function GameHud() {
  const hud = useGameStore((s) => s.hud);

  return (
    <div className="game-hud">
      <div className="hud-row">
        <span>P1 ★{hud.starLevels[0]}</span>
        <span>STAGE {hud.stageNumber}</span>
        <span>SCORE {hud.score}</span>
      </div>
      <div className="hud-row">
        <span>LIVES {'♥'.repeat(Math.max(0, hud.lives))}</span>
        <span>ENEMIES {hud.enemiesRemaining}</span>
        {hud.playerKills[1] > 0 || hud.effects.length > 0 ? (
          <span>P2 ★{hud.starLevels[1]} K{hud.playerKills[1]}</span>
        ) : null}
      </div>
      {hud.phase === 'stageClear' && <div className="hud-banner">STAGE CLEAR!</div>}
      {hud.phase === 'gameOver' && <div className="hud-banner game-over">GAME OVER</div>}
      {hud.phase === 'countdown' && <div className="hud-banner">GET READY!</div>}
    </div>
  );
}
