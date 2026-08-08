import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { SettingsScreen } from './SettingsScreen';
import { useGameStore } from '@/store/gameStore';

vi.mock('@/services/audio/MenuMusic', () => ({
  menuMusic: {
    start: vi.fn(),
    stop: vi.fn(),
    setVolume: vi.fn(),
  },
}));

function renderSettings() {
  return render(
    <MemoryRouter>
      <SettingsScreen />
    </MemoryRouter>,
  );
}

describe('SettingsScreen', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useGameStore.setState({
      settings: {
        difficulty: 'normal',
        sfxVolume: 0.7,
        musicVolume: 0.5,
        muted: false,
      },
    });
  });

  it('renders options controls and back link', () => {
    renderSettings();

    expect(screen.getByRole('heading', { name: /options/i })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /difficulty/i })).toHaveValue('normal');
    expect(screen.getByRole('slider', { name: /sfx volume/i })).toBeInTheDocument();
    expect(screen.getByRole('slider', { name: /music volume/i })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: /mute/i })).not.toBeChecked();
    expect(screen.getByRole('link', { name: /back/i })).toHaveAttribute('href', '/');
  });

  it('updates difficulty when the select changes', async () => {
    const user = userEvent.setup();
    renderSettings();

    await user.selectOptions(screen.getByRole('combobox', { name: /difficulty/i }), 'easy');

    expect(useGameStore.getState().settings.difficulty).toBe('easy');
  });

  it('mutes music when mute is checked', async () => {
    const user = userEvent.setup();
    const { menuMusic } = await import('@/services/audio/MenuMusic');
    renderSettings();

    await user.click(screen.getByRole('checkbox', { name: /mute/i }));

    expect(useGameStore.getState().settings.muted).toBe(true);
    expect(menuMusic.stop).toHaveBeenCalled();
  });
});
