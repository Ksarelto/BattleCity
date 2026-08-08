# Enemies and AI

## Enemy Types

See [enemy-config.json](../data/enemy-config.json) for authoritative values.

| Type | Points | HP | Move Speed | Bullet Speed | Notes |
|------|--------|-----|------------|--------------|-------|
| basic | 100 | 1 | Slow (1) | Slow (1) | Default enemy |
| fast | 200 | 1 | Fast (3) | Normal (2) | Rushes toward base |
| power | 300 | 1 | Normal (2) | Fast (3) | Rapid fire, fast brick break |
| armor | 400 | 4 | Normal (2) | Normal (2) | Color degrades per hit |

## Armor Color Stages

- 4 HP → green (full)
- 3 HP → light green
- 2 HP → gray
- 1 HP → dark gray

## Spawn System

- **20 tanks** per stage queued in `enemyRoster` order
- Max **4 active** on screen simultaneously
- Spawn from **3 fixed positions** at top row (columns 0, 6, 12 — center of each third)
- Spawn animation: ~60 frames before tank becomes active
- New spawn when active count drops below 4 and queue non-empty

## Flashing Tanks

Spawn indices (1-based in queue): **4, 11, 18**

## AI Behavior (Normal Difficulty)

State machine per enemy:

1. **Move** — travel in current direction until blocked or timer expires
2. **Turn** — pick new random cardinal direction (avoid immediate reverse 70% of time)
3. **Shoot** — fire if aligned with player or base on axis within range
4. **Stuck recovery** — if no movement for 90 frames, force random turn

### Type-Specific Bias

- **fast**: 60% chance to pick direction toward base when turning
- **power**: fires 2× more often than basic
- **armor**: no special AI; acts as obstacle
- **basic**: random movement

### Easy Difficulty

- Pure random direction and shooting (no base bias)

## Stage Roster

Per-stage enemy composition in [stage-roster.json](../data/stage-roster.json). After stage 35, rosters loop with increased fast/power/armor ratios.
