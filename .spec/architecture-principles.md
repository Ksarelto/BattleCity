# Architecture Principles

## 1. Separation of Simulation and Presentation

- `GameWorld`: mutable state + pure system functions
- `GameRenderer`: reads world snapshot, updates Pixi display objects
- No Pixi imports in systems/ or entities/

## 2. Fixed-Timestep Simulation

- Logic: 60 updates/second (`FIXED_DT = 1/60`)
- Render: interpolate between previous and current state for smooth visuals
- Enables deterministic unit tests

## 3. Grid-First Collision

- All spatial queries start from tile coordinates
- Brick damage at sub-tile quadrant granularity
- Entity hitboxes: 14×14 px centered in 16×16 tile

## 4. Systems Over Inheritance

```
systems/
  movementSystem.ts
  bulletSystem.ts
  collisionSystem.ts
  spawnSystem.ts
  aiSystem.ts
  powerUpSystem.ts
  tileDamageSystem.ts
```

Each system: `(world: GameWorld, dt: number) => void`

## 5. Data-Driven Levels

- Level layouts in `src/assets/levels/*.json`
- Config tables in `.spec/data/*.json` mirrored in `src/game/core/constants.ts`
- No magic numbers in system code

## 6. Immutable Specs, Mutable Runtime

- `.spec/` documents are source of truth for game rules
- Code constants reference spec values
- Changes to rules require spec update first

## 7. No React in the Game Loop

- React: routing, menus, HUD overlays, settings
- Zustand store updated at most 10 Hz from game events
- Pixi ticker drives simulation; React never re-renders per frame

## 8. Progressive Fidelity

- Each phase delivers playable build
- Feature flags for incomplete systems during development

## 9. Test the Rules, Not the Renderer

- Vitest for: collision, damage, spawn indices, power-up effects, scoring
- Manual QA checklist for feel/timing

## React ↔ Pixi Boundary

```tsx
// GameCanvas.tsx — sole integration point
useEffect(() => {
  const game = new GameEngine(containerRef.current);
  game.start();
  return () => game.destroy();
}, []);
```

- Single mount point per game session
- Guard against React StrictMode double-mount
- Canvas fills container; CSS handles integer scaling

## Event Flow

```
Input → GameEngine.tick → Systems → GameWorld
                    ↓
              EventBus.emit('hud:update', snapshot)
                    ↓
              Zustand (throttled) → React HUD
```
