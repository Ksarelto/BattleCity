# Screen Flow

```mermaid
stateDiagram-v2
  [*] --> MainMenu
  MainMenu --> Game: 1 Player
  MainMenu --> Game2P: 2 Players
  MainMenu --> Editor: Construction
  MainMenu --> Settings: Options
  MainMenu --> HighScores: High Scores
  Game --> Pause: Escape
  Pause --> Game: Resume
  Pause --> MainMenu: Quit
  Game --> StageClear: 20 enemies destroyed
  StageClear --> Game: Next stage
  Game --> GameOver: Base destroyed / no lives
  GameOver --> MainMenu: Continue
  Editor --> Game: Play Test
  Editor --> MainMenu: Back
  Settings --> MainMenu: Back
  HighScores --> MainMenu: Back
```

## Screens

| Screen | Route | Description |
|--------|-------|-------------|
| MainMenu | `/` | Title, mode select |
| Game | `/game` | Active gameplay + HUD |
| Game2P | `/game?mode=2p` | Co-op gameplay |
| Editor | `/editor` | Level construction |
| Settings | `/settings` | Audio, difficulty, controls |
| HighScores | `/scores` | Top 10 local scores |

## Overlays (in-game)

- Pause menu (semi-transparent)
- Stage clear banner
- Game over screen
- Countdown before stage start (optional)

## HUD Elements

- P1 score (top-left)
- P2 score (top-right, 2P only)
- Lives remaining (tank icons)
- Enemies remaining (icon + count)
- Current stage number
- Power-up timer indicators
