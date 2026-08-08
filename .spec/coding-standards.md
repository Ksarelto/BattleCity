# Coding Standards

## TypeScript

- `strict: true` in tsconfig
- Prefer `interface` for data shapes, `type` for unions
- No `any`; use `unknown` + narrowing
- Explicit return types on exported functions

## Naming

| Kind | Convention | Example |
|------|------------|---------|
| Files | camelCase | `bulletSystem.ts` |
| React components | PascalCase | `GameCanvas.tsx` |
| Constants | SCREAMING_SNAKE | `TILE_SIZE` |
| Enums | PascalCase | `TileId.Brick` |
| Game systems | verb + System | `movementSystem` |

## File Size

- Target < 200 lines per file
- Split systems if exceeding 300 lines

## Imports

- Absolute imports via `@/` alias
- Order: external → internal → types → styles

## Game Code Rules

- Systems must be pure functions of `(world, dt)` — no side effects outside world mutation
- No `Date.now()` in simulation — use `world.tick` counter
- Randomness via injectable `Rng` for testability

## React Rules

- GameCanvas is only component that touches Pixi
- HUD components subscribe to Zustand, not game engine directly
- Memoize static menu components

## Testing

- Every rule in `.spec/data/*.json` has at least one Vitest case
- Test files mirror source: `bulletSystem.test.ts`
- Use fixed RNG seed in tests

## Git Commits

- Conventional commits: `feat:`, `fix:`, `spec:`, `test:`
- One logical change per commit
