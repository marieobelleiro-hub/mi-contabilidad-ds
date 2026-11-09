// Input stories — HTML + Vite
// One story per type of input, each with its controls. Every label, value and message is a real one from the app.
// Checkbox / radio / switch → Selectors · cells inside tables → Tables.
import { figma } from '../../.storybook/figma.js';
import './input-docs.css';
import { dialogHTML } from '../dialog/dialog.stories.js';
import { entryForm, wireEntryForm, CAT_OPTS, IVA } from './entry-form.js';
import { inFrame, frameArgs, mobileFrame } from '../../foundations/mobile-frame.js';

let uid = 0;
const id = () => `f${++uid}`;
const YEAR = new Date().getFullYear();
const REQ = 'Este campo es obligatorio.';

/** One field: label + control + hint / error */
export const fieldHTML = ({ label = 'Concepto', type = 'text', value = '', placeholder = '', hint = '', error = '',
  accent = 'primary', tinted = false, filled = false, disabled = false, optional = false, required = false, inline = false, state = '',
  options = [], optionPlaceholder = '', inputmode = '' }) => {
  const i = id();
  const cls = ['input'];
  if (filled) cls.push('input--filled');
  if (state === 'hover' || state === 'focus') cls.push(`is-${state}`);
  const describedBy = [hint && `${i}-hint`, error && `${i}-err`].filter(Boolean).join(' ');
  const attrs = `class="${cls.join(' ')}" id="${i}"${describedBy ? ` aria-describedby="${describedBy}"` : ''}${error ? ' aria-invalid="true"' : ''}${required ? ' aria-required="true"' : ''}${disabled ? ' disabled' : ''}`;
  let control;
  if (type === 'select') control = `<select ${attrs}>${optionPlaceholder ? `<option value="">${optionPlaceholder}</option>` : ''}${options.map((o) => `<option${o === value ? ' selected' : ''}>${o}</option>`).join('')}</select>`;
  else if (type === 'textarea') control = `<textarea ${attrs}${placeholder ? ` placeholder="${placeholder}"` : ''}>${value}</textarea>`;
  else control = `<input ${attrs} type="text"${inputmode ? ` inputmode="${inputmode}"` : ''} value="${value}"${placeholder ? ` placeholder="${placeholder}"` : ''} autocomplete="off">`;
  const fcls = ['field', `field--${accent}`];
  if (tinted) fcls.push('field--tinted');
  if (inline) fcls.push('field--inline');
  return `<div class="${fcls.join(' ')}">
    <label class="field__label" for="${i}">${label}${optional ? ' <span class="is-optional">(opcional)</span>' : ''}</label>
    ${control}
    ${hint ? `<p class="field__hint" id="${i}-hint">${hint}</p>` : ''}
    ${error ? `<p class="field__error" id="${i}-err">${error}</p>` : ''}
  </div>`;
};

/* ── The real fields of the app ── */
export const FIELDS = {
  proveedor: { label: 'Proveedor', value: 'Jazztel', msg: REQ },
  cliente: { label: 'Cliente', value: 'University', msg: REQ },
  concepto: { label: 'Concepto', value: 'Internet', msg: REQ },
  num: { label: 'Número de factura', value: '411', msg: REQ },
  base: { label: 'Base imponible en €', value: '37,65', inputmode: 'decimal', msg: 'Introduce un importe válido, por ejemplo 1250,50.' },
  fecha: { label: `Fecha · ${YEAR}`, value: '30/09/2026', placeholder: 'DD/MM/AAAA', inputmode: 'numeric', msg: 'Fecha no válida. Escríbela como DD/MM/AAAA.' },
  iva: { label: '% de IVA', type: 'select', value: '21 %', options: IVA, hint: 'La cuota de autónomos no lleva IVA.' },
  cat: { label: 'Categoría IRPF', type: 'select', value: CAT_OPTS[2], options: CAT_OPTS, optionPlaceholder: 'Elige una categoría', msg: 'Elige una categoría.' },
  notas: { label: 'Notas del trimestre', type: 'textarea', placeholder: 'Criterios o decisiones de este trimestre...' },
  notasAnual: { label: 'Notas de la declaración', type: 'textarea', placeholder: 'Observaciones sobre la declaración anual...' },
};
const pick = (k, extra = {}) => { const { msg, hint, ...f } = FIELDS[k]; return fieldHTML({ ...f, ...extra }); };

