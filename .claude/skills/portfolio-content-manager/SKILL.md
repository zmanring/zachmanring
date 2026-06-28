---
name: portfolio-content-manager
description: >
  Manage content for Zach Manring's portfolio game (zachmanring.me). Use this skill whenever
  the user wants to add, edit, reorder, or remove portfolio items (zones) in the game —
  including changing titles, descriptions, tags, or links. Also use when user says things like
  "add a new zone", "update my bio", "change what the card says", "move that item earlier",
  "add a link to X", "I want a new section about Y", or any time they're talking about what
  shows up when you open a zone in the game. Triggers on: portfolio content, zone content,
  info card, add item, edit item, reorder, new zone, update bio, portfolio data.
---

# Portfolio Content Manager

You manage the portfolio content for Zach Manring's side-scroller game at zachmanring.me.
All visible content in the game's info cards lives in one file.

## Content file

**Path:** `C:\Users\chevy\Projects\zachmanring\src\data\portfolio.ts`

Always read this file before making changes.

## Data structure

```typescript
interface PortfolioItem {
  id: string;          // unique kebab-case identifier
  levelId: number;     // which level (1–5) this belongs to
  type: 'info' | 'case-study' | 'project' | 'podcast' | 'article';
  title: string;       // shown on zone label and card header
  shortDesc: string;   // subtitle in the card (one sentence)
  longDesc: string;    // body copy — use → for bullet points, \n\n for paragraphs
  link?: string;       // CTA button URL (mailto: or https://)
  linkLabel?: string;  // CTA button text (e.g. 'Visit site →')
  tags?: string[];     // small chips shown in card header
}
```

## Levels and their theme

| Level | Array | Theme |
|-------|-------|-------|
| 1 | `level1Data` | Introduction / who Zach is |
| 2 | `level2Data` | Motif design system work |
| 3 | `level3Data` | Podcast + Southern Ginger Workshop |
| 4 | `level4Data` | Projects and code |
| 5 | `level5Data` | Contact |

## Important: zone count = item count

Level 1 currently has **6 interactive zones** in the game scene. The number of items in
`level1Data` should match the number of zones. If adding/removing items, note whether the
user also wants to add/remove a zone in the game (that's a separate change to
`src/game/scenes/Level1Scene.ts` — ask if needed).

Levels 2–5 don't have scenes built yet, so item count doesn't need to match anything.

## Known links (use these exactly)

- SGW site: `https://southerngingerworkshop.com`
- SGW YouTube: `https://youtube.com/@southernginger`
- SGW products: `https://southerngingerworkshop.com/products`
- Pixel Broccoli (Spotify): `https://open.spotify.com/show/033gFTqCwsukpXM8B1ruUm`
- LinkedIn: `https://linkedin.com/in/zachmanring`
- GitHub: `https://github.com/zmanring`
- Brocc repo: `https://github.com/zmanring/brocc`
- Email: `mailto:zmanring@gmail.com`

## Workflow

1. **Read** the current portfolio.ts
2. **Make changes** — add, edit, reorder, or remove items
3. **Verify** TypeScript still compiles:
   ```bash
   cd C:\Users\chevy\Projects\zachmanring
   node node_modules/typescript/bin/tsc --noEmit --project tsconfig.json
   ```
4. **Confirm** what changed in a short summary

## Writing style

Zach's voice is direct, confident, and personal — not corporate. Think:
- Short punchy sentences
- Real specifics over vague claims ("5 days → 1.5 days", not "significantly faster")
- Use `→` for bullet points in longDesc
- Personal asides are welcome ("Come for the builds, stay for the occasional disaster.")
- Avoid buzzwords: "leverage", "synergy", "passionate about"

## Reordering items

Array order = display order in the card's Prev/Next navigation. To reorder, cut and paste
the object blocks within the array. The first item in each array is what shows when a user
first opens that zone.

## longDesc formatting

Use `\n\n` between paragraphs and `→ item\n` for bullet lists:

```
`First paragraph here.

Second paragraph here.

→ Bullet one
→ Bullet two
→ Bullet three`
```
