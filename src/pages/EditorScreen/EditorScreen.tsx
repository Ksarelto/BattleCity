import { useCallback, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { LevelData, TileId } from '@/models';
import { TileId as Tile } from '@/enums';
import { createBlankLevel, parseCustomLevel } from '@/services/level/LevelService';
import { MAX_CUSTOM_LEVELS, TILE_COLORS } from '@/utils/constants';
import { EDITOR_STORAGE_KEY, EDITOR_TILES } from './constants';
import { savePlaytestLevel } from './utils/playtestLevel';
import './EditorScreen.styles.css';

export function EditorScreen() {
  const [level, setLevel] = useState<LevelData>(createBlankLevel);
  const [selectedTile, setSelectedTile] = useState<TileId>(Tile.brick);
  const navigate = useNavigate();

  const paintCell = (row: number, col: number) => {
    setLevel((prev) => {
      const grid = prev.grid.map((r) => [...r]);
      grid[row]![col] = selectedTile;
      return { ...prev, grid };
    });
  };

  const saveLevel = () => {
    const stored = JSON.parse(localStorage.getItem(EDITOR_STORAGE_KEY) ?? '[]') as LevelData[];
    const idx = stored.findIndex((l) => l.name === level.name);
    if (idx >= 0) stored[idx] = level;
    else stored.push(level);
    localStorage.setItem(EDITOR_STORAGE_KEY, JSON.stringify(stored.slice(0, MAX_CUSTOM_LEVELS)));
    alert('Level saved!');
  };

  const exportLevel = () => {
    const blob = new Blob([JSON.stringify(level, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${level.name.replace(/\s+/g, '-').toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importLevel = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          setLevel(parseCustomLevel(reader.result as string));
        } catch (e) {
          alert(String(e));
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const playTest = useCallback(() => {
    savePlaytestLevel(level);
    navigate('/game?playtest=1');
  }, [level, navigate]);

  return (
    <div className="screen editor-screen">
      <h1>CONSTRUCTION</h1>
      <div className="editor-toolbar" role="toolbar" aria-label="Tile palette">
        {EDITOR_TILES.map((t) => (
          <button
            key={t}
            type="button"
            className={`tile-btn ${selectedTile === t ? 'active' : ''}`}
            style={{ backgroundColor: `#${TILE_COLORS[t].toString(16).padStart(6, '0')}` }}
            aria-pressed={selectedTile === t}
            onClick={() => setSelectedTile(t)}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="editor-grid" role="grid" aria-label="Level grid">
        {level.grid.map((row, r) =>
          row.map((tile, c) => (
            <button
              key={`${r}-${c}`}
              type="button"
              className="editor-cell"
              aria-label={`Cell ${r + 1}, ${c + 1}`}
              style={{
                backgroundColor: tile === 'empty' ? '#111' : `#${TILE_COLORS[tile].toString(16).padStart(6, '0')}`,
              }}
              onClick={() => paintCell(r, c)}
            />
          )),
        )}
      </div>
      <div className="editor-actions">
        <button type="button" className="menu-btn" onClick={saveLevel}>SAVE</button>
        <button type="button" className="menu-btn" onClick={exportLevel}>EXPORT</button>
        <button type="button" className="menu-btn" onClick={importLevel}>IMPORT</button>
        <button type="button" className="menu-btn" onClick={playTest}>PLAY TEST</button>
        <Link to="/" className="menu-btn">BACK</Link>
      </div>
    </div>
  );
}
