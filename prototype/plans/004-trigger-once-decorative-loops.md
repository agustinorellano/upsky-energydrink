# 004 — Trigger decorative loops once on viewport entry instead of infinite

- **Status**: TODO
- **Commit**: 83da3e2
- **Severity**: LOW
- **Category**: Purpose & frequency
- **Estimated scope**: 2 files (`style.css`, `script.js`), ~4 edits

## Problem

Two sets of decorative animations loop forever while on screen, with no
relevance trigger — purely "it looks cool" on elements the user sees for as
long as they linger on that section:

```css
/* style.css:827-829 — current */
.shop-badges li:nth-child(1) svg { animation: badge-pulse 1.6s ease-in-out infinite; transform-origin: center; }
.shop-badges li:nth-child(2) svg { animation: badge-bounce 1.8s ease-in-out infinite; }
.shop-badges li:nth-child(3) svg { animation: badge-spin 7s linear infinite; transform-origin: center; }
```

```css
/* style.css:1543 and :1575 — current (two nearly-identical rules) */
  animation: ugc-comment-pop 5s ease-in-out infinite;
```

## Target

Both become finite, triggered once by an `is-in-view` class added via
`IntersectionObserver` (the codebase already has this pattern for
`.kb-zoom`, see Repo conventions below).

```css
/* style.css:827-829 — target */
.shop-badges li:nth-child(1) svg { animation-name: badge-pulse; animation-duration: 1.6s; animation-timing-function: ease-in-out; animation-iteration-count: 3; transform-origin: center; }
.shop-badges li:nth-child(2) svg { animation-name: badge-bounce; animation-duration: 1.8s; animation-timing-function: ease-in-out; animation-iteration-count: 3; }
.shop-badges li:nth-child(3) svg { animation-name: badge-spin; animation-duration: 7s; animation-timing-function: linear; animation-iteration-count: 1; }
.shop-badges svg { animation-play-state: paused; }
.shop-badges.is-in-view svg { animation-play-state: running; }
```

```css
/* style.css:1543 and :1575 — target */
  animation: ugc-comment-pop 5s ease-in-out 3;
  animation-play-state: paused;
}
.ugc-grid-wrap.is-in-view .ugc-comment-bubble,
.ugc-grid-wrap.is-in-view .ugc-like-badge {
  animation-play-state: running;
}
```

## Repo conventions to follow

- The codebase already has exactly this "observe, then add a class that
  starts the motion" pattern for Ken Burns photos: `script.js` sets up a
  `kbObserver` (`IntersectionObserver`) around line 95-113 that toggles a
  class (`is-in-view` or similar — read the exact class name used there, it
  is the one applied to `.kb-zoom` elements) when `entry.isIntersecting` with
  `{ threshold: 0.15 }`. Reuse the exact same observer options and class
  name convention for the two new targets instead of inventing a new pattern.

## Steps

1. In `script.js`, find the existing `kbObserver` IntersectionObserver setup
   (search for `kbObserver` or `kb-zoom`, around lines 90-114). Note the
   exact class name it toggles and the threshold used.
2. Immediately after that block, add two more observers (or extend the
   existing one to also watch new selectors — follow whichever pattern is
   less invasive given the surrounding code) that:
   - observe `.shop-badges` and add the SAME class name convention
     (e.g. `is-in-view`) when it enters the viewport, with the same
     `{ threshold: 0.15 }`.
   - observe `.ugc-grid-wrap` and add the same class when it enters the
     viewport, same threshold.
3. In `style.css`, update the three `.shop-badges li:nth-child(N) svg`
   rules (lines 827-829) to the target shown above: split the shorthand
   `animation` into longhand properties with `animation-iteration-count: 3`
   (badges 1 and 2) or `1` (badge 3, the spin), add
   `.shop-badges svg { animation-play-state: paused; }` and
   `.shop-badges.is-in-view svg { animation-play-state: running; }`
   (use the actual class name from Step 1, not literally `is-in-view` if it
   differs).
4. In `style.css`, update the two `animation: ugc-comment-pop 5s ease-in-out infinite;`
   declarations (lines 1543 and 1575) to `animation: ugc-comment-pop 5s ease-in-out 3;`
   and add the paused-by-default / running-when-in-view pair shown in Target,
   scoped to `.ugc-grid-wrap` (again using the real class name from Step 1).

## Boundaries

- Do NOT change the keyframe definitions themselves (`@keyframes badge-pulse`,
  `badge-bounce`, `badge-spin`, `ugc-comment-pop`) — only how many times they
  run and when they start.
- Do NOT touch the existing `@media (prefers-reduced-motion: reduce)` blocks
  that already disable these animations (`style.css:843-844` and `:1579-1580`)
  — they continue to take precedence and need no change.
- Do NOT invent a new IntersectionObserver class-naming convention — match
  whatever the existing `kbObserver` uses exactly.
- If the existing Ken Burns observer code has drifted from what's described
  here (different class name, different threshold, or doesn't exist),
  STOP and report instead of guessing.

## Verification

- **Mechanical**: `grep -n "infinite" style.css` should no longer match
  `badge-pulse`, `badge-bounce`, `badge-spin`, or `ugc-comment-pop`.
- **Feel check**:
  - Load `index.html`, scroll to the "Formatos" section where `.shop-badges`
    live — the three badge icons should animate for a few seconds then
    settle still, not keep animating forever while the section is in view.
  - Scroll to `#lifestyle` — the floating comment bubbles and like badges
    should pop in a few times then stop, not loop endlessly while the
    section stays on screen.
  - Scroll away and back — the animations should NOT automatically replay
    just from re-entering the viewport a second time unless that matches
    the existing Ken Burns observer's own replay behavior (check what it
    does and mirror it for consistency).
- **Done when**: both animation families run a bounded number of times
  triggered by viewport entry, matching the existing Ken Burns observer
  pattern, with reduced-motion still fully disabling them.
