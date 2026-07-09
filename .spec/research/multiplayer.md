# Multiplayer (2-Player Co-op)

## Player Assignment

- Player 1: Yellow tank, bottom-left spawn
- Player 2: Green tank, bottom-right spawn

## Controls

See [controls.md](../ui/controls.md).

## Shared Rules

- Shared life pool (3 lives total for both)
- Shared score
- Both must protect same base
- Stage clears when 20 enemies destroyed (combined)

## Friendly Fire

- P1 bullet hitting P2 (or vice versa): target **stunned** ~2 seconds
- Stunned: cannot move, can rotate and shoot
- No life lost from friendly fire

## Competitive Element

- Track kills per player during stage
- At stage end, player with more kills receives **+1000 bonus points**
- Tie: no bonus

## Spawn / Respawn

- If one player dead, other continues
- Respawn dead player at spawn point when life consumed and respawn timer completes
- Both dead + no lives = game over

## Implementation Notes

- Input systems isolated per player (`InputChannel.P1`, `InputChannel.P2`)
- Collision checks team ID before applying friendly fire stun
