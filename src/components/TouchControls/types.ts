import type { Direction } from '@/models';

export interface TouchControlsProps {
  onInput: (direction: Direction | null, fire: boolean) => void;
}
