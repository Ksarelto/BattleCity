import { useState } from 'react';
import type { Direction } from '@/types/game';

interface TouchControlsProps {
  onInput: (direction: Direction | null, fire: boolean) => void;
}

export function TouchControls({ onInput }: TouchControlsProps) {
  const [direction, setDirection] = useState<Direction | null>(null);

  const handleDir = (dir: Direction | null) => {
    setDirection(dir);
    onInput(dir, false);
  };

  return (
    <div className="touch-controls">
      <div className="dpad">
        <button type="button" className="dpad-up" onTouchStart={() => handleDir('up')} onTouchEnd={() => handleDir(null)} onMouseDown={() => handleDir('up')} onMouseUp={() => handleDir(null)}>▲</button>
        <button type="button" className="dpad-left" onTouchStart={() => handleDir('left')} onTouchEnd={() => handleDir(null)} onMouseDown={() => handleDir('left')} onMouseUp={() => handleDir(null)}>◀</button>
        <button type="button" className="dpad-right" onTouchStart={() => handleDir('right')} onTouchEnd={() => handleDir(null)} onMouseDown={() => handleDir('right')} onMouseUp={() => handleDir(null)}>▶</button>
        <button type="button" className="dpad-down" onTouchStart={() => handleDir('down')} onTouchEnd={() => handleDir(null)} onMouseDown={() => handleDir('down')} onMouseUp={() => handleDir(null)}>▼</button>
      </div>
      <button
        type="button"
        className="fire-btn"
        onTouchStart={() => onInput(direction, true)}
        onMouseDown={() => onInput(direction, true)}
      >
        FIRE
      </button>
    </div>
  );
}
