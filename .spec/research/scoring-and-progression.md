# Scoring and Progression

## Points

| Action | Points |
|--------|--------|
| Destroy basic tank | 100 |
| Destroy fast tank | 200 |
| Destroy power tank | 300 |
| Destroy armor tank | 400 |
| Collect power-up | 500 |
| 2P stage kill bonus | 1000 (most kills wins) |

## Lives

- Start with **3 lives**
- Extra life from **tank power-up**
- Extra life at **20,000 points** (once per game, not repeating)
- Lives shared in 2P co-op (NES behavior)

## Stage Progression

- **35 unique stages** with distinct layouts
- After stage 35, loop from stage 1 with harder enemy rosters
- Stage clear bonus: 1000 points (configurable)

## Stage Clear Flow

1. Destroy 20th enemy → freeze gameplay
2. Show stage clear screen with bonus tally
3. Curtain transition animation
4. Load next stage; reset player positions; keep score/lives/star level

## Game Over

- Show final score
- High score saved to localStorage
- Option: continue from stage 1 or return to menu

## High Score

- Persist top 10 in localStorage
- Format: `{ name, score, stage, date }`
