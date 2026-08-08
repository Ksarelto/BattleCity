# Battle City — Overview

## History

Battle City (バトルシティ) was developed by Tomcat System and published by Namco for the Famicom (NES) in Japan, September 1985. It is a sequel/enhancement of the 1980 arcade game **Tank Battalion**.

The game became internationally popular through bootleg multicarts and Famiclone hardware, especially in Eastern Europe and Russia during the 1990s.

## Core Gameplay Loop

1. Player spawns at bottom near the base (eagle/phoenix symbol)
2. Up to 4 enemy tanks appear from 3 spawn points at the top
3. Player destroys enemies while protecting the base
4. Stage clears when all 20 enemies are destroyed
5. Game ends if base is hit or player runs out of lives

## Key Features (NES Original)

- 35 built-in stages (13×13 tile grid each)
- Single-player and 2-player cooperative mode
- 4 enemy tank types with distinct behavior
- 6 power-up types from flashing red tanks
- Construction mode (level editor)
- Progressive difficulty across stages

## Sources

- [StrategyWiki — Battle City](https://strategywiki.org/wiki/Battle_City)
- [Wikipedia — Battle City](https://en.wikipedia.org/wiki/Battle_City)
- [GameFAQs Walkthrough](https://gamefaqs.gamespot.com/nes/562966-battle-city/faqs/29287)
- [IGN Walkthrough/FAQ](https://www.ign.com/articles/2003/06/20/battle-city-walkthroughfaq-424615)

## Implementation Target

This project implements NES-faithful mechanics using React (UI/menus), TypeScript (game logic), and PixiJS (rendering). See [architecture-principles.md](../architecture-principles.md).
