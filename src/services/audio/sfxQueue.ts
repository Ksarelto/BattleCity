import type { SfxId } from '@/services/audio/AudioService';

const queue: SfxId[] = [];

export function queueSfx(id: SfxId): void {
  queue.push(id);
}

export function drainSfxQueue(): SfxId[] {
  if (queue.length === 0) return [];
  return queue.splice(0, queue.length);
}
