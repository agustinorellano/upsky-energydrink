# 005 — Add scroll reveal + stagger to card grids that currently teleport in

- **Status**: TODO
- **Commit**: 83da3e2
- **Severity**: LOW
- **Category**: Missed opportunity
- **Estimated scope**: 2 files (`index.html`, `style.css`), small

## Problem

`.product-card` (Formatos section) and `.event-preview-card` have no reveal
animation at all — they're simply present in the layout with no fade/rise on
scroll, unlike `.ficha-attr` which already uses `.qs-reveal`
(`index.html:248,260,272,284`) but without any stagger between the four.

```html
<!-- index.html:385 — current, repeated 3× for product-card -->
<article class="product-card">
```

```html
<!-- index.html:541 — current -->
<a href="eventos.html" class="event-preview-card">
```

```css
/* style.css:751-755 — current, the existing reveal primitive */
.qs-reveal { opacity: 0; transform: translateY(18px); transition: opacity 0.6s ease, transform 0.6s ease; }
.qs-reveal.is-visible { opacity: 1; transform: none; }
@media (prefers-reduced-motion: reduce) {
  .qs-reveal { opacity: 1; transform: none; transition: none; }
}
```

## Target

Apply the existing `.qs-reveal` class to the product cards and event preview
card, add a small stagger, and tighten the existing reveal's own easing
(currently plain `ease`) to the shared `--ease-out` token from Plan 002.

```html
<!-- index.html:385 — target, repeated for all 3 product-card instances -->
<article class="product-card qs-reveal">
```

```html
<!-- index.html:541 — target -->
<a href="eventos.html" class="event-preview-card qs-reveal">
```

```css
/* style.css:751-755 — target */
.qs-reveal { opacity: 0; transform: translateY(18px); transition: opacity 0.5s var(--ease-out), transform 0.5s var(--ease-out); }
.qs-reveal.is-visible { opacity: 1; transform: none; }
@media (prefers-reduced-motion: reduce) {
  .qs-reveal { opacity: 1; transform: none; transition: none; }
}

/* new, appended near .qs-reveal */
.product-grid .qs-reveal:nth-child(2) { transition-delay: 60ms; }
.product-grid .qs-reveal:nth-child(3) { transition-delay: 120ms; }
```

(Replace `.product-grid` above with whatever the actual parent container
class of the three `.product-card` elements is — confirm by reading
`index.html` around line 383-414 before writing this rule; do not guess.)

## Repo conventions to follow

- `.qs-reveal` plus an `is-visible` class toggled by an `IntersectionObserver`
  is the established reveal pattern already used for `.ficha-attr` — reuse
  it rather than inventing a second reveal mechanism. Confirm in `script.js`
  which observer currently watches `.qs-reveal` elements (search for
  `qs-reveal` or `is-visible` in `script.js`) — it should already pick up
  newly-added `.qs-reveal` elements automatically with no JS change needed,
  since it very likely queries `document.querySelectorAll('.qs-reveal')` at
  init. If it does NOT automatically pick up new elements (e.g. it hardcodes
  specific IDs), STOP and report instead of improvising new JS.
- Use `var(--ease-out)` from Plan 002, don't hand-type a new curve.
- Stagger values (60ms, 120ms) follow the 30-80ms-per-item guidance from the
  audit; for 3-4 items, 60ms steps keep the whole group settling well under
  300ms total spread.

## Steps

1. Read `script.js` to confirm how `.qs-reveal` elements get observed and
   confirm it is a generic `querySelectorAll('.qs-reveal')` (or equivalent)
   that will automatically include any new elements carrying that class,
   with no per-element registration needed.
2. In `index.html`, add the class `qs-reveal` to the three `.product-card`
   elements (around lines 385, 396, 407 — confirm exact lines first, they
   may have shifted).
3. In `index.html`, add the class `qs-reveal` to the `.event-preview-card`
   element (around line 541).
4. In `style.css`, change the `.qs-reveal` transition (lines 751-755) from
   `0.6s ease` to `0.5s var(--ease-out)` on both the opacity and transform
   transitions, keeping everything else in that rule identical.
5. In `style.css`, near the `.qs-reveal` rule, add two stagger rules scoped
   to the actual parent container of the three product cards (read the
   container's class from `index.html` first — do not assume `.product-grid`,
   confirm it), targeting the 2nd and 3rd card with `transition-delay: 60ms`
   and `transition-delay: 120ms` respectively.

## Boundaries

- Do NOT add a stagger rule for `.event-preview-card` — there is only one of
  it, stagger doesn't apply.
- Do NOT touch `.ficha-attr`'s existing `.qs-reveal` usage or add a stagger
  to it unless you confirm its four instances share a common parent selector
  cleanly — if the parent selector is ambiguous (e.g. would also match
  unrelated `.qs-reveal` elements elsewhere), skip the ficha stagger and
  leave it as a follow-up, do not risk a selector collision.
- Do NOT touch `script.js` unless Step 1 reveals the observer does NOT
  auto-pick-up new `.qs-reveal` elements — in that case STOP and report
  rather than modifying the observer yourself.
- Depends on Plan 002 for the `--ease-out` token; apply 002 first.

## Verification

- **Mechanical**: `grep -n "qs-reveal" index.html` should show the four
  existing `.ficha-attr` usages plus the newly added ones on product cards
  and the event preview card.
- **Feel check**:
  - Reload `index.html`, scroll down to the "Elegí tu formato" section —
    the three product cards should fade/rise in with a slight stagger
    (not all three popping simultaneously), each taking about half a
    second.
  - Scroll to the events preview section and confirm the single card also
    reveals the same way.
  - Toggle `prefers-reduced-motion` and confirm all of the above appear
    instantly with no animation (existing reduced-motion override in
    `.qs-reveal` already handles this, just confirm it still works after
    the easing/token change).
- **Done when**: all newly-tagged elements use `.qs-reveal`, the reveal
  transition uses `var(--ease-out)`, and the product cards stagger visibly
  without affecting any other `.qs-reveal` usage on the page.
