import { useState } from 'react';
import type { Direction } from '@/models';
import type { TouchControlsProps } from './types';
import './TouchControls.styles.css';

export function TouchControls({ onInput }: TouchControlsProps) {
  const [direction, setDirection] = useState<Direction | null>(null);

  const handleDir = (dir: Direction | null) => {
    setDirection(dir);
    onInput(dir, false);
  };

  return (
    <div className="touch-controls" aria-label="Touch controls">
      <div className="dpad" role="group" aria-label="D-pad">
        <button type="button" className="dpad-up" aria-label="Move up" onTouchStart={() => handleDir('up')} onTouchEnd={() => handleDir(null)} onMouseDown={() => handleDir('up')} onMouseUp={() => handleDir(null)}>▲</button>
        <button type="button" className="dpad-left" aria-label="Move left" onTouchStart={() => handleDir('left')} onTouchEnd={() => handleDir(null)} onMouseDown={() => handleDir('left')} onMouseUp={() => handleDir(null)}>◀</button>
        <button type="button" className="dpad-right" aria-label="Move right" onTouchStart={() => handleDir('right')} onTouchEnd={() => handleDir(null)} onMouseDown={() => handleDir('right')} onMouseUp={() => handleDir(null)}>▶</button>
        <button type="button" className="dpad-down" aria-label="Move down" onTouchStart={() => handleDir('down')} onTouchEnd={() => handleDir(null)} onMouseDown={() => handleDir('down')} onMouseUp={() => handleDir(null)}>▼</button>
      </div>
      <button
        type="button"
        className="fire-btn"
        aria-label="Fire"
        onTouchStart={() => onInput(direction, true)}
        onMouseDown={() => onInput(direction, true)}
      >
        FIRE
      </button>
    </div>
  );
}
