// Button stories — HTML + Vite
// Three types (Big, Ghost, Icon). Each has its own Playground with the properties agreed for it.
import { figma } from '../../.storybook/figma.js';
import { icon } from '../../icons/icons.js';

/* Icons each type can swap to */
export const BIG_ICONS = ['arrow-right', 'save', 'check', 'download', 'trash', 'plus', 'chevron-down'];
export const GHOST_ICONS = ['plus', 'arrow-right', 'save', 'check', 'download', 'trash', 'chevron-down'];
export const ICON_BUTTON_ICONS = { info: ['info'], danger: ['trash', 'close', 'close-filled'] };
/** Icon button types: each one has its own icon and meaning (the same as the Figma property Type) */
export const ICON_BUTTON_TYPES = {
  info: { kind: 'info', icon: 'info', label: 'Más información' },        // opens a tooltip
  close: { kind: 'danger', icon: 'close', label: 'Cerrar' },             // closes a banner or a dialog
  remove: { kind: 'danger', icon: 'close-filled', label: 'Eliminar factura 411' },   // removes a line, a message, the text of a field…
  delete: { kind: 'danger', icon: 'trash', label: 'Eliminar gasto' },    // deletes a record
};
const STATES = ['default', 'hover', 'pressed', 'disabled', 'focus'];
const stateAttrs = (state) => ({
  cls: { hover: ' is-hover', pressed: ' is-active', focus: ' is-focus' }[state] || '',
  dis: state === 'disabled' ? ' disabled' : '',
});

/** Big button · 48px. Optional icon on the left and/or on the right, each with its own icon (✓ Guardado 💾).
    With icons: everything starts on the left (8px after the left icon), the right icon sits at the far right. Without icons: text centred. */
export const bigHTML = ({ colour = 'primary', label = 'Continuar', showIconLeft = false, iconLeft = 'check', showIcon = true, icon: name = 'arrow-right', state = 'default' } = {}) => {
  const { cls, dis } = stateAttrs(state);
  return `<button type="button" class="btn btn--${colour}${cls}"${dis}>${showIconLeft ? icon(iconLeft, { size: 'md' }) : ''}<span class="btn__label">${label}</span>${showIcon ? icon(name, { size: 'md' }) : ''}</button>`;
};

/** Ghost button · 24px. Optional icon on the left (plus by default); the text is always there. */
export const ghostHTML = ({ colour = 'primary', label = 'Añadir factura', showIcon = true, icon: name = 'plus', state = 'default', flush = false } = {}) => {
  const { cls, dis } = stateAttrs(state);
  return `<button type="button" class="btn btn--ghost btn--${colour}${flush ? ' btn--flush' : ''}${cls}"${dis}>${showIcon ? icon(name) : ''}<span class="btn__label">${label}</span></button>`;
};

/** Icon button · Info (blue) · Close · Remove · Delete (grey → red). The label is for screen readers only.
    type: 'info' | 'close' | 'remove' | 'delete' (or the older kind + icon). */
/* Default accessible name for each icon (in the app it is more specific: "Eliminar factura 411") */
const ICON_LABELS = { info: 'Más información', trash: 'Eliminar', close: 'Cerrar', 'close-filled': 'Eliminar' };
export const iconButtonHTML = ({ type, kind = 'info', icon: name, size = 'sm', label, state = 'default' } = {}) => {
  const { cls, dis } = stateAttrs(state);
  if (type) ({ kind, icon: name } = ICON_BUTTON_TYPES[type]);
  const ico = name || ICON_BUTTON_ICONS[kind][0];
  label = label || ICON_LABELS[ico] || ico;
  return `<button type="button" class="btn btn--icon btn--${size} btn--${kind}${cls}" aria-label="${label}"${dis}>${icon(ico, { size: size === 'md' ? 'md' : 'sm' })}</button>`;
};

const STATE_CONTROL = { control: 'select', options: STATES, description: 'Shown statically here; in use the state comes from the pointer, keyboard and `disabled`' };

