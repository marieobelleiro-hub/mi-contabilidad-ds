# Mi Contabilidad Design System · Instructions for AI assistants

You are building screens for **Mi Contabilidad**, an accounting app for freelancers in Spain (UI text in Spanish). Use this design system and nothing else. If something you need doesn't exist here, say so instead of inventing it.

**Version 0.1 · first version, in progress.** Components will change; always read the current files.

## Sources of truth

| What | Where |
|---|---|
| Every token (value, type, description) | `dist/tokens.json` (W3C Design Tokens format) · `tokens/tokens.css` |
| Styles of every component | `dist/mi-contabilidad-ds.css` · `components/<name>/<name>.css` (the header comment lists classes, variants and markup) |
| Icons | `icons/icons.js` · `dist/icons/<name>.svg` · sprite `dist/mi-contabilidad-ds-icons.svg` |
| Charts | `components/chart/chart.js` (`lineChart`, `barChart`) |
| Human documentation | Storybook (`npm run storybook`) |
| Design (Figma library) | "Mi Contabilidad DS" — every story links to its component in the Design tab (`.storybook/figma.js`, `figma('node-id')` at the end of each stories file) |

## Rules (always)

1. **Tokens only.** Never write a raw colour, size, weight, line height, duration or z-index. Always `var(--token)`. `npm run lint` fails otherwise.
2. **Use role tokens, not the palette.** `--primary`, `--attention`, `--income`, `--expense`, `--text`, `--surface`… never `--blue`, `--orange`, `--gray-*` in components. Exception: `--white` / `--black` for text on a coloured background.
3. **Two action colours.**
   - `--primary` (blue): the main action of the screen, Facturación and IRPF sections.
   - `--attention` (orange): an action that must not be skipped (Guardar: if the user leaves, changes are lost), pending things, Gastos and IVA sections.
   - Never two solid buttons side by side.
