# Kelime Kurmaca (Word Building)

A word building game for a 6-year-old. On the start screen the child picks a
category (Animals, Foods, Toys, Sports or Mixed) and how the letters behave:
**still** (in a row) or **flying** (floating around an area, catch the right one).
The choice is remembered on the device; the 🏠 button goes back to the start screen.

A picture and its word appear; the child builds the word by tapping the letter tiles in the right order. Every few words
(or after a few minutes of play) a funny moment pops up as a reward. After every
10 words a cat picture puzzle starts: 10 pieces (2 x 5), tap one piece and then
another to swap them. Pieces in the right place lock with a green frame.

## Why a web app (PWA)?

The game must run on an iPhone but is developed on Windows. Native iOS builds
need a Mac (or a cloud build service and an Apple developer account), and React
Native/Expo would pull in hundreds of npm packages. A plain web app avoids all of that:

- **Zero dependencies.** No `npm install`, nothing to break or update.
- Runs in Safari on iPhone and can be added to the Home Screen, where it opens
  full screen like an app.
- Plain JavaScript ES modules with JSDoc types (`// @ts-check`), so VS Code still
  type-checks it without a build step.

You need only **Node.js 20.11+** (to serve files and run tests).

## Run it

```powershell
cd D:\MB-Projects\MBProjects_Game_WordsBuilding
npm start      # starts a small server on port 8080
npm test       # runs the unit tests (Node's built-in test runner)
```

`npm start` prints two addresses:

- `http://localhost:8080` for the PC browser.
- `http://<your-PC-IP>:8080` to open in **Safari on the iPhone** (same Wi-Fi).
  Windows may ask to allow Node through the firewall: allow it on private networks.

### Play offline on the iPhone

The game works fully offline once it is published on free GitHub Pages and
added to the Home Screen. Step-by-step guide: **[PUBLISH.md](PUBLISH.md)**.
After changing any file, bump `VERSION` in `sw.js` so phones pick up the update.

Note: the iPhone silent switch mutes the game sounds. The spoken word uses the
device voice (Settings → Accessibility → Spoken Content → Voices to add a better Turkish voice).

## Settings

Defaults are in [src/config.js](src/config.js). Each can be overridden in the URL:

| URL parameter | Meaning | Default |
| --- | --- | --- |
| `lang` | Word pack: `tr` or `en` | `tr` |
| `words` | Funny moment after this many words | `3` |
| `minutes` | ...or after this many minutes | `2` |
| `puzzle` | Cat puzzle after this many words | `10` |
| `hint` | `0` hides the written word above the boxes | `1` |
| `speak` | `0` turns off the spoken word | `1` |
| `mistakes` | Wrong taps before the right letter glows | `2` |

Example: `http://192.168.1.20:8080/?lang=en&words=4`

## Architecture

Layered, dependencies point inward only (presentation → application → domain).

```
src/
  domain/         Pure game rules, no browser code
    Word.js             a word + its picture, split into letters (Turkish-safe)
    SpellingPuzzle.js   tiles and "pick letters in order" rule
    SwapPuzzle.js       picture puzzle rules: swap pieces, lock correct ones
  application/    Use cases and ports (interfaces)
    ports.js            WordRepository, SettingsStore, SoundPlayer, Speaker, FunnyMoment, BonusGame
    categories.js       category ids and the category filter ('mixed' = all)
    GameSettings.js     the player's choices (category, letter mode) + validation
    GameSession.js      game flow: pick, next word, hints, score
    RewardPolicy.js     when a reward is due (N words or T minutes)
    WordDeck.js         deals each word once before repeating
    shuffle.js
  data/           Where words come from
    WordPackRepository.js  implements WordRepository
    LocalSettingsStore.js  implements SettingsStore with localStorage
    wordPacks/          tr.js, en.js, index.js (registry)
    puzzlePictures/     cats.js: 3 cats drawn as SVG for this project (free to ship)
  presentation/   Everything the child sees and hears
    GameView.js         DOM rendering only
    StartScreen.js      category and letter mode picker
    tileLayouts/        FixedTileLayout, FlyingTileLayout (swap or add new ones)
    GameController.js   connects session ↔ view ↔ sound ↔ voice ↔ funny moment
    audio/              WebAudioSoundPlayer (synthesized, no files), SpeechSpeaker
    funny/              DancingCharacterFunnyMoment (placeholder)
    bonus/              PicturePuzzleGame (the cat puzzle)
    strings.js, styles.css
  config.js       settings
  main.js         composition root: the only place concrete classes are chosen
tests/            node:test unit tests for domain, application and data
tools/serve.mjs   zero-dependency static server
```

## Common changes

- **Add words:** add a `{ category, text, picture }` line to `src/data/wordPacks/tr.js`.
- **Add a category:** add its id to `application/categories.js`, its name to
  `presentation/strings.js` and an icon in `presentation/StartScreen.js`, then tag words with it.
- **Add a letter mode:** write a class with `attach(container)` and `detach()`
  in `presentation/tileLayouts/` and add it to `tileLayouts` in `main.js`.
  Flying speed is the `speed` option of `FlyingTileLayout` (pixels per second).
- **Add a language:** copy `en.js`, change `id`/`locale`/words, register it in
  `wordPacks/index.js`, add texts to `presentation/strings.js`.
- **Change the funny moment:** write a class with `play(): Promise<void>`
  (see `presentation/funny/`) and pass it to `GameController` in `main.js`.
  Nothing else needs to change.
- **Other puzzle pictures:** add an entry to `data/puzzlePictures/` (any 4:5
  SVG) and pass that list to `PicturePuzzleGame` in `main.js`.
- **Use real pictures instead of emoji:** the `picture` field can become an
  image path; only `GameView.renderPuzzle` needs to draw an `<img>`.
