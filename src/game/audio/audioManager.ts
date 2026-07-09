type SoundId = 'shoot' | 'explosion' | 'powerup' | 'stageClear' | 'gameOver';

export class AudioManager {
  private muted = false;
  private volume = 0.5;
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext {
    if (!this.ctx) {
      this.ctx = new AudioContext();
    }
    return this.ctx;
  }

  setMuted(m: boolean): void {
    this.muted = m;
  }

  setVolume(v: number): void {
    this.volume = Math.max(0, Math.min(1, v));
  }

  play(id: SoundId): void {
    if (this.muted) return;
    try {
      const ctx = this.getContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      gain.gain.value = this.volume * 0.1;

      const freqs: Record<SoundId, number> = {
        shoot: 880,
        explosion: 110,
        powerup: 660,
        stageClear: 523,
        gameOver: 220,
      };
      osc.frequency.value = freqs[id];
      osc.type = id === 'explosion' ? 'sawtooth' : 'square';
      osc.start();
      osc.stop(ctx.currentTime + (id === 'explosion' ? 0.15 : 0.08));
    } catch {
      // Audio not available
    }
  }

  destroy(): void {
    this.ctx?.close();
    this.ctx = null;
  }
}
