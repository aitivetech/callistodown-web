# Callisto Down website

The marketing site for **Callisto Down**, a survival and building game on Jupiter's moon Callisto (ultra early access, for gameplay testing). A game by Aitive Technologies GmbH using Voxelity Technology.
Static HTML, CSS and a little JavaScript; no build step, no tracking, no cookies. Fonts come from Google Fonts
(Big Shoulders Display, IBM Plex Sans, IBM Plex Mono).

Published with GitHub Pages from `main` by `.github/workflows/pages.yml` at **https://callistodown.com/**.
The canonical URL, `og:url` and `og:image` in `index.html` point there.

## Domain and DNS

GitHub repository settings, Pages:
- Source: "GitHub Actions".
- Custom domain: `callistodown.com` (also in the `CNAME` file, which the workflow deploys with the site).
- Enforce HTTPS: on, once the certificate has been issued.

DNS records at Cloudflare. Set them to **DNS only** (grey cloud) so that GitHub can issue and renew the certificate:

| Type | Name | Content |
|---|---|---|
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| AAAA | `@` | `2606:50c0:8000::153` |
| AAAA | `@` | `2606:50c0:8001::153` |
| AAAA | `@` | `2606:50c0:8002::153` |
| AAAA | `@` | `2606:50c0:8003::153` |
| CNAME | `www` | `aitivetech.github.io` |

GitHub redirects `www.callistodown.com` to the apex. Verifying the domain for the organisation (GitHub
organisation settings, Pages, "Add a domain") adds a TXT record `_github-pages-challenge-aitivetech` and
protects the domain against takeover. `download.callistodown.com` is separate: it is the R2 bucket's custom
domain, set up in Cloudflare R2, not a Pages record.

## Files

| Path | What |
|---|---|
| `index.html` | the page: hero, pitch, features, the Ocean Stack, gallery, status, download, footer |
| `style.css` | all styles (one dark theme; colour tokens at the top) |
| `main.js` | the download picker, nav state, reveal on scroll, the gallery lightbox |
| `detect.js` | browser platform to launcher RID (tests: `tests/detect.test.js`) |
| `config.js` | **downloads: `released` flag, platforms, URL pattern** (see below) |
| `CNAME` | the Pages custom domain |
| `img/` | WebP screenshots in two sizes (`-1920` and `-960`), `og-share.jpg` (1200 x 630 share card) |
| `tools/build-images.sh` | converts the source stills into `img/` (ImageMagick 7 with WebP) |
| `tools/og.html` | template of the share card |
| `SHOTS-WANTED.md` | stills to reshoot without HUD, and missing shots |

## Downloads

The launchers are served from Cloudflare R2 at `https://download.callistodown.com`. Everything about them is set in one
place, `config.js`:

- **`released`**: `false` until the first public build is uploaded. The download section then shows "First public test
  build coming soon", and nothing can be downloaded. Set it to `true` once the files of every available platform exist.
- **`platforms`**: the five launcher RIDs (`win-x64`, `win-arm64`, `linux-x64`, `linux-arm64`, `osx-arm64`), each with
  an `available` flag. Unavailable platforms are listed as "coming later" and cannot be picked.
- **`url(rid, stability)`**: the one function that builds every link, with `stability` = `stable` or `unstable`:
  - `https://download.callistodown.com/launcher/CallistoDown-<rid>-<stability>-Setup.exe` (Windows)
  - `https://download.callistodown.com/launcher/CallistoDown-<rid>-<stability>.AppImage` (Linux)
  - `https://download.callistodown.com/launcher/CallistoDown-<rid>-<stability>.pkg` (macOS)
- **`defaultStability`**: the channel selected at first (`stable`).

**The file names must match what the release workflow uploads to the bucket.** The CI lane confirms the final names.
Change `url()` when they change.

The visitor gets one primary button for the platform their browser reports, a Stable/Unstable toggle (Unstable is
labelled as testing builds that may break) and a list of all five platforms to pick from by hand. Detection is in
`detect.js`. It uses `navigator.userAgentData` (platform, plus `getHighEntropyValues(["architecture", "bitness"])`)
where the browser has it, and otherwise `navigator.userAgent` and `navigator.platform`. Every Mac counts as
`osx-arm64`, because Apple Silicon cannot be told apart from Intel reliably. Phones and tablets get no preselection.
Test it with `node tests/detect.test.js`.

Without JavaScript, the button only jumps to the `#download` section, which says that the first public build may not be
out yet. There is deliberately no fallback to GitHub releases.

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
