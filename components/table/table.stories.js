// Tables stories — HTML + Vite
// The five tables of the app: Facturación · Gastos · Últimas facturas · Resumen anual · Tax forms (Modelo 303 / 130),
// each with its variants, desktop / mobile and states.
// Data: components/table/table-data.js (the demo app, 2026).
import { figma } from '../../.storybook/figma.js';
import { icon } from '../../icons/icons.js';
import { inFrame, frameArgs, mobileFrame, reportHeight } from '../../foundations/mobile-frame.js';
import { INVOICES, EXPENSES, CATEGORIES, QUARTERS, SUMMARY, fmt } from './table-data.js';
import { recordListHTML } from '../list/list.stories.js';

const PLUS = icon('plus');
const n2 = (v) => fmt(v).replace(' €', '');               // 1.234,50 (no €: the column says €)
const byDate = (a, b) => { const k = (f) => { const [d, m] = f.split('/').map(Number); return m * 100 + d; }; return k(b.fecha) - k(a.fecha); };
let uid = 0;

/* Which rows each state shows: Editable = a quarter (3T) · Read only = Resumen anual (the whole year) · Empty = a quarter with nothing yet (4T) */
const PERIOD = { editable: [3], readonly: [1, 2, 3, 4], empty: [] };

/* ── Shared bits ── */
const del = (what, mobile) => `<button type="button" class="btn btn--icon btn--sm btn--danger" aria-label="Eliminar ${what}">${icon(mobile ? 'trash' : 'close-filled')}</button>`;
const dot = (f, ro) => ro
  ? `<span class="status status--${f.cobrada ? 'paid' : 'pending'}" role="img" aria-label="Factura ${f.num}: ${f.cobrada ? 'cobrada' : 'pendiente de cobro'}"></span>`
  : `<button type="button" class="status-btn" aria-label="Factura ${f.num}: ${f.cobrada ? 'cobrada. Pulsa para marcar pendiente' : 'pendiente. Pulsa para marcar cobrada'}"><span class="status status--${f.cobrada ? 'paid' : 'pending'}" aria-hidden="true"></span></button>`;
const check303 = (g, ro) => {
  const on = g.en303 && g.iva > 0 && g.cat !== 'reta';
  const off = g.iva === 0 || g.cat === 'reta';
  return `<input type="checkbox" class="table__check" aria-label="Incluir el gasto de ${g.proveedor} del ${g.fecha} en el 303"${on ? ' checked' : ''}${ro || off ? ' disabled' : ''}>`;
};
const inp = (cls, value, label, ph = '') => `<input class="table__input${cls ? ` ${cls}` : ''}" value="${value}"${ph ? ` placeholder="${ph}"` : ''} aria-label="${label}">`;
const card = (accent, title, body, footer = '', extra = '') => {
  const id = `t${++uid}`;
  return `<section class="card card--${accent}" style="max-width:1108px" aria-labelledby="${id}">
    <div class="card__header"><h2 class="card__title card__title--caps" id="${id}">${title}</h2>${extra}</div>
    ${body}
    ${footer ? `<div class="card__footer" style="border-top:var(--border-thin) solid var(--line);padding-top:var(--space-12)">${footer}</div>` : ''}
  </section>`;
};
const footer = (accent, addLabel, totals, ro) => `${ro ? '<span></span>' : `<button type="button" class="btn btn--ghost btn--${accent} btn--flush">${PLUS}<span class="btn__label">${addLabel}</span></button>`}
  ${totals.length ? `<p class="table-totals table-totals--${accent}">${totals.map((t) => `<span>${t}</span>`).join('')}</p>` : ''}`;
