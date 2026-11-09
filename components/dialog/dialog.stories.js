// Dialog stories — HTML + Vite (native <dialog>)
// Every dialog here is a real one from the app: Demo (online) and Local (the version you edit and save on your computer).
import { figma } from '../../.storybook/figma.js';
import { icon } from '../../icons/icons.js';
import { switchHTML } from '../selectors/selectors.stories.js';
import { inFrame, frameArgs, mobileFrame, frameRoot } from '../../foundations/mobile-frame.js';
import { entryForm, wireEntryForm, CAT_OPTS, IVA } from '../input/entry-form.js';
import { factMobile, gastoMobile } from '../table/table.stories.js';
import { INVOICES, EXPENSES, CATEGORIES, fmt } from '../table/table-data.js';
const ARROW = icon('arrow-right', { size: 'md' });
const DOWNLOAD = icon('download', { size: 'md' });
const SAVE = icon('save', { size: 'md' });
let n = 0;

const MAIL = '<a href="mailto:marieobelleiro@gmail.com">marieobelleiro@gmail.com</a>';
const TEXT = {
  demo: {
    es: { title: 'Bienvenidos a Contabilidad Demo', body: ['Esta app ha sido concebida para organizar la contabilidad de trabajadores autónomos en España.', 'Te invito a usar este ejemplo online: añadiendo gastos o facturas, podrás entender cómo funciona.', 'Los botones de Asistente Inteligente y Accesibilidad son ejemplos para poder ver cuán lejos se puede llevar la producción de un diseño gracias a la colaboración de IA.', `Si quisieras usarla para tu propia contabilidad, escríbeme a ${MAIL}`], cta: 'Continuar' },
    en: { title: 'Welcome to the Contabilidad Demo', body: ['This demo was designed to organise the accounting of freelancers (autónomos) in Spain.', 'Feel free to use this online example: by adding expenses or invoices, you will see how it works.', 'The Smart Assistant and Accessibility buttons are examples of how far the production of a design can be taken thanks to collaboration with AI.', `If you would like to use it for your own accounting, write to me at ${MAIL}`], cta: 'Continue' },
  },
  local: {
    es: { title: 'Contabilidad LOCAL', body: ['Esta es una pequeña aplicación diseñada para ayudar a los autónomos de España a organizar su contabilidad con la normativa vigente en ese momento*.', 'Por ahora, es una aplicación local que puedes editar mediante un archivo HTML independiente en tu dispositivo. Para iniciar el proceso de registro de datos, primero debes descargar el archivo HTML (botón pequeño en la parte superior de la página). A continuación, haz clic en el botón \'Autorizar edición\' (arriba a la derecha) y sigue las instrucciones.', '*<strong>Importante:</strong> Esta app es una demo para el portfolio de Marie Obelleiro (no es un producto profesional ni certificado). <u>Si decides usarla para tu contabilidad es bajo tu entera responsabilidad.</u>'], cta: 'Continuar' },
    en: { title: 'Contabilidad LOCAL', body: ['This is a small app designed to help Freelancers based in Spain organise their accounting according to the rules in force at the time*.', 'For now, it is a local app that you can edit using a separate HTML file on your device. To start the data recording process, you must first download the HTML file (small button at the top of the page). Then, click the \'Autorizar edición\' button (top right) and follow the instructions.', '*<strong>Important:</strong> This app is a demo for Marie Obelleiro\'s portfolio (it is not a professional or certified product). <u>If you decide to use it for your own accounting, it is entirely at your own responsibility.</u>'], cta: 'Continue' },
  },
};
const ALERTS = {
  formato: 'Revise la fecha de la factura anotada: «31-09-2026» no tiene el formato DD/MM/AAAA.',
  existe: 'Revise la fecha de la factura anotada: el 31/09/2026 no existe.',
  trimestre: 'Revise que el trimestre seleccionado es el correcto ya que la fecha de la factura anotada no coincide.',
};

