# Level Editor (Construction Mode)

## Features

- Paint tiles from palette: empty, brick, steel, water, ice, bush
- Place player spawn markers (P1, P2)
- Place enemy spawn points (3 required)
- Place base position (default bottom center)
- Set enemy roster (20 types) or use random
- Play-test level immediately
- Save/load custom levels

## UX Flow

1. Main menu → Construction
2. Grid editor with tile palette toolbar
3. Click/drag to paint
4. Save to localStorage slot (up to 10 custom levels)
5. Export/import JSON file

## Custom Level JSON

Uses same schema as [level-schema.json](../data/level-schema.json) with `"custom": true`.

## Validation Rules

- Grid must be 13×13
- Exactly 1 base position
- At least 1 player spawn
- 3 enemy spawn points
- enemyRoster length = 20
- Base must not be completely enclosed without path (warning only)

## Future Enhancements

- Tiled (.tmx) import
- Share levels via URL encoding
