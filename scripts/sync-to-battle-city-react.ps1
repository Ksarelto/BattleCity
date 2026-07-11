# Sync Battle City game code into your local React project folder.
# Run from PowerShell on Windows:
#   cd D:\Projects\Battle_City_React
#   git clone -b cursor/battle-city-react-bd31 https://github.com/Ksarelto/BattleCity.git .\_battlecity_upstream
#   .\scripts\sync-to-battle-city-react.ps1 -TargetRoot "D:\Projects\Battle_City_React" -SourceRoot "D:\Projects\Battle_City_React\_battlecity_upstream"

param(
    [Parameter(Mandatory = $true)]
    [string]$TargetRoot,

    [Parameter(Mandatory = $true)]
    [string]$SourceRoot
)

$ErrorActionPreference = "Stop"

function Copy-Tree {
    param([string]$RelativePath)
    $src = Join-Path $SourceRoot $RelativePath
    $dst = Join-Path $TargetRoot $RelativePath
    if (-not (Test-Path $src)) {
        Write-Warning "Skip missing: $RelativePath"
        return
    }
    New-Item -ItemType Directory -Force -Path (Split-Path $dst -Parent) | Out-Null
    Copy-Item -Path $src -Destination $dst -Recurse -Force
    Write-Host "Copied $RelativePath"
}

Write-Host "Target: $TargetRoot"
Write-Host "Source: $SourceRoot"

@(
    "src\app",
    "src\components",
    "src\game",
    "src\store",
    "src\hooks",
    "src\types",
    "public\sprites",
    "public\favicon.svg",
    "public\icons.svg",
    ".spec",
    ".github",
    "index.html",
    "vite.config.ts",
    "vitest.config.ts",
    "tsconfig.json",
    "tsconfig.app.json",
    "tsconfig.node.json",
    ".oxlintrc.json"
) | ForEach-Object { Copy-Tree $_ }

Copy-Item (Join-Path $SourceRoot "src\App.tsx") (Join-Path $TargetRoot "src\App.tsx") -Force
Copy-Item (Join-Path $SourceRoot "src\main.tsx") (Join-Path $TargetRoot "src\main.tsx") -Force
Copy-Item (Join-Path $SourceRoot "src\index.css") (Join-Path $TargetRoot "src\index.css") -Force

Write-Host ""
Write-Host "Next steps:"
Write-Host "  cd $TargetRoot"
Write-Host "  npm install"
Write-Host "  npm run check"
Write-Host "  npm run dev"
