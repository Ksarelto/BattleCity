# Local setup on Windows (`D:\Projects\Battle_City_React`)

The Cloud Agent runs on a Linux VM where the repo is mounted at:

```
/workspace
```

That is **not** your `D:` drive. To work on your machine, use this folder:

```
D:\Projects\Battle_City_React
```

## Option A — Use this repo as your project folder (recommended)

```powershell
cd D:\Projects
git clone -b cursor/battle-city-react-bd31 https://github.com/Ksarelto/BattleCity.git Battle_City_React
cd Battle_City_React
npm install
npm run check
npm run dev
```

Then open **`D:\Projects\Battle_City_React`** in Cursor (File → Open Folder).

## Option B — Merge into an existing Vite + React + TypeScript starter

```powershell
cd D:\Projects\Battle_City_React
git clone -b cursor/battle-city-react-bd31 https://github.com/Ksarelto/BattleCity.git .\_battlecity_upstream
powershell -ExecutionPolicy Bypass -File .\_battlecity_upstream\scripts\sync-to-battle-city-react.ps1 `
  -TargetRoot "D:\Projects\Battle_City_React" `
  -SourceRoot "D:\Projects\Battle_City_React\_battlecity_upstream"
npm install
npm run check
npm run dev
```

## Full paths to game code (on your PC after clone)

| What | Windows path |
|------|----------------|
| Levels | `D:\Projects\Battle_City_React\src\game\levels\levelLoader.ts` |
| Engine | `D:\Projects\Battle_City_React\src\game\core\gameEngine.ts` |
| State | `D:\Projects\Battle_City_React\src\game\core\gameWorld.ts` |
| Settings / scores | `D:\Projects\Battle_City_React\src\store\gameStore.ts` |
| Sprites | `D:\Projects\Battle_City_React\public\sprites\` |
| Renderer | `D:\Projects\Battle_City_React\src\game\render\gameRenderer.ts` |

## Open the correct folder in Cursor

Cloud Agent can only edit the folder opened as the workspace. If you want changes applied directly to `D:\Projects\Battle_City_React`, open that folder in Cursor before starting an agent.
