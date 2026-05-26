# Angle Measure

A tiny single-page web app for measuring joint and limb angles in photos. Built for tracking stretches, gymnastics strength holds, and other body positions over time.

Live: `https://<your-username>.github.io/angle-measure/`

## Features

- Upload, drag-and-drop, or paste (Ctrl/Cmd+V) an image — works on desktop and mobile
- Add unlimited point-triplets; each shows its interior angle (0–180°) at the vertex
- Drag any point to refine; arrow keys nudge the selected point by 1px (Shift = 10px)
- Mouse-wheel and pinch zoom, drag to pan
- Per-triplet color and label; delete individual triplets or clear all
- Auto-saves to browser localStorage — refresh-safe
- Export annotated photo as PNG (at native resolution)
- No build step, no dependencies, no tracking

## Usage

1. Open the app, upload a photo (or paste / drag-and-drop one in).
2. Click **Add triplet** and tap three points: first arm, vertex, second arm.
3. The angle appears at the vertex. Drag any point to adjust. Use the zoom controls (or pinch) for precision.
4. Add more triplets as needed. Click a row in the side panel to highlight that triplet.
5. **Export PNG** when you want to save the annotated image to your progress log.

### Keyboard shortcuts

- **Arrow keys** — nudge selected point 1px
- **Shift + Arrow** — nudge selected point 10px
- **Delete / Backspace** — delete the triplet of the selected point
- **Escape** — cancel "Add triplet" mode

## Hosting on GitHub Pages

1. Create a new public repo (e.g. `angle-measure`) and push these files to `main`.
2. Repo → **Settings** → **Pages** → Source: *Deploy from a branch*, Branch: `main`, Folder: `/ (root)`.
3. Wait ~1 minute. App will be live at `https://<your-username>.github.io/angle-measure/`.

The `.nojekyll` file tells Pages to serve the files as-is without running Jekyll.

## License

MIT — see [LICENSE](LICENSE).
