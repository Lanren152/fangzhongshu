# Contributing

Thanks for helping preserve and modernize this corpus. This project is intentionally simple: vanilla HTML/CSS/JS, zero dependencies, offline-first. Please keep it that way.

## Ground rules

1. **No runtime dependencies.** No frameworks, no CDN links, no web fonts, no analytics. Everything must work from `file://` offline.
2. **Cite your sources.** Content corrections must include the classical text, chapter, and edition (e.g. 《医心方》卷二十八·至理第一, 半井家本). Modern medical statements need a reference (paper, textbook, or authoritative guideline).
3. **Keep the build working.** After changes, run `node build.js` and confirm `dist/index.html` opens with no console errors.
4. **Respect the licenses.** Code is MIT; text and design are CC BY-SA 4.0. By submitting a PR you agree to license your contribution under the same terms. Do not paste in copyrighted translations or images you don't have rights to.

## Where things live

| You want to change… | Edit… |
|---|---|
| Prose, card text, classical quotations | `src/index.html` (editorial blocks), `src/js/app.js` (data arrays: `techniques`, `readherSignals`, formulas, herb lists) |
| Layout, colors, components | `src/css/main.css` (tokens at the top: OKLCH scale, spacing, radii, motion) |
| Behavior (modals, filters, scroll reveal) | `src/js/app.js` |
| Classical artwork | `assets/img/art/` + the `--art` CSS variables in `main.css` |

Rules of the design system (please don't break them):

- Spacing on a 4px base scale; type scale has 9 fixed steps.
- Accent color = "current / primary action" only. No decorative gradients beyond the existing glass/aurora surfaces.
- Every interactive element: keyboard reachable, visible focus, ARIA label in Chinese.
- Both themes (dark default / light) must keep WCAG AA contrast.

## Visual assets

The project ships text-only technique cards by default. See "Help wanted: visual assets" in the README for the kinds of contributions needed. Technical bar for illustrated contributions:

- **Position diagrams.** Schematic, neutral, anatomy-chart style. Work at 1200×900 or larger; export WebP or SVG; background transparent or compatible with the theme surface. A diagram must still read at 300px wide (card thumbnail) and at 800px (detail modal). Name files after the `POSE_MAP` key they serve (`classic`, `sidekick`, `rider`, …) and wire them through `POSE_IMAGES` as described in `assets/img/poses/README.md`. Never ship them through `pose-images.local.js` — that file is for images you can use locally but not redistribute.
- **Rights statement.** Every visual PR must state in its body which of these applies: (a) original work by you, (b) contributed under a named license (must be CC BY-SA 4.0-compatible), or (c) generated — include the model name, the date, and confirmation that you hold distribution rights for the output.
- **Style boundary.** Diagrams must read as anatomical illustration, not explicit imagery. This is a GitHub content-policy requirement (the repository must stay within GitHub's Acceptable Use Policies), not a judgment on the subject matter.
- **Batch process for large sets.** Open an Issue with 2–3 sample diagrams first. After style sign-off, submit in batches of about 10 so review stays possible. Diagram sets are reviewed for accuracy against the technique's operation notes, not just aesthetics.

## Testing a change

```bash
node build.js
# open dist/index.html — click through all six pages, open a few modals,
# toggle the theme, resize to mobile width
```

There is no test suite yet — building and clicking through is the bar. A PR that adds a lightweight smoke test is very welcome.

## Submitting

- Small fixes: open a PR directly.
- Content revisions or new sections: open an Issue first with sources, so we can agree on scope.
- One topic per PR. Keep diffs focused — the entire UI lives in three files, so large mixed PRs are hard to review.

## Not in scope

- Explicit imagery. The project is textual and diagrammatic.
- Medical advice or personalized treatment guidance.
- Anything that breaks offline usage.