export default {
  title: 'App/Components/Button',
  tags: ['!autodocs'],   // documented in Button.mdx
  excludeStories: ['bigHTML', 'ghostHTML', 'iconButtonHTML', 'fabHTML', 'BIG_ICONS', 'GHOST_ICONS', 'ICON_BUTTON_ICONS', 'ICON_BUTTON_TYPES', 'FAB_ICONS'],
  parameters: { layout: 'centered' },
};

/* ── Playgrounds: one per type (shown in the sidebar) ── */
export const Big = {
  name: 'Big button',
  render: (args) => bigHTML(args),
  argTypes: {
    colour: { name: 'Type', control: { type: 'inline-radio', labels: { primary: 'Primary (blue)', attention: 'Attention (orange)' } }, options: ['primary', 'attention'], table: { category: 'Variant' } },
    showIconLeft: { name: 'Icon left', control: 'boolean', table: { category: 'Boolean' } },
    iconLeft: { name: 'Icon left choice', control: 'select', options: BIG_ICONS, if: { arg: 'showIconLeft' }, table: { category: 'Icon swap' } },
    showIcon: { name: 'Icon right', control: 'boolean', table: { category: 'Boolean' } },
    icon: { name: 'Icon right choice', control: 'select', options: BIG_ICONS, if: { arg: 'showIcon' }, table: { category: 'Icon swap' } },
    label: { name: 'Label', control: 'text', description: 'Short. Too long → cut with "…"', table: { category: 'Text' } },
    state: { name: 'State', ...STATE_CONTROL, table: { category: 'Variant' } },
  },
  args: { colour: 'primary', showIconLeft: true, iconLeft: 'check', showIcon: true, icon: 'save', label: 'Guardado', state: 'default' },
};

export const Ghost = {
  name: 'Ghost button',
  render: (args) => ghostHTML(args),
  argTypes: {
    colour: { name: 'Type', control: { type: 'inline-radio', labels: { primary: 'Primary (blue)', attention: 'Attention (orange)' } }, options: ['primary', 'attention'], table: { category: 'Variant' } },
    showIcon: { name: 'Icon', control: 'boolean', table: { category: 'Boolean' } },
    icon: { name: 'Icon choice', control: 'select', options: GHOST_ICONS, if: { arg: 'showIcon' }, table: { category: 'Icon swap' } },
    label: { name: 'Label', control: 'text', description: 'Always present. Too long → cut with "…"', table: { category: 'Text' } },
    state: { name: 'State', ...STATE_CONTROL, table: { category: 'Variant' } },
    flush: { table: { disable: true } },
  },
  args: { colour: 'primary', showIcon: true, icon: 'plus', label: 'Añadir factura', state: 'default' },
};

export const Icon = {
  name: 'Icon button',
  render: ({ type, label, ...a }) => iconButtonHTML({ ...a, type, label: label || ICON_BUTTON_TYPES[type].label }),
  argTypes: {
    type: { name: 'Type', control: { type: 'inline-radio', labels: { info: 'Info (i)', close: 'Close (×)', remove: 'Remove (⊗)', delete: 'Delete (trash)' } }, options: ['info', 'close', 'remove', 'delete'], description: 'Info: blue, opens a tooltip · Close: closes a banner or dialog · Remove: takes out a line, a message, the text of a field · Delete: deletes a record. Close, Remove and Delete: grey → red', table: { category: 'Variant' } },
    size: { name: 'Size', control: 'inline-radio', options: ['sm', 'md'], description: 'sm 24 (dense rows) · md 40', table: { category: 'Variant' } },
    label: { name: 'Label (screen readers only)', control: 'text', description: 'Invisible. Read aloud by screen readers (aria-label): say what the button does, e.g. "Eliminar factura 411". Empty = default for the icon', table: { category: 'Text' } },
    state: { name: 'State', ...STATE_CONTROL, table: { category: 'Variant' } },
  },
  args: { type: 'info', size: 'sm', label: '', state: 'default' },
};

