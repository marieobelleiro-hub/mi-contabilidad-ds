// Input stories — HTML + Vite
// One story per component, the same as in Figma: Field (text · amount · date · dropdown), Amount · small, Description, Field · inline.
// Every label, value and message is a real one from the app. The mobile forms are in Dialog.
// Checkbox / radio / switch → Selectors · cells inside tables → Tables.
import { figma } from '../../.storybook/figma.js';
import './input-docs.css';
import { CAT_OPTS, IVA } from './entry-form.js';

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

const T = (category) => ({ table: { category } });

export default {
  title: 'App/Components/Input',
  tags: ['!autodocs'],   // documented in Input.mdx
  excludeStories: ['fieldHTML', 'FIELDS'],
  parameters: { layout: 'padded' },
  globals: { backgrounds: { value: 'white' } },
};

/* ── Field: text, amount, date and dropdown are one component (same as Figma "Field") ── */
const STATE5 = { name: 'State', control: { type: 'inline-radio', labels: { default: 'Default', hover: 'Hover', error: 'Error', disabled: 'Disabled', focus: 'Focus' } }, options: ['default', 'hover', 'error', 'disabled', 'focus'], ...T('Variant') };
const COLOUR = { name: 'Colour', control: { type: 'inline-radio', labels: { primary: 'Blue (Facturación, IRPF)', attention: 'Orange (Gastos, IVA)' } }, options: ['primary', 'attention'], description: 'Focus border, checkboxes and total; the tint colour when Tinted', ...T('Variant') };
const optionsFor = (text) => (IVA.includes(text) ? IVA : CAT_OPTS.includes(text) ? CAT_OPTS : [text]);
export const Field = {
  name: 'Field',
  argTypes: {
    accent: COLOUR,
    tinted: { name: 'Tinted', control: 'boolean', description: 'Tint background: only in the mobile forms', ...T('Variant') },
    value: { name: 'Value', control: { type: 'inline-radio', labels: { filled: 'Filled', empty: 'Empty (grey placeholder)' } }, options: ['filled', 'empty'], ...T('Variant') },
    state: STATE5,
    dropdown: { name: 'Dropdown', control: 'boolean', description: 'A list of fixed options, with the chevron (% de IVA, Categoría IRPF)', ...T('Boolean') },
    optional: { name: 'Optional', control: 'boolean', description: 'Adds "(opcional)" in grey next to the label', ...T('Boolean') },
    hint: { name: 'Hint', control: 'boolean', description: 'Grey message under the field', ...T('Boolean') },
    label: { name: 'Label', control: 'text', ...T('Text') },
    text: { name: 'Text in the field', control: 'text', description: 'The value when Filled · the grey placeholder when Empty', ...T('Text') },
    hintText: { name: 'Hint text', control: 'text', if: { arg: 'hint' }, ...T('Text') },
    errorText: { name: 'Error text', control: 'text', description: 'Shown when State is Error', ...T('Text') },
  },
  args: { accent: 'primary', tinted: false, value: 'filled', state: 'default', dropdown: false, optional: false, hint: false, label: 'Proveedor', text: 'Jazztel', hintText: 'La cuota de autónomos no lleva IVA.', errorText: REQ },
  render: (a) => {
    const empty = a.value === 'empty';
    const f = a.dropdown
      ? { type: 'select', options: empty ? [] : optionsFor(a.text), value: empty ? '' : a.text, optionPlaceholder: empty ? a.text : '' }
      : { value: empty ? '' : a.text, placeholder: empty ? a.text : '' };
    return `<div style="width:360px;max-width:100%">${fieldHTML({ ...f, label: a.label, accent: a.accent, tinted: a.tinted, optional: a.optional,
      required: !a.optional, state: ['hover', 'focus'].includes(a.state) ? a.state : '', disabled: a.state === 'disabled',
      hint: a.hint ? a.hintText : '', error: a.state === 'error' ? a.errorText : '' })}</div>`;
  },
};

