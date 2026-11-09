// Selectors stories — HTML + Vite
// Small controls that show or change a state: checkbox & radio, status dot, switch (toggle), and the static chips.
import { figma } from '../../.storybook/figma.js';

/* ── Builders (also used by the Showcase and other stories) ── */
const STATUS_LABEL = { paid: 'Cobrada', pending: 'Pendiente' };
const stateCls = (state) => ({ hover: ' is-hover', focus: ' is-focus' }[state] || '');

export const checkHTML = ({ type = 'primary', kind = 'checkbox', size = 'md', label = 'Incluir en el 303', showLabel = true, checked = true, state = 'default', name = 'r' } = {}) => {
  const input = `<input type="${kind}"${kind === 'radio' ? ` name="${name}"` : ''}${checked ? ' checked' : ''}${state === 'disabled' ? ' disabled' : ''}${showLabel ? '' : ` aria-label="${label}"`}>`;
  return `<span class="${type === 'attention' ? 'field--attention' : 'field--primary'}" style="display:inline-flex"><label class="check${size === 'sm' ? ' check--sm' : ''}${stateCls(state)}">${input}${showLabel ? ` ${label}` : ''}</label></span>`;
};

export const statusHTML = ({ state = 'paid', mode = 'dot', interaction = 'default' } = {}) => {
  const dot = (hidden) => `<span class="status status--${state}"${hidden ? ' aria-hidden="true"' : ` role="img" aria-label="${STATUS_LABEL[state]}"`}></span>`;
  if (mode === 'label') return `<span class="status-label">${dot(true)}${STATUS_LABEL[state]}</span>`;
  if (mode === 'button') return `<button type="button" class="status-btn${stateCls(interaction)}" aria-label="${STATUS_LABEL[state]}. Pulsa para cambiar">${dot(true)}</button>`;
  return dot(false);
};

export const switchHTML = ({ checked = false, off = 'Esp', on = 'Eng', showLabels = true, label = 'English', state = 'default' } = {}) =>
  `<div class="switch${stateCls(state)}"${state === 'disabled' ? ' aria-disabled="true"' : ''}>${showLabels ? `<span class="switch__off" aria-hidden="true">${off}</span>` : ''}<button type="button" class="switch__control" role="switch" aria-checked="${checked}" aria-label="${label}"${state === 'disabled' ? ' disabled' : ''}><span class="switch__track"><span class="switch__thumb"></span></span></button>${showLabels ? `<span class="switch__on" aria-hidden="true">${on}</span>` : ''}</div>`;

/** Choice card: radio (one choice) or checkbox (several choices) with a title and a short explanation. */
export const choiceHTML = ({ type = 'primary', kind = 'radio', title = 'Versión actual (con datos)', desc = 'Guarda la contabilidad registrada actual.', checked = true, state = 'default', name = 'choice' } = {}) =>
  `<label class="choice${stateCls(state)}"><input type="${kind}"${kind === 'radio' ? ` name="${name}"` : ''}${checked ? ' checked' : ''}${state === 'disabled' ? ' disabled' : ''}><span class="choice__text"><b class="choice__title">${title}</b><span class="choice__desc">${desc}</span></span></label>`;
/** The real group: Guardar copia .html (Local app) */
export const choiceGroupHTML = ({ type = 'primary', kind = 'radio', name = 'version' } = {}) =>
  `<fieldset class="choice-group ${type === 'attention' ? 'field--attention' : 'field--primary'}"><legend class="sr-only">Versión</legend>
    ${choiceHTML({ kind, name, checked: true })}${choiceHTML({ kind, name, title: 'Versión vacía (sin datos)', desc: 'Para empezar desde cero.', checked: false })}</fieldset>`;

export const chipHTML = ({ variant = 'brand', label = 'Contabilidad' } = {}) => `<span class="chip chip--${variant}">${label}</span>`;

