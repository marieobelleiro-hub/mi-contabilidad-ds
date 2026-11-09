// Showcase: foundations, tokens and every component on one page.
// Everything is rendered from the real design-system files, so the page can't drift from the library.
import './showcase.css';
import { version } from '../package.json';
import { bigHTML, ghostHTML, iconButtonHTML, fabHTML } from '../components/button/button.stories.js';
import { tabHTML, YearStrip, yearTabHTML, sectionSelector, periodSelector } from '../components/tab/tab.stories.js';
import { chipHTML, statusHTML, checkHTML, switchHTML, choiceHTML } from '../components/selectors/selectors.stories.js';
import { kpiCardHTML } from '../components/card/card.stories.js';
import { showcaseTables } from '../components/table/table.stories.js';
import { fieldHTML, FIELDS } from '../components/input/input.stories.js';
import { bannerHTML } from '../components/feedback/feedback.stories.js';
import { Alert as DialogAlert } from '../components/dialog/dialog.stories.js';
import { formHTML, groupHTML, menuHTML } from '../components/menu/menu.stories.js';
import { lineChart, barChart } from '../components/chart/chart.js';
import { ICONS, icon } from '../icons/icons.js';
import { tokenList, TOKEN_COUNT } from '../foundations/token-list.js';
import { layoutOverview } from '../foundations/layout-diagram.js';

/* ── Page structure ───────────────────────────────────────────────────────── */
const docs = (id) => `./?path=/docs/${id}`;
const FOUNDATIONS = [
  ['colors', 'Colors', 'app-foundations-colors--docs'],
  ['typography', 'Typography', 'app-foundations-typography--docs'],
  ['spacing', 'Spacing', 'app-foundations-spacing-radius-elevation--docs'],
  ['shape', 'Radius, borders & elevation', 'app-foundations-spacing-radius-elevation--docs'],
  ['layout', 'Layout & breakpoints', 'app-foundations-layout-breakpoints--layout'],
  ['icons', 'Icons', 'app-foundations-icons--docs'],
];
const COMPONENTS = [
  // [id, group, docs, the components of the group = the entries of the sidebar = the Figma components]
  ['button', 'Button', 'app-components-button--button', ['Big button', 'Ghost button', 'Icon button', 'Floating button']],
  ['tab', 'Tab', 'app-components-tab--tab', ['Tab', 'Tab · selector', 'Year tab', 'Year strip']],
  ['selectors', 'Selectors', 'app-components-selectors--selectors', ['Checkbox & radio', 'Choice card', 'Status dot', 'Switch', 'Chip']],
  ['card', 'Card', 'app-components-card--card', ['KPI card']],
  ['input', 'Input', 'app-components-input--input', ['Field', 'Amount · small', 'Description', 'Field · inline']],
  ['lists', 'Lists & menus', 'app-components-lists-menus--lists', ['Form', 'Selector group', 'Menu']],
  ['table', 'Tables', 'app-components-tables--tables', ['Facturación', 'Gastos', 'Últimas facturas', 'Resumen anual', 'Tax forms']],
  ['feedback', 'Banner, tooltip & toast', 'app-components-banner-tooltip-toast--feedback', ['Banner', 'Tooltip', 'Chart tooltip', 'Toast']],
  ['dialog', 'Dialog', 'app-components-dialog--dialog', ['Dialog']],
  ['chart', 'Chart', 'app-components-chart--chart', ['Chart · Line', 'Chart · Bars']],
];
const COMPONENT_COUNT = COMPONENTS.reduce((n, c) => n + c[3].length, 0);

const section = (id, title, docsId, lead, body, canvas = false) => `
  <section class="sc__section" id="sc-${id}" aria-labelledby="sc-${id}-t">
    <div class="sc__head">
      <div><h3 id="sc-${id}-t">${title}</h3>${lead ? `<p>${lead}</p>` : ''}</div>
      <a class="sc__docs" href="${docs(docsId)}" target="_top">Open docs →</a>
    </div>
    <div class="sc__panel${canvas ? ' sc__panel--canvas' : ''}">${body}</div>
  </section>`;
const row = (label, items) => `<div class="sc__row"><span class="sc__label">${label}</span><div class="sc__items">${items.join('')}</div></div>`;
const slot = (name) => `<div data-slot="${name}"></div>`;
/** A component on a canvas panel (cards, tables, charts): its name, then the component */
const block = (label, html) => `<div class="sc__block"><span class="sc__label">${label}</span>${html}</div>`;