/* ── Shared controls (same order on every type) ── */
const T = (category) => ({ table: { category } });
const COMMON = {
  tinted: { name: 'Tinted', control: 'boolean', description: 'Tint background: only in the mobile forms', ...T('Style') },
  accent: { name: 'Colour', control: { type: 'inline-radio', labels: { primary: 'Blue (Facturación, IRPF)', attention: 'Orange (Gastos, IVA)' } }, options: ['primary', 'attention'], if: { arg: 'tinted' }, ...T('Style') },
  state: { name: 'State', control: { type: 'inline-radio', labels: { default: 'Default', hover: 'Hover', disabled: 'Disabled', focus: 'Focus' } }, options: ['default', 'hover', 'disabled', 'focus'], ...T('Style') },
  label: { name: 'Label', control: 'text', ...T('Content') },
  required: { name: 'Required', control: { type: 'inline-radio', labels: { required: 'Required', optional: 'Optional' } }, options: ['required', 'optional'], description: 'Optional adds "(opcional)" in grey next to the label', ...T('Content') },
  value: { name: 'Text in the field', control: 'text', description: 'Delete it to see the empty field', ...T('Content') },
  message: { name: 'Message', control: { type: 'inline-radio', labels: { none: 'None', hint: 'Hint (grey)', error: 'Error (red)' } }, options: ['none', 'hint', 'error'], ...T('Message') },
  hintText: { name: 'Hint text', control: 'text', if: { arg: 'message', eq: 'hint' }, ...T('Message') },
  errorText: { name: 'Error text', control: 'text', if: { arg: 'message', eq: 'error' }, ...T('Message') },
};
/** Default args: every text control starts with the real text of the app (never an empty box). */
const argsFor = (f, extra = {}) => ({
  tinted: false, accent: 'primary', state: 'default', label: f.label, required: 'required', value: f.value ?? '',
  message: 'none', hintText: f.hint || 'Hint text.', errorText: f.msg || REQ, ...extra,
});

/** Builds the field of a type story from its args. */
const fromArgs = (base, a, extra = {}) => {
  const { msg, hint, ...f } = base;
  return `<div style="width:360px;max-width:100%">${fieldHTML({
    ...f, ...extra,
    label: a.label,
    accent: a.tinted ? a.accent : (extra.accent || 'primary'),
    tinted: a.tinted,
    optional: a.required === 'optional',
    required: a.required === 'required',
    state: ['hover', 'focus'].includes(a.state) ? a.state : '',
    disabled: a.state === 'disabled',
    hint: a.message === 'hint' ? a.hintText : '',
    error: a.message === 'error' ? a.errorText : '',
  })}</div>`;
};

export default {
  title: 'App/Components/Input',
  tags: ['!autodocs'],   // documented in Input.mdx
  excludeStories: ['fieldHTML', 'FIELDS'],
  parameters: { layout: 'padded' },
  globals: { backgrounds: { value: 'white' } },
};

/* ── 1 · Text ── */
export const Text = {
  name: 'Text',
  argTypes: { ...COMMON },
  args: argsFor(FIELDS.proveedor),
  render: (a) => fromArgs(FIELDS.proveedor, a, { value: a.value }),
};

