# 001 — Gate `:hover` states behind `(hover: hover) and (pointer: fine)`

- **Status**: TODO
- **Commit**: 83da3e2
- **Severity**: MEDIUM
- **Category**: Accessibility
- **Estimated scope**: 1 file (`style.css`), ~24 selectors touched

## Problem

None of the site's `:hover` rules are gated behind a hover-capable-pointer media
query. On touch devices, tapping an element fires `:hover` and the state stays
"stuck" (background tinted, icon scaled, button lifted) until the user taps
something else — a well-known mobile web bug. This affects every interactive
element on every page (`index.html`, `catalogo.html`, `negocios.html`,
`eventos.html` all share `style.css`).

Representative current code (full list of lines to change is in Steps):

```css
/* style.css:98 — current */
.btn:hover { transform: translateY(-2px); }

/* style.css:1178 — current */
.ig-tile:hover img { transform: scale(1.08); }

/* style.css:1843 — current */
.whatsapp-float:hover { transform: scale(1.08); }

/* style.css:1518 — current */
.ugc-action:hover .ugc-action-icon { transform: scale(1.12); }
```

## Target

Every cosmetic `:hover` rule wrapped in:

```css
@media (hover: hover) and (pointer: fine) {
  .btn:hover { transform: translateY(-2px); }
}
```

So on a touch-only device (no fine pointer that can truly "hover"), the rule
never applies and tapping never leaves a stuck visual state.

## Repo conventions to follow

- The codebase already uses plain `@media (max-width: …)` blocks for
  responsive overrides (e.g. `style.css:1850-1905`) — follow the same block
  style: one `@media (hover: hover) and (pointer: fine) { … }` wrapper can
  hold multiple related selectors, it does not need to be one block per rule.
- Exemplar of the existing (manual, incomplete) workaround for this exact
  problem: `style.css:1876-1887` resets `.nav-dropdown a:hover` and
  `.nav-dropdown--preview .nav-preview-card:hover` back to neutral inside the
  `max-width: 900px` mobile block. That workaround can stay — gating the
  source rule makes it redundant but harmless. Do not delete it (out of
  scope).

## Steps

1. In `style.css`, locate each selector below and wrap it (or group adjacent
   ones together in one wrapper) in `@media (hover: hover) and (pointer: fine) { }`.
   Do not change the declarations inside — only add the wrapper.

   Lines to wrap (selector shown for identification; wrap the full rule
   block at that line):
   - `style.css:98` `.btn:hover`
   - `style.css:100` `.btn-primary:hover`
   - `style.css:102` `.btn-outline:hover`
   - `style.css:104` `.btn-light:hover`
   - `style.css:152` `.main-nav a:hover`
   - `style.css:207` `.nav-dropdown a:hover`
   - `style.css:231` `.nav-dropdown--preview .nav-preview-card:hover`
   - `style.css:337` `.hero-arrow:hover`
   - `style.css:534` `.qs-seq-arrow:hover`
   - `style.css:661` `.qs-seq-cta:hover`
   - `style.css:998` `.qty-btn:hover`
   - `style.css:1178` `.ig-tile:hover img`
   - `style.css:1179` `.ig-tile:hover .ig-tile-overlay` (and its paired selector on the next line)
   - `style.css:1209` `.cart-button:hover`
   - `style.css:1311` `.cart-qty-btn:hover`
   - `style.css:1355` `.event-card:hover` (and its paired selector)
   - `style.css:1431` `.event-preview-card:hover`
   - `style.css:1518` `.ugc-action:hover .ugc-action-icon`
   - `style.css:1766` `.custom-select-trigger:hover`
   - `style.css:1789` `.custom-select-options li:hover` (and its paired selector)
   - `style.css:1809` `.footer-nav a:hover`
   - `style.css:1821` `.footer-contact-link:hover`
   - `style.css:1843` `.whatsapp-float:hover`

2. **Do NOT wrap these three** — they are not cosmetic hover-only effects,
   they gate real functionality or already live inside a `max-width` block
   meant for small/touch screens:
   - `style.css:208` `.nav-item:hover .nav-dropdown` / `.nav-item:focus-within .nav-dropdown` — this is how the desktop dropdown opens; it already has a `:focus-within` fallback for keyboard/touch, leave as-is.
   - `style.css:1115` `.marquee:hover .marquee-track { animation-play-state: paused; }` — pausing an infinite marquee on hover is a nice-to-have on desktop only anyway; wrapping it is fine but not required. If wrapped, keep it with the others in step 1.
   - `style.css:1876-1887` (the `max-width: 900px` resets) — leave untouched per Repo conventions above.

## Boundaries

- Do NOT touch `index.html`, `catalogo.html`, `negocios.html`, `eventos.html`, or `script.js`.
- Do NOT change any color/transform/background values — only add the media query wrapper.
- Do NOT remove the existing `max-width: 900px` hover resets.
- If a selector listed above has drifted (line number or exact text no longer matches), STOP and report instead of guessing which rule was meant.

## Verification

- **Mechanical**: open `style.css` and confirm every selector from Step 1 is now nested inside an `@media (hover: hover) and (pointer: fine) { }` block, and the three exclusions from Step 2 are unchanged.
- **Feel check**:
  - In Chrome DevTools, toggle device emulation to a touch device (e.g. "iPhone 14"), reload `index.html`, tap the hero CTA button and the WhatsApp float button. Confirm neither stays visually "pressed/hovered" after the tap.
  - With device emulation off (real mouse), hover the same buttons and confirm the hover effects (lift, scale, color change) still work exactly as before.
- **Done when**: no cosmetic hover effect sticks after a tap in touch emulation, and nothing regresses on desktop mouse hover.