/* ── Foundations ──────────────────────────────────────────────────────────── */
const swatch = (token, label) => `<div class="sc__swatch"><i style="background:var(${token})"></i><b>${label}</b><span>${token}</span></div>`;
const sw = (tokens) => `<div class="sc__swatches" style="flex:1">${tokens.map(([t, l]) => swatch(t, l)).join('')}</div>`;
const colors = `
  ${row('Palette · blue', [sw([['--blue-dark', 'dark'], ['--blue', 'base'], ['--blue-light', 'light'], ['--blue-tint', 'tint']])])}
  ${row('Palette · orange', [sw([['--orange-dark', 'dark'], ['--orange', 'base'], ['--orange-light', 'light'], ['--orange-tint', 'tint']])])}
  ${row('Actions & data', [sw([['--primary', 'primary'], ['--attention', 'attention'], ['--income', 'income'], ['--expense', 'expense']])])}
  ${row('Surfaces', [sw([['--canvas', 'canvas'], ['--surface', 'surface'], ['--fill', 'fill'], ['--disabled', 'disabled']])])}
  ${row('Text & lines', [sw([['--text', 'text'], ['--text-muted', 'text-muted'], ['--line-strong', 'line-strong'], ['--line', 'line']])])}
  ${row('Brand & states', [sw([['--brand', 'brand'], ['--positive-tint', 'positive-tint'], ['--error', 'error'], ['--focus', 'focus']])])}`;

const TYPE = [
  ['Display', 'font-size:var(--text-24);line-height:var(--leading-tight)', '1.778,23 €', '24 · Sans'],
  ['Title', 'font-size:var(--text-16)', 'Últimas facturas', '16 · Sans'],
  ['Body', 'font-size:var(--text-14)', 'Esta app ha sido concebida para organizar la contabilidad de trabajadores autónomos en España.', '14 · Sans'],
  ['Small', 'font-size:var(--text-12)', '30/09/2026 — Design Services', '12 · Sans'],
  ['Label', 'font-family:var(--font-mono);font-size:var(--text-12);text-transform:uppercase;letter-spacing:var(--ls-caps)', 'Facturación', '12 · Mono'],
  ['Caption', 'font-family:var(--font-mono);font-size:var(--text-10)', 'Ene · Feb · Mar · Abr', '10 · Mono'],
];
const typeface = `
  <div class="sc__face"><span style="font-family:var(--font-sans)">IBM Plex Sans</span><span style="font-family:var(--font-mono)">IBM Plex Mono</span></div>
  ${row('Scale · Sans', [`<div class="sc__scale">${[24, 16, 14, 12].map((px) => `<span style="font-size:var(--text-${px})">Plex ${px}</span>`).join('')}</div>`])}
  ${row('Scale · Mono', [`<div class="sc__scale" style="font-family:var(--font-mono)">${[14, 12, 10].map((px) => `<span style="font-size:var(--text-${px})">Plex ${px}</span>`).join('')}</div>`])}
  ${row('Weights · Sans', [`<div class="sc__scale">${[['Light', 300], ['Regular', 400], ['Medium', 500]].map(([n, w]) => `<span style="font-size:var(--text-16);font-weight:${w}">${n} (${w})</span>`).join('')}</div>`])}
  ${row('Weights · Mono', [`<div class="sc__scale" style="font-family:var(--font-mono)">${[['Regular', 400], ['Bold', 700]].map(([n, w]) => `<span style="font-size:var(--text-16);font-weight:${w}">${n} (${w})</span>`).join('')}</div>`])}`;
const typography = typeface + `<h4 class="sc__sub">Styles</h4>` + TYPE.map(([n, st, sample, spec]) => `<div class="sc__type"><span class="sc__label">${n}</span><span style="${st}">${sample}</span><code>${spec}</code></div>`).join('');

const spacing = [2, 4, 8, 12, 16, 20, 24, 32, 40, 48].map((v) => `<div class="sc__space"><b>--space-${v}</b><span>${v}px</span><i style="width:calc(var(--space-${v}) * 4)"></i></div>`).join('');