/* ── 2 · Amount (regular in forms · small in the tax forms) ── */
const onlyRegular = (t) => ({ ...t, if: { arg: 'size', eq: 'regular' } });
const onlySmall = (t) => ({ ...t, if: { arg: 'size', eq: 'small' } });
export const Amount = {
  name: 'Amount',
  argTypes: {
    size: { name: 'Size', control: { type: 'inline-radio', labels: { regular: 'Regular · 40px (forms)', small: 'Small · 24px (tax forms)' } }, options: ['regular', 'small'], ...T('Style') },
    tinted: onlyRegular(COMMON.tinted),
    accent: COMMON.accent,
    smallAccent: onlySmall({ name: 'Colour', control: { type: 'inline-radio', labels: { primary: 'Blue (Modelo 130)', attention: 'Orange (Modelo 303)' } }, options: ['primary', 'attention'], ...T('Style') }),
    state: COMMON.state,
    label: onlyRegular(COMMON.label),
    required: { ...COMMON.required, description: 'Regular: optional adds "(opcional)" · Small: optional puts a checkbox before the label' },
    smallLabel: onlySmall({ name: 'Label (required)', control: 'text', description: 'Shown on the left when Required', ...T('Content') }),
    checkLabel: onlySmall({ name: 'Checkbox text (optional)', control: 'text', description: 'Shown on the left, after the checkbox, when Optional', ...T('Content') }),
    value: onlyRegular(COMMON.value),
    smallValue: onlySmall({ ...COMMON.value }),
    message: onlyRegular(COMMON.message),
    hintText: COMMON.hintText,
    errorText: COMMON.errorText,
  },
  args: argsFor(FIELDS.base, { size: 'regular', smallAccent: 'attention', smallLabel: 'Importe ingresado en Hacienda', checkLabel: 'Aplicar compensación', smallValue: '151,80' }),
  render: (a) => {
    if (a.size === 'regular') return fromArgs(FIELDS.base, a, { value: a.value });
    const i = id();
    const cls = `input input--sm input--num input--w-sm${['hover', 'focus'].includes(a.state) ? ` is-${a.state}` : ''}`;
    const optional = a.required === 'optional';
    const lead = optional
      ? `<label class="check"><input type="checkbox" checked> ${a.checkLabel}</label>`
      : `<label class="row__label" for="${i}">${a.smallLabel}</label>`;
    return `<div class="field--${a.smallAccent}" style="width:720px;max-width:100%"><div class="list"><div class="row row--kv">
      ${lead}
      <input class="${cls}" id="${i}" value="${a.smallValue}" placeholder="0,00" inputmode="decimal"${optional ? ` aria-label="Importe: ${a.checkLabel}"` : ' aria-required="true"'}${a.state === 'disabled' ? ' disabled' : ''}>
    </div></div></div>`;
  },
};

/* ── 3 · Date ── */
export const Date_ = {
  name: 'Date',
  argTypes: { ...COMMON },
  args: argsFor(FIELDS.fecha),
  render: (a) => fromArgs(FIELDS.fecha, a, { value: a.value }),
};

/* ── 4 · Dropdown ── */
export const Dropdown = {
  name: 'Dropdown',
  argTypes: {
    variant: { name: 'Variant', control: { type: 'inline-radio', labels: { iva: '% de IVA', cat: 'Categoría IRPF' } }, options: ['iva', 'cat'], ...T('Content') },
    ...COMMON,
    label: { ...COMMON.label, if: { arg: 'variant', eq: 'iva' } },
    catLabel: { ...COMMON.label, if: { arg: 'variant', eq: 'cat' } },
    value: { name: 'Option selected', control: 'select', options: IVA, if: { arg: 'variant', eq: 'iva' }, ...T('Content') },
    catValue: { name: 'Option selected', control: { type: 'select', labels: { '': 'Elige una categoría (none yet)' } }, options: ['', ...CAT_OPTS], if: { arg: 'variant', eq: 'cat' }, ...T('Content') },
  },
  args: argsFor(FIELDS.iva, { variant: 'iva', catLabel: FIELDS.cat.label, catValue: CAT_OPTS[2], errorText: FIELDS.cat.msg }),
  render: (a) => fromArgs(FIELDS[a.variant], { ...a, label: a.variant === 'iva' ? a.label : a.catLabel }, { value: a.variant === 'iva' ? a.value : a.catValue }),
};

/* ── 5 · Description ── */
export const Description = {
  name: 'Description',
  argTypes: {
    filled: { name: 'Filled background', control: 'boolean', description: 'Grey box (input--filled): the Notas of the tax forms. Off = white, like the other fields', ...T('Style') },
    tinted: { table: { disable: true } }, accent: { table: { disable: true } },
    state: COMMON.state, label: COMMON.label, required: COMMON.required,
    value: { ...COMMON.value, description: 'Starts with the sentence the app shows in the empty field; delete it to see that placeholder' },
    message: COMMON.message, hintText: COMMON.hintText, errorText: COMMON.errorText,
  },
  args: argsFor(FIELDS.notas, { filled: true, required: 'optional', value: FIELDS.notas.placeholder }),
  render: (a) => {
    const { msg, hint, ...f } = FIELDS.notas;
    return `<div style="width:360px;max-width:100%">${fieldHTML({ ...f, value: a.value, label: a.label, filled: a.filled,
      optional: a.required === 'optional', required: a.required === 'required',
      state: ['hover', 'focus'].includes(a.state) ? a.state : '', disabled: a.state === 'disabled',
      hint: a.message === 'hint' ? a.hintText : '', error: a.message === 'error' ? a.errorText : '' })}</div>`;
  },
};

