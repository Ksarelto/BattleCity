# Power-Ups

## Drop Rules

1. Destroy a **flashing tank** (spawn #4, #11, #18)
2. Power-up appears at random position from 16 predefined grid cells
3. Collect by driving over it (+500 points)
4. Despawn when next flashing tank enters the field
5. If armor flashing tank hit but not destroyed, no drop until destroyed

## Power-Up Types

See [power-up-config.json](../data/power-up-config.json).

| ID | Name | Effect |
|----|------|--------|
| grenade | Grenade | Destroy all on-screen enemies instantly; **no points** for those kills in stage bonus |
| helmet | Helmet | Invincibility ~10 seconds |
| shovel | Shovel | Base walls become steel + repair damage ~10 seconds |
| star | Star | Increase offensive tier by 1 (max 3) |
| tank | Tank | +1 life |
| timer | Timer | Freeze all enemy movement ~10 seconds |

## Star Tiers (Player Offensive Level)

| Tier | Stars | Bullet Speed | Max Bullets | Brick Damage | Steel Damage |
|------|-------|--------------|-------------|--------------|--------------|
| 0 | 0 | Slow | 1 | 1 quadrant/hit | None |
| 1 | 1 | Fast | 1 | 1 quadrant/hit | None |
| 2 | 2 | Fast | 2 | 1 quadrant/hit | None |
| 3 | 3 | Fast | 2 | 2 quadrants/hit | 1 hit destroys |

- Star level **resets to 0 on player death**
- Star level **persists across stages** until death

## Interactions

- Timer + frozen enemies: AI and movement halted; shooting still allowed for player
- Grenade during timer: clears frozen enemies without bonus points
- Shovel: converts brick base walls to steel tiles temporarily; on expiry revert to brick state (damaged areas restored)