/* ── Amount · small: the two numbers you type in the tax forms ── */
export const AmountSmall = {
  name: 'Amount · small',
  argTypes: {
    accent: { name: 'Colour', control: { type: 'inline-radio', labels: { primary: 'Blue (Modelo 130)', attention: 'Orange (Modelo 303)' } }, options: ['primary', 'attention'], ...T('Variant') },
    state: STATE5,
    optional: { name: 'Optional', control: 'boolean', description: 'A checkbox before the label instead of "(opcional)"', ...T('Boolean') },
    label: { name: 'Label', control: 'text', if: { arg: 'optional', truthy: false }, ...T('Text') },
    checkLabel: { name: 'Checkbox text', control: 'text', if: { arg: 'optional' }, ...T('Text') },
    text: { name: 'Text in the field', control: 'text', ...T('Text') },
  },
  args: { accent: 'attention', state: 'default', optional: true, label: 'Importe ingresado en Hacienda', checkLabel: 'Aplicar compensación', text: '151,80' },
  render: (a) => {
    const i = id();
    const cls = `input input--sm input--num input--w-sm${['hover', 'focus'].includes(a.state) ? ` is-${a.state}` : ''}`;
    const lead = a.optional
      ? `<label class="check"><input type="checkbox" checked> ${a.checkLabel}</label>`
      : `<label class="row__label" for="${i}">${a.label}</label>`;
    return `<div class="field--${a.accent}" style="width:720px;max-width:100%"><div class="list"><div class="row row--kv">
      ${lead}
      <input class="${cls}" id="${i}" value="${a.text}" placeholder="0,00" inputmode="decimal"${a.optional ? ` aria-label="Importe: ${a.checkLabel}"` : ' aria-required="true"'}${a.state === 'error' ? ' aria-invalid="true"' : ''}${a.state === 'disabled' ? ' disabled' : ''}>
    </div></div></div>`;
  },
};

/* ── Description: free text over several lines (Notas) ── */
export const Description = {
  name: 'Description',
  argTypes: {
    accent: COLOUR,
    filled: { name: 'Filled background', control: 'boolean', description: 'Grey box (input--filled): the Notas of the tax forms. Off = white, like the other fields', ...T('Variant') },
    state: STATE5,
    optional: { name: 'Optional', control: 'boolean', description: 'Adds "(opcional)" in grey next to the label', ...T('Boolean') },
    label: { name: 'Label', control: 'text', ...T('Text') },
    text: { name: 'Text in the field', control: 'text', description: 'Starts with the sentence the app shows in the empty field; delete it to see that placeholder', ...T('Text') },
    errorText: { name: 'Error text', control: 'text', description: 'Shown when State is Error', ...T('Text') },
  },
  args: { accent: 'attention', filled: true, state: 'default', optional: true, label: FIELDS.notas.label, text: FIELDS.notas.placeholder, errorText: REQ },
  render: (a) => `<div style="width:360px;max-width:100%">${fieldHTML({ type: 'textarea', placeholder: FIELDS.notas.placeholder, value: a.text === FIELDS.notas.placeholder ? '' : a.text,
    label: a.label, accent: a.accent, filled: a.filled, optional: a.optional, required: !a.optional,
    state: ['hover', 'focus'].includes(a.state) ? a.state : '', disabled: a.state === 'disabled', error: a.state === 'error' ? a.errorText : '' })}</div>`,
};

/* ── Field · inline: the label on the left (Cálculo del salario) ── */
export const Inline = {
  name: 'Field · inline',
  argTypes: {
    state: STATE5,
    label: { name: 'Label', control: 'text', ...T('Text') },
    text: { name: 'Text in the field', control: 'text', ...T('Text') },
    errorText: { name: 'Error text', control: 'text', description: 'Shown when State is Error', ...T('Text') },
  },
  args: { state: 'default', label: 'Clientes', text: 'Main client', errorText: REQ },
  render: (a) => `<div style="width:720px;max-width:100%">${fieldHTML({ label: a.label, value: a.text, placeholder: 'Main client', inline: true,
    state: ['hover', 'focus'].includes(a.state) ? a.state : '', disabled: a.state === 'disabled', error: a.state === 'error' ? a.errorText : '' })}</div>`,
};

/* ── Illustrations (no controls) ── */
const ILL = { controls: { disable: true } };
const HIDDEN = ['!dev'];   // only shown inside the Input page, not in the sidebar
const cell = (cap, html) => `<figure class="ifig__cell"><figcaption class="ifig__cap">${cap}</figcaption>${html}</figure>`;
const fig = (cells, cols = 3) => `<div class="ifig" style="--ifig-cols:${cols}">${cells.join('')}</div>`;

export const Types = {
  name: 'Illustration · Types',
  tags: HIDDEN,
  parameters: ILL,
  render: () => fig([
    cell('Text', pick('proveedor')),
    cell('Amount', pick('base')),
    cell('Date · empty', pick('fecha', { value: '' })),
    cell('Dropdown', pick('iva')),
    cell('Dropdown · empty', pick('cat', { value: '' })),
    cell('Optional · empty', pick('num', { value: '', optional: true })),
  ]),
};

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
Field.parameters = { ...Field.parameters, design: figma('37:162') };
AmountSmall.parameters = { ...AmountSmall.parameters, design: figma('36:163') };
Description.parameters = { ...Description.parameters, design: figma('36:142') };
Inline.parameters = { ...Inline.parameters, design: figma('36:184') };
Types.parameters = { ...Types.parameters, design: figma('35:9') };
Anatomy.parameters = { ...Anatomy.parameters, design: figma('37:162') };
States.parameters = { ...States.parameters, design: figma('37:162') };
Colour.parameters = { ...Colour.parameters, design: figma('37:162') };
