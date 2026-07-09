# Tech Stack

## Core

| Package | Version | Purpose |
|---------|---------|---------|
| vite | ^6.x | Build tool |
| react | ^19.x | UI framework |
| react-router-dom | ^7.x | Client routing |
| typescript | ^5.x | Type safety |
| pixi.js | ^8.x | 2D WebGL rendering |

## State & Audio

| Package | Purpose |
|---------|---------|
| zustand | UI/meta game state |
| howler | SFX and music |

## Dev Tools

| Package | Purpose |
|---------|---------|
| vitest | Unit tests |
| @testing-library/react | Component tests |
| eslint | Linting |
| prettier | Formatting |

## Rationale

### Why PixiJS over Phaser?

- Battle City needs rendering + custom grid logic, not full physics
- PixiJS is lighter (~150KB vs ~400KB)
- TypeScript-native since v7/v8
- React integration is simpler (canvas in ref)

### Why not Matter.js?

- Tank movement is grid-aligned AABB, not rigid body
- Deterministic tile collision is simpler and more faithful to NES

### Why Zustand?

- Minimal boilerplate for HUD state
- No re-render of game canvas on update
- Easy persist middleware for settings

## Alternatives (Documented)

| Alternative | When to Consider |
|-------------|------------------|
| Phaser 3 | If adding many scene transitions/effects |
| Excalibur.js | If team prefers TS game engine |
| Canvas 2D only | If bundle size critical |
| Tiled editor | If level authoring scales beyond 35 |

## Path Aliases

```json
{
  "@/*": ["src/*"]
}
```
