# Tiles and Collision

## Tile Types

See [tile-config.json](../data/tile-config.json).

| ID | Blocks Tank | Blocks Bullet | Destructible | Notes |
|----|-------------|---------------|--------------|-------|
| empty | No | No | No | Open ground |
| brick | Yes | No | Yes | 4 sub-quadrants, 1 hit each (tier 3: 2 per hit) |
| steel | Yes | Yes* | Yes* | *Only tier 3 bullets destroy (2 hits same side) |
| water | Yes | No | No | Bullets fly over |
| ice | No | No | No | Slide physics on tanks |
| bush | No | No | No | Overlay; hides tanks underneath |

## Layering

1. **Base layer**: empty, brick, steel, water, ice
2. **Overlay layer**: bush (rendered above tanks for concealment)
3. **Entities**: tanks, bullets, power-ups, base eagle

## Brick Sub-Quadrants

Each brick tile divided into 4 quadrants (2×2):

```
[ TL | TR ]
[ BL | BR ]
```

- Default bullet removes 1 quadrant
- Tier 3 bullet removes 2 quadrants on same side hit
- When all 4 quadrants destroyed, tile becomes empty

## Base Fortress

- Base occupies 2×2 tiles at bottom center (columns 5–6, rows 11–12)
- Surrounded by brick walls (configurable per level)
- Shovel power-up converts surrounding brick to steel temporarily

## Collision Detection Order

1. Tile boundary check (grid)
2. Entity AABB overlap (tank-tank)
3. Bullet vs tile (quadrant precision for brick)
4. Bullet vs entity
5. Bullet vs bullet

## Spawn Points (Default)

Top row, tile centers:
- Left: (0, 0)
- Center: (6, 0)
- Right: (12, 0)

Player spawn: bottom area (P1 col 3, P2 col 8, row 12)