/* ── The real dialogs ── */
const welcome = ({ version = 'demo', lang = 'es', languageSwitch = true } = {}) => {
  const t = TEXT[version][lang];
  return {
    top: languageSwitch ? switchHTML({ checked: lang === 'en', label: 'English' }) : '',
    title: t.title, body: t.body.map((p) => `<p>${p}</p>`).join(''),
    actions: `<button type="button" class="btn btn--primary" data-close><span class="btn__label">${t.cta}</span>${ARROW}</button>`,
    version, lang,
  };
};
const alert = (msg = 'trimestre') => ({
  size: 'sm', role: 'alertdialog', title: 'Atención!', body: `<p>${ALERTS[msg]}</p>`,
  actions: '<button type="button" class="btn btn--attention" data-close><span class="btn__label">Entendido</span></button>',
});
const AUTH = {
  title: 'Instrucciones para la app local',
  body: '<p>Seleccione en su ordenador el archivo .html de la app previamente descargado (botón "Guardar copia .html") a fin de comenzar la edición.</p><p>Recomendamos hacer una copia de los datos en formato .json para volver a importarlos en caso de necesitarlo, o como control de versiones.</p>',
  actions: `<button type="button" class="btn btn--ghost btn--primary" data-close><span class="btn__label">Cancelar</span></button><button type="button" class="btn btn--primary" data-close><span class="btn__label">Continuar</span>${ARROW}</button>`,
  split: true,
};
const choice = (value, title, desc, checked) => `<label class="choice"><input type="radio" name="guardar-version-${n}" value="${value}"${checked ? ' checked' : ''}><span class="choice__text"><b class="choice__title">${title}</b><span class="choice__desc">${desc}</span></span></label>`;
const saveCopy = () => ({
  title: 'Guardar copia .html',
  body: `<p>Elige qué versión quieres descargar.</p>
    <fieldset class="choice-group"><legend class="sr-only">Versión</legend>
      ${choice('actual', 'Versión actual (con datos)', 'Guarda la contabilidad registrada actual.', true)}
      ${choice('vacia', 'Versión vacía (sin datos)', 'Para empezar desde cero.', false)}
    </fieldset>`,
  actions: `<button type="button" class="btn btn--ghost btn--primary" data-close><span class="btn__label">Cancelar</span></button><button type="button" class="btn btn--primary" data-close><span class="btn__label">Descargar</span>${DOWNLOAD}</button>`,
  split: true,
});

/** Dialog markup. static = shown inline (docs); otherwise a real <dialog>. */
export const dialogHTML = ({ size = 'md', role, top = '', title, info = false, headerAction = '', body, actions = '', form = false, list = false, split = false, lang }, isStatic = false) => {
  const id = `dlg-${++n}`;
  const cls = ['dialog', `dialog--${size}`];
  if (form) cls.push('dialog--form');
  if (list) cls.push('dialog--list');
  const heading = `<h2 class="dialog__title" id="${id}">${title}</h2>`;
  const infoBtn = `<button type="button" class="btn btn--icon btn--sm btn--info" aria-label="Información">${icon('info')}</button>`;
  if (isStatic) cls.push('dialog--static');
  const tag = isStatic ? 'div' : 'dialog';
  const r = role || (isStatic ? 'dialog' : '');
  return `<${tag} class="${cls.join(' ')}" aria-labelledby="${id}"${r ? ` role="${r}"` : ''}${lang ? ` lang="${lang}"` : ''}>
    ${top ? `<div class="dialog__top">${top}</div>` : ''}
    <div class="dialog__header">${info ? `<div class="dialog__heading">${heading}${infoBtn}</div>` : heading}${headerAction}</div>
    <div class="dialog__body">${body}</div>
    ${actions ? `<div class="dialog__actions${split ? ' dialog__actions--split' : ''}">${actions}</div>` : ''}
  </${tag}>`;
};