/* Clicking works in every preview */
const live = (html) => {
  const el = document.createElement('div');
  el.style.cssText = 'display:inline-flex';
  el.innerHTML = html;
  el.querySelectorAll('.switch').forEach((sw) => {
    const btn = sw.querySelector('.switch__control');
    const set = (v) => { if (!btn.disabled) btn.setAttribute('aria-checked', v); };
    btn.addEventListener('click', () => set(btn.getAttribute('aria-checked') !== 'true'));
    sw.querySelector('.switch__off')?.addEventListener('click', () => set(false));
    sw.querySelector('.switch__on')?.addEventListener('click', () => set(true));
  });
  el.querySelectorAll('.status-btn').forEach((b) => b.addEventListener('click', () => {
    const d = b.querySelector('.status'); const paid = !d.classList.contains('status--paid');
    d.classList.toggle('status--paid', paid); d.classList.toggle('status--pending', !paid);
    b.setAttribute('aria-label', `${paid ? 'Cobrada' : 'Pendiente'}. Pulsa para cambiar`);
  }));
  return el;
};

const TYPE = { name: 'Colour', control: { type: 'inline-radio', labels: { primary: 'Blue', attention: 'Orange' } }, options: ['primary', 'attention'], table: { category: 'Variant' } };
const STATE = (opts) => ({ name: 'State', control: 'select', options: opts, table: { category: 'Variant' } });

export default {
  title: 'App/Components/Selectors',
  tags: ['!autodocs'],   // documented in Selectors.mdx
  excludeStories: ['checkHTML', 'statusHTML', 'switchHTML', 'chipHTML', 'choiceHTML', 'choiceGroupHTML'],
  parameters: { layout: 'centered' },
};

/* ── Playgrounds ── */
export const Checkbox = {
  name: 'Checkbox & radio',
  render: (args) => live(checkHTML(args)),
  argTypes: {
    type: TYPE,
    kind: { name: 'Kind', control: 'inline-radio', options: ['checkbox', 'radio'], table: { category: 'Variant' } },
    size: { name: 'Size', control: { type: 'inline-radio', labels: { md: 'md 20 (forms)', sm: 'sm 16 (table rows)' } }, options: ['md', 'sm'], table: { category: 'Variant' } },
    state: STATE(['default', 'disabled', 'focus']),
    checked: { name: 'Checked', control: 'boolean', table: { category: 'Boolean' } },
    showLabel: { name: 'Label', control: 'boolean', description: 'Hidden: the text stays for screen readers', table: { category: 'Boolean' } },
    label: { name: 'Label text', control: 'text', table: { category: 'Text' } },
    name: { table: { disable: true } },
  },
  args: { type: 'primary', kind: 'checkbox', size: 'md', state: 'default', checked: true, showLabel: true, label: 'Incluir en el 303' },
};

export const Choice = {
  name: 'Choice card',
  parameters: { layout: 'padded' },
  render: ({ type, ...a }) => live(`<div class="${type === 'attention' ? 'field--attention' : 'field--primary'}" style="width:400px;max-width:100%">${choiceHTML(a)}</div>`),
  argTypes: {
    type: TYPE,
    kind: { name: 'Kind', control: { type: 'inline-radio', labels: { radio: 'Radio (one choice)', checkbox: 'Checkbox (several choices)' } }, options: ['radio', 'checkbox'], table: { category: 'Variant' } },
    state: STATE(['default', 'hover', 'disabled', 'focus']),
    checked: { name: 'Checked', control: 'boolean', table: { category: 'Boolean' } },
    title: { name: 'Title', control: 'text', table: { category: 'Text' } },
    desc: { name: 'Description', control: 'text', table: { category: 'Text' } },
    name: { table: { disable: true } },
  },
  args: { type: 'primary', kind: 'radio', state: 'default', checked: true, title: 'Versión actual (con datos)', desc: 'Guarda la contabilidad registrada actual.' },
};

export const ChoiceGroup = {
  name: 'Choice card · In the app',
  tags: ['!dev'],
  parameters: { layout: 'padded', controls: { disable: true } },
  render: () => live(`<div style="width:400px;max-width:100%">${choiceGroupHTML()}</div>`),
};