/* Mobile: one card per table, the rows as records */
const mobileCard = (accent, title, items, totals, addLabel, ro, col303 = false, empty = 'Sin facturas en este período') => {
  const id = `m${++uid}`;
  return `<section class="card card--${accent}" aria-labelledby="${id}">
    <div class="card__header"><h3 class="card__title" id="${id}">${title}</h3>${col303 && items.length ? '<p class="records__303" aria-hidden="true">303</p>' : ''}</div>
    ${items.length ? `<ul class="records records--${accent}">${items.join('')}</ul>
    <p class="table-totals table-totals--${accent} table-totals--stack" style="padding-top:var(--space-16)">${totals.map((t) => `<span>${t}</span>`).join('')}</p>` : `<p class="records__empty">${empty}</p>`}
    ${ro ? '' : `<div style="display:flex;justify-content:flex-end;padding-top:var(--space-8)"><button type="button" class="btn btn--ghost btn--${accent}">${PLUS}<span class="btn__label">${addLabel}</span></button></div>`}
  </section>`;
};
const record = (top, sub, rows, side) => `<li class="record">
  <div class="record__main"><div class="record__top">${top}</div><p class="record__sub">${sub}</p>
    <dl class="record__rows">${rows.map(([k, v, total]) => `<div class="record__row${total ? ' record__row--total' : ''}"><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl></div>
  ${side ? `<div class="record__side">${side}</div>` : ''}
