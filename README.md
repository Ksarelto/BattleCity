# Battle City

NES-faithful **Battle City** tank game built with **React 19**, **TypeScript**, and **Canvas 2D** sprites.

## Features

- 13×13 tile grid with brick, steel, water, ice, and bush tiles
- 4 enemy tank types with spawn queue (20 per stage, max 4 active)
- 6 power-ups: grenade, helmet, shovel, star, tank, timer
- Player star tiers 0–3
- 35 procedurally generated stages with progressive difficulty
- 2-player co-op with friendly fire stun
- Construction mode level editor with save/export/import
- Touch controls for mobile
- High scores (localStorage)

## Quick Start

**Windows (local project folder):**

```powershell
cd D:\Projects\Battle_City_React
npm install
npm run dev
```

**Linux / macOS / Cloud VM (`/workspace`):**

```bash
npm install
npm run dev
```

Open http://localhost:5173

See [LOCAL_SETUP.md](LOCAL_SETUP.md) if you need to clone or merge into `D:\Projects\Battle_City_React`.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run test` | Run Vitest unit tests |
| `npm run preview` | Preview production build |

## Controls

### Player 1
- Move: Arrow keys / WASD
- Fire: Space / Z
- Pause: Escape

### Player 2
- Move: I/J/K/L
- Fire: Enter / H

## Project Structure

```
src/
  app/           # React screens
  components/    # GameCanvas, HUD, touch controls
  game/          # Engine, systems, rendering
  store/         # Zustand state
.spec/           # Game design specs & research
```

## Specifications

Full game design documentation lives in [`.spec/`](.spec/README.md).

## Tech Stack

- Vite + React + TypeScript
- Canvas 2D + sprite sheets (rendering)
- Zustand (UI state)
- Vitest (tests)

## License

MIT — Placeholder graphics are original. Battle City is a trademark of Bandai Namco.
