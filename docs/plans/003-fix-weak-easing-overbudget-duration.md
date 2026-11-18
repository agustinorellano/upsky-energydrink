# 003 — Fix weak easing and over-budget durations on two UI entrances

- **Status**: DONE
- **Commit**: 83da3e2
- **Severity**: LOW
- **Category**: Easing & duration
- **Estimated scope**: 1 file (`style.css`), 2 edits
- **Depends on**: Plan 002 (adds the `--ease-out` token this plan consumes). Apply 002 first.

## Problem

Two entrances use the plain built-in `ease` curve (weak, symmetric) and
exceed the 300ms UI budget:

```css
/* style.css:623 — current */
.qs-attr { ... }
.qs-attr.is-visible,
.qs-reveal.is-visible,
.ficha-attr.is-visible {
  animation: qs-attr-in 400ms ease forwards;
}
```

```css
/* style.css:1164 — current */
.ig-tile img {
  transition: transform 0.4s ease;
}
```

## Target

```css
/* style.css:623 — target */
  animation: qs-attr-in 250ms var(--ease-out) forwards;
```

```css
/* style.css:1164 — target */
.ig-tile img {
  transition: transform 220ms var(--ease-out);
}
```

## Repo conventions to follow

- Use the `--ease-out: cubic-bezier(0.23, 1, 0.32, 1)` token added by Plan 002
  (`style.css :root`). Do not hand-type a new cubic-bezier here.
- The Producto carousel's own entrance (`style.css:557-562`, the `qs-text-in`
  keyframe) is the closest existing exemplar of a correct fast UI entrance —
  350ms with a strong custom curve. This plan brings `.qs-attr-in` and
  `.ig-tile img` in line with that same spirit, just using the new shared
  token instead of a one-off value.

## Steps

1. In `style.css`, find the exact line containing
   `animation: qs-attr-in 400ms ease forwards;` (around line 623). Replace it
   with:
   `animation: qs-attr-in 250ms var(--ease-out) forwards;`
2. In `style.css`, find the exact line containing
   `transition: transform 0.4s ease;` inside the `.ig-tile img` rule (around
   line 1164 — there are other unrelated `0.4s ease` or `transform` lines in
   the file, confirm you are editing the `.ig-tile img` rule specifically, not
   `.site-header` at line 124 or anything else). Replace it with:
   `transition: transform 220ms var(--ease-out);`

## Boundaries

- Do NOT touch `.site-header`'s `transition: transform 0.35s ease;`
  (`style.css:124`) — different element, out of scope for this plan.
- Do NOT touch the `@keyframes qs-attr-in` definition itself, only the
  `animation:` declaration that references it.
- Do NOT touch `index.html` or `script.js`.
- If Plan 002 has not been applied yet (no `--ease-out` token exists in
  `:root`), STOP and apply Plan 002 first — this plan's target code will not
  work without that token.

## Verification

- **Mechanical**: `grep -n "ease-out" style.css` should show the `:root`
  definition plus at least these two new usages.
- **Feel check**:
  - Scroll to the Ficha section (`#ficha`) on `index.html` and watch the four
    attribute cards animate in — they should feel noticeably snappier and
    less "floaty" than before.
  - Hover an Instagram tile image in the `#instagram-feed` section — the
    zoom should feel quick and responsive, not sluggish.
  - In DevTools Animations panel at 10% playback, confirm both now ease out
    (fast start, gentle stop) rather than linear-feeling.
- **Done when**: both declarations reference `var(--ease-out)` with the exact
  durations above, and nothing else in the file changed.