const shape = `
  ${row('Radius', [`<div class="sc__shapes">${[['0', '0', 'inputs, buttons'], ['--radius-sm', 'var(--radius-sm)', 'chips, bars'], ['--radius-md', 'var(--radius-md)', 'cards'], ['--radius-pill', 'var(--radius-pill)', 'toggle'], ['--radius-round', 'var(--radius-round)', 'dots']].map(([t, v, u]) => `<div class="sc__shape"><i style="border-radius:${v}"></i><b>${t}</b><span>${u}</span></div>`).join('')}</div>`])}
  ${row('Borders', [`<div class="sc__shapes">${[['1px', '1px solid var(--line-strong)', 'hairlines, fields'], ['2px', 'none;box-shadow:inset 0 0 0 2px var(--primary)', 'selected'], ['3px bar', 'none;border-left:var(--border-accent) solid var(--primary);background:var(--primary-tint)', 'banners']].map(([t, b, u]) => `<div class="sc__shape"><i style="border:${b}"></i><b>${t}</b><span>${u}</span></div>`).join('')}</div>`])}
  ${row('Elevation', [`<div class="sc__shapes">${['--shadow-sm', '--shadow-md'].map((t) => `<div class="sc__shape"><i style="border:none;box-shadow:var(${t})"></i><b>${t}</b></div>`).join('')}</div>`])}
  ${row('Focus ring', [`<button type="button" class="btn btn--primary" style="outline:2px solid var(--focus);outline-offset:2px;box-shadow:0 0 0 1px var(--black)">Focused</button><span class="sc__label">yellow ring + 1px black halo, everywhere</span>`])}`;

const icons = `
  <div class="sc__icons">${Object.entries(ICONS).map(([n, d]) => `
    <div class="sc__icon" title="${d.use}">
      <div class="sc__icon-art">${icon(n, { size: 'md' })}${icon(n)}</div>
      <b>${n}</b><span>${d.label}</span>
    </div>`).join('')}</div>
  ${row('In use', [bigHTML({ label: 'Continuar' }), ghostHTML({ label: 'Añadir factura' }), iconButtonHTML({ label: 'Más información' }), iconButtonHTML({ kind: 'danger', icon: 'trash', label: 'Eliminar' }), iconButtonHTML({ kind: 'danger', icon: 'close', size: 'md', label: 'Cerrar' })])}`;