/* ── Docs-only stories (hidden from the sidebar) ── */
const cell = 'display:flex;align-items:center;justify-content:center;min-height:72px;padding:var(--space-8)';
const head = 'font-family:var(--font-mono);font-size:var(--text-10);text-transform:uppercase;letter-spacing:var(--ls-caps);color:var(--text-muted)';
const statesRow = (name, fn) => `<span style="${head};align-self:center">${name}</span>${STATES.map((s) => `<div style="${cell}">${fn(s)}</div>`).join('')}`;

export const States = {
  name: 'States',
  tags: ['!dev'],
  parameters: { layout: 'padded', controls: { disable: true } },
  render: () => `<div class="card" style="display:grid;grid-template-columns:120px repeat(5,minmax(200px,1fr));gap:var(--space-8) var(--space-16);max-width:1240px;overflow-x:auto">
    <span></span>${STATES.map((s) => `<span style="${head};text-align:center">${s}</span>`).join('')}
    ${statesRow('Big · primary', (s) => bigHTML({ state: s }))}
    ${statesRow('Big · attention', (s) => bigHTML({ colour: 'attention', label: 'Guardar', icon: 'save', state: s }))}
    ${statesRow('Ghost · primary', (s) => ghostHTML({ state: s }))}
    ${statesRow('Ghost · attention', (s) => ghostHTML({ colour: 'attention', label: 'Añadir gasto', state: s }))}
    ${statesRow('Icon · info', (s) => iconButtonHTML({ type: 'info', state: s }))}
    ${statesRow('Icon · close', (s) => iconButtonHTML({ type: 'close', state: s }))}
    ${statesRow('Icon · remove', (s) => iconButtonHTML({ type: 'remove', state: s }))}
    ${statesRow('Icon · delete', (s) => iconButtonHTML({ type: 'delete', state: s }))}
  </div>`,
};

export const LongLabel = {
  name: 'Long label',
  tags: ['!dev'],
  parameters: { layout: 'padded', controls: { disable: true } },
  render: () => `<div class="card" style="display:flex;flex-direction:column;align-items:flex-start;gap:var(--space-16)">
    ${bigHTML({ label: 'Guardar y continuar con la siguiente factura' })}
    ${bigHTML({ label: 'Guardar y continuar con la siguiente factura', showIcon: false, colour: 'attention' })}
  </div>`,
};

export const InContext = {
  name: 'In the app',
  tags: ['!dev'],
  parameters: { layout: 'padded', controls: { disable: true } },
  render: () => `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:var(--space-16);max-width:960px">
    <section class="card" aria-labelledby="bi-1">
      <div class="card__header"><h2 class="card__title" id="bi-1">Últimas facturas</h2>${iconButtonHTML({ label: 'Más información sobre las facturas' })}</div>
      <p class="card__sub" style="margin:0 0 var(--space-16)">411 · University · 4.826,00 €</p>
      <div style="display:flex;justify-content:space-between;align-items:center">
        ${ghostHTML({ flush: true })}
        ${iconButtonHTML({ kind: 'danger', icon: 'close-filled', label: 'Eliminar factura 411' })}
      </div>
    </section>
    <section class="card" aria-labelledby="bi-2">
      <div class="card__header"><h2 class="card__title" id="bi-2">Cambios sin guardar</h2></div>
      <p class="card__sub" style="margin:0 0 var(--space-24)">Si sales ahora, se perderán los cambios del gasto.</p>
      <div style="display:flex;justify-content:flex-end;align-items:center;gap:var(--space-16)">
        ${ghostHTML({ colour: 'attention', label: 'Descartar', showIcon: false })}
        ${bigHTML({ colour: 'attention', label: 'Guardar', icon: 'save' })}
      </div>
    </section>
  </div>`,
};

export const Mobile = {
  name: 'Mobile',
  tags: ['!dev'],
  parameters: { layout: 'padded', controls: { disable: true } },
  globals: { viewport: { value: 'mobile' } },
  render: () => `<div class="card" style="max-width:358px;display:flex;flex-direction:column;gap:var(--space-16)">
    ${bigHTML({ label: 'Guardar factura', icon: 'save' })}
    ${bigHTML({ colour: 'attention', label: 'Guardar gasto', icon: 'save' })}
    <div style="display:flex;justify-content:space-between;align-items:center">${ghostHTML({ label: 'Ver todas', showIcon: false, flush: true })}${iconButtonHTML({ kind: 'danger', icon: 'trash', label: 'Eliminar gasto' })}</div>
  </div>`,
};

