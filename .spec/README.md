# Battle City — Specification Index

Version: 1.0.0  
Target: NES-faithful Battle City clone in React + TypeScript + PixiJS

## Glossary

| Term | Definition |
|------|------------|
| Tile | One 32×32 px cell on the 13×13 grid |
| Star level | Player offensive tier 0–3 (power-ups) |
| Flashing tank | Enemy that drops a power-up when destroyed (4th, 11th, 18th spawn) |
| Base / HQ | Eagle/phoenix fortress; game over if destroyed |
| Stage | One level with 20 enemy tanks |

## Document Map

### Research
- [battle-city-overview.md](research/battle-city-overview.md)
- [mechanics-deep-dive.md](research/mechanics-deep-dive.md)
- [enemies-and-ai.md](research/enemies-and-ai.md)
- [power-ups.md](research/power-ups.md)
- [tiles-and-collision.md](research/tiles-and-collision.md)
- [scoring-and-progression.md](research/scoring-and-progression.md)
- [multiplayer.md](research/multiplayer.md)
- [level-editor.md](research/level-editor.md)
- [existing-repo-analysis.md](research/existing-repo-analysis.md)

### Architecture & Standards
- [architecture-principles.md](architecture-principles.md)
- [coding-standards.md](coding-standards.md)
- [tech-stack.md](tech-stack.md)

### Data Schemas
- [level-schema.json](data/level-schema.json)
- [enemy-config.json](data/enemy-config.json)
- [power-up-config.json](data/power-up-config.json)
- [tile-config.json](data/tile-config.json)
- [stage-roster.json](data/stage-roster.json)

### UI & Assets
- [screen-flow.md](ui/screen-flow.md)
- [controls.md](ui/controls.md)
- [sprite-sheet-layout.md](assets/sprite-sheet-layout.md)

### Testing & Roadmap
- [test-plan.md](testing/test-plan.md)
- [phases.md](roadmap/phases.md)

## Spec Versioning

- Patch: typo/clarification only
- Minor: new optional fields in JSON schemas
- Major: breaking rule changes (requires code + test update)