/* ── Components ───────────────────────────────────────────────────────────── */
const C = {
  button: `
    ${row('Big button', [bigHTML({ label: 'Continuar' }), bigHTML({ colour: 'attention', label: 'Guardar', icon: 'save' }), bigHTML({ label: 'Entendido', showIcon: false }), bigHTML({ label: 'Guardar', state: 'disabled' })])}
    ${row('Ghost button', [ghostHTML({ label: 'Añadir factura' }), ghostHTML({ colour: 'attention', label: 'Añadir gasto' }), ghostHTML({ label: 'Ver todas las facturas', showIcon: false }), ghostHTML({ label: 'Cancelar', showIcon: false, state: 'disabled' })])}
    ${row('Icon button', [iconButtonHTML({ type: 'info', label: 'Más información' }), iconButtonHTML({ type: 'close', label: 'Cerrar aviso' }), iconButtonHTML({ type: 'remove', label: 'Eliminar factura 411' }), iconButtonHTML({ type: 'delete', label: 'Eliminar gasto' }), iconButtonHTML({ type: 'close', size: 'md', label: 'Cerrar' }), iconButtonHTML({ type: 'delete', label: 'Eliminar gasto', state: 'disabled' })])}
    ${row('Floating button', [fabHTML({}), fabHTML({ state: 'open' }), fabHTML({ style: 'filled', icon: 'accessibility' }), fabHTML({ style: 'filled', icon: 'accessibility', state: 'open' })])}`,
  tab: `
    ${row('Tab', [['brand', 'Dashboard', 'Facturación'], ['primary', 'Facturación', 'Gastos'], ['attention', 'Gastos', 'IVA']].map(([a, on, off]) => `<div class="tab-list" role="tablist" aria-label="${on}">${tabHTML({ label: on, accent: a, active: true })}${tabHTML({ label: off, accent: a })}</div>`).concat(['primary', 'attention'].map((a) => `<div class="tab-list" role="tablist" aria-label="${a} outline">${tabHTML({ label: a === 'primary' ? 'IRPF' : 'IVA', accent: a, outline: true, active: true })}${tabHTML({ label: a === 'primary' ? 'IVA' : 'IRPF', accent: a })}</div>`)))}
    ${row('Tab · selector', [slot('sel-section'), slot('sel-period')])}
    ${row('Year tab', [['selected', 2026], ['unselected', 2025], ['disabled', 2027]].map(([st, y]) => `<div class="year-strip" role="tablist" aria-label="Año ${st}" style="width:120px">${yearTabHTML({ year: y, state: st })}</div>`))}
    ${row('Year strip', [slot('years')])}`,
  selectors: `
    ${row('Checkbox & radio', [checkHTML({ label: 'Aplicar retención IRPF del 15 %' }), checkHTML({ type: 'attention', label: 'Aplicar compensación', checked: false }), checkHTML({ type: 'attention', size: 'sm', label: 'Incluir en el 303' }), checkHTML({ kind: 'radio', label: 'Versión actual (con datos)', name: 'sc-r' }), checkHTML({ type: 'attention', label: 'Incluir en el 303', state: 'disabled', checked: false })])}
    ${row('Choice card', [`<div class="sc__grid sc__grid--2 field--primary" style="flex:1">${choiceHTML({ name: 'sc-ch' })}${choiceHTML({ name: 'sc-ch', title: 'Versión vacía (sin datos)', desc: 'Para empezar desde cero.', checked: false })}${choiceHTML({ kind: 'checkbox', title: 'Versión actual (con datos)' })}${choiceHTML({ kind: 'checkbox', title: 'Versión vacía (sin datos)', desc: 'Para empezar desde cero.', checked: false })}</div>`])}
    ${row('Status dot', [statusHTML({ state: 'paid', mode: 'button' }), statusHTML({ state: 'pending', mode: 'button' }), statusHTML({ state: 'paid', mode: 'label' }), statusHTML({ state: 'pending', mode: 'label' })])}
    ${row('Switch', [switchHTML({}), switchHTML({ checked: true }), switchHTML({ showLabels: false })])}
    ${row('Chip', [chipHTML({ label: 'Contabilidad' }), chipHTML({ label: 'Demo' }), chipHTML({ variant: 'code', label: 'c.01' }), chipHTML({ variant: 'code', label: 'c.28' })])}`,
  card: block('KPI card', `
    <div class="sc__grid sc__grid--4">
      ${kpiCardHTML({ label: 'IVA a pagar', labelColor: 'attention', amount: '1.778,23 €', sub: 'Vence 20 de octubre', interactive: true })}
      ${kpiCardHTML({ label: 'Total facturado', amount: '50.790,36 €', amountColor: 'primary', sub: 'Base imponible' })}
      ${kpiCardHTML({ label: 'Pendiente de cobro', amount: '7.406,63 €', amountColor: 'attention', sub: '2 facturas' })}
      ${kpiCardHTML({ label: 'IRPF acumulado (3T)', amount: '3.508,86 €', amountColor: 'primary', showSub: false, state: 'selected' })}
    </div>`),
  table: showcaseTables(block),
  input: `
    ${row('Field', [`<div class="sc__grid sc__grid--3" style="flex:1">
      <div class="sc__stack">${fieldHTML({ ...FIELDS.proveedor })}${fieldHTML({ ...FIELDS.base, value: '37,65' })}</div>
      <div class="sc__stack">${fieldHTML({ ...FIELDS.fecha, value: '31/09/2026', error: FIELDS.fecha.msg })}${fieldHTML({ label: FIELDS.num.label, optional: true })}</div>
      <div class="sc__stack">${fieldHTML({ ...FIELDS.iva, hint: '' })}${fieldHTML({ ...FIELDS.cat, value: '' })}${fieldHTML({ ...FIELDS.proveedor, tinted: true, accent: 'attention' })}</div>
    </div>`])}
    ${row('Amount · small', [`<div class="field--attention" style="width:720px;max-width:100%"><div class="list">
      <div class="row row--kv"><label class="row__label" for="sc-sm1">Importe ingresado en Hacienda</label><input class="input input--sm input--num input--w-sm" id="sc-sm1" value="" placeholder="0,00" inputmode="decimal" aria-required="true"></div>
      <div class="row row--kv"><label class="check"><input type="checkbox" checked> Aplicar compensación</label><input class="input input--sm input--num input--w-sm" value="151,80" placeholder="0,00" inputmode="decimal" aria-label="Importe: Aplicar compensación"></div>
    </div></div>`])}
    ${row('Description', [`<div style="width:360px;max-width:100%">${fieldHTML({ label: FIELDS.notas.label, type: 'textarea', placeholder: FIELDS.notas.placeholder, filled: true, optional: true, accent: 'attention' })}</div>`])}
    ${row('Field · inline', [`<div style="width:720px;max-width:100%">${fieldHTML({ label: 'Clientes', value: 'Main client', inline: true })}</div>`])}`,
  feedback: `
    ${row('Banner', [`<div style="flex:1;max-width:720px">${bannerHTML({ type: 'warning', text: 'Sin facturación española → IVA soportado no deducible este trimestre.' })}</div>`])}
    ${row('Tooltip', [`<div class="tooltip" role="tooltip" style="position:static;width:auto;max-width:480px">El salario neto es calculado con esas facturas, restando los gastos del mes anterior, independientemente de si los pagos se hayan realizado.</div>`])}
    ${row('Chart tooltip', [`<div class="tooltip tooltip--dark" role="tooltip" style="position:static"><b>Julio</b><br><span class="tooltip__swatch" style="background:var(--income-light)"></span>Ingresos <b>8.203,35 €</b><br><span class="tooltip__swatch" style="background:var(--expense-light)"></span>Gastos <b>1.072,54 €</b></div>`])}
    ${row('Toast', [`<div class="toast toast--inline" role="status" style="width:400px;max-width:100%"><span>Factura 411 eliminada.</span><button type="button" class="toast__action">Deshacer</button></div>`])}`,
  lists: `
    ${row('Form', [`<div style="width:342px;max-width:100%">${formHTML({ form: 'gasto-cat' })}</div>`])}
    ${row('Selector group', [`<div class="sc__grid sc__grid--3" style="flex:1">${groupHTML({ kind: 'checkbox', selected: [0, 1] })}${groupHTML({ kind: 'radio', accent: 'attention' })}${groupHTML({ kind: 'choice' })}</div>`])}
    ${row('Menu', [`<div style="display:flex;flex-wrap:wrap;gap:var(--space-24);align-items:flex-start">${menuHTML({ kind: 'text', items: 'iva' })}${menuHTML({ kind: 'radio', accent: 'attention', items: 'iva' })}${menuHTML({ kind: 'checkbox', items: 'iva', selected: [0, 2] })}</div><p class="sc__label" style="margin:var(--space-8) 0 0">Not in the app yet: the app uses the browser's own menus</p>`])}`,
  dialog: row('Dialog', [`<div style="width:400px;max-width:100%">${DialogAlert.render().outerHTML}</div>`]),
  chart: `<div class="sc__grid sc__grid--2">
      ${block('Chart · Line', `<section class="card"><div class="card__header"><h4 class="card__title">Comparativa Ingresos · Gastos</h4></div>${slot('line')}</section>`)}
      ${block('Chart · Bars', `<section class="card"><div class="card__header"><h4 class="card__title">Comparativa salario neto</h4></div>${slot('bar')}</section>`)}
    </div>`,
};
const CANVAS = ['card', 'table', 'chart'];
const M = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov'];   // real data: the demo app, 2026

