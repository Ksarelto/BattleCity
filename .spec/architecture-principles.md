# Architecture Principles

## 1. Separation of Simulation and Presentation

- `GameWorld`: mutable state mutated by services
- `RenderService`: Canvas 2D reads world state and draws sprites
- No renderer imports in combat/movement/spawn services

## 2. Fixed-Timestep Simulation

- Logic: 60 updates/second (`FIXED_DT = 1/60`)
- Render: variable frame rate via `requestAnimationFrame`
- Enables deterministic unit tests

## 3. Grid-First Collision

- All spatial queries start from tile coordinates
- Brick damage at sub-tile quadrant granularity
- Entity hitboxes: 28×28 px centered in 32×32 tile

## 4. Services Over Inheritance

```
src/
  enums/       # TileId, Direction, GamePhase, …
  models/      # GameWorld, entities, LevelData
  utils/       # constants, collision, rng, helpers
  services/    # engine, movement, bullet, combat, spawn, …
```

Tick services: `(world: GameWorld, …) => void`

## 5. Data-Driven Config

- Stage rosters: `.spec/data/stage-roster.json` (imported by `LevelService`)
- **Runtime tunables:** `src/utils/constants.ts` is the source of truth for speeds, timers, and spawn coords on the 40px / 35×20 field
- Spec JSON under `.spec/data/` (enemy-config, power-up-config, …) mirrors those constants for documentation; do not load them at runtime unless a future pass wires that up
- Levels: procedural generation (custom levels via editor / localStorage)

## 6. Immutable Specs, Mutable Runtime

- `.spec/` documents game rules
- Spec values should stay in sync with `constants.ts` for the current field scale
- Prefer updating `constants.ts` first for gameplay, then mirror into `.spec/data/`

## 7. No React in the Game Loop

- React: routing, menus, HUD overlays, settings
- Zustand store updated at most ~10 Hz via `onHudUpdate` callback
- `GameEngine` RAF loop drives simulation; React never re-renders per frame

## 8. Progressive Fidelity

- Each phase delivers a playable build

## 9. Test the Rules, Not the Renderer

- Vitest for: collision, damage, spawn indices, power-up effects, scoring, stage carry-over
- Manual QA for feel/timing

## React ↔ Engine Boundary

```tsx
// GameCanvas.tsx — sole integration point
useEffect(() => {
  const engine = new GameEngine({ container, … });
  engine.start();
  return () => engine.destroy();
}, [setHud]); // single mount per session — not stageNumber
```

- Single mount point per game session
- Stage advance via `engine.loadStage()` only
- Guard against React StrictMode double-mount

## Event Flow

```
Input → GameEngine.tick → Services → GameWorld
                    ↓
              onHudUpdate(snapshot) → Zustand → React HUD
```