/** Make the language switch of a welcome dialog change its text. */
const wireWelcome = (root, cfg) => {
  root.querySelectorAll('.switch').forEach((sw) => {
    const btn = sw.querySelector('.switch__control');
    const set = (en) => {
      btn.setAttribute('aria-checked', en);
      const t = TEXT[cfg.version][en ? 'en' : 'es'];
      const dlg = sw.closest('.dialog');
      dlg.setAttribute('lang', en ? 'en' : 'es');
      dlg.querySelector('.dialog__title').textContent = t.title;
      dlg.querySelector('.dialog__body').innerHTML = t.body.map((p) => `<p>${p}</p>`).join('');
      dlg.querySelector('.dialog__actions .btn__label').textContent = t.cta;
    };
    btn.addEventListener('click', () => set(btn.getAttribute('aria-checked') !== 'true'));
    sw.querySelector('.switch__off')?.addEventListener('click', () => set(false));
    sw.querySelector('.switch__on')?.addEventListener('click', () => set(true));
  });
  return root;
};
const staticBox = (cfg, width = '640px') => {
  const el = document.createElement('div');
  el.style.cssText = `max-width:${width}`;
  el.innerHTML = dialogHTML(cfg, true);
  return cfg.version ? wireWelcome(el, cfg) : el;
};

/** A trigger button that opens a real modal dialog. */
const launcher = (label, cfg, variant = 'primary') => {
  const el = document.createElement('div');
  el.innerHTML = `<button type="button" class="btn btn--${variant}"><span class="btn__label">${label}</span></button>${dialogHTML(cfg)}`;
  const dlg = el.querySelector('dialog');
  el.querySelector('button').addEventListener('click', () => dlg.showModal());
  dlg.querySelectorAll('[data-close]').forEach((b) => b.addEventListener('click', () => dlg.close()));
  if (cfg.version) wireWelcome(el, cfg);
  return el;
};

export default {
  title: 'App/Components/Dialog',
  tags: ['!autodocs'],   // documented in Dialog.mdx
  excludeStories: ['dialogHTML'],
  parameters: { layout: 'padded', controls: { disable: true } },
  globals: { backgrounds: { value: 'canvas' } },
};

