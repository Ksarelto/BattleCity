# Existing Repository Analysis

## Branch: `origin/BattleCity`

Vanilla JavaScript implementation (2021) — reference only, not target architecture.

## Comparison

| Feature | origin/BattleCity | Target (this project) |
|---------|-------------------|----------------------|
| Language | JavaScript | TypeScript |
| Framework | None (DOM) | React + PixiJS |
| Grid | 40×27 @ 20px | 13×13 @ 16px (NES) |
| Tile types | 4 (empty, brick, rock, water) | 6 (+ steel, ice, bush) |
| Enemy types | 3 (light, middle, heavy) | 4 (basic, fast, power, armor) |
| Power-ups | None | All 6 |
| Stages | 1 hardcoded map | 35 JSON levels |
| 2P co-op | No | Yes |
| Level editor | No | Yes |
| Spawn system | 6 positions, unlimited | 3 positions, max 4 active, queue of 20 |
| Brick damage | Whole tile | Sub-quadrant |
| Star tiers | No | 0–3 |
| Audio | MP3 + vibration | Howler.js |
| High scores | Remote AJAX server | localStorage |

## Reusable Ideas from Old Branch

- Touch joystick pattern for mobile
- Hash-based SPA routing concept (adapt to React Router)
- Sprite sheet approach (adapt to Pixi textures)
- Game loop via requestAnimationFrame (adapt to Pixi ticker)

## Do Not Port

- Global mutable variables across files
- Non-NES grid dimensions
- Simplified enemy AI without spawn queue
- jQuery dependency for scores
