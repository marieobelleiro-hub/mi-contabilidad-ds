// Lists & menus stories — HTML + Vite
// Three components, the same as in Figma: Form (a list of fields), Selector group (a list of checkboxes, radios or choice cards)
// and Menu (a dropdown menu: text, radio or checkbox options). Every option is a real one from the app.
import { figma } from '../../.storybook/figma.js';
import { entryForm, wireEntryForm, CAT_OPTS, IVA } from '../input/entry-form.js';
import { choiceHTML } from '../selectors/selectors.stories.js';

let uid = 0;
const id = () => `lm${++uid}`;
const T = (category) => ({ table: { category } });
const COLOUR = { name: 'Colour', control: { type: 'inline-radio', labels: { primary: 'Blue (Facturación, IRPF)', attention: 'Orange (Gastos, IVA)' } }, options: ['primary', 'attention'], ...T('Variant') };
const ITEMS = { iva: { legend: '% de IVA', options: IVA }, cat: { legend: 'Categoría IRPF', options: CAT_OPTS } };
const ITEMS_CONTROL = { name: 'Options', control: { type: 'inline-radio', labels: { iva: '% de IVA', cat: 'Categoría IRPF' } }, options: ['iva', 'cat'], ...T('Content') };

/* ── Builders (also used by the Showcase) ── */

/** Form: the fields of a mobile form, 20px apart (the content of the full-screen dialog) */
export const formHTML = ({ form = 'factura-esp', cat = 2, rate = '21 %', tinted = true } = {}) => {
  const body = entryForm({ form, cat, rate }).body;
  return tinted ? body : body.replace(' form--tinted', '');
};

/** Selector group: checkboxes, radios or choice cards under one legend */
export const groupHTML = ({ kind = 'checkbox', accent = 'primary', items = 'iva', legend, showLegend = true, selected = [0] } = {}) => {
  const n = id();
  if (kind === 'choice') {
    const lg = legend ?? 'Versión';
    return `<fieldset class="choice-group field--${accent}"><legend class="${showLegend ? 'field__label' : 'sr-only'}">${lg}</legend>
      ${choiceHTML({ kind: 'radio', name: n, checked: selected.includes(0) })}${choiceHTML({ kind: 'radio', name: n, title: 'Versión vacía (sin datos)', desc: 'Para empezar desde cero.', checked: selected.includes(1) })}</fieldset>`;
  }
  const { legend: lg0, options } = ITEMS[items];
  return `<fieldset class="check-group field--${accent}"><legend class="${showLegend ? '' : 'sr-only'}">${legend ?? lg0}</legend>
    ${options.map((o, i) => `<label class="check"><input type="${kind}"${kind === 'radio' ? ` name="${n}"` : ''}${selected.includes(i) ? ' checked' : ''}> ${o}</label>`).join('')}</fieldset>`;
};

/** Menu: the open list of a dropdown. state = the state shown on the hovered / focused / disabled option */
export const menuHTML = ({ kind = 'text', accent = 'primary', items = 'iva', selected = [0], state = 'default', stateItem = 1, label } = {}) => {
  const { legend, options } = ITEMS[items];
  const n = id();
  const cls = (i) => `menu__item${i === stateItem && state === 'hover' ? ' is-hover' : ''}${i === stateItem && state === 'focus' ? ' is-focus' : ''}`;
  const dis = (i) => i === stateItem && state === 'disabled';
  if (kind === 'text') {
    return `<ul class="menu field--${accent}" role="listbox" aria-label="${label ?? legend}">
      ${options.map((o, i) => `<li class="${cls(i)}" role="option" aria-selected="${selected.includes(i)}"${dis(i) ? ' aria-disabled="true"' : ''} tabindex="-1">${o}</li>`).join('')}</ul>`;
  }
  return `<fieldset class="menu field--${accent}"><legend class="sr-only">${label ?? legend}</legend>
    ${options.map((o, i) => `<label class="${cls(i)}"><input type="${kind}"${kind === 'radio' ? ` name="${n}"` : ''}${selected.includes(i) ? ' checked' : ''}${dis(i) ? ' disabled' : ''}> ${o}</label>`).join('')}</fieldset>`;
};

/* A text menu that works: click or ↑ ↓ + Enter selects one option */
const liveMenu = (html) => {
  const el = document.createElement('div');
  el.style.cssText = 'display:inline-block';
  el.innerHTML = html;
  const items = [...el.querySelectorAll('[role="option"]')];
  const pick = (it) => { if (it.getAttribute('aria-disabled') === 'true') return; items.forEach((x) => x.setAttribute('aria-selected', x === it)); };
  items.forEach((it, i) => {
    if (i === 0) it.tabIndex = 0;
    it.addEventListener('click', () => pick(it));
    it.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); items[(i + (e.key === 'ArrowDown' ? 1 : items.length - 1)) % items.length].focus(); }
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(it); }
    });
  });
  return el;
};

export default {
  title: 'App/Components/Lists & menus',
  tags: ['!autodocs'],   // documented in Lists.mdx
  excludeStories: ['formHTML', 'groupHTML', 'menuHTML'],
  parameters: { layout: 'padded' },
  globals: { backgrounds: { value: 'white' } },
};

