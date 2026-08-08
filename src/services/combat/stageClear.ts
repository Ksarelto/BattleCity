import type { GameWorld } from '@/models';
import { GamePhase } from '@/enums';
import {
  COOP_KILL_BONUS,
  STAGE_CLEAR_BONUS,
  STAGE_CLEAR_FRAMES,
} from '@/utils/constants';
import { queueSfx } from '@/services/audio/sfxQueue';

export function checkStageClear(world: GameWorld): void {
  if (world.enemyQueue.length === 0 && world.enemies.length === 0) {
    world.phase = GamePhase.stageClear;
    world.stageClearTimer = STAGE_CLEAR_FRAMES;
    world.score += STAGE_CLEAR_BONUS;
    queueSfx('stageClear');

    if (world.twoPlayer) {
      const [k1, k2] = world.playerKills;
      if (k1 > k2) world.score += COOP_KILL_BONUS;
      else if (k2 > k1) world.score += COOP_KILL_BONUS;
    }
  }
}