/* ══ Playground: the generic dialogs (placeholder text) ══ */
const BUTTONS = {
  continuar: ['Continuar', ARROW], entendido: ['Entendido', ''], descargar: ['Descargar', DOWNLOAD], guardar: ['Guardar', SAVE], confirmar: ['Confirmar', ''],
};
const TYPE = {
  info: { variant: 'primary', size: 'md', role: 'dialog' },
  attention: { variant: 'attention', size: 'sm', role: 'alertdialog' },
  error: { variant: 'danger', size: 'sm', role: 'alertdialog' },
  choice: { variant: 'primary', size: 'md', role: 'dialog' },
  list: { variant: 'primary', size: 'md', role: 'dialog' },
};
const genericDialog = (a) => {
  if (a.type === 'list') return { ...listDialog('facturas'), title: a.title, info: a.info };
  const t = TYPE[a.type];
  const key = { info: a.infoButton, attention: a.attentionButton, error: a.errorButton, choice: a.choiceButton }[a.type];
  const [label, ico] = BUTTONS[key];
  const cancelVariant = a.type === 'attention' ? 'attention' : 'primary';
  const main = `<button type="button" class="btn btn--${t.variant}" data-close><span class="btn__label">${label}</span>${ico}</button>`;
  const cancel = a.cancel ? `<button type="button" class="btn btn--ghost btn--${cancelVariant}" data-close><span class="btn__label">Cancelar</span></button>` : '';
  const options = a.type === 'choice' ? `<fieldset class="choice-group"><legend class="sr-only">${a.title}</legend>
      ${choice('1', a.option1, a.option1Desc, true)}${choice('2', a.option2, a.option2Desc, false)}</fieldset>` : '';
  return {
    size: t.size, role: t.role,
    top: a.languageSwitch ? switchHTML({ checked: false, label: 'English' }) : '',
    title: a.title, body: `<p>${a.message}</p>${options}`,
    actions: `${cancel}${main}`, split: a.cancel,
  };
};
const wireSwitch = (root) => {
  root.querySelectorAll('.switch').forEach((sw) => {
    const b = sw.querySelector('.switch__control');
    const set = (on) => b.setAttribute('aria-checked', on);
    b.addEventListener('click', () => set(b.getAttribute('aria-checked') !== 'true'));
    sw.querySelector('.switch__off')?.addEventListener('click', () => set(false));
    sw.querySelector('.switch__on')?.addEventListener('click', () => set(true));
  });
  return root;
};
const byType = (type, t) => ({ ...t, if: { arg: 'type', eq: type } });
export const Playground = {
  name: 'Dialog',
  parameters: { controls: { disable: false } },
  argTypes: {
    view: { name: 'View', control: { type: 'inline-radio', labels: { desktop: 'Desktop', mobile: 'Mobile (390px)' } }, options: ['desktop', 'mobile'] },
    type: { name: 'Type', control: { type: 'inline-radio', labels: { info: 'Informative (blue)', attention: 'Attention (orange)', error: 'Error (red)', choice: 'Multi-option', list: 'List (cards)' } }, options: ['info', 'attention', 'error', 'choice', 'list'] },
    languageSwitch: { name: 'Language toggle', control: 'boolean', description: 'Esp / Eng switch above the title', if: { arg: 'type', neq: 'list' } },
    info: byType('list', { name: 'Info button', control: 'boolean', description: 'ⓘ right after the title' }),
    title: { name: 'Title', control: 'text' },
    message: { name: 'Message', control: 'text', if: { arg: 'type', neq: 'list' } },
    option1: byType('choice', { name: 'Option 1 · title', control: 'text' }),
    option1Desc: byType('choice', { name: 'Option 1 · text', control: 'text' }),
    option2: byType('choice', { name: 'Option 2 · title', control: 'text' }),
    option2Desc: byType('choice', { name: 'Option 2 · text', control: 'text' }),
    infoButton: byType('info', { name: 'Button', control: { type: 'inline-radio', labels: { continuar: 'Continuar →', entendido: 'Entendido', descargar: 'Descargar ↓', guardar: 'Guardar' } }, options: ['continuar', 'entendido', 'descargar', 'guardar'] }),
    attentionButton: byType('attention', { name: 'Button', control: { type: 'inline-radio', labels: { entendido: 'Entendido', guardar: 'Guardar' } }, options: ['entendido', 'guardar'] }),
    errorButton: byType('error', { name: 'Button', control: { type: 'inline-radio', labels: { confirmar: 'Confirmar', entendido: 'Entendido' } }, options: ['confirmar', 'entendido'] }),
    choiceButton: byType('choice', { name: 'Button', control: { type: 'inline-radio', labels: { descargar: 'Descargar ↓', guardar: 'Guardar', continuar: 'Continuar →' } }, options: ['descargar', 'guardar', 'continuar'] }),
    cancel: { name: 'Cancelar', control: 'boolean', description: 'Ghost button on the left', if: { arg: 'type', neq: 'list' } },
  },
  args: {
    view: 'desktop', type: 'info', languageSwitch: false, info: true, title: 'Title', message: 'Message text.',
    option1: 'Option 1', option1Desc: 'Option text.', option2: 'Option 2', option2Desc: 'Option text.',
    infoButton: 'continuar', attentionButton: 'entendido', errorButton: 'confirmar', choiceButton: 'descargar', cancel: false,
  },
  render: (a) => {
    if (inFrame()) {
      a = { ...a, ...frameArgs() };
      const el = document.createElement('div');
      el.innerHTML = dialogHTML(genericDialog(a));
      el.querySelector('dialog').setAttribute('open', '');
      return frameRoot(wireSwitch(el), 'Dialog');
    }
    if (a.view === 'mobile') return mobileFrame('app-components-dialog--playground', a, { height: 760, bg: 'canvas' });
    const cfg = genericDialog(a);
    return wireSwitch(staticBox(cfg, cfg.size === 'sm' ? '400px' : '640px'));
  },
};

