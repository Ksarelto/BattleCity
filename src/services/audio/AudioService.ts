import { Howl, Howler } from 'howler';
import { DEFAULT_SFX_VOLUME, ENGINE_VOLUME_FACTOR } from '@/utils/constants';

export type SfxId =
  | 'shoot'
  | 'hit'
  | 'explosion'
  | 'stageStart'
  | 'powerup'
  | 'stageClear'
  | 'gameOver';

const SFX_SRC: Record<SfxId, string[]> = {
  shoot: ['/audio/shoot.wav'],
  hit: ['/audio/hit.wav'],
  explosion: ['/audio/explosion.wav'],
  stageStart: ['/audio/stage-start.wav'],
  powerup: ['/audio/hit.wav'],
  stageClear: ['/audio/stage-start.wav'],
  gameOver: ['/audio/explosion.wav'],
};

export class AudioService {
  private muted = false;
  private volume = DEFAULT_SFX_VOLUME;
  private sounds = new Map<SfxId, Howl>();
  private engine: Howl | null = null;
  private enginePlaying = false;

  constructor() {
    for (const [id, src] of Object.entries(SFX_SRC) as Array<[SfxId, string[]]>) {
      this.sounds.set(
        id,
        new Howl({
          src,
          volume: this.volume,
          preload: true,
        }),
      );
    }

    this.engine = new Howl({
      src: ['/audio/engine.wav'],
      loop: true,
      volume: this.volume * ENGINE_VOLUME_FACTOR,
      preload: true,
    });
  }

  setMuted(m: boolean): void {
    this.muted = m;
    Howler.mute(m);
    if (m) this.stopEngine();
  }

  setVolume(v: number): void {
    this.volume = Math.max(0, Math.min(1, v));
    for (const sound of this.sounds.values()) {
      sound.volume(this.volume);
    }
    this.engine?.volume(this.volume * ENGINE_VOLUME_FACTOR);
  }

  play(id: SfxId): void {
    if (this.muted) return;
    const sound = this.sounds.get(id);
    if (!sound) return;
    sound.volume(this.volume);
    sound.play();
  }

  setEngineActive(active: boolean): void {
    if (this.muted || !this.engine) {
      this.stopEngine();
      return;
    }
    if (active && !this.enginePlaying) {
      this.engine.volume(this.volume * ENGINE_VOLUME_FACTOR);
      this.engine.play();
      this.enginePlaying = true;
    } else if (!active && this.enginePlaying) {
      this.stopEngine();
    }
  }

  private stopEngine(): void {
    this.engine?.stop();
    this.enginePlaying = false;
  }

  destroy(): void {
    this.stopEngine();
    for (const sound of this.sounds.values()) {
      sound.unload();
    }
    this.sounds.clear();
    this.engine?.unload();
    this.engine = null;
  }
}
