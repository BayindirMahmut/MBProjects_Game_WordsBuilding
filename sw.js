// Offline support. On the first visit every game file is saved on the phone,
// after that the game opens from the phone even in airplane mode.
//
// RELEASING AN UPDATE: change VERSION below (e.g. '1.0.1') every time you change
// any game file. The phone then downloads the new files in the background and
// uses them the next time the game is opened.
// If you add a new file, also add it to FILES (npm test checks this for you).
const VERSION = '1.0.0';
const CACHE = `words-building-${VERSION}`;

const FILES = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon-180.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './src/main.js',
  './src/config.js',
  './src/domain/Word.js',
  './src/domain/SpellingPuzzle.js',
  './src/domain/SwapPuzzle.js',
  './src/application/categories.js',
  './src/application/GameSession.js',
  './src/application/GameSettings.js',
  './src/application/ports.js',
  './src/application/RewardPolicy.js',
  './src/application/shuffle.js',
  './src/application/WordDeck.js',
  './src/data/LocalSettingsStore.js',
  './src/data/WordPackRepository.js',
  './src/data/puzzlePictures/cats.js',
  './src/data/wordPacks/index.js',
  './src/data/wordPacks/tr.js',
  './src/data/wordPacks/en.js',
  './src/presentation/GameController.js',
  './src/presentation/GameView.js',
  './src/presentation/StartScreen.js',
  './src/presentation/strings.js',
  './src/presentation/styles.css',
  './src/presentation/audio/SpeechSpeaker.js',
  './src/presentation/audio/WebAudioSoundPlayer.js',
  './src/presentation/bonus/PicturePuzzleGame.js',
  './src/presentation/funny/DancingCharacterFunnyMoment.js',
  './src/presentation/tileLayouts/FixedTileLayout.js',
  './src/presentation/tileLayouts/FlyingTileLayout.js',
];

self.addEventListener('install', (event) => {
  // 'reload' skips the browser's HTTP cache so a new version gets fresh files.
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(FILES.map((url) => new Request(url, { cache: 'reload' }))))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  // Remove the files of older versions.
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;

  // Saved copy first (works offline and starts fast), network only for anything not saved.
  // Pages are matched without their ?settings, so index.html?lang=en works offline too.
  const isPage = request.mode === 'navigate';
  event.respondWith(
    caches
      .match(isPage ? './index.html' : request, { ignoreSearch: isPage })
      .then((saved) => saved ?? fetch(request)),
  );
});