/* ── Floating button (assistant launchers) ── */
/* Artwork of the two launchers (drawn larger than the 16px icon set, so they live here) */
export const FAB_ICONS = {
  assistant: `<svg viewBox="0 0 40 40" aria-hidden="true" focusable="false"><g fill="currentColor"><path d="M21.8193 23.3955C22.2603 23.077 22.8774 23.1704 23.2051 23.6074C23.5362 24.0493 23.4468 24.6766 23.0049 25.0078L23.002 25.0098L22.9902 25.0186C22.9847 25.0226 22.9779 25.0272 22.9707 25.0322C22.956 25.0426 22.9375 25.0552 22.916 25.0693C22.8728 25.0977 22.8157 25.1332 22.7451 25.1729C22.6037 25.2524 22.4066 25.3491 22.1553 25.4434C21.6505 25.6326 20.9317 25.8076 20.0039 25.8076C19.0761 25.8076 18.3573 25.6326 17.8526 25.4434C17.6011 25.3491 17.4041 25.2524 17.2627 25.1729C17.1921 25.1331 17.135 25.0977 17.0918 25.0693C17.0702 25.0552 17.0519 25.0426 17.0371 25.0322C17.0298 25.0271 17.0232 25.0226 17.0176 25.0186L17.0059 25.0098L17.0039 25.0078C16.5621 24.6766 16.4717 24.0493 16.8027 23.6074C17.1303 23.1705 17.7465 23.0783 18.1875 23.3965L18.1904 23.3984L18.2432 23.4297C18.3019 23.4627 18.406 23.5155 18.5547 23.5713C18.8504 23.6821 19.332 23.8076 20.0039 23.8076C20.6757 23.8076 21.1574 23.6821 21.4531 23.5713C21.6016 23.5156 21.7059 23.4627 21.7647 23.4297L21.8164 23.3984L21.8193 23.3955Z"/><path d="M16.4024 18.4053C16.9546 18.4053 17.4024 18.853 17.4024 19.4053V20.6055C17.4022 21.1576 16.9545 21.6055 16.4024 21.6055C15.8503 21.6054 15.4025 21.1575 15.4024 20.6055V19.4053C15.4024 18.853 15.8501 18.4054 16.4024 18.4053Z"/><path d="M23.6055 18.4053C24.1578 18.4053 24.6055 18.853 24.6055 19.4053V20.6055C24.6053 21.1576 24.1577 21.6055 23.6055 21.6055C23.0534 21.6054 22.6057 21.1575 22.6055 20.6055V19.4053C22.6055 18.853 23.0533 18.4054 23.6055 18.4053Z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M20.0039 7C20.7467 7 21.4591 7.29512 21.9844 7.82031C22.5096 8.34556 22.8047 9.05797 22.8047 9.80078C22.8047 10.1686 22.7326 10.5332 22.5918 10.873C22.4511 11.2127 22.2444 11.5213 21.9844 11.7812C21.7244 12.0412 21.4158 12.2479 21.0762 12.3887C21.0526 12.3984 21.0277 12.405 21.0039 12.4141V14.2031H24.207C25.3101 14.2031 26.2388 14.2008 26.9746 14.2998C27.7387 14.4026 28.4429 14.6318 29.0108 15.2002C29.5791 15.7686 29.8083 16.4725 29.9111 17.2373C29.9352 17.4158 29.9523 17.6057 29.9658 17.8066C30.367 17.8082 30.7398 17.8149 31.0557 17.8574C31.4387 17.909 31.8502 18.0231 32.21 18.3135L32.3613 18.4492L32.4971 18.6006C32.7874 18.9603 32.9016 19.3719 32.9531 19.7549C33.0082 20.1639 33.0059 20.6683 33.0059 21.2061V22.4062C33.0059 22.9438 33.0081 23.4475 32.9531 23.8564C32.8942 24.2944 32.7538 24.7706 32.3613 25.1631C31.9691 25.5553 31.4939 25.6959 31.0557 25.7549C30.7398 25.7974 30.3672 25.8031 29.9658 25.8047C29.9523 26.006 29.9352 26.1962 29.9111 26.375C29.8147 27.0919 29.6081 27.7562 29.1143 28.3047L29.0117 28.4121C28.4437 28.9809 27.7382 29.2097 26.9736 29.3125C26.2378 29.4114 25.3094 29.4092 24.2061 29.4092H20.7617C20.5627 29.4092 20.4555 29.4093 20.376 29.4141C20.3094 29.418 20.3058 29.4231 20.3223 29.418L20.3203 29.4189C20.3374 29.4136 20.3328 29.4106 20.2764 29.4453C20.2087 29.487 20.1209 29.5474 19.957 29.6621L18.0176 31.0205C17.3642 31.4778 16.7979 31.8762 16.3233 32.1279C15.8575 32.375 15.2481 32.6121 14.582 32.417L14.5791 32.416C14.3037 32.3344 14.0504 32.2018 13.8262 32.0215C13.2854 31.5879 13.1299 30.954 13.0654 30.4316C13.0282 30.1299 13.0143 29.7768 13.0078 29.3828C12.915 29.3736 12.8254 29.3617 12.7393 29.3447L12.7383 29.3438C12.0784 29.2126 11.4719 28.8888 10.9961 28.4131C10.5203 27.9372 10.1956 27.3309 10.0645 26.6709V26.6689C10.0143 26.4139 10.0063 26.1335 10.0039 25.8037C9.61655 25.8018 9.2566 25.7961 8.95021 25.7549C8.51235 25.696 8.03695 25.5554 7.64454 25.1631C7.25205 24.7706 7.11166 24.2944 7.05275 23.8564C6.99779 23.4475 7.00001 22.9438 7.00001 22.4062V20.6055C7.00001 20.3395 6.99945 20.0901 7.01368 19.8809C7.02855 19.6626 7.06293 19.4162 7.167 19.1641L7.16798 19.1611C7.39182 18.6231 7.81997 18.1954 8.35841 17.9727C8.61054 17.8678 8.8572 17.8334 9.07521 17.8184C9.28503 17.8039 9.53501 17.8047 9.80079 17.8047H10.043C10.0566 17.6045 10.0737 17.4153 10.0977 17.2373C10.2009 16.4724 10.43 15.7673 10.9981 15.1992C11.5663 14.6312 12.2707 14.4027 13.0352 14.2998C13.771 14.2008 14.7 14.2031 15.8037 14.2031H19.0039V12.4141C18.9801 12.405 18.9552 12.3984 18.9317 12.3887C18.592 12.2479 18.2834 12.0412 18.0234 11.7812C17.7635 11.5213 17.5568 11.2127 17.416 10.873C17.2753 10.5333 17.2031 10.1686 17.2031 9.80078C17.2031 9.05801 17.4983 8.34555 18.0234 7.82031C18.5487 7.2951 19.2612 7.00004 20.0039 7ZM15.8037 16.2031C14.6434 16.2031 13.8733 16.2053 13.3018 16.2822C12.7601 16.3552 12.5472 16.4783 12.4121 16.6133C12.2768 16.7487 12.1523 16.9625 12.0791 17.5049C12.0021 18.0761 12 18.8453 12 20.0049V24.7871C12.0001 24.7939 12.001 24.8008 12.001 24.8076C12.001 24.8145 12.0002 24.8213 12 24.8281V25.4072C12 26.01 12.0046 26.1694 12.0264 26.2812L12.0508 26.3818C12.1152 26.6145 12.2387 26.8275 12.4102 26.999C12.6055 27.1943 12.8543 27.3275 13.125 27.3818C13.2369 27.4039 13.3956 27.4092 14.001 27.4092C14.5533 27.4092 15.001 27.8569 15.001 28.4092C15.001 29.2614 15.0028 29.8054 15.0498 30.1865C15.0702 30.3517 15.0961 30.4389 15.1104 30.4795C15.1522 30.4678 15.2388 30.4393 15.3858 30.3613C15.7253 30.1812 16.1729 29.8704 16.8711 29.3818L18.8096 28.0244C19.0344 27.867 19.2907 27.6769 19.5918 27.5566L19.7236 27.5098C19.9899 27.4263 20.264 27.4114 20.5166 27.4092H24.2061C25.3659 27.4092 26.1355 27.4069 26.707 27.3301C27.2498 27.2571 27.4625 27.1334 27.5967 26.999L27.5977 26.998C27.7326 26.8629 27.8558 26.6502 27.9287 26.1084C28.0056 25.5369 28.0078 24.7668 28.0078 23.6064V20.0049C28.0078 18.8447 28.0056 18.0754 27.9287 17.5039C27.8557 16.9614 27.7328 16.7484 27.5977 16.6133C27.4635 16.4789 27.2504 16.3552 26.708 16.2822C26.1365 16.2054 25.3667 16.2031 24.207 16.2031H15.8037ZM9.80079 19.8047C9.50747 19.8047 9.33795 19.8049 9.2129 19.8135C9.11368 19.8203 9.09734 19.8303 9.11525 19.8242C9.0733 19.8437 9.03971 19.8774 9.01954 19.9189C9.01715 19.9322 9.0125 19.9623 9.0088 20.0166C9.00026 20.1422 9.00001 20.3122 9.00001 20.6055V22.4062C9.00001 23.0003 9.0023 23.3452 9.03517 23.5898C9.04547 23.6664 9.0572 23.7139 9.06544 23.7412C9.09259 23.7495 9.13961 23.7621 9.21681 23.7725C9.40032 23.7971 9.6406 23.8025 10 23.8047V19.8047H9.80079ZM30.0078 20.0049V23.6064C30.0078 23.6732 30.0069 23.7393 30.0068 23.8047C30.366 23.8025 30.6058 23.7971 30.7891 23.7725C30.8656 23.7622 30.9123 23.7494 30.9395 23.7412C30.9477 23.7139 30.9604 23.6666 30.9707 23.5898C31.0036 23.3452 31.0059 23.0003 31.0059 22.4062V21.2061C31.0059 20.6117 31.0036 20.2662 30.9707 20.0215C30.9603 19.9443 30.9477 19.8973 30.9395 19.8701C30.9121 19.8619 30.8646 19.8501 30.7881 19.8398C30.6048 19.8152 30.3652 19.8088 30.0068 19.8066C30.0069 19.8721 30.0078 19.9382 30.0078 20.0049ZM20.0039 9C19.7916 9.00004 19.5876 9.08424 19.4375 9.23438C19.2874 9.38454 19.2031 9.58844 19.2031 9.80078C19.2031 9.90592 19.2235 10.0103 19.2637 10.1074C19.3039 10.2045 19.3632 10.2929 19.4375 10.3672C19.5118 10.4415 19.6002 10.5008 19.6973 10.541C19.7944 10.5813 19.8988 10.6016 20.0039 10.6016C20.109 10.6016 20.2134 10.5812 20.3106 10.541C20.4077 10.5008 20.496 10.4415 20.5703 10.3672C20.6447 10.2928 20.7039 10.2045 20.7442 10.1074C20.7844 10.0103 20.8047 9.90594 20.8047 9.80078C20.8047 9.5884 20.7205 9.38455 20.5703 9.23438C20.4202 9.08425 20.2163 9 20.0039 9Z"/></g></svg>`,
  accessibility: `<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false"><circle cx="32" cy="32" r="25" fill="none" stroke="currentColor" stroke-width="2.5"/><circle cx="32" cy="19.5" r="3.6" fill="currentColor"/><path d="M20 25.5c4 1.2 8 1.8 12 1.8s8-.6 12-1.8" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><path d="M32 27.5v9M32 36.5l-5 10M32 36.5l5 10" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
};
const FAB_LABELS = { assistant: 'Asistente inteligente', accessibility: 'Acceso fácil: asistente accesible' };
const FAB_STATES = ['default', 'hover', 'pressed', 'open', 'disabled', 'focus'];
/** Floating button · 40px circle that opens a panel. */
export const fabHTML = ({ style = 'outline', icon: name = 'assistant', state = 'default', label } = {}) => {
  const cls = { hover: ' is-hover', pressed: ' is-active', focus: ' is-focus' }[state] || '';
  return `<button type="button" class="fab fab--${style}${cls}" aria-label="${label || FAB_LABELS[name]}" aria-haspopup="dialog" aria-expanded="${state === 'open'}"${state === 'disabled' ? ' disabled' : ''}>${FAB_ICONS[name]}</button>`;
};

export const Floating = {
  name: 'Floating button',
  render: (args) => fabHTML(args),
  argTypes: {
    style: { name: 'Type', control: { type: 'inline-radio', labels: { outline: 'Outline (white, blue ring)', filled: 'Filled (blue)' } }, options: ['outline', 'filled'], table: { category: 'Variant' } },
    icon: { name: 'Icon choice', control: 'select', options: Object.keys(FAB_ICONS), table: { category: 'Icon swap' } },
    state: { name: 'State', control: 'select', options: FAB_STATES, description: 'Open = its panel is showing', table: { category: 'Variant' } },
    label: { name: 'Label (screen readers only)', control: 'text', description: 'Invisible. Read aloud by screen readers (aria-label): say what it opens. Empty = default for the icon', table: { category: 'Text' } },
  },
  args: { style: 'outline', icon: 'assistant', label: 'Asistente inteligente', state: 'default' },
};

export const FloatingStates = {
  name: 'Floating · States',
  tags: ['!dev'],
  parameters: { layout: 'padded', controls: { disable: true } },
  render: () => `<div class="card" style="display:grid;grid-template-columns:120px repeat(6,minmax(72px,1fr));gap:var(--space-8) var(--space-16);max-width:900px">
    <span></span>${FAB_STATES.map((s) => `<span style="${head};text-align:center">${s}</span>`).join('')}
    <span style="${head};align-self:center">Outline</span>${FAB_STATES.map((s) => `<div style="${cell}">${fabHTML({ state: s })}</div>`).join('')}
    <span style="${head};align-self:center">Filled</span>${FAB_STATES.map((s) => `<div style="${cell}">${fabHTML({ style: 'filled', icon: 'accessibility', state: s })}</div>`).join('')}
  </div>`,
};

export const FloatingInContext = {
  name: 'Floating · In the app',
  tags: ['!dev'],
  parameters: { layout: 'padded', controls: { disable: true } },
  render: () => `<div style="display:flex;gap:var(--space-48);align-items:flex-end">
    <div style="display:flex;flex-direction:column;gap:var(--space-20);padding:var(--space-12)">${fabHTML({})}${fabHTML({ style: 'filled', icon: 'accessibility' })}</div>
    <div class="fab-dock">${fabHTML({})}${fabHTML({ style: 'filled', icon: 'accessibility' })}</div>
  </div>`,
};

/* ── Design tab: the matching component in the Figma library ── */
Big.parameters = { ...Big.parameters, design: figma('25:179') };
Ghost.parameters = { ...Ghost.parameters, design: figma('25:240') };
Icon.parameters = { ...Icon.parameters, design: figma('25:271') };
States.parameters = { ...States.parameters, design: figma('8:169') };
LongLabel.parameters = { ...LongLabel.parameters, design: figma('25:179') };
InContext.parameters = { ...InContext.parameters, design: figma('8:169') };
Mobile.parameters = { ...Mobile.parameters, design: figma('8:169') };
Floating.parameters = { ...Floating.parameters, design: figma('25:332') };
FloatingStates.parameters = { ...FloatingStates.parameters, design: figma('25:332') };
FloatingInContext.parameters = { ...FloatingInContext.parameters, design: figma('25:332') };
