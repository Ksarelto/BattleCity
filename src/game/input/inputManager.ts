import type { Direction } from '@/types/game';

const keysDown = new Set<string>();

const P1_KEYS: Record<string, Direction | 'fire'> = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
  w: 'up',
  W: 'up',
  s: 'down',
  S: 'down',
  a: 'left',
  A: 'left',
  d: 'right',
  D: 'right',
  ' ': 'fire',
  z: 'fire',
  Z: 'fire',
};

const P2_KEYS: Record<string, Direction | 'fire'> = {
  i: 'up',
  I: 'up',
  k: 'down',
  K: 'down',
  j: 'left',
  J: 'left',
  l: 'right',
  L: 'right',
  Enter: 'fire',
  h: 'fire',
  H: 'fire',
};

export class InputManager {
  private enabled = true;
  private touchP1: { direction: Direction | null; fire: boolean } = { direction: null, fire: false };

  constructor() {
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
  }

  destroy(): void {
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
  }

  setEnabled(v: boolean): void {
    this.enabled = v;
  }

  setTouchInput(direction: Direction | null, fire: boolean): void {
    this.touchP1 = { direction, fire };
  }

  private onKeyDown = (e: KeyboardEvent): void => {
    if (!this.enabled) return;
    keysDown.add(e.key);
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
      e.preventDefault();
    }
  };

  private onKeyUp = (e: KeyboardEvent): void => {
    keysDown.delete(e.key);
  };

  isPausePressed(): boolean {
    return keysDown.has('Escape') || keysDown.has('p') || keysDown.has('P');
  }

  getPlayerInput(player: 1 | 2): { direction: Direction | null; fire: boolean } {
    const map = player === 1 ? P1_KEYS : P2_KEYS;
    let direction: Direction | null = null;
    let fire = false;

    for (const [key, action] of Object.entries(map)) {
      if (!keysDown.has(key)) continue;
      if (action === 'fire') fire = true;
      else direction = action;
    }

    if (player === 1 && this.touchP1.direction) {
      direction = this.touchP1.direction;
      fire = fire || this.touchP1.fire;
    }

    return { direction, fire };
  }
}

export function consumePauseKey(): boolean {
  const pause = keysDown.has('Escape') || keysDown.has('p') || keysDown.has('P');
  if (pause) {
    keysDown.delete('Escape');
    keysDown.delete('p');
    keysDown.delete('P');
  }
  return pause;
}