export const Status = {
  name: 'Status dot',
  render: ({ clickable, showLabel, ...a }) => live(statusHTML({ ...a, mode: clickable ? 'button' : showLabel ? 'label' : 'dot' })),
  argTypes: {
    state: { name: 'Status', control: { type: 'inline-radio', labels: { paid: 'Cobrada (green)', pending: 'Pendiente (orange)' } }, options: ['paid', 'pending'], table: { category: 'Variant' } },
    clickable: { name: 'Clickable', control: 'boolean', description: '24px button around the dot: click to switch Cobrada ↔ Pendiente', table: { category: 'Boolean' } },
    showLabel: { name: 'Label', control: 'boolean', description: 'Dot + text (static only)', if: { arg: 'clickable', truthy: false }, table: { category: 'Boolean' } },
    interaction: { ...STATE(['default', 'hover', 'focus']), if: { arg: 'clickable' } },
  },
  args: { state: 'paid', clickable: true, showLabel: false, interaction: 'default' },
};

export const Switch = {
  name: 'Switch',
  render: (args) => live(switchHTML(args)),
  argTypes: {
    state: STATE(['default', 'disabled', 'focus']),
    checked: { name: 'On', control: 'boolean', table: { category: 'Boolean' } },
    showLabels: { name: 'Labels', control: 'boolean', description: 'Hidden: the switch keeps its aria-label', table: { category: 'Boolean' } },
    on: { name: 'Right text (ON)', control: 'text', description: 'Any word: Eng, Anual, Sí…', if: { arg: 'showLabels' }, table: { category: 'Text' } },
    off: { name: 'Left text (OFF)', control: 'text', description: 'Any word: Esp, Mensual, No…', if: { arg: 'showLabels' }, table: { category: 'Text' } },
    label: { name: 'Accessible name', control: 'text', description: 'What the switch turns on, for screen readers', table: { category: 'Text' } },
  },
  args: { state: 'default', checked: false, showLabels: true, off: 'Esp', on: 'Eng', label: 'English' },
};

export const Chip = {
  name: 'Chip',
  render: (args) => chipHTML(args),
  argTypes: {
    variant: { name: 'Type', control: { type: 'inline-radio', labels: { brand: 'Brand (green outline)', code: 'Code (grey)' } }, options: ['brand', 'code'], table: { category: 'Variant' } },
    label: { name: 'Text', control: 'text', table: { category: 'Text' } },
  },
  args: { variant: 'brand', label: 'Contabilidad' },
};

/* ── Docs-only ── */
const head = 'font-family:var(--font-mono);font-size:var(--text-10);text-transform:uppercase;letter-spacing:var(--ls-caps);color:var(--text-muted)';
const grid = (cols, rows, min = 96) => `<div class="card" style="display:grid;grid-template-columns:140px repeat(${cols.length},minmax(${min}px,1fr));gap:var(--space-12) var(--space-16);align-items:center;max-width:900px">
  <span></span>${cols.map((c) => `<span style="${head};text-align:center">${c}</span>`).join('')}
  ${rows.map(([n, f]) => `<span style="${head}">${n}</span>${cols.map((c) => `<div style="display:flex;justify-content:center">${f(c)}</div>`).join('')}`).join('')}</div>`;

export const States = {
  name: 'States',
  tags: ['!dev'],
  parameters: { layout: 'padded', controls: { disable: true } },
  render: () => Object.assign(live(`${grid(['selected', 'deselected', 'disabled', 'focus'], [
    ['Checkbox · md', (s) => checkHTML({ checked: s !== 'deselected', state: s === 'focus' || s === 'disabled' ? s : 'default', showLabel: false })],
    ['Checkbox · sm', (s) => checkHTML({ checked: s !== 'deselected', state: s === 'focus' || s === 'disabled' ? s : 'default', size: 'sm', showLabel: false, type: 'attention' })],
    ['Radio', (s) => checkHTML({ kind: 'radio', checked: s !== 'deselected', state: s === 'focus' || s === 'disabled' ? s : 'default', showLabel: false, name: `st-${s}` })],
  ])}<div style="height:var(--space-16)"></div>${grid(['selected', 'deselected', 'hover', 'disabled', 'focus'], [
    ['Choice · radio', (s) => choiceHTML({ checked: s === 'selected', state: s === 'selected' || s === 'deselected' ? 'default' : s, name: `stc-${s}`, title: 'Versión actual', desc: 'Con datos.' })],
    ['Choice · checkbox', (s) => choiceHTML({ kind: 'checkbox', checked: s === 'selected', state: s === 'selected' || s === 'deselected' ? 'default' : s, title: 'Versión actual', desc: 'Con datos.' })],
  ], 120)}<div style="height:var(--space-16)"></div>${grid(['on', 'off', 'disabled', 'focus'], [
    ['Switch / toggle', (s) => switchHTML({ checked: s !== 'off', state: s === 'focus' || s === 'disabled' ? s : 'default' })],
  ], 170)}<div style="height:var(--space-16)"></div>${grid(['default', 'hover', 'focus'], [
    ['Status · Cobrada', (s) => statusHTML({ mode: 'button', interaction: s, state: 'paid' })],
    ['Status · Pendiente', (s) => statusHTML({ mode: 'button', interaction: s, state: 'pending' })],
  ])}`), { style: 'display:flex;flex-direction:column;align-items:flex-start' }),
};

