import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { EditorScreen } from './EditorScreen';
import * as playtestLevel from './utils/playtestLevel';

const navigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigate,
  };
});

function renderEditor() {
  return render(
    <MemoryRouter>
      <EditorScreen />
    </MemoryRouter>,
  );
}

describe('EditorScreen', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    sessionStorage.clear();
  });

  it('renders construction tools and actions', () => {
    renderEditor();

    expect(screen.getByRole('heading', { name: /construction/i })).toBeInTheDocument();
    expect(screen.getByRole('toolbar', { name: /tile palette/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^brick$/i })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /play test/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /back/i })).toHaveAttribute('href', '/');
  });

  it('selects a different tile from the palette', async () => {
    const user = userEvent.setup();
    renderEditor();

    await user.click(screen.getByRole('button', { name: /^steel$/i }));

    expect(screen.getByRole('button', { name: /^steel$/i })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: /^brick$/i })).toHaveAttribute('aria-pressed', 'false');
  });

  it('saves playtest level and navigates to the game', async () => {
    const user = userEvent.setup();
    const saveSpy = vi.spyOn(playtestLevel, 'savePlaytestLevel');
    renderEditor();

    await user.click(screen.getByRole('button', { name: /play test/i }));

    expect(saveSpy).toHaveBeenCalled();
    expect(navigate).toHaveBeenCalledWith('/game?playtest=1');
  });
});