</li>`;
const legend = `<p style="display:flex;gap:var(--space-24);justify-content:flex-end;margin:var(--space-16) 0 0;max-width:1108px"><span class="status-label"><span class="status status--paid" aria-hidden="true"></span>Cobrada</span><span class="status-label"><span class="status status--pending" aria-hidden="true"></span>Pendiente</span></p>`;

/* Desktop or mobile: mobile is the same story in a 390px frame (real mobile CSS) */
const VIEW = { name: 'View', control: { type: 'inline-radio', labels: { desktop: 'Desktop · table', mobile: 'Mobile · list (390px)' } }, options: ['desktop', 'mobile'] };
const STATE = { name: 'State', control: { type: 'inline-radio', labels: { editable: 'Editable (a quarter)', readonly: 'Read only (Resumen anual)', empty: 'Empty' } }, options: ['editable', 'readonly', 'empty'] };
const view = (storyId, a, desktop, mobile) => {
  if (inFrame()) { const el = document.createElement('div'); el.innerHTML = mobile({ ...a, ...frameArgs() }); return reportHeight(el); }
  if (a.view === 'mobile') return mobileFrame(storyId, { ...a, view: 'mobile' });
  return desktop(a);
};

/* ══ Facturación ══ */
const facts = (type, state) => INVOICES.filter((f) => f.type === type && PERIOD[state].includes(f.trim)).sort(byDate);
const factCalc = (f) => { const iva = f.base * f.iva / 100; const ret = f.ret ? f.base * 0.15 : 0; return { iva, ret, total: f.base + iva - ret }; };
const factTotals = (type, list) => {
  if (type === 'ext') return [`Total (neto): ${fmt(list.reduce((a, f) => a + f.base, 0))}`];
  if (!list.length) return [];
  const s = list.reduce((a, f) => { const c = factCalc(f); a.b += f.base; a.i += c.iva; a.r += c.ret; return a; }, { b: 0, i: 0, r: 0 });
  return [`Total (neto): ${fmt(s.b + s.i - s.r)}`];   // as in the app: IVA and IRPF are in the columns / the record rows
};
const FACT_TITLE = { esp: 'Facturas nacionales', ext: 'Facturas exentas de impuestos' };

const factDesktop = ({ table, state }) => {
  const ro = state === 'readonly';
  const list = facts(table, state);
  const esp = table === 'esp';
  const cols = esp
    ? '<col class="col-sm"><col class="col-md"><col class="col-lg"><col><col class="col-md"><col class="col-md"><col class="col-md"><col class="col-md"><col class="col-md"><col class="col-md"><col class="col-xs"><col class="col-xs">'
    : '<col class="col-sm"><col class="col-md"><col class="col-lg"><col><col class="col-md"><col class="col-md"><col class="col-xs"><col class="col-xs">';
  const head = `<tr><th scope="col">Núm.</th><th scope="col">Fecha</th><th scope="col">Cliente</th><th scope="col">Concepto</th><th scope="col" class="is-num">Base €</th>
    ${esp ? '<th scope="col" class="is-center is-group">IVA %</th><th scope="col" class="is-num">IVA €</th><th scope="col" class="is-center is-group">IRPF %</th><th scope="col" class="is-num">IRPF €</th>' : ''}
    <th scope="col" class="is-num">Total €</th><th scope="col"><span class="sr-only">Estado</span></th><th scope="col"><span class="sr-only">Acciones</span></th></tr>`;
  const row = (f) => {
    const c = factCalc(f);
    const cell = (ro ? [f.num, f.fecha, f.cliente, f.concepto, n2(f.base)] : [
      inp('table__input--code', f.num, `Número, factura ${f.num}`), inp('table__input--code', f.fecha, `Fecha, factura ${f.num}`, 'DD/MM/AAAA'),
      inp('', f.cliente, `Cliente, factura ${f.num}`, 'Cliente'), inp('', f.concepto, `Concepto, factura ${f.num}`, 'Concepto'),
      inp('table__input--num', n2(f.base), `Base, factura ${f.num}`, '0,00')]);
    const ivaCell = ro ? `${f.iva}%` : `<select class="table__select" aria-label="IVA %, factura ${f.num}">${[0, 4, 5, 10, 21].map((r) => `<option${r === f.iva ? ' selected' : ''}>${r}%</option>`).join('')}</select>`;
    return `<tr>
      <td class="is-strong">${cell[0]}</td><td>${cell[1]}</td><td>${cell[2]}</td><td>${cell[3]}</td><td class="is-num">${cell[4]}</td>
      ${esp ? `<td class="is-center is-group${ro ? ' is-rate' : ''}">${ivaCell}</td><td class="is-num">${n2(c.iva)}</td><td class="is-center is-group is-rate">${f.ret ? '15%' : '—'}</td><td class="is-num">${f.ret ? n2(c.ret) : '—'}</td>` : ''}
      <td class="is-num is-strong">${n2(esp ? c.total : f.base)}</td>
      <td class="is-action">${dot(f, ro)}</td><td class="is-action">${ro ? '' : del(`factura ${f.num}`)}</td></tr>`;
  };
  const body = list.length ? list.map(row).join('') : `<tr class="table__empty"><td colspan="${esp ? 12 : 8}">${esp ? 'Sin facturas españolas este período' : 'Sin facturas extranjero este período'}</td></tr>`;
  return `${card('primary', FACT_TITLE[table], `<div class="table-wrap"><table class="table table--primary"><colgroup>${cols}</colgroup><thead>${head}</thead><tbody>${body}</tbody></table></div>`,
    footer('primary', 'Añadir factura', factTotals(table, list), ro))}${ro ? '' : legend}`;
};

export const factMobile = ({ table, state }) => {
  const ro = state === 'readonly';
  const list = facts(table, state);
  const items = list.map((f) => {
    const c = factCalc(f);
    const rows = table === 'esp'
      ? [['Base €', fmt(f.base)], [`${f.iva}% IVA`, fmt(c.iva)], ...(f.ret ? [['15% IRPF', fmt(c.ret)]] : []), ['Total', `${dot(f, ro)}<strong>${fmt(c.total)}</strong>`, true]]
      : [['Base € (Total)', `${dot(f, ro)}<strong>${fmt(f.base)}</strong>`, true]];
    return record(`<strong>${f.cliente}</strong><span>Núm. <strong>${f.num}</strong></span>`, `${f.fecha} — ${f.concepto}`, rows, ro ? '' : del(`factura ${f.num} de ${f.cliente}`, true));
  });
  return mobileCard('primary', FACT_TITLE[table], items, factTotals(table, list), 'Añadir factura', ro);
};

export default {
  title: 'App/Components/Tables',
  tags: ['!autodocs'],   // documented in Table.mdx
  excludeStories: ['showcaseTables', 'taxFormHTML', 'factMobile', 'gastoMobile'],
  parameters: { layout: 'padded' },
  globals: { backgrounds: { value: 'canvas' } },
};

export const Facturacion = {
  name: 'Facturación',
  argTypes: {
    table: { name: 'Table', control: { type: 'inline-radio', labels: { esp: 'Facturas nacionales', ext: 'Facturas exentas de impuestos' } }, options: ['esp', 'ext'] },
    view: VIEW, state: STATE,
  },
  args: { table: 'esp', view: 'desktop', state: 'editable' },
  render: (a) => view('app-components-tables--facturacion', a, factDesktop, factMobile),
};

/* ══ Gastos ══ */
const catOf = (id) => CATEGORIES.find((c) => c.id === id);
const gastos = (a) => EXPENSES.filter((g) => PERIOD[a.state].includes(g.trim) && (a.list === 'cat' ? g.cat === a.cat : g.iva === Number(a.rate))).sort(byDate);
const gTotals = (a, list) => {
  const b = list.reduce((x, g) => x + g.base, 0); const i = list.reduce((x, g) => x + g.base * g.iva / 100, 0);
  if (a.list === 'cat' && a.cat === 'reta') return [`Total: ${fmt(b)}`];
  return [`Base: ${fmt(b)}`, ...(i ? [`IVA: ${fmt(i)}`] : []), `Total: ${fmt(b + i)}`];
};
const gTitle = (a) => (a.list === 'cat' ? catOf(a.cat).label : Number(a.rate) === 0 ? 'IVA 0% · exentos' : `IVA ${a.rate}%`);
const gAdd = (a) => (a.list === 'iva' ? `Añadir gasto ${a.rate}%` : 'Añadir gasto');

const gastoDesktop = (a) => {
  const ro = a.state === 'readonly';
  const list = gastos(a);
  const byCat = a.list === 'cat';
  const reta = byCat && a.cat === 'reta';
  const odeg = byCat && a.cat === 'odeg';
  const showIva = byCat && !reta;
  const cols = [odeg && '<col class="col-lg">', '<col class="col-md">', '<col class="col-md">', '<col class="col-lg">', '<col>', !byCat && '<col class="col-md">', '<col class="col-md">',
    showIva && '<col class="col-sm">', !reta && '<col class="col-md">', '<col class="col-md">', '<col class="col-sm">', '<col class="col-xs">'].filter(Boolean).join('');
  const head = `<tr>${odeg ? '<th scope="col">Objeto</th>' : ''}<th scope="col">Núm.</th><th scope="col">Fecha</th><th scope="col">Proveedor</th><th scope="col">Concepto</th>
    ${byCat ? '' : '<th scope="col" class="is-center">Cat. IRPF</th>'}<th scope="col" class="is-num">${reta ? 'Cuota' : 'Base €'}</th>
    ${showIva ? '<th scope="col" class="is-center">IVA %</th>' : ''}${reta ? '' : '<th scope="col" class="is-num">IVA €</th>'}
    <th scope="col" class="is-num">Total €</th><th scope="col" class="is-center">303</th><th scope="col"><span class="sr-only">Acciones</span></th></tr>`;
  const row = (g, i) => {
    const iva = g.base * g.iva / 100;
    const nm = `gasto de ${g.proveedor} del ${g.fecha}`;
    const t = (cls, v, l, ph) => (ro ? v : inp(cls, v, `${l}, ${nm}`, ph));
    const cat = catOf(g.cat);
    const catCell = ro ? `<span aria-hidden="true">${cat.no}</span><span class="sr-only">${cat.label}</span>`
      : `<span class="table__pick">${cat.no}${icon('chevron-down')}<select aria-label="Categoría IRPF, ${nm}">${CATEGORIES.map((c) => `<option${c.id === g.cat ? ' selected' : ''}>${c.label}</option>`).join('')}</select></span>`;
    const ivaSel = ro ? `${g.iva}%` : `<select class="table__select" aria-label="IVA %, ${nm}">${[0, 4, 5, 10, 21].map((r) => `<option${r === g.iva ? ' selected' : ''}>${r}%</option>`).join('')}</select>`;
    return `<tr>${odeg ? `<td>${t('', g.objeto, 'Objeto', 'Tipo…')}</td>` : ''}
      <td>${t('table__input--code', g.num, 'Número', 'Núm.')}</td><td>${t('table__input--code', g.fecha, 'Fecha', 'DD/MM/AAAA')}</td>
      <td>${t('', g.proveedor, 'Proveedor', 'Proveedor')}</td><td>${t('', g.concepto, 'Concepto', 'Concepto')}</td>
      ${byCat ? '' : `<td class="is-center">${catCell}</td>`}
      <td class="is-num">${t('table__input--num', n2(g.base), 'Base', '0,00')}</td>
      ${showIva ? `<td class="is-center${ro ? ' is-rate' : ''}">${ivaSel}</td>` : ''}${reta ? '' : `<td class="is-num">${g.iva ? n2(iva) : '—'}</td>`}
      <td class="is-num is-strong">${n2(g.base + iva)}</td><td class="is-center">${check303(g, ro)}</td><td class="is-action">${ro ? '' : del(nm)}</td></tr>`;
  };
  const ncols = cols.split('<col').length - 1;
  const body = list.length ? list.map(row).join('') : `<tr class="table__empty"><td colspan="${ncols}">Ningún gasto registrado</td></tr>`;
  const info = byCat ? `<button type="button" class="btn btn--icon btn--sm btn--info" aria-label="Información: ${catOf(a.cat).label.replace(/^\d+\. /, '')}">${icon('info')}</button>` : '';
  return card('attention', gTitle(a), `<div class="table-wrap"><table class="table table--attention"><colgroup>${cols}</colgroup><thead>${head}</thead><tbody>${body}</tbody></table></div>`,
    footer('attention', gAdd(a), gTotals(a, list), ro), info);
};

export const gastoMobile = (a) => {
  const ro = a.state === 'readonly';
  const list = gastos(a);
  const items = list.map((g) => {
    const iva = g.base * g.iva / 100;
    const reta = g.cat === 'reta';
    return record(`<strong>${g.proveedor}</strong>${g.num ? `<span>Núm. <strong>${g.num}</strong></span>` : ''}`,
      `${g.fecha} — ${g.concepto}${g.cat === 'odeg' && g.objeto ? ` · ${g.objeto}` : ''}`,
      [[reta ? 'Cuota €' : 'Base €', fmt(g.base)], ...(g.iva ? [[`${g.iva}% IVA`, fmt(iva)]] : []), ['Total', `<strong>${fmt(g.base + iva)}</strong>`, true]],
      `${check303(g, ro)}${ro ? '' : del(`gasto de ${g.proveedor} del ${g.fecha}`, true)}`);
  });
  return mobileCard('attention', gTitle(a), items, gTotals(a, list), gAdd(a), ro, true, 'Ningún gasto registrado');
};

export const Gastos = {
  name: 'Gastos',
  argTypes: {
    list: { name: 'List', control: { type: 'inline-radio', labels: { cat: 'Por cat. IRPF', iva: 'Por % IVA' } }, options: ['cat', 'iva'] },
    cat: { name: 'Category', control: { type: 'select', labels: Object.fromEntries(CATEGORIES.map((c) => [c.id, c.label])) }, options: CATEGORIES.map((c) => c.id), if: { arg: 'list', eq: 'cat' } },
    rate: { name: 'IVA rate', control: { type: 'inline-radio', labels: { 21: '21%', 10: '10%', 4: '4%', 0: '0% · exentos' } }, options: ['21', '10', '4', '0'], if: { arg: 'list', eq: 'iva' } },
    view: VIEW, state: STATE,
  },
  args: { list: 'cat', cat: 'sum', rate: '21', view: 'desktop', state: 'editable' },
  render: (a) => view('app-components-tables--gastos', a, gastoDesktop, gastoMobile),
};

/* ══ Últimas facturas: the dashboard list (the 6 newest invoices; only the status dot can be changed) ══ */
const INFO = `<button type="button" class="btn btn--icon btn--sm btn--info" aria-label="Información: Últimas facturas">${icon('info')}</button>`;
const lastDraw = () => {
  const rows = [...INVOICES].sort(byDate).slice(0, 6).map((f) => [f.num, f.cliente, f.fecha, fmt(f.base), f.cobrada ? 'paid' : 'pending']);
  return `<section class="card" style="max-width:540px" aria-labelledby="lf-t">
    <div class="card__header"><h2 class="card__title" id="lf-t">Últimas facturas</h2>${INFO}</div>
    ${recordListHTML({ rows })}
  </section>`;
};

export const LastInvoices = {
  name: 'Últimas facturas',
  argTypes: { view: { ...VIEW, control: { type: 'inline-radio', labels: { desktop: 'Desktop', mobile: 'Mobile (390px)' } } } },
  args: { view: 'desktop' },
  render: (a) => view('app-components-tables--last-invoices', a, lastDraw, lastDraw),
};

/* ══ Resumen anual: the annual summaries of IVA and IRPF ══ */
const sumDesktop = ({ tax }) => {
  const t = SUMMARY[tax];
  const table = `<div class="table-wrap"><table class="table table--summary table--${t.accent}">
    <colgroup><col><col class="col-lg"><col class="col-lg"><col class="col-lg"><col class="col-lg"></colgroup>
    <thead><tr><th scope="col"><span class="sr-only">Concepto</span></th>${QUARTERS.map((q, i) => `<th scope="col"${i === 3 ? ' class="is-empty"' : ''}>${q}</th>`).join('')}</tr></thead>
    <tbody>${t.rows.map((r, i) => `<tr${i === t.rows.length - 1 ? ' class="table__total"' : ''}><th scope="row">${r[0]}</th>${r.slice(1).map((v) => `<td class="is-num">${v} €</td>`).join('')}<td class="is-num is-empty">—</td></tr>`).join('')}</tbody>
  </table></div>`;
  return card(t.accent, t.title, `${table}<div class="result result--footer result--${t.accent}" style="margin-top:var(--space-16)"><p class="result__label">${t.footer[0]}</p><p class="result__value">${t.footer[1]}</p></div>`);
};
const sumMobile = ({ tax }) => {
  const t = SUMMARY[tax];
  const blocks = QUARTERS.map((q, i) => {
    const head = q.replace(/^(\dT)\s+/, '$1 · ');
    if (i === 3) return `<section class="card__section" aria-label="${head}"><h3 class="card__section-title card__section-title--muted">${head}</h3><p class="records__empty">Sin resultado hasta que termine el plazo de declaración</p></section>`;
    return `<section class="card__section" aria-label="${head}"><h3 class="card__section-title">${head}</h3>
      <dl class="list list--compact list--${t.accent}">${t.rows.map((r, k) => `<div class="row row--kv"><dt class="row__label">${r[0]}</dt><dd class="row__value${k === t.rows.length - 1 ? ' row__value--strong' : ''}">${r[i + 1]} €</dd></div>`).join('')}</dl></section>`;
  }).join('');
  const id = `s${++uid}`;
  return `<section class="card card--sectioned card--${t.accent}" aria-labelledby="${id}"><div class="card__header"><h2 class="card__title card__title--caps" id="${id}">${t.title}</h2></div>
    ${blocks}<div class="result result--footer result--${t.accent}" style="padding:var(--space-16) var(--card-pad-x)"><p class="result__label">${t.footer[0]}</p><p class="result__value">${t.footer[1]}</p></div></section>`;
};

export const Summary = {
  name: 'Resumen anual',
  argTypes: {
    tax: { name: 'Tax', control: { type: 'inline-radio', labels: { iva: 'IVA · Modelo 390 (orange)', irpf: 'IRPF · Modelo 100 (blue)' } }, options: ['iva', 'irpf'] },
    view: VIEW,
  },
  args: { tax: 'iva', view: 'desktop' },
  render: (a) => view('app-components-tables--summary', a, sumDesktop, sumMobile),
};

/* ══ Tax forms: Modelo 303 (IVA) and Modelo 130 (IRPF), one quarter ══
   Real data of the demo. Where the demo has no such quarter, the case is built from its real records (see Table.mdx). */
const TRIM = ['1T · Ene–Mar', '2T · Abr–Jun', '3T · Jul–Sep', '4T · Oct–Dic'];
const DUE = ['20 de abril', '20 de julio', '20 de octubre', '30 de enero'];
const COMP = 151.8;                                      // IVA a compensar from earlier quarters (3T of the demo)
const IVA_Q = {
  pay: { q: 2, c01: 9622.45, c28: 431.85, c120: 14411.21 },   // 3T
  credit: { q: 0, c01: 0, c28: 380.5, c120: 11309.78 },             // 1T, with its IVA expenses ticked for the 303
  none: { q: 1, c01: 0, c28: 0, c120: 15446.92 },                       // 2T: only foreign invoices, no 303 expenses
};
const IRPF_Q = {
  pay: { q: 2, c01: 50790.36, c02: 12609.29, c07: 1443.3675, c08: 3508.86 },            // 3T
  credit: { q: 3, c01: 50790.36, c02: 14777.93, c07: 1443.3675, c08: 6192.85 },         // 4T: no new invoices, three RETA quotas
  none: { q: 3, c01: 50790.36, c02: 12609.29, c07: 1443.3675, c08: 6192.85 },           // 4T: nothing new yet
};
const r2 = (v) => { const x = Math.round(v * 100) / 100; return Object.is(x, -0) ? 0 : x; };
const neg = (v) => (v < 0 ? `−${fmt(-v)}` : fmt(v));      // a real minus sign

const taxFormData = ({ tax, result, compensacion }) => {
  if (tax === 'iva') {
    const d = { ...IVA_Q[result] }; d.c03 = d.c01 * 0.21; d.c29 = d.c28 * 0.21;   // calculated like the app: round only to show
    const sub = d.c03 - d.c29;
    const raw = sub - (compensacion ? COMP : 0); const res = r2(raw);
    return {
      accent: 'attention', title: `Modelo 303 · ${TRIM[d.q]} 2026`, due: `Plazo: ${DUE[d.q]}`,
      blocks: [
        ['Ingresos con IVA · España', [['c.01', 'Base imponible', fmt(d.c01)], ['c.03', 'IVA repercutido 21%', fmt(d.c03), 'accent']]],
        ['Gastos con IVA deducible · Checkboxes activos', [['c.28', 'Base gastos', fmt(d.c28)], ['c.29', 'IVA soportado', fmt(d.c29), 'accent']]],
        ['subtotal', 'IVA repercutido − IVA soportado', neg(r2(sub))],
        ['Operaciones no sujetas por reglas de localización', [['c.120', 'Servicios a empresa extranjera', fmt(d.c120)]]],
        ['compensar', compensacion],
      ],
      state: res > 0 ? 'pay' : res < 0 ? 'credit' : 'none',
      label: res > 0 ? 'A ingresar este trimestre' : res < 0 ? 'A compensar próximo trimestre' : 'Sin actividad con IVA',
      value: fmt(Math.abs(raw)), pay: res > 0, notes: 'Notas del trimestre',
    };
  }
  const d = IRPF_Q[result];
  const c03 = d.c01 - d.c02; const c05 = c03 * 0.2;
  const raw = c05 - d.c07 - d.c08; const res = r2(raw);
  return {
    accent: 'primary', title: `Modelo 130 · ${TRIM[d.q]} 2026`, due: `Plazo: ${DUE[d.q]}`,
    blocks: [
      [`Ingresos y gastos acumulados hasta ${TRIM[d.q]}`, [['c.01', 'Ingresos íntegros acumulados', fmt(d.c01)], ['c.02', 'Gastos deducibles acumulados', fmt(d.c02)], ['c.03', 'Rendimiento neto acumulado', fmt(c03), 'accent']]],
      ['Cálculo del pago fraccionado', [['c.05', '20% sobre rendimiento neto', fmt(c05)], ['c.07', 'Retenciones acumuladas 15%', fmt(d.c07), 'muted'], ['c.08', 'Pagos fraccionados anteriores', fmt(d.c08), 'muted']]],
    ],
    state: res > 0 ? 'pay' : res < 0 ? 'credit' : 'none',
    label: res > 0 ? 'A ingresar este trimestre' : 'Sin pago fraccionado este trimestre',
    value: res ? neg(raw) : fmt(0), pay: res > 0, notes: 'Notas del trimestre',
  };
};

export const taxFormHTML = (a) => {
  const t = taxFormData(a); const id = `tf${++uid}`;
  const kv = (list) => `<dl class="list list--${t.accent}">${list.map(([code, label, value, kind]) => `
        <div class="row row--kv"><dt class="row__label"><span class="chip chip--code">${code}</span>${label}</dt><dd class="row__value${kind ? ` row__value--${kind}` : ''}">${value}</dd></div>`).join('')}
      </dl>`;
  const block = ([title, a1, b1]) => {
    if (title === 'subtotal') return `<div class="result result--sm"><p class="result__label">${a1}</p><p class="result__value">${b1}</p></div>`;
    if (title === 'compensar') return `<div class="card__section">
      <h3 class="card__section-title">IVA a compensar de trimestres anteriores</h3>
      <div class="list"><div class="row row--kv">
        <label class="check"><input type="checkbox"${a1 ? ' checked' : ''}> Aplicar compensación</label>
        <input class="input input--sm input--num input--w-sm" value="${a1 ? n2(COMP) : ''}" placeholder="0,00" inputmode="decimal" aria-label="Importe a compensar">
      </div></div>
    </div>`;
    return `<div class="card__section"><h3 class="card__section-title">${title}</h3>${kv(a1)}</div>`;
  };
  return `<section class="card card--sectioned card--${t.accent} field--${t.accent}" style="max-width:1108px" aria-labelledby="${id}">
  <div class="card__header"><h2 class="card__title card__title--caps" id="${id}">${t.title}</h2><p class="card__due">${t.due}</p></div>
  ${t.blocks.map(block).join('\n  ')}
  <div class="result result--${t.state}" role="status"><p class="result__label">${t.label}</p><p class="result__value">${t.value}</p></div>
  ${t.pay ? `<div class="card__section">
    <h3 class="card__section-title">Registrar pago realizado</h3>
    <div class="list"><div class="row row--kv">
      <label class="row__label" for="${id}-pago">Importe ingresado en Hacienda</label>
      <input class="input input--sm input--num input--w-sm" id="${id}-pago" placeholder="0,00" inputmode="decimal">
    </div></div>
  </div>` : ''}
  <div class="card__section">
    <h3 class="card__section-title"><label for="${id}-notas">${t.notes}</label></h3>
    <textarea class="input input--filled" id="${id}-notas" placeholder="Criterios o decisiones de este trimestre…"></textarea>
  </div>