4. **One orange for all text.** `--attention` (#B64407) passes AA on white, the orange tint, `--canvas` and `--fill`; `--attention-dark` is only the pressed state.
5. **Don't rely on colour alone.** If a colour or bold text means something (paid, error, to pay), the words say it too (visible text or `aria-label`).
6. **Spacing:** only `--space-2 4 8 12 16 20 24 32 40 48`.
7. **Typography:** six styles, five sizes (`--text-24 16 14 12 10`).
   - Sans: weights 300 (big dates and years only), 400, 500 (amounts, totals).
   - Mono: weights 400 and 700.
   - Uppercase only with `text-transform` plus `--ls-caps`, never typed in capitals.
8. **Accessibility:**
   - Real `<button>` / `<a>`, never a clickable `<div>`.
   - Icon-only buttons need an `aria-label`; icons get `aria-hidden="true"`.
   - Minimum target 24 × 24px.
   - Keep the global yellow focus ring: never set `outline:none` without a replacement.
   - Dialogs use native `<dialog>` with `showModal()`.
   - Toasts use `role="status"`; warning and error banners use `role="alert"`.
9. **Square corners by default** (`--radius-none`). Only cards (`--radius-md`), chips, bars and the switch are rounded.
10. **One breakpoint: 1024px** (`--bp-desktop`). Mobile layout up to 1023px, desktop from 1024px. Write media queries only as `@media (max-width:1023px)` or `@media (min-width:1024px)` (CSS can't read tokens there; lint checks it).
    - Desktop: sidebar `--sidebar-w` 124 + content `--content-max-w` 1108 = design width `--page-w` 1232.
    - Mobile: no sidebar, section / period selectors on top, one column (max `--mobile-max-w` 768, centred), floating buttons in `.fab-dock`; design width `--mobile-w` 390.

## Type styles

| Style | Spec | Use |
|---|---|---|
| Display | 24 · Sans | Big numbers: amounts, dates, years |
| Title | 16 · Sans | Card and panel titles |
| Body | 14 · Sans | Text, forms, dialogs |
| Small | 12 · Sans | Table cells, list rows, legends |
| Label | 12 · Mono | Navigation, tabs, ghost buttons, headers (uppercase) · card subtitles |
| Caption | 10 · Mono | Chart axes, code chips |

## Components

Each one is plain HTML with CSS classes (BEM: `block`, `block__part`, `block--variant`).

| Component | Root | Variants & options | Must have |
|---|---|---|---|
| **Button** | `.btn` | Big (default, 48px, 160–296px, full width on mobile): `--primary` / `--attention`, optional icon left and/or right, each its own (✓ Guardado 💾: `check` left + `save` right; with icons the content starts on the left, the right icon at the far right; no icons: centred): `arrow-right`, `save`, `check`, `download`, `trash`, `plus`, `chevron-down` · Ghost `--ghost` (24px): `--primary` / `--attention`, optional icon left (`plus` by default, same list) · Icon `--icon` + `--sm` 24 / `--md` 40: `--info` (blue) / `--danger` (grey → red) · big `--danger` = red confirm action (danger alerts, future) · Floating `.fab` 40px circle: `--outline` / `--filled`, open = `aria-expanded="true"` (orange ring), mobile `.fab-dock` · label in `.btn__label` (one line, cut with …) | `<button>`; icon-only → `aria-label`; states: hover, pressed, focus, `disabled` |
| **Tab** | `.tab` in `.tab-list` | `--brand` / `--primary` / `--attention` · `--outline` · `--fixed` · `.tab-list--fluid` / `--vertical` · year tab `.year-tab` (always green: selected · unselected, hover green bar · disabled = future year) composed into `.year-strip` (max 6 years, newest left) · selector: `.tab--menu` in `.tab-menu` + `.tab-menu__list` (mobile section selector in the section colour, period selector `--neutral`) | tabs: `role="tablist"` + `role="tab"` + `aria-selected`; navigation: `<a aria-current="page">`; selector: `aria-expanded`, `aria-controls`, Esc closes |
| **Selectors** | `.check` · `.status` · `.status-btn` · `.switch` · `.chip` | checkbox / radio `.check` (+ `--sm` 16px in tables), colour from `field--primary` / `--attention` · status dot `status--paid` / `--pending` (every dot has a 1px ring), `.status-label` (dot + text), `.status-btn` (clickable) · switch / toggle `.switch` (on / off, e.g. language Esp / Eng) · choice card `.choice` (radio = one choice, checkbox = several; a card with title + description, in `.choice-group` with a `<legend>`) · static chips `chip--brand` / `--code` | native `<input>` in a `<label>`; dots always have words (`aria-label` or visible label); switch: `<button class="switch__control" role="switch" aria-checked aria-label>` with the two words outside it, `aria-hidden` (label in name); chips are not clickable |
| **Card** | `.card` | KPI card `--kpi`: `__label` (black · `__label--primary` blue · `--attention` orange) + `__amount` (black · `__amount--primary` · `--attention`) + optional `__sub` (black). Dashboard: coloured label, black amount · sections: black label, amount in the section colour, pending always orange · `--interactive` (whole card is a link, hover shadow) · `.is-selected` + `aria-current` (outline, colour from `card--primary` / `--attention`) · `.is-disabled` + `aria-disabled` (other periods) · container: `__header __title __body __footer` · tax form = `--sectioned` + `__due` (deadline, orange) + `__section`/`__section-title`, rows `.list .row--kv` with `chip--code`, totals `.result` (`--sm` subtotal, `--pay`) · `.card-grid--2/--4` · `card__text` (explanation under the header, Cálculo del salario) · cards and containers are fully responsive (one component for desktop and mobile) | parts: `__header __title __body __footer __label __amount __sub __section __section-title` |
| **List row** | `.list` + `.row` | record · `row--kv` · `row--bar` · `.list--compact` · `.list--sm` | parts: `__lead __title __meta __value __trail __label __bar-cell` |
| **Tables** | `.table` in `.table-wrap`, inside a card | five tables: Últimas facturas (dashboard: `.list .row` records, only the status dot works) · tax forms Modelo 303 / 130 (`card--sectioned`, results `--pay` / `--credit` / `--none`; compensation block IVA only; IRPF can be negative, compensated in the annual return) · Facturación (nacionales · exentas), Gastos (por cat. IRPF · por % IVA; Seguridad Social: no IVA, "Cuota"; Otros desgravables: + Objeto), Resumen anual (`--summary`: IVA → 390, IRPF → 100) · states: editable (a quarter: `.table__input --code --num`, `.table__select`, `.table__pick` for Cat. IRPF, `.table__check` 303) · read only (Resumen anual: plain text, no delete, no Añadir) · empty (`.table__empty`) · `--primary` / `--attention` · cells `.is-num .is-center .is-strong .is-muted .is-group .is-rate` · `<col class="col-xs|sm|md|lg">` · delete: `close-filled` desktop, `trash` mobile · **mobile = no table**: `.records > .record` (one block per row) · summary on mobile = one `card__section` per quarter with `row--kv` | inputs in cells need an `aria-label` naming column and row |
| **Input** | `.field` + `.input` | only fields (checkbox/switch → Selectors, table cells → Tables) · colour `field--primary` / `--attention` or on the form `form--primary` / `--attention` · `--tinted` / `form--tinted` **only** in the mobile forms · amounts in forms: Sans, left, `inputmode="decimal"` · `.input--sm .input--num .input--w-sm` = the two numbers typed in the tax forms (Mono, right) · `.field--inline` only for Clientes (Cálculo del salario) · `.field__total` (Total gasto) · types: text · amount (`inputmode="decimal"`) · date (DD/MM/AAAA, label "Fecha · year") · dropdown · description (textarea) · amount has two sizes: regular 40px (forms) and small 24px (tax forms: label on the left, optional = checkbox before the label) · required → `aria-required`, optional → "(opcional)" · the mobile forms (Nueva factura nacional · exenta · Nuevo gasto from a category or an IVA rate) come from `components/input/entry-form.js` and are documented on Input | `<label for>`; hints/errors via `aria-describedby`; errors: `aria-invalid="true"` + `.field__error` with the app's own message |
| **List row · Result** | `.result` | `--pay` / `--credit` / `--none` · `--sm` · `--footer` | `role="status"`; the label says the state in words |
| **Banner** | `.banner` | `--info` / `--warning` / `--error` · `--sm` · only `--warning` is used in the app today (Modelo 303); the others are ready, shown with placeholder text | info `role="status"`, warning/error `role="alert"` |
| **Tooltip** | `.tooltip` in `.tooltip-wrap` | `--end` · `--dark` (charts) | opened by an ⓘ `<button aria-expanded>`; Esc closes |
| **Toast** | `.toast` | `.is-visible` · `--start` (bottom left) · `.toast__action` (Deshacer) | `role="status" aria-live="polite"` |
| **Dialog** | `<dialog class="dialog">` | types: informative (blue, `--md`: Continuar · Entendido · Descargar · Guardar) · attention (orange, `--sm`, `alertdialog`: Entendido · Guardar) · error (red `btn--danger`, `--sm`, `alertdialog`: Confirmar · Entendido) · multi-option (`choice` cards, `--md`) · optional ghost Cancelar on the left (`__actions--split`) · optional language switch (`__top`) · parts `__top` (language switch) `__header __title __body __actions` (`--split`: Cancelar left) | `showModal()`, `aria-labelledby` |
| **Chart** | `.chart` | `lineChart(el, cfg)` · `barChart(el, cfg)` from `chart.js` | colours `--chart-1` (income), `--chart-2` (expense), `--chart-compare`; a data table is built in. Horizontal bars (Distribución del gasto) = `.list--bars` + `row--bar`, **one** section colour (no shade scales) |

## Sub-system · Chatbot (Asistente inteligente in the app)

Load `dist/mi-contabilidad-ds-assistant.css` **after** the main CSS. Tokens start with `--ai-` (`assistant/tokens.css`, `dist/tokens-assistant.json`); fonts, scale, spacing, icons and focus come from the main system.

| Part | Root | Notes |
|---|---|---|
| Panel | `.ai-panel` | `role="dialog" aria-modal="false"`, own `lang` · `--full` · mobile: bottom sheet · `__head` (`__title` H2 + main `.switch` + `.ai-head-btn` maximize / minimize / close) · `__body` · `__hello` · `__log` (`role="log" aria-live="polite"`) · `__foot` (`__engine` + ghost "Borrar conversación") |
| Messages | `.ai-msg--user` / `--bot` | hidden "Tú:" / "Asistente:" first · headings `h3` · `__note` (orange bar) · `__meta` · `.ai-typing` (`aria-hidden`) |
| Suggestion chips | `.ai-chips > .ai-chip` | real `<button>`s · `--primary` for the one expected step |
| Composer | `.ai-composer` | `__input` (hidden label) + `__send` (`aria-label="Enviar"`) · the focus ring is on the box (`:focus-within`) |
| Question & form cards | inside `.ai-msg--bot` | main `.check-group`, `.field`/`.input` with `form--primary|attention form--tinted`, ghost + big buttons · `.ai-form` (`__title`, `__total`, `__actions`) |

## Sub-system · Accessibility assistant (Acceso fácil in the app)

Load `dist/mi-contabilidad-ds-acceso.css` **after** the main CSS. Dark theme. Tokens start with `--af-` (`acceso/tokens.css`, `dist/tokens-acceso.json`); fonts, scale, spacing, icons and focus come from the main system. Everything you read or type is 16px.

| Part | Root | Notes |
|---|---|---|
| Panel | `.af-panel` | `role="dialog" aria-modal="false"`, own `lang` · `--full` · mobile: bottom sheet · `__head` (`__title` H2 Mono 12 bold caps + main `.switch` + `.af-head-btn`) · `__body` · `__hello` |
| Steps & options | `.af-step` (`role="group"`, named by its question) > `__label` + `__options` > `.af-option` (`aria-pressed`) | `.is-done .has-choice` once answered (label shows only "1.", question stays as `.sr-only`) · `.af-option--primary` = Guardar |
| Answer | `.af-answer` | `__head` (`__label` "Respuesta" H3 `tabindex="-1"`: focus lands here, + `__rule`) · `h4` · `p` · `ul` · `.af-note` · `.af-status` (`role="status"`) |
| Form on dark | `.af-form` | main `.field`/`.input`/`.check` (recoloured) · yes/no as `.af-option-radio` in `.af-option-group` (`<fieldset>`) |
| Footer | `.af-foot > .af-link` | Volver · Empezar de nuevo |

## Icons

There are 14 icons: `arrow-right`, `download`, `minimize`, `plus`, `trash`, `info`, `close`, `close-filled`, `check`, `chevron-down`, `chevron-sort`, `menu`, `maximize`, `save`.

- 16 × 16 grid, single colour (`currentColor`), sizes `--icon-sm` 16 and `--icon-md` 24.
- HTML: `<svg class="icon" aria-hidden="true"><use href="#ico-trash"/></svg>`
- JS: `icon('trash')` or `icon('trash', { label: 'Eliminar' })`

## Before you finish

- Run `npm run lint`: it must say *tokens only*.
- Check contrast and that every interactive element works with the keyboard.
