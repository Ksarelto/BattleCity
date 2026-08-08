# Sprite Sheet Layout

Placeholder art until licensed NES-style sprites are sourced.

## Atlas: `sprites.png` (256×256)

| Region | Size | Content |
|--------|------|---------|
| (0,0) | 16×16 | Player 1 tank (up) |
| (16,0) | 16×16 | Player 1 tank (right) |
| (32,0) | 16×16 | Player 1 tank (down) |
| (48,0) | 16×16 | Player 1 tank (left) |
| (0,16) | 16×16 | Player 2 tank (4 dirs) |
| (64,0) | 16×16 | Basic enemy (4 dirs) |
| (80,0) | 16×16 | Fast enemy |
| (96,0) | 16×16 | Power enemy |
| (112,0) | 16×16 | Armor enemy (4 color variants) |
| (0,32) | 8×8 | Bullet |
| (8,32) | 16×16 | Small explosion (4 frames) |
| (72,32) | 32×32 | Large explosion (4 frames) |
| (0,48) | 16×16 | Brick tile |
| (16,48) | 16×16 | Steel tile |
| (32,48) | 16×16 | Water tile (animated 2 frames) |
| (48,48) | 16×16 | Ice tile |
| (64,48) | 16×16 | Bush tile |
| (80,48) | 32×32 | Base eagle (intact) |
| (112,48) | 32×32 | Base eagle (destroyed) |
| (0,80) | 16×16 | Power-ups (6 types, 16×16 each) |
| (96,80) | 16×16 | Spawn flash effect |

## Phase 1 Placeholder

Use Pixi `Graphics` colored rectangles matching [tile-config.json](../data/tile-config.json) colors until atlas is drawn.

## Animation Frame Rates

| Animation | FPS |
|-----------|-----|
| Tank treads | 8 |
| Water | 4 |
| Explosion | 15 |
| Power-up blink | 4 |
| Shield flicker | 8 |

## Licensing

- Initial placeholders: procedurally generated, CC0
- Final art: must not copy Namco sprites directly; inspired pixel art only
