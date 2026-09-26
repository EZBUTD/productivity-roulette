# Productivity Roulette

**Make progress. Change your chances.** A static roulette wheel for hobby productivity sprints with friends, built with plain HTML, CSS, and JavaScript. No accounts, backend, dependencies, or build step.

## Why this exists

This project accompanies a hobby sprint: a group of friends chooses a timeframe and a personal goal, such as making art for 20 minutes each day for two weeks. The wheel gives each small step a tangible effect on the final outcome.

- **Bad tiles** represent an agreed consequence or “punishment.” For our group, avoiding a negative outcome feels like a stronger motivator than promising ourselves a treat. Decide on consequences everyone involved is comfortable with before starting.
- **Neutral tiles** represent progress. As you make incremental progress, flip bad tiles to neutral ones. Each step reduces your chances of landing on a bad outcome.
- **Good tiles** come from a friend sponsoring a reward. The sponsor decides what that reward means. Something we could simply buy ourselves can feel less meaningful than a gift, experience, or gesture from someone cheering us on.

The point is incremental progress, not a perfect streak. Missing a day does not erase yesterday's effort. Every step you take still moves the odds in your favor.

## Use the wheel

1. Agree on a sprint timeframe, a goal, what counts as a step of progress, and the stakes.
2. Enter the number of bad, neutral, and good tiles. Start with any mix you like; the default is 8 bad, 3 neutral, and 1 good.
3. Optionally open **Give the stakes a name** to record the consequence and sponsored reward.
4. (Optional) Click **Log progress** whenever you complete a step. It converts one bad tile to neutral while keeping the total fixed. You can also edit counts directly, including adding sponsored good tiles.
5. At the agreed end of the sprint, click **Spin the wheel** and honor the outcome together.

Each tile is an equal-sized slice with an equal probability of selection. The order is randomly shuffled whenever counts change, when the page loads, or when you click **Shuffle tiles**. Shuffling changes placement, not probabilities. Spins select a tile uniformly, then animate its center to the fixed top pointer. Repeated spins are independent; tiles are not removed.

Counts must be nonnegative whole numbers, with 1–200 total tiles. Large wheels omit the slice symbols for legibility; the legend and accessible wheel description still show the composition. The app respects reduced-motion preferences and supports keyboard controls.

The optional reward note applies to all good tiles, and the consequence note applies to all bad tiles. For multiple sponsors with different rewards, agree outside the app how a good outcome will be assigned. This version does not track individual sponsors, dates, or daily activity.

Your counts and notes are saved in local storage in the current browser, when available. They are not shared with friends or synced across devices. The arrangement and spin result are not saved. Clearing site data clears your saved setup.

## Run locally

With Node.js installed, run:

```sh
npm start
```

Open `http://127.0.0.1:8080`. On Windows, if PowerShell blocks `npm.ps1`, use `npm.cmd start` and `npm.cmd test`.

Alternatively, serve this folder with any static web server, for example with Python installed:

```sh
python -m http.server 8080
```

Open `http://localhost:8080`. Use a web server rather than opening `index.html` as a file, because the JavaScript uses ES modules.

## Host on GitHub Pages

1. Push these files to your GitHub repository's default branch.
2. Open the repository's **Settings → Pages**.
3. Under **Build and deployment**, select **Deploy from a branch**.
4. Select the branch containing these files and the **/ (root)** folder, then save.
5. Once GitHub finishes deploying, open the site URL shown in Pages settings.

All asset paths are relative, so the site works at a repository path such as `https://YOUR-USERNAME.github.io/productivity-roulette/` as well as at a custom domain. No secrets, package installation, or build configuration are needed. `.nojekyll` tells Pages to serve the static files directly.

## Development

- `index.html` — page structure and controls
- `styles.css` — responsive layout and wheel styling; system fonts, no external assets
- `app.js` — SVG rendering, animation, input handling, and local persistence
- `wheel.js` — validation, Fisher–Yates shuffling, and pointer alignment math

With Node.js installed, run `npm test` to check count validation, preservation of tile counts during shuffling, and correct pointer alignment for every selection across several wheel sizes and repeated spins. No npm dependencies are needed. To check the interface, serve the site and try a single tile, mixed counts, invalid counts, progress conversion, shuffling, a completed spin, and a narrow mobile viewport.