/* ── Mobile forms (the real full-screen dialog) ── */
export const MobileForms = {
  name: 'Mobile forms',
  parameters: { layout: 'fullscreen' },
  argTypes: {
    form: { name: 'Form', control: { type: 'select', labels: { 'factura-esp': 'Facturación · Nacional', 'factura-ext': 'Facturación · Exenta de impuestos', 'gasto-cat': 'Gastos · from a category (Por cat. IRPF)', 'gasto-iva': 'Gastos · from an IVA rate (Por % IVA)' } }, options: ['factura-esp', 'factura-ext', 'gasto-cat', 'gasto-iva'] },
    cat: { name: 'Category it opens from', control: { type: 'select', labels: Object.fromEntries(CAT_OPTS.map((c, i) => [String(i), c])) }, options: CAT_OPTS.map((c, i) => String(i)), if: { arg: 'form', eq: 'gasto-cat' } },
    rate: { name: 'IVA rate it opens from', control: { type: 'inline-radio', labels: Object.fromEntries(IVA.map((r) => [r.split(' ')[0], r])) }, options: IVA.map((r) => r.split(' ')[0]), if: { arg: 'form', eq: 'gasto-iva' } },
  },
  args: { form: 'factura-esp', cat: '2', rate: '21' },
  render: (a) => {
    if (!inFrame()) return mobileFrame('app-components-input--mobile-forms', a, { height: 844, bg: 'white' });
    a = { ...a, ...frameArgs() };
    const el = document.createElement('div');
    el.innerHTML = dialogHTML(entryForm({ form: a.form, cat: Number(a.cat), rate: `${a.rate} %` }));
    el.querySelector('dialog').setAttribute('open', '');
    return wireEntryForm(el);
  },
};

/* ── Illustrations (no controls) ── */
const ILL = { controls: { disable: true } };
const HIDDEN = ['!dev'];   // only shown inside the Input page, not in the sidebar
const cell = (cap, html) => `<figure class="ifig__cell"><figcaption class="ifig__cap">${cap}</figcaption>${html}</figure>`;
const fig = (cells, cols = 3) => `<div class="ifig" style="--ifig-cols:${cols}">${cells.join('')}</div>`;

export const Anatomy = {
  name: 'Illustration · Anatomy',
  tags: HIDDEN,
  parameters: ILL,
  render: () => `<div class="ianat">
    ${pick('fecha', { value: '31/09/2026', optional: false, error: FIELDS.fecha.msg })}
    <p class="ianat__note" style="grid-row:1">Label · <code>field__label</code> · optional: "(opcional)" in grey</p>
    <p class="ianat__note" style="grid-row:2">Box · <code>input</code> · the text you type</p>
    <p class="ianat__note" style="grid-row:3">Message · <code>field__hint</code> grey · <code>field__error</code> red</p>
  </div>`,
};

export const States = {
  name: 'Illustration · States',
  tags: HIDDEN,
  parameters: ILL,
  render: () => fig([
    cell('Empty', pick('concepto', { value: '' })),
    cell('Hover', pick('concepto', { value: '', state: 'hover' })),
    cell('Filled', pick('concepto')),
    cell('Error', pick('concepto', { value: '', error: REQ })),
    cell('Disabled + hint', pick('iva', { value: '0 %', disabled: true, hint: FIELDS.iva.hint })),
    cell('Focus', pick('concepto', { value: '', state: 'focus' })),
  ]),
};

export const Colour = {
  name: 'Illustration · Colour & background',
  tags: HIDDEN,
  parameters: ILL,
  render: () => fig([
    cell('Blue · white', pick('concepto', { state: 'focus' })),
    cell('Blue · tinted', pick('cliente', { tinted: true, state: 'focus' })),
    cell('Orange · white', pick('concepto', { accent: 'attention', state: 'focus' })),
    cell('Orange · tinted', pick('proveedor', { accent: 'attention', tinted: true, state: 'focus' })),
  ], 4),
};

/* ── Design tab: the matching component in the Figma library ── */
Text.parameters = { ...Text.parameters, design: figma('37:162') };
Amount.parameters = { ...Amount.parameters, design: figma('36:163') };
Date_.parameters = { ...Date_.parameters, design: figma('37:162') };
Dropdown.parameters = { ...Dropdown.parameters, design: figma('37:343') };
Description.parameters = { ...Description.parameters, design: figma('36:142') };
MobileForms.parameters = { ...MobileForms.parameters, design: figma('118:164') };
Anatomy.parameters = { ...Anatomy.parameters, design: figma('38:22') };
States.parameters = { ...States.parameters, design: figma('37:162') };
Colour.parameters = { ...Colour.parameters, design: figma('37:162') };
