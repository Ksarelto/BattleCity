import { Link } from 'react-router-dom';
import { useGameStore } from '@/store/gameStore';

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
            onChange={(e) => updateSettings({ difficulty: e.target.value as 'easy' | 'normal' })}
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
            onChange={(e) => updateSettings({ sfxVolume: parseFloat(e.target.value) })}
          />
        </label>
        <label>
          <input
            type="checkbox"
            checked={settings.muted}
            onChange={(e) => updateSettings({ muted: e.target.checked })}
          />
          Mute
        </label>
      </div>
      <Link to="/" className="menu-btn">BACK</Link>
    </div>
  );
}
