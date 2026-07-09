# Test Plan

## Unit Tests (Vitest)

### Collision
- [ ] Tank blocked by brick, steel, water
- [ ] Tank passes through bush, ice
- [ ] Bullet blocked by brick (damages), steel
- [ ] Bullet passes over water
- [ ] Tank-tank collision prevents overlap

### Brick Damage
- [ ] Single quadrant removed per default hit
- [ ] Tier 3 removes 2 quadrants
- [ ] Tile becomes empty when all quadrants gone

### Bullets
- [ ] One bullet on screen at tier 0-1
- [ ] Two bullets at tier 2-3
- [ ] Bullet-bullet cancellation
- [ ] Cannot fire until bullet clears

### Spawn
- [ ] Max 4 active enemies
- [ ] Queue depletes after 20 spawns
- [ ] Flashing flag on indices 4, 11, 18

### Power-ups
- [ ] Drop on flashing tank destroy
- [ ] 500 points on collect
- [ ] Grenade clears enemies without bonus credit
- [ ] Star increments tier (max 3)
- [ ] Timer freezes enemy movement
- [ ] Shovel fortifies base walls

### Scoring
- [ ] Correct points per enemy type
- [ ] Extra life at 20000 (once)
- [ ] 2P kill bonus +1000

### Win/Lose
- [ ] Stage clear at 20 kills
- [ ] Game over on base hit
- [ ] Game over at 0 lives

## Integration Tests

- [ ] Load level JSON validates against schema
- [ ] Full stage simulation (mock input) completes

## Manual QA Checklist

- [ ] 60fps stable on desktop
- [ ] Integer scaling crisp at 2x/3x/4x
- [ ] Touch controls responsive on mobile
- [ ] Pause/resume preserves state
- [ ] Audio mute persists after reload
- [ ] All 35 stages load without error
- [ ] Editor save/load roundtrip
- [ ] 2P friendly fire stun works

## Parity vs NES

- [ ] Grid 13×13
- [ ] 20 enemies per stage
- [ ] 4 enemy types behavior
- [ ] 6 power-ups
- [ ] Star tier effects
- [ ] Ice slide feel
- [ ] Bush concealment