/* ── Form ── */
const FORMS = { 'factura-esp': 'Nueva factura nacional', 'factura-ext': 'Nueva factura exenta de impuestos', 'gasto-cat': 'Nuevo gasto · from a category', 'gasto-iva': 'Nuevo gasto · from an IVA rate' };
export const Form = {
  name: 'Form',
  argTypes: {
    form: { name: 'Form', control: { type: 'select', labels: FORMS }, options: Object.keys(FORMS), ...T('Variant') },
    tinted: { name: 'Tinted', control: 'boolean', description: 'Tint background on the fields: the mobile forms fill the screen with no card around them', ...T('Variant') },
  },
  args: { form: 'factura-esp', tinted: true },
  render: (a) => {
    const el = document.createElement('div');
    el.style.cssText = 'width:342px;max-width:100%';
    el.innerHTML = formHTML({ form: a.form, tinted: a.tinted });
    return wireEntryForm(el);
  },
};

/* ── Selector group ── */
export const SelectorGroup = {
  name: 'Selector group',
  argTypes: {
    kind: { name: 'Kind', control: { type: 'inline-radio', labels: { checkbox: 'Checkbox (several choices)', radio: 'Radio (one choice)', choice: 'Choice card (one choice)' } }, options: ['checkbox', 'radio', 'choice'], ...T('Variant') },
    accent: COLOUR,
    showLegend: { name: 'Legend', control: 'boolean', description: 'The title of the group. Hidden: it stays for screen readers', ...T('Boolean') },
    items: { ...ITEMS_CONTROL, if: { arg: 'kind', neq: 'choice' } },
    legend: { name: 'Legend text', control: 'text', ...T('Text') },
  },
  args: { kind: 'checkbox', accent: 'primary', showLegend: true, items: 'iva', legend: '% de IVA' },
  render: (a) => `<div style="width:400px;max-width:100%">${groupHTML({ ...a, selected: a.kind === 'checkbox' ? [0, 1] : [0] })}</div>`,
};

/* ── Menu ── */
export const Menu = {
  name: 'Menu',
  argTypes: {
    kind: { name: 'Kind', control: { type: 'inline-radio', labels: { text: 'Text (one choice)', radio: 'Radio (one choice)', checkbox: 'Checkbox (several choices)' } }, options: ['text', 'radio', 'checkbox'], ...T('Variant') },
    accent: COLOUR,
    items: ITEMS_CONTROL,
    state: { name: 'State of the 2nd option', control: { type: 'inline-radio', labels: { default: 'Default', hover: 'Hover', disabled: 'Disabled', focus: 'Focus' } }, options: ['default', 'hover', 'disabled', 'focus'], description: 'The first option is the selected one', ...T('Variant') },
  },
  args: { kind: 'text', accent: 'primary', items: 'iva', state: 'default' },
  render: (a) => liveMenu(menuHTML({ ...a, selected: a.kind === 'checkbox' ? [0, 2] : [0] })),
};

/* ── Docs only ── */
const head = 'font-family:var(--font-mono);font-size:var(--text-10);text-transform:uppercase;letter-spacing:var(--ls-caps);color:var(--text-muted)';
export const MenuStates = {
  name: 'Menu · States',
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => {
    const cols = [['Selected', { selected: [0] }], ['Default', { selected: [] }], ['Hover', { selected: [], state: 'hover', stateItem: 0 }], ['Disabled', { selected: [], state: 'disabled', stateItem: 0 }], ['Focus', { selected: [], state: 'focus', stateItem: 0 }]];
    const first = (kind, o) => { const h = menuHTML({ kind, items: 'iva', ...o }); const end = kind === 'text' ? '</li>' : '</label>'; const close = kind === 'text' ? '</ul>' : '</fieldset>'; return (h.slice(0, h.indexOf(end) + end.length) + close).replace(/^<(ul|fieldset) class="menu /, '<$1 style="min-width:0" class="menu '); };
    return `<div style="display:grid;grid-template-columns:100px repeat(5,minmax(0,1fr));max-width:1000px;gap:var(--space-12) var(--space-16);align-items:center">
      <span></span>${cols.map(([c]) => `<span style="${head}">${c}</span>`).join('')}
      ${['text', 'radio', 'checkbox'].map((k) => `<span style="${head}">${k}</span>${cols.map(([, o]) => `<div>${first(k, o)}</div>`).join('')}`).join('')}
    </div>`;
  },
};

export const MenuInContext = {
  name: 'Menu · Under a dropdown',
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => `<div class="field field--attention" style="width:360px;position:relative">
      <label class="field__label" id="mc-l">Categoría IRPF</label>
      <button type="button" class="input is-focus" aria-haspopup="listbox" aria-expanded="true" aria-labelledby="mc-l" style="text-align:left;background-image:url(&quot;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'%3E%3Cpath d='M3 11l5-5 5 5' fill='none' stroke='%23000' stroke-width='1.3'/%3E%3C/svg%3E&quot;);background-repeat:no-repeat;background-position:right var(--input-pad-x) center">${CAT_OPTS[2]}</button>
      <div style="margin-top:var(--menu-gap)">${menuHTML({ kind: 'text', accent: 'attention', items: 'cat', selected: [2] }).replace('<ul class="menu ', '<ul style="width:100%" class="menu ')}</div>
    </div>`,
};

/* ── Design tab: the matching component in the Figma library ── */
Form.parameters = { ...Form.parameters, design: figma('155:711') };
SelectorGroup.parameters = { ...SelectorGroup.parameters, design: figma('155:390') };
Menu.parameters = { ...Menu.parameters, design: figma('155:285') };
MenuStates.parameters = { ...MenuStates.parameters, design: figma('155:148') };
MenuInContext.parameters = { ...MenuInContext.parameters, design: figma('155:285') };
