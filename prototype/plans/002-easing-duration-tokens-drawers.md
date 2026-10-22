# 002 — Add shared easing/duration tokens, unify drawer transitions

- **Status**: TODO
- **Commit**: 83da3e2
- **Severity**: MEDIUM
- **Category**: Cohesion & tokens (consolidates easing budget finding too)
- **Estimated scope**: 1 file (`style.css`), ~5 edits

## Problem

`style.css` has no shared easing/duration custom properties — every rule
hand-types its own curve. Two drawers that do the exact same job (a panel
sliding in from an edge) use different values for no reason:

```css
/* style.css:1263-1266 — current (mobile-nav-sheet, inside @media max-width:900px) */
  transform: translateY(100%);
  transition: transform 0.3s ease;
}
.mobile-nav-sheet.is-open { transform: translateY(0); }
```

```css
/* style.css:1283-1286 — current */
.cart-drawer {
  ...
  transform: translateX(100%);
  transition: transform 0.25s ease;
}
.cart-drawer.is-open { transform: translateX(0); }
```

Both use plain `ease` (a weak, symmetric built-in curve) instead of a strong
custom curve, and disagree on duration (0.3s vs 0.25s) despite being the same
kind of interaction.

## Target

```css
/* style.css :root — target, new tokens added after --max-width */
:root {
  --primary-color: #ec1f7a;
  --primary-color-dark: #b3155c;
  --secondary-color: #00e5ff;
  --background-color: #0a0a0c;
  --background-alt: #131316;
  --text-color: #f5f5f7;
  --text-muted: #a3a3ab;
  --border-color: #2a2a2f;
  --font-display: "Oswald", "Arial Narrow", "Helvetica Neue", Arial, sans-serif;
  --font-body: "Manrope", "Helvetica Neue", Arial, sans-serif;
  --radius: 10px;
  --max-width: 1160px;
  --ease-out: cubic-bezier(0.23, 1, 0.32, 1);
  --ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);
  --ease-drawer: cubic-bezier(0.32, 0.72, 0, 1);
  --duration-drawer: 280ms;
}
```

```css
/* style.css:1263-1266 — target */
  transform: translateY(100%);
  transition: transform var(--duration-drawer) var(--ease-drawer);
}
.mobile-nav-sheet.is-open { transform: translateY(0); }
```

```css
/* style.css:1283-1286 — target */
.cart-drawer {
  ...
  transform: translateX(100%);
  transition: transform var(--duration-drawer) var(--ease-drawer);
}
.cart-drawer.is-open { transform: translateX(0); }
```

## Repo conventions to follow

- All existing design tokens live in the single `:root` block at the top of
  `style.css:5-17`. Add the new motion tokens inside that same block,
  immediately after `--max-width: 1160px;` — do not create a second `:root`
  block.
- The Producto carousel already hand-types a strong ease-out curve
  (`style.css:493`: `cubic-bezier(0.22, 1, 0.36, 1)`) and a separate one for
  panel fades (`style.css:557`: `cubic-bezier(0.22, 1, 0.36, 1)` again, inside
  the `qs-text-in` keyframe). Leave those untouched — they are already
  correct and are a different (marketing/explanatory) context than the UI
  drawers this plan touches. Do not replace them with the new tokens; this
  plan only scopes `.mobile-nav-sheet` and `.cart-drawer`.

## Steps

1. In `style.css`, inside the `:root { }` block (lines 5-17), after the line
   `--max-width: 1160px;`, add:
   ```css
   --ease-out: cubic-bezier(0.23, 1, 0.32, 1);
   --ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);
   --ease-drawer: cubic-bezier(0.32, 0.72, 0, 1);
   --duration-drawer: 280ms;
   ```
2. At `style.css:1264` (inside the `.mobile-nav-sheet` rule, within the
   `@media (max-width: 900px)` block), change:
   `transition: transform 0.3s ease;`
   to:
   `transition: transform var(--duration-drawer) var(--ease-drawer);`
3. At `style.css:1285` (inside `.cart-drawer`), change:
   `transition: transform 0.25s ease;`
   to:
   `transition: transform var(--duration-drawer) var(--ease-drawer);`

## Boundaries

- Do NOT touch the Producto carousel's own curves (`style.css:493`, `506`,
  `548`, `557`) — out of scope, already correct.
- Do NOT touch `index.html`, `catalogo.html`, `negocios.html`, `eventos.html`,
  or `script.js`.
- Do NOT add tokens for every single transition in the file in this plan —
  only the four tokens listed above. Plan 003 will consume `--ease-out` for
  its own fixes; do not duplicate token definitions there.
- If `style.css:1264` or `:1285` no longer contain `transition: transform 0.3s ease;` / `transition: transform 0.25s ease;` respectively (drift since commit 83da3e2), STOP and report instead of guessing.

## Verification

- **Mechanical**: `grep -n "ease-drawer\|duration-drawer" style.css` should return the `:root` definition plus exactly two usages (mobile-nav-sheet and cart-drawer).
- **Feel check**:
  - Open `index.html` in a viewport under 900px wide, open the mobile nav
    sheet (hamburger menu) and the cart drawer (if reachable) — both should
    slide in with the same snappy, slightly-decelerating feel (an iOS-sheet
    character), not the generic linear-ish `ease` feel from before.
  - In DevTools' Animations panel, set playback to 10% and confirm both
    drawers now share the same curve shape and duration.
  - Toggle `prefers-reduced-motion` (Rendering panel) and confirm
    `.mobile-nav-sheet`'s existing reduced-motion override (`style.css:1269-1270`, already sets `transition: none`) still applies — it reads `transition: none` unconditionally so it is unaffected by this change, just confirm it still works.
- **Done when**: both drawers use `var(--ease-drawer)` and `var(--duration-drawer)`, and the four new tokens exist in `:root` exactly once.
