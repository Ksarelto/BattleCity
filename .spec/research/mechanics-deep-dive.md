# Mechanics Deep Dive

## Grid & Coordinates

- Playfield: **35 columns × 20 rows** of tiles
- Tile size: **40×40 pixels** → native resolution **1400×800** (matches CSS canvas; tank art draws 1:1)
- Display: integer-scaled on larger screens
- Tank occupies roughly one tile (40×40 draw; 36×36 hitbox centered)
- Sub-tile positions use floats for smooth movement; collision snaps to grid edges

## Movement

- 4 cardinal directions only (no diagonals)
- Tank rotates instantly to face movement direction
- Player default speed: **5** px/frame at 60 Hz (see `src/utils/constants.ts`; ≈2× classic NES for 40px tiles)
- Enemies vary by type (see enemy-config.json / `ENEMY_CONFIG`)
- Tanks cannot pass: brick, steel, water, other tanks (same cell)
- Tanks can pass: empty, ice, bush (underneath)

## Ice Sliding

- On ice tiles, releasing movement input causes tank to slide ~1 tile forward before stopping
- Turning while sliding is allowed
- Bullets are harder to see on ice (visual only)

## Bullets

- Travel in tank's facing direction at fixed speed (player **8** px/frame; enemies per `ENEMY_CONFIG`)
- Max active bullets per tank depends on star level (1 default, 2 at tier 2+)
- Cannot fire again until bullet hits something or leaves playfield
- Bullets cancel each other on contact (both destroyed)
- Bullets pass over water; destroy/affect walls on impact
- Bullets cannot pass steel (unless max tier destroys it)

## Player Spawn Invincibility

- ~3 seconds force field at stage start (same effect as Helmet power-up visually)
- Brief invincibility after respawn following death

## Friendly Fire (2P)

- Player bullet hitting ally tank: ally **cannot move** for ~2 seconds
- Ally can still turn and fire while stunned
- No damage to ally

## Win / Lose Conditions

| Condition | Result |
|-----------|--------|
| 20 enemies destroyed | Stage clear |
| Base hit by any bullet | Immediate game over |
| Player lives = 0 | Game over |
| Player destroys own base | Game over (friendly fire on base) |

## Flashing Tank Rules

- Tanks at spawn indices **4, 11, 18** (1-based) are flashing
- Destroying flashing tank spawns random power-up at one of 16 predefined tile positions
- Previous power-up on field is removed when next flashing tank spawns
- Hitting (not destroying) armor flashing tank still triggers drop on full destroy

## Timing Reference (60 Hz frames)

| Event | Duration |
|-------|----------|
| Spawn invincibility | ~180 frames (3s) |
| Helmet shield | ~600 frames (10s) |
| Timer freeze | ~600 frames (10s) |
| Shovel fort | ~600 frames (10s) |
| Power-up blink timeout | until next flashing spawn |
| Explosion small | 30 frames |
| Explosion large | 60 frames |
| Friendly fire stun | 120 frames (2s) |