</section>`;
};

export const TaxForms = {
  name: 'Tax forms',
  argTypes: {
    tax: { name: 'Tax', control: { type: 'inline-radio', labels: { iva: 'IVA · Modelo 303 (orange)', irpf: 'IRPF · Modelo 130 (blue)' } }, options: ['iva', 'irpf'] },
    result: { name: 'Result', control: { type: 'inline-radio', labels: { pay: 'A ingresar', credit: 'A compensar (IRPF: negative)', none: 'Sin actividad' } }, options: ['pay', 'credit', 'none'] },
    compensacion: { name: 'Compensación', control: 'boolean', description: 'IVA only: apply the IVA a compensar of earlier quarters (151,80 €). It changes the result.', if: { arg: 'tax', eq: 'iva' } },
    view: { ...VIEW, control: { type: 'inline-radio', labels: { desktop: 'Desktop', mobile: 'Mobile (390px)' } } },
  },
  args: { tax: 'iva', result: 'pay', compensacion: true, view: 'desktop' },
  render: (a) => view('app-components-tables--tax-forms', a, taxFormHTML, taxFormHTML),
};

/* For the Showcase */
/** For the Showcase: one example of each table, named as in the sidebar */
export const showcaseTables = (block) => [
  block('Facturación', factDesktop({ table: 'esp', state: 'editable' })),
  block('Gastos', gastoDesktop({ list: 'cat', cat: 'sum', rate: '21', state: 'editable' })),
  block('Últimas facturas', lastDraw()),
  block('Resumen anual', sumDesktop({ tax: 'iva' })),
  block('Tax forms', taxFormHTML({ tax: 'iva', result: 'pay', compensacion: true })),
].join('');

/* ── Design tab: the matching component in the Figma library ── */
Facturacion.parameters = { ...Facturacion.parameters, design: figma('42:1211') };
Gastos.parameters = { ...Gastos.parameters, design: figma('44:4590') };
LastInvoices.parameters = { ...LastInvoices.parameters, design: figma('47:3545') };
Summary.parameters = { ...Summary.parameters, design: figma('47:3360') };
TaxForms.parameters = { ...TaxForms.parameters, design: figma('48:3367') };
