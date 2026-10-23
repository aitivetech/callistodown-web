# Callisto Down website

The marketing site for **Callisto Down**, a survival and building game on Jupiter's moon Callisto (in development).
Static HTML, CSS and a little JavaScript; no build step, no tracking, no cookies. Fonts come from Google Fonts
(Big Shoulders Display, IBM Plex Sans, IBM Plex Mono).

Published with GitHub Pages from `main` by `.github/workflows/pages.yml` (repository settings: Pages, source
"GitHub Actions"). The canonical URL, `og:url` and `og:image` in `index.html` assume
`https://aitivetech.github.io/callisto-down/`; change them if the site moves to its own domain.

## Files

| Path | What |
|---|---|
| `index.html` | the page: hero, pitch, features, the Ocean Stack, gallery, status, download, footer |
| `style.css` | all styles (one dark theme; colour tokens at the top) |
| `main.js` | download links from `config.js`, nav state, reveal on scroll, the gallery lightbox |
| `config.js` | **the download links** (see below) |
| `img/` | WebP screenshots in two sizes (`-1920` and `-960`), `og-share.jpg` (1200 x 630 share card) |
| `tools/build-images.sh` | converts the source stills into `img/` (ImageMagick 7 with WebP) |
| `tools/og.html` | template of the share card |
| `SHOTS-WANTED.md` | stills to reshoot without HUD, and missing shots |

## Download links

Both launcher URLs live in one place, `config.js`:

```js
windows: "https://github.com/aitivetech/callisto-down/releases/latest/download/CallistoDown-win-Setup.exe",
linux:   "https://github.com/aitivetech/callisto-down/releases/latest/download/CallistoDown-linux.AppImage",
```

**The file names must match the assets the release workflow attaches to each GitHub release.** The
`releases/latest/download/<name>` URLs only resolve when an asset with exactly that name exists on the latest
release. The release (CI) workflow decides the final names; when it does, update `config.js` to match. Without
JavaScript, the buttons link to the latest release page instead.

## Images

All images are real in-game screenshots (no paint-overs). The source stills are the PNG/JPEG renders from the game
repo's photo-mode runs; `tools/build-images.sh` lists each output with its source and turns them into WebP:

```sh
SRC=/path/to/shots tools/build-images.sh
```

The share card is rendered from `tools/og.html` with a headless browser at 1200 x 630, for example with Playwright:

```python
page.set_viewport_size({"width": 1200, "height": 630})
page.goto("file:///.../tools/og.html", wait_until="networkidle")
page.screenshot(path="img/og-share.jpg", type="jpeg", quality=86)
```

Keep the repository small (target under 30 MB): add 1920 and 960 px WebP versions only, quality about 80.

## Content rules

The site describes only what the game is and does, from the game's design and engine docs. The story is in flux:
no lore, characters or quests. No release dates, prices or platforms beyond Windows and Linux (macOS later). No
reviews, quotes, awards or player counts.

## Local preview

Open `index.html` directly, or serve the folder: `python3 -m http.server 8000`.
