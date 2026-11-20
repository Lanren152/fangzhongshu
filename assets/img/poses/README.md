# Pose silhouettes — not shipped

The technique diagrams in this project are stylized silhouettes. The source
image library they were derived from **carries no license** (all rights
reserved by default), so they are not included in this repository.

The app degrades gracefully: when no silhouette data is present, `poseFor()`
returns `null` and the technique modal simply shows without a figure. The
public GitHub Pages build runs in this mode.

## If you have licensed images

Put them in `src/js/pose-images.local.js` (gitignored):

```js
window.__POSE_IMAGES_LOCAL__ = {
  "classic": "data:image/webp;base64,...",
  "rider":   "data:image/webp;base64,..."
};
```

Keys must match the `file` values in `POSE_MAP` inside `src/js/app.js`
(21 keys, e.g. `classic`, `sidekick`, `rider`, `lotus_blossom`). Then:

```bash
node build.js   # local build picks up pose-images.local.js automatically
```

Never commit `pose-images.local.js`. If you contribute new diagrams, they must
be your own work or licensed for redistribution — put them in `assets/img/poses/`
and wire them through `POSE_IMAGES` with a relative path instead.