export const StatusOverview = {
  name: 'Status · Overview',
  tags: ['!dev'],
  parameters: { layout: 'padded', controls: { disable: true } },
  render: () => grid(['paid', 'pending'], [
    ['Dot', (s) => statusHTML({ state: s })],
    ['Dot + label', (s) => statusHTML({ state: s, mode: 'label' })],
    ['Clickable', (s) => statusHTML({ state: s, mode: 'button' })],
  ]),
};

export const InContext = {
  name: 'In the app',
  tags: ['!dev'],
  parameters: { layout: 'padded', controls: { disable: true } },
  render: () => live(`<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:var(--space-16);max-width:1000px">
    <section class="card" aria-labelledby="sl-1">
      <div class="card__header"><h2 class="card__title" id="sl-1">Últimas facturas</h2>${chipHTML({ label: 'Demo' })}</div>
      <ul class="list list--sm">
        <li class="row"><span class="row__lead">411</span><span class="row__title">University</span><span class="row__value row__value--strong">4.826,00 €</span><span class="row__trail">${statusHTML({ state: 'pending', mode: 'button' })}</span></li>
        <li class="row"><span class="row__lead">409</span><span class="row__title">Main client</span><span class="row__value row__value--strong">3.892,45 €</span><span class="row__trail">${statusHTML({ state: 'paid', mode: 'button' })}</span></li>
      </ul>
      <div style="display:flex;justify-content:flex-end;gap:var(--space-16);padding-top:var(--space-12)">${statusHTML({ state: 'paid', mode: 'label' })}${statusHTML({ state: 'pending', mode: 'label' })}</div>
    </section>
    <section class="card" aria-labelledby="sl-2">
      <div class="card__header"><h2 class="card__title" id="sl-2">Nuevo gasto</h2>${switchHTML()}</div>
      <div style="display:flex;flex-direction:column;gap:var(--space-12)">
        ${checkHTML({ type: 'attention', label: 'Incluir en el modelo 303' })}
        <div style="display:flex;align-items:center;gap:var(--space-8)"><span class="chip chip--code">c.28</span><span style="font-size:var(--text-14)">IVA deducible operaciones interiores</span></div>
        ${checkHTML({ type: 'attention', size: 'sm', label: 'Fila de tabla (16px)', checked: false })}
      </div>
    </section>
  </div>`),
};

/* ── Design tab: the matching component in the Figma library ── */
Checkbox.parameters = { ...Checkbox.parameters, design: figma('26:85') };
Status.parameters = { ...Status.parameters, design: figma('27:65') };
Choice.parameters = { ...Choice.parameters, design: figma('27:93') };
ChoiceGroup.parameters = { ...ChoiceGroup.parameters, design: figma('66:191') };
Switch.parameters = { ...Switch.parameters, design: figma('27:34') };
Chip.parameters = { ...Chip.parameters, design: figma('27:70') };
States.parameters = { ...States.parameters, design: figma('26:3') };
StatusOverview.parameters = { ...StatusOverview.parameters, design: figma('27:65') };
InContext.parameters = { ...InContext.parameters, design: figma('26:3') };
