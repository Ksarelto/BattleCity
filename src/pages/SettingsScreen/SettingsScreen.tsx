import { Link } from 'react-router-dom';
import type { Difficulty } from '@/models';
import { menuMusic } from '@/services/audio/MenuMusic';
import { useGameStore } from '@/store/gameStore';
import './SettingsScreen.styles.css';

export function SettingsScreen() {
  const settings = useGameStore((s) => s.settings);
  const updateSettings = useGameStore((s) => s.updateSettings);

  return (
    <div className="screen menu-screen">
      <h1>OPTIONS</h1>
      <div className="settings-form">
        <label>
          Difficulty
          <select
            value={settings.difficulty}
            onChange={(e) => updateSettings({ difficulty: e.target.value as Difficulty })}
          >
            <option value="easy">Easy</option>
            <option value="normal">Normal</option>
          </select>
        </label>
        <label>
          SFX Volume
          <input
            type="range"
            min={0}
            max={1}
            step={0.1}
            value={settings.sfxVolume}
            aria-label="SFX Volume"
            onChange={(e) => updateSettings({ sfxVolume: parseFloat(e.target.value) })}
          />
        </label>
        <label>
          Music Volume
          <input
            type="range"
            min={0}
            max={1}
            step={0.1}
            value={settings.musicVolume}
            aria-label="Music Volume"
            onChange={(e) => {
              const musicVolume = parseFloat(e.target.value);
              updateSettings({ musicVolume });
              menuMusic.setVolume(musicVolume);
            }}
          />
        </label>
        <label>
          <input
            type="checkbox"
            checked={settings.muted}
            aria-label="Mute"
            onChange={(e) => {
              const muted = e.target.checked;
              updateSettings({ muted });
              if (muted) menuMusic.stop();
              else menuMusic.start(settings.musicVolume, false);
            }}
          />
          Mute
        </label>
      </div>
      <Link to="/" className="menu-btn">BACK</Link>
    </div>
  );
}
