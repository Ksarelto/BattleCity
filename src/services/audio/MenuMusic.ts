import { Howl } from 'howler';
import { DEFAULT_MENU_MUSIC_VOLUME } from '@/utils/constants';

/**
 * Menu music manager.
 * Prefer a user-provided Helldivers 2 (or other) track at /audio/menu.mp3.
 * Falls back to the bundled procedural loop if that file is missing.
 */
class MenuMusicController {
  private howl: Howl | null = null;
  private started = false;

  private ensure(): Howl {
    if (!this.howl) {
      this.howl = new Howl({
        src: ['/audio/menu.mp3', '/audio/menu.ogg', '/audio/menu-fallback.wav'],
        loop: true,
        volume: DEFAULT_MENU_MUSIC_VOLUME,
        html5: true,
        preload: true,
      });
    }
    return this.howl;
  }

  start(volume = DEFAULT_MENU_MUSIC_VOLUME, muted = false): void {
    if (muted) {
      this.stop();
      return;
    }
    const sound = this.ensure();
    sound.volume(volume);
    if (!this.started) {
      sound.play();
      // Browsers may block autoplay until a gesture — retry via Howler's unlock.
      sound.once('playerror', () => {
        sound.once('unlock', () => {
          sound.play();
        });
      });
      this.started = true;
    } else if (!sound.playing()) {
      sound.play();
    }
  }

  setVolume(volume: number): void {
    this.howl?.volume(Math.max(0, Math.min(1, volume)));
  }

  stop(): void {
    if (!this.howl) return;
    this.howl.stop();
    this.started = false;
  }

  destroy(): void {
    this.stop();
    this.howl?.unload();
    this.howl = null;
  }
}

export const menuMusic = new MenuMusicController();
