# Put the game on the iPhone (offline, free)

The game is published on **GitHub Pages** (free hosting from your GitHub
account). Safari opens it once, saves every file on the phone, and from then on
it opens from the Home Screen icon even in airplane mode. No Mac, no App Store.

You do this once. It takes about 10 minutes.

## 1. Clean up the folder

Delete `src\application\FunnyMomentPolicy.js` if it is still there (it is an
old file that is no longer used). Then, if Node.js is installed, check that
everything is fine:

```powershell
cd D:\MB-Projects\MBProjects_Game_WordsBuilding
npm test
```

All tests should pass.

## 2. Create the repository on GitHub

1. Sign in on <https://github.com> and open <https://github.com/new>.
2. **Repository name:** `MBProjects_Game_WordsBuilding`
3. Choose **Public**. (Free GitHub Pages needs a public repository.
   Nothing private is in these files.)
4. Leave "Add a README", ".gitignore" and "license" **unticked**.
5. Click **Create repository**.

## 3. Upload the files

Pick **one** of the two ways.

### Option A: in the browser (no tools needed)

1. On the new empty repository page click **uploading an existing file**.
2. Open `D:\MB-Projects\MBProjects_Game_WordsBuilding` in File Explorer,
   select **everything inside it** (Ctrl+A), and drag it onto the GitHub page.
   Use Chrome or Edge, which keep the folders (`src`, `icons`, ...).
3. Wait until all files are listed, then click **Commit changes**.
4. Check that the repository now shows `index.html`, `sw.js`, `src` and `icons`
   at the top level (not inside another folder).

### Option B: with Git (if Git for Windows is installed)

Replace `YOUR-USERNAME` with your GitHub user name:

```powershell
cd D:\MB-Projects\MBProjects_Game_WordsBuilding
git init -b main
git add .
git commit -m "First version of the word building game"
git remote add origin https://github.com/YOUR-USERNAME/MBProjects_Game_WordsBuilding.git
git push -u origin main
```

## 4. Turn on GitHub Pages

1. In the repository click **Settings** → **Pages** (left menu).
2. Under **Build and deployment**: Source = **Deploy from a branch**,
   Branch = **main**, folder = **/ (root)**. Click **Save**.
3. Wait 1 to 2 minutes and refresh the page. It shows
   "Your site is live at `https://YOUR-USERNAME.github.io/MBProjects_Game_WordsBuilding/`".

## 5. Put it on the iPhone

1. On the iPhone open that address in **Safari** (not Chrome) while online.
2. Tap **Share** (the square with the arrow) → **Add to Home Screen** → **Add**.
3. Open the game **from the new Home Screen icon** once while still online, and
   tap ▶ Oyna. The Home Screen app keeps its own copy, so this first open is
   what saves the game for offline use.

## 6. Test offline

1. Close the game (swipe it away in the app switcher).
2. Turn on **airplane mode**.
3. Open the game from the Home Screen icon and play a few words.

It should work exactly as online.

## Updating the game later

The phone keeps using its saved copy until a new **version** is published:

1. Make your changes (for example new words in `src\data\wordPacks\tr.js`).
2. Open `sw.js` and change the version, e.g. `const VERSION = '1.0.0';` →
   `const VERSION = '1.0.1';`. **Without this the phone keeps the old game.**
3. If you added a new file, add it to the `FILES` list in `sw.js`
   (`npm test` tells you if one is missing).
4. Upload the changed files again (Option A: **Add file → Upload files**,
   drag the changed files or folders; Option B: `git add .`,
   `git commit -m "..."`, `git push`).
5. On the iPhone open the game once while online. It downloads the new version
   in the background; **close and reopen** it and the update is there.

## If something goes wrong

- **Page shows 404:** wait a few minutes after turning on Pages, and check that
  `index.html` is at the top of the repository, not inside a subfolder.
- **Offline doesn't work:** open the game once from the Home Screen icon while
  online (step 5.3), then try again.
- **The update doesn't show up:** check that `VERSION` in `sw.js` changed,
  open the game online, close it fully, open it again.
- **No sound:** the silent switch on the side of the iPhone mutes the game sounds.
