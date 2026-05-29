# Angle Measure

A tiny single-page web app for measuring joint and limb angles in photos. Built for tracking stretches, gymnastics strength holds, and other body positions over time.

Live: https://nssharpe.github.io/angle-measure/

## Features

- Upload, drag-and-drop, or paste (Ctrl/Cmd+V) an image — works on desktop and mobile
- **Triplets**: tap three points (arm, vertex, arm) to measure the interior angle (0–180°)
- **Line pairs**: an adjustable reference line plus a measured segment — measure how far a body line sits from vertical/horizontal. **Ref horizontal/vertical** snaps the reference; **Flip** shows the supplementary angle (180° − value)
- Drag any point to refine, with a magnifier loupe on touch devices; arrow keys nudge the selected point by 1px (Shift = 10px)
- Mouse-wheel and pinch zoom, drag to pan
- Per-measurement color and label; delete individual items or clear all
- Auto-saves to browser localStorage — refresh-safe (falls back to saving measurements without the image if it exceeds the storage quota)
- Export annotated photo as PNG (native resolution); shares to the camera roll on mobile, downloads on desktop
- Works offline after first load (service worker); no build step, no dependencies, no tracking

## Usage

1. Open the app, upload a photo (or paste / drag-and-drop one in).
2. **Add triplet** → tap three points (arm, vertex, arm), or **Add line pair** → a vertical reference appears, then tap the two ends of the segment you want to measure.
3. The angle appears on the image. Drag any point to adjust; use the zoom controls (or pinch) for precision.
4. Add more measurements as needed. Click a row in the side panel to select it. For line pairs, use **Ref horizontal/vertical** and **Flip** as needed.
5. **Export PNG** to save the annotated image to your progress log.

### Keyboard shortcuts

- **Arrow keys** — nudge selected point 1px
- **Shift + Arrow** — nudge selected point 10px
- **Delete / Backspace** — delete the measurement of the selected point
- **Escape** — cancel placement mode

## Project structure

| File | Purpose |
|------|---------|
| `index.html` | The whole app — markup, styles, and UI/interaction logic |
| `geometry.js` | Pure, DOM-free angle math (shared by the app and the tests) |
| `sw.js` | Service worker (offline + fast repeat loads) |
| `tests/geometry.test.mjs` | Unit tests for the geometry module |

## Development

No build step. Open `index.html` directly, or serve the folder:

```bash
python -m http.server 8099   # then visit http://localhost:8099
```

Run the unit tests (requires Node 18+):

```bash
npm test        # or: node --test
```

## Hosting on GitHub Pages

1. Create a new public repo (e.g. `angle-measure`) and push these files to `main`.
2. Repo → **Settings** → **Pages** → Source: *Deploy from a branch*, Branch: `main`, Folder: `/ (root)`.
3. Wait ~1 minute. App will be live at `https://<your-username>.github.io/angle-measure/`.

The `.nojekyll` file tells Pages to serve the files as-is without running Jekyll.

## License

MIT — see [LICENSE](LICENSE).