/* ══ The real dialogs of the app, each opened by its button ══ */
export const AppDialogs = {
  name: 'App dialogs',
  tags: ['!dev'],
  render: () => {
    const box = document.createElement('div');
    box.style.cssText = 'display:flex;gap:var(--space-16);flex-wrap:wrap';
    box.append(
      launcher('Bienvenida · Demo', welcome()),
      launcher('Bienvenida · Local', welcome({ version: 'local' })),
      launcher('Atención!', alert(), 'attention'),
      launcher('Instrucciones (Local)', AUTH),
      launcher('Guardar copia .html (Local)', saveCopy()),
    );
    return box;
  },
};

/* ══ Illustrations (shown in the docs only) ══ */
export const Welcome = {
  name: 'Welcome',
  tags: ['!dev'],
  parameters: { controls: { disable: false } },
  render: ({ version = 'demo', languageSwitch = true } = {}) => staticBox(welcome({ version, languageSwitch })),
  argTypes: {
    version: { name: 'App', control: { type: 'inline-radio', labels: { demo: 'Demo (online)', local: 'Local (saved on your computer)' } }, options: ['demo', 'local'] },
    languageSwitch: { name: 'Language switch', control: 'boolean', description: 'Esp / Eng switch above the title: it changes the text of the dialog' },
  },
  args: { version: 'demo', languageSwitch: true },
};

export const Alert = {
  name: 'Alert · Atención!',
  tags: ['!dev'],
  parameters: { controls: { disable: false } },
  render: ({ message = 'trimestre' } = {}) => staticBox(alert(message), '400px'),
  argTypes: { message: { name: 'Message', control: { type: 'select', labels: { formato: 'Wrong date format', existe: 'Date doesn\'t exist', trimestre: 'Date outside the quarter' } }, options: ['formato', 'existe', 'trimestre'] } },
  args: { message: 'trimestre' },
};

export const Auth = {
  name: 'Local · Instrucciones',
  tags: ['!dev'],
  render: () => staticBox(AUTH),
};

export const SaveCopy = {
  name: 'Local · Guardar copia .html',
  tags: ['!dev'],
  render: () => staticBox(saveCopy()),
};

/* ══ Mobile forms: Nueva factura / Nuevo gasto, the full-screen dialog (docs only) ══ */
export const MobileForms = {
  name: 'Mobile forms',
  tags: ['!dev'],
  parameters: { layout: 'fullscreen', controls: { disable: false } },
  argTypes: {
    form: { name: 'Form', control: { type: 'select', labels: { 'factura-esp': 'Facturación · Nacional', 'factura-ext': 'Facturación · Exenta de impuestos', 'gasto-cat': 'Gastos · from a category (Por cat. IRPF)', 'gasto-iva': 'Gastos · from an IVA rate (Por % IVA)' } }, options: ['factura-esp', 'factura-ext', 'gasto-cat', 'gasto-iva'] },
    cat: { name: 'Category it opens from', control: { type: 'select', labels: Object.fromEntries(CAT_OPTS.map((c, i) => [String(i), c])) }, options: CAT_OPTS.map((c, i) => String(i)), if: { arg: 'form', eq: 'gasto-cat' } },
    rate: { name: 'IVA rate it opens from', control: { type: 'inline-radio', labels: Object.fromEntries(IVA.map((r) => [r.split(' ')[0], r])) }, options: IVA.map((r) => r.split(' ')[0]), if: { arg: 'form', eq: 'gasto-iva' } },
  },
  args: { form: 'factura-esp', cat: '2', rate: '21' },
  render: (a) => {
    if (!inFrame()) return mobileFrame('app-components-dialog--mobile-forms', a, { height: 844, bg: 'white' });
    a = { ...a, ...frameArgs() };
    const el = document.createElement('div');
    el.innerHTML = dialogHTML(entryForm({ form: a.form, cat: Number(a.cat), rate: `${a.rate} %` }));
    el.querySelector('dialog').setAttribute('open', '');
    return wireEntryForm(el);
  },
};