export default {
  title: 'App/Showcase',
  tags: ['!autodocs', '!dev'],   // opened in its own browser tab from the Introduction
  parameters: { layout: 'fullscreen', controls: { disable: true } },
};

export const Overview = {
  name: 'Foundations, tokens & components',
  render: () => {
    // Opened in its own browser tab: its own favicon (white square + DS) so it's easy to tell from Storybook (green)
    if (window.top === window) {
      const link = document.querySelector('link[rel="icon"]') || document.head.appendChild(Object.assign(document.createElement('link'), { rel: 'icon' }));
      Object.assign(link, { type: 'image/svg+xml', href: './favicon-showcase.svg' });
    }
    const el = document.createElement('div');
    el.className = 'sc';
    el.innerHTML = `
      <nav class="sc__nav" aria-label="Showcase">
        <div class="sc__brand">${chipHTML({ label: 'Showcase' })}<small>Design system v${version}</small></div>
        <h2>Foundations</h2><ul>${FOUNDATIONS.map(([id, t]) => `<li><a href="#sc-${id}">${t}</a></li>`).join('')}</ul>
        <h2>Tokens</h2><ul><li><a href="#sc-tokens">All tokens</a></li></ul>
        <h2>Components</h2><ul>${COMPONENTS.map(([id, t]) => `<li><a href="#sc-${id}">${t}</a></li>`).join('')}</ul>
      </nav>
      <main class="sc__main">
        <header class="sc__intro">
          <h1>Mi Contabilidad · Design System</h1>
          <p>Everything the library contains, on one page. Each block is rendered from the real design-system files; open the docs of any part for its full spec, states and markup.</p>
          <div class="sc__stats">
            <div><b>${FOUNDATIONS.length - 1}</b><span>Foundations</span></div>
            <div><b>${Object.keys(ICONS).length}</b><span>Icons</span></div>
            <div><b>${TOKEN_COUNT}</b><span>Tokens</span></div>
            <div><b>${COMPONENT_COUNT}</b><span>Components</span></div>
          </div>
        </header>

        <h2 class="sc__part">Foundations</h2>
        ${section('colors', 'Colors', FOUNDATIONS[0][2], 'Three levels: palette (the hues) → actions (primary, attention) and data (income, expense).', colors)}
        ${section('typography', 'Typography', FOUNDATIONS[1][2], 'IBM Plex Sans and IBM Plex Mono · six styles · five sizes: 24 · 16 · 14 · 12 · 10.', typography)}
        ${section('spacing', 'Spacing', FOUNDATIONS[2][2], 'Ten tokens, even values on a 4px scale with a 2px half-step.', spacing)}
        ${section('shape', 'Radius, borders & elevation', FOUNDATIONS[3][2], '', shape)}
        ${section('layout', 'Layout & breakpoints', FOUNDATIONS[4][2], 'Two layouts, one breakpoint: mobile up to 1023px (designed at 390), desktop from 1024px (designed at 1232).', slot('layout'))}
        ${section('icons', 'Icons', FOUNDATIONS[5][2], `${Object.keys(ICONS).length} icons · 16 × 16 grid · filled 1px lines · currentColor · 16px or 24px.`, icons)}

        <h2 class="sc__part">Tokens</h2>
        ${section('tokens', 'All tokens', 'app-foundations-tokens--tokens', 'Read live from <code>tokens/tokens.css</code>: this list updates by itself when a token changes. Click a group to open it, or filter.', slot('tokens'))}

        <h2 class="sc__part">Components</h2>
        ${COMPONENTS.map(([id, t, d, parts]) => section(id, t, d, `${parts.length} component${parts.length > 1 ? 's' : ''}: ${parts.join(' · ')}`, C[id], CANVAS.includes(id))).join('')}
      </main>`;

    // Live slots
    el.querySelector('[data-slot="layout"]').replaceWith(layoutOverview());
    el.querySelector('[data-slot="tokens"]').replaceWith(tokenList({ open: 4, id: 'sc-tok' }));
    el.querySelector('[data-slot="years"]').replaceWith(Object.assign(YearStrip.render(), { style: 'width:100%' }));
    el.querySelector('[data-slot="sel-section"]').replaceWith(sectionSelector(1));
    el.querySelector('[data-slot="sel-period"]').replaceWith(periodSelector(0));
    requestAnimationFrame(() => {
      lineChart(el.querySelector('[data-slot="line"]'), { title: 'Comparativa Ingresos · Gastos', labels: M, series: [
        { name: 'Ingresos', color: 'var(--chart-1)', values: [2976.52, 4166.63, 4166.63, 4731.92, 5357.5, 5357.5, 8203.35, 2580.63, 5843.05, 0, 0] },
        { name: 'Gastos', color: 'var(--chart-2)', values: [1234.94, 1514.27, 1799.53, 1065.4, 2465.63, 1132.65, 1072.54, 1072.94, 1251.39, 0, 0] }] });
      barChart(el.querySelector('[data-slot="bar"]'), { title: 'Comparativa salario neto', labels: M, series: [
        { name: '2025', color: 'var(--chart-compare)', values: [0, 1827.42, 3619.47, 4247.02, 4026.62, 3592.72, 2386.66, 2519.76, 3005.29, 1822.92, 4237.16] },
        { name: '2026', color: 'var(--chart-1)', values: [1805.1, 1741.58, 2652.36, 2367.1, 3666.52, 2891.87, 4224.85, 4284.96, 1507.69, 5221.69, 0] }] });
    });

    // Table of contents: smooth scroll + highlight the section in view
    const links = [...el.querySelectorAll('.sc__nav a')];
    links.forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); el.querySelector(a.getAttribute('href')).scrollIntoView({ behavior: 'smooth' }); }));
    const io = new IntersectionObserver((entries) => entries.forEach((en) => {
      if (en.isIntersecting) links.forEach((a) => a.classList.toggle('is-current', a.getAttribute('href') === `#${en.target.id}`));
    }), { rootMargin: '-20% 0px -70% 0px' });
    requestAnimationFrame(() => el.querySelectorAll('.sc__section').forEach((s) => io.observe(s)));
    return el;
  },
};