/* ══ Mobile lists: Ver todas las facturas / todos los gastos (List type, docs only) ══ */
const GVIEW = (v) => `<div class="tab-list tab-list--fluid" role="group" aria-label="Ordenar gastos"><button type="button" class="tab tab--attention${v === 'cat' ? ' is-active' : ''}" aria-pressed="${v === 'cat'}">Por cat. IRPF</button><button type="button" class="tab tab--attention${v === 'iva' ? ' is-active' : ''}" aria-pressed="${v === 'iva'}">Por % IVA</button></div>`;
/* The 3T 2026 of the demo, as in the app: every card, then the grand totals (and the legend of the status dots) */
const Q = 3;
const factNeto = INVOICES.filter((f) => f.trim === Q).reduce((a, f) => a + f.base * (1 + f.iva / 100 - (f.ret ? 0.15 : 0)), 0);
const gq = EXPENSES.filter((g) => g.trim === Q);
const gBase = gq.reduce((a, g) => a + g.base, 0), gIva = gq.reduce((a, g) => a + g.base * g.iva / 100, 0);
const LEGEND = '<p style="display:flex;gap:var(--space-24);margin:0;padding-inline:var(--space-4)"><span class="status-label"><span class="status status--paid" aria-hidden="true"></span>Cobrada</span><span class="status-label"><span class="status status--pending" aria-hidden="true"></span>Pendiente</span></p>';
const listDialog = (which) => (which === 'gastos'
  ? { list: true, info: true, title: 'Gastos 3T 2026', headerAction: '<button type="button" class="btn btn--ghost btn--attention"><span class="btn__label">Cerrar</span></button>',
    body: GVIEW('cat') + CATEGORIES.filter((c) => gq.some((g) => g.cat === c.id)).map((c) => gastoMobile({ list: 'cat', cat: c.id, state: 'editable' })).join('')
      + `<p class="table-totals table-totals--attention table-totals--stack"><span>Total gastado: ${fmt(gBase + gIva)}</span><span>Base: ${fmt(gBase)}</span><span>IVA: ${fmt(gIva)}</span></p>
      <div style="display:flex;justify-content:flex-end"><button type="button" class="btn btn--ghost btn--attention">${icon('plus')}<span class="btn__label">Añadir gasto</span></button></div>` }
  : { list: true, info: true, title: 'Facturación 3T 2026', headerAction: '<button type="button" class="btn btn--ghost btn--primary"><span class="btn__label">Cerrar</span></button>',
    body: factMobile({ table: 'esp', state: 'editable' }) + factMobile({ table: 'ext', state: 'editable' })
      + `<p class="table-totals table-totals--primary table-totals--stack"><span>Total (neto): ${fmt(factNeto)}</span></p>${LEGEND}` });
export const MobileLists = {
  name: 'Mobile lists',
  tags: ['!dev'],
  parameters: { layout: 'fullscreen', controls: { disable: false } },
  argTypes: { which: { name: 'List', control: { type: 'inline-radio', labels: { facturas: 'Ver todas las facturas', gastos: 'Ver todos los gastos' } }, options: ['facturas', 'gastos'] } },
  args: { which: 'facturas' },
  render: (a) => {
    if (!inFrame()) return mobileFrame('app-components-dialog--mobile-lists', a, { height: 844, bg: 'canvas' });
    a = { ...a, ...frameArgs() };
    const el = document.createElement('div');
    el.innerHTML = dialogHTML(listDialog(a.which));
    el.querySelector('dialog').setAttribute('open', '');
    return el;
  },
};

/* ── Design tab: the matching component in the Figma library ── */
Playground.parameters = { ...Playground.parameters, design: figma('65:142') };
MobileForms.parameters = { ...MobileForms.parameters, design: figma('66:281') };
MobileLists.parameters = { ...MobileLists.parameters, design: figma('175:3848') };
AppDialogs.parameters = { ...AppDialogs.parameters, design: figma('66:24') };
Welcome.parameters = { ...Welcome.parameters, design: figma('66:34') };
Alert.parameters = { ...Alert.parameters, design: figma('66:89') };
Auth.parameters = { ...Auth.parameters, design: figma('66:141') };
SaveCopy.parameters = { ...SaveCopy.parameters, design: figma('66:191') };
