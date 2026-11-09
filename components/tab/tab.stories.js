// Tab stories — HTML + Vite
import { figma } from '../../.storybook/figma.js';
import { icon } from '../../icons/icons.js';

/** Single tab markup. role "tab" → <button role="tab" aria-selected>, role "nav" → <a aria-current="page"> */
export const tabHTML = ({ label = 'Ingresos', accent = 'brand', outline = false, width = 'auto',
  active = false, disabled = false, role = 'tab' }) => {
  const cls = ['tab', `tab--${accent}`];
  if (outline) cls.push('tab--outline');
  if (width === 'fixed') cls.push('tab--fixed');
  if (role === 'nav') {
    return `<a class="${cls.join(' ')}" href="#"${active ? ' aria-current="page"' : ''}${disabled ? ' aria-disabled="true"' : ''}>${label}</a>`;
  }
  return `<button type="button" class="${cls.join(' ')}" role="tab" aria-selected="${active}"${disabled ? ' disabled' : ''}>${label}</button>`;
};

/** A working tab list: click (or arrow keys) moves the selection. */
const tabList = ({ labels, selected = 0, accent, outline = false, width = 'auto', fluid = false, ariaLabel, maxWidth }) => {
  const wrap = document.createElement('div');
  wrap.className = 'tab-list' + (fluid ? ' tab-list--fluid' : '');
  wrap.setAttribute('role', 'tablist');
  wrap.setAttribute('aria-label', ariaLabel);
  if (maxWidth) wrap.style.maxWidth = maxWidth;
  wrap.innerHTML = labels.map((l, i) => tabHTML({ label: l, accent, outline, width, active: i === selected })).join('');
  const tabs = [...wrap.querySelectorAll('.tab')];
  const select = (t) => { tabs.forEach((x) => { x.setAttribute('aria-selected', x === t); x.tabIndex = x === t ? 0 : -1; }); t.focus(); };
  tabs.forEach((t, i) => {
    t.tabIndex = i === selected ? 0 : -1;
    t.addEventListener('click', () => select(t));
    t.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') select(tabs[(i + 1) % tabs.length]);
      if (e.key === 'ArrowLeft') select(tabs[(i - 1 + tabs.length) % tabs.length]);
    });
  });
  return wrap;
};

const PERIODS = ['Resumen anual', '1T · Ene–Mar', '2T · Abr–Jun', '3T · Jul–Sep', '4T · Oct–Dic'];
const SECTIONS = [
  ['Dashboard', 'brand', false], ['Facturación', 'primary', false], ['Gastos', 'attention', false],
  ['IVA', 'attention', true], ['IRPF', 'primary', true],
];

export default {
  title: 'App/Components/Tab',
  tags: ['!autodocs'],   // documented in Tab.mdx
  excludeStories: ['tabHTML', 'yearTabHTML', 'YEAR_INFO', 'sectionSelector', 'periodSelector'],
  render: (args) => args.role === 'nav'
    ? `<nav aria-label="Secciones" class="tab-list">${tabHTML(args)}</nav>`
    : `<div class="tab-list" role="tablist" aria-label="Ejemplo">${tabHTML(args)}</div>`,
  argTypes: {
    label: { control: 'text' },
    accent: { name: 'Section', control: { type: 'inline-radio', labels: { brand: 'Dashboard (green)', primary: 'Facturación / IRPF (blue)', attention: 'Gastos / IVA (orange)' } }, options: ['brand', 'primary', 'attention'], description: 'The active tab takes the colour of the section' },
    outline: { control: 'boolean', description: 'Active state as a 2px outline (IVA, IRPF)' },
    width: { control: 'inline-radio', options: ['auto', 'fixed'], description: 'auto = fits the label · fixed = 160px' },
    active: { control: 'boolean' },
    disabled: { control: 'boolean' },
    role: { control: 'inline-radio', options: ['tab', 'nav'], description: 'tab = switches content · nav = goes to a page' },
  },
  args: { label: 'Ingresos', accent: 'brand', outline: false, width: 'auto', active: true, disabled: false, role: 'tab' },
};

/* ── Playground: one tab ── */
const COLOUR = { name: 'Colour', control: { type: 'inline-radio', labels: { brand: 'Green', primary: 'Blue', attention: 'Orange' } }, options: ['brand', 'primary', 'attention'], description: 'The active tab takes the colour of its section' };
const VIEW = { name: 'View', control: { type: 'inline-radio', labels: { desktop: 'Desktop · tab', mobile: 'Mobile · selector (with chevron)' } }, options: ['desktop', 'mobile'] };
const boxed = (el) => { const d = document.createElement('div'); d.style.cssText = 'min-height:240px'; d.append(el); return d; };

const NO_TAB_ARGS = Object.fromEntries(['label', 'accent', 'outline', 'width', 'active', 'disabled', 'role'].map((k) => [k, { table: { disable: true } }]));

export const Playground = {
  name: 'Tab',
  render: (a) => {
    const html = tabHTML({ ...a, active: a.state === 'active', disabled: a.state === 'disabled' })
      .replace('class="tab ', `class="tab${a.state === 'hover' ? ' is-hover' : a.state === 'focus' ? ' is-focus' : ''} `);
    return a.role === 'nav' ? `<nav aria-label="Secciones" class="tab-list">${html}</nav>` : `<div class="tab-list" role="tablist" aria-label="Ejemplo">${html}</div>`;
  },
  argTypes: {
    accent: { ...COLOUR, control: { type: 'inline-radio', labels: { ...COLOUR.control.labels, neutral: 'Grey (periods on mobile)' } }, options: [...COLOUR.options, 'neutral'], table: { category: 'Variant' } },
    outline: { name: 'Style · outline', control: 'boolean', description: 'Active state as a 2px outline (IVA, IRPF)', table: { category: 'Variant' } },
    state: { name: 'State', control: { type: 'inline-radio', labels: { active: 'Active', default: 'Default', hover: 'Hover', disabled: 'Disabled', focus: 'Focus' } }, options: ['active', 'default', 'hover', 'disabled', 'focus'], table: { category: 'Variant' } },
    width: { name: 'Width', control: 'inline-radio', options: ['auto', 'fixed'], description: 'auto = fits the label · fixed = 160px (period tabs, view toggle)', table: { category: 'Variant' } },
    role: { name: 'Role', control: 'inline-radio', options: ['tab', 'nav'], description: 'tab = switches content · nav = goes to a page (sidebar)', table: { category: 'Code' } },
    label: { name: 'Label', control: 'text', table: { category: 'Text' } },
    active: { table: { disable: true } }, disabled: { table: { disable: true } },
  },
  args: { accent: 'primary', outline: false, state: 'active', width: 'auto', role: 'tab', label: 'Facturación' },
};

/* ── Tab · selector: on mobile the tab strip becomes one tab that opens a menu ── */
export const TabSelector = {
  name: 'Tab · selector',
  parameters: { layout: 'padded' },
  render: (a) => {
    const periods = a.accent === 'neutral';
    const el = periods ? periodSelector(0) : menuSelector({ items: [a.label], current: 0, ariaLabel: 'Secciones', name: 'Sección', classes: () => `tab--${a.accent}${a.outline ? ' tab--outline' : ''}` });
    if (!periods) el.querySelector('.tab--menu').classList.add(`tab--${a.accent}`);
    if (a.outline && !periods) el.querySelector('.tab--menu').classList.add('tab--outline');
    if (a.open) requestAnimationFrame(() => el.querySelector('.tab--menu').click());
    return boxed(el);
  },
  argTypes: {
    ...NO_TAB_ARGS,
    accent: { ...COLOUR, control: { type: 'inline-radio', labels: { ...COLOUR.control.labels, neutral: 'Grey (periods)' } }, options: [...COLOUR.options, 'neutral'], table: { category: 'Variant' } },
    outline: { name: 'Style · outline', control: 'boolean', if: { arg: 'accent', neq: 'neutral' }, table: { category: 'Variant' } },
    open: { name: 'Open', control: 'boolean', description: 'The menu below, with every section (or period)', table: { category: 'Variant' } },
    label: { name: 'Label', control: 'text', if: { arg: 'accent', neq: 'neutral' }, table: { category: 'Text' } },
  },
  args: { accent: 'primary', outline: false, open: false, label: 'Facturación' },
};

/* ── Real cases (each one has its controls) ── */
const TYPE = { name: 'Type', control: { type: 'inline-radio', labels: { primary: 'Facturación / IRPF (blue)', attention: 'Gastos / IVA (orange)' } }, options: ['primary', 'attention'] };

export const PeriodTabs = {
  name: 'Period tabs',
  tags: ['!dev'],   // docs only: tabs (fixed width) in a row
  parameters: { layout: 'padded' },
  render: ({ view, type, period }) => (view === 'mobile'
    ? boxed(periodSelector(PERIODS.indexOf(period)))
    : tabList({ labels: PERIODS, selected: PERIODS.indexOf(period), accent: type, width: 'fixed', ariaLabel: 'Período' })),
  argTypes: { ...NO_TAB_ARGS, view: { ...VIEW, control: { type: 'inline-radio', labels: { desktop: 'Desktop · tab strip', mobile: 'Mobile · selector (grey)' } } }, type: { ...TYPE, if: { arg: 'view', eq: 'desktop' } }, period: { name: 'Selected', control: 'select', options: PERIODS } },
  args: { view: 'desktop', type: 'primary', period: PERIODS[1] },
};

const VIEWS = ['Por cat. IRPF', 'Por % IVA'];
export const ViewToggle = {
  name: 'View toggle',
  tags: ['!dev'],   // docs only: two fixed tabs
  render: ({ view }) => tabList({ labels: VIEWS, selected: VIEWS.indexOf(view), accent: 'attention', width: 'fixed', ariaLabel: 'Ordenar gastos' }),
  argTypes: { ...NO_TAB_ARGS, view: { name: 'Selected', control: 'inline-radio', options: VIEWS } },
  args: { view: VIEWS[0] },
};

/* Docs only: the sidebar navigation of each section */
export const SidebarNav = {
  name: 'Sidebar navigation',
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => {
    const nav = document.createElement('nav');
    nav.setAttribute('aria-label', 'Secciones');
    nav.innerHTML = `<div style="display:flex;gap:var(--space-48)">${SECTIONS.map((_, cur) => `
      <div class="tab-list tab-list--vertical">${SECTIONS.map(([l, a, o], i) => tabHTML({ label: l, accent: a, outline: o, role: 'nav', active: i === cur })).join('')}</div>`).join('')}
    </div>`;
    nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', (e) => e.preventDefault()));
    return nav;
  },
};

/* Docs only: every accent in every state */
export const States = {
  name: 'States',
  tags: ['!dev'],
  parameters: { layout: 'padded', controls: { disable: true } },
  render: () => {
    const head = 'font-family:var(--font-mono);font-size:var(--text-10);text-transform:uppercase;letter-spacing:var(--ls-caps);color:var(--text-muted)';
    const cols = ['active', 'default', 'hover', 'disabled', 'focus'];
    const one = (accent, outline, s) => `<div class="tab-list" role="tablist" aria-label="${accent} ${s}">${tabHTML({ label: 'Facturación', accent, outline, active: s === 'active', disabled: s === 'disabled' }).replace('class="tab ', `class="tab${s === 'hover' ? ' is-hover' : s === 'focus' ? ' is-focus' : ''} `)}</div>`;
    const rows = [['Dashboard (green)', 'brand', false], ['Facturación (blue)', 'primary', false], ['Gastos (orange)', 'attention', false], ['IRPF (blue · outline)', 'primary', true], ['IVA (orange · outline)', 'attention', true]];
    return `<div class="card" style="display:grid;grid-template-columns:160px repeat(5,minmax(120px,1fr));gap:var(--space-12) var(--space-16);align-items:center;max-width:960px">
      <span></span>${cols.map((c) => `<span style="${head};text-align:center">${c}</span>`).join('')}
      ${rows.map(([n, a, o]) => `<span style="${head}">${n}</span>${cols.map((c) => `<div style="display:flex;justify-content:center">${one(a, o, c)}</div>`).join('')}`).join('')}
    </div>`;
  },
};

/* Docs only: the view toggle on mobile, sharing the row */
export const Mobile = {
  name: 'View toggle · Mobile',
  tags: ['!dev'],
  parameters: { layout: 'padded', controls: { disable: true } },
  globals: { viewport: { value: 'mobile' } },
  render: () => {
    const box = document.createElement('div');
    box.style.cssText = 'max-width:358px';
    box.append(tabList({ labels: VIEWS, accent: 'attention', fluid: true, ariaLabel: 'Ordenar gastos' }));
    return box;
  },
};

/* ── Year tab: the component (always green) · selected / unselected (+ hover) / disabled ── */
export const yearTabHTML = ({ year = 2026, state = 'unselected', interaction = 'default' } = {}) => {
  const cls = ['year-tab'];
  if (interaction === 'hover' && state === 'unselected') cls.push('is-hover');
  if (interaction === 'focus' && state !== 'disabled') cls.push('is-focus');
  return `<button type="button" class="${cls.join(' ')}" role="tab" aria-selected="${state === 'selected'}"${state === 'disabled' ? ' disabled' : ''}><span class="year-tab__num">${year}</span><span class="year-tab__bar"></span></button>`;
};

export const YearTab = {
  name: 'Year tab',
  parameters: { layout: 'padded' },
  render: (a) => `<div class="year-strip" role="tablist" aria-label="Año" style="width:160px">${yearTabHTML(a)}</div>`,
  argTypes: {
    ...NO_TAB_ARGS,
    state: { name: 'State', control: { type: 'inline-radio', labels: { selected: 'Selected', unselected: 'Unselected', disabled: 'Disabled (future year)' } }, options: ['selected', 'unselected', 'disabled'], table: { category: 'Variant' } },
    interaction: { name: 'Interaction', control: 'select', options: ['default', 'hover', 'focus'], description: 'Hover only changes an unselected tab', if: { arg: 'state', neq: 'disabled' }, table: { category: 'Variant' } },
    year: { name: 'Year', control: 'text', table: { category: 'Text' } },
  },
  args: { state: 'unselected', interaction: 'default', year: '2025' },
};

/* Year strip: the composition of up to 6 year tabs (newest on the left) */
const yearStrip = (years) => {
  const strip = document.createElement('div');
  strip.className = 'year-strip';
  strip.setAttribute('role', 'tablist');
  strip.setAttribute('aria-label', 'Año');
  strip.style.width = '880px';
  strip.style.maxWidth = '100%';
  strip.innerHTML = years.map(([year, state]) => yearTabHTML({ year, state })).join('');
  const tabs = [...strip.querySelectorAll('.year-tab:not(:disabled)')];
  tabs.forEach((t) => t.addEventListener('click', () => tabs.forEach((x) => x.setAttribute('aria-selected', x === t))));
  return strip;
};
// The current year comes from the device's clock. 6 years, newest on the left; future years are disabled.
// The strip starts at the first year (2025) and moves forward once the current year passes the 6th.
const NOW = new Date().getFullYear();
const FIRST_YEAR = 2025;
const START = Math.max(FIRST_YEAR, NOW - 5);
const YEARS = [5, 4, 3, 2, 1, 0].map((i) => START + i);
const ACTIVE = YEARS.filter((y) => y <= NOW);
export const YEAR_INFO = { now: NOW, years: YEARS, active: ACTIVE };

export const YearStrip = {
  name: 'Year strip',
  parameters: { layout: 'padded' },
  render: ({ selected = NOW } = {}) => {
    const sel = ACTIVE.includes(Number(selected)) ? Number(selected) : NOW;   // always exactly one selected
    return yearStrip(YEARS.map((y) => [y, y > NOW ? 'disabled' : y === sel ? 'selected' : 'unselected']));
  },
  argTypes: {
    ...NO_TAB_ARGS,
    selected: { name: 'Selected year', control: 'select', options: ACTIVE, description: `Only the active years: ${ACTIVE.join(', ')}. The current year (${NOW}) comes from the device's clock; later years are disabled.` },
  },
  args: { selected: NOW },
};

/* Docs only: the year tab in every state */
export const YearStates = {
  name: 'Year tab · States',
  tags: ['!dev'],
  parameters: { layout: 'padded', controls: { disable: true } },
  render: () => {
    const head = 'font-family:var(--font-mono);font-size:var(--text-10);text-transform:uppercase;letter-spacing:var(--ls-caps);color:var(--text-muted)';
    const cells = [['Selected', 'selected', 'default'], ['Unselected', 'unselected', 'default'], ['Unselected · hover', 'unselected', 'hover'], ['Disabled', 'disabled', 'default'], ['Focus', 'unselected', 'focus']];
    return `<div class="card" style="display:grid;grid-template-columns:repeat(5,minmax(120px,1fr));gap:var(--space-12) var(--space-24);align-items:end;max-width:900px">
      ${cells.map(([n]) => `<span style="${head}">${n}</span>`).join('')}
      ${cells.map(([n, st, i], k) => `<div class="year-strip" role="tablist" aria-label="${n}">${yearTabHTML({ year: 2026 - k, state: st, interaction: i })}</div>`).join('')}
    </div>`;
  },
};

/* ── Selectors: a tab that opens a menu (mobile) ── */
const CHEVRON = icon('chevron-down');
const menuSelector = ({ items, current, ariaLabel, name, classes }) => {
  const wrap = document.createElement('div');
  wrap.className = 'tab-menu';
  const id = 'sel-' + Math.random().toString(36).slice(2, 7);
  wrap.innerHTML = `<button type="button" class="tab tab--menu is-active" aria-expanded="false" aria-controls="${id}"></button>
    <nav class="tab-menu__list" id="${id}" aria-label="${ariaLabel}" hidden>
      ${items.map((it, i) => `<a href="#" class="tab ${classes(i)}" data-i="${i}">${it}</a>`).join('')}
    </nav>`;
  const btn = wrap.querySelector('button'); const list = wrap.querySelector('nav'); const links = [...list.querySelectorAll('a')];
  const set = (i) => {
    btn.className = `tab tab--menu ${classes(i)} is-active`;
    btn.innerHTML = `${items[i]} ${CHEVRON}`;
    btn.setAttribute('aria-label', `${name}: ${items[i]}. Cambiar ${name.toLowerCase()}`);
    links.forEach((x, j) => (j === i ? x.setAttribute('aria-current', 'page') : x.removeAttribute('aria-current')));
  };
  const open = (o, focusBtn) => {
    list.hidden = !o; btn.setAttribute('aria-expanded', o);
    if (o) (list.querySelector('[aria-current]') || links[0]).focus(); else if (focusBtn) btn.focus();
  };
  btn.addEventListener('click', () => open(list.hidden));
  links.forEach((it, i) => it.addEventListener('click', (e) => { e.preventDefault(); set(i); open(false, true); }));
  wrap.addEventListener('keydown', (e) => {
    if (list.hidden) return;
    if (e.key === 'Escape') open(false, true);
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      let i = links.indexOf(document.activeElement); i = e.key === 'ArrowDown' ? (i + 1) % links.length : (i - 1 + links.length) % links.length;
      links[i].focus(); e.preventDefault();
    }
  });
  document.addEventListener('click', (e) => { if (!wrap.contains(e.target) && !list.hidden) open(false); });
  set(current);
  return wrap;
};
/** Section selector: the current section in its colour; the menu lists every section. */
export const sectionSelector = (current = 1) => menuSelector({ items: SECTIONS.map(([l]) => l), current, ariaLabel: 'Secciones', name: 'Sección',
  classes: (i) => `tab--${SECTIONS[i][1]}${SECTIONS[i][2] ? ' tab--outline' : ''}` });
/** Period selector: neutral grey; the menu lists the periods. */
export const periodSelector = (current = 0) => menuSelector({ items: PERIODS, current, ariaLabel: 'Período', name: 'Período', classes: () => 'tab--neutral' });

export const Selector = {
  name: 'Section selector (mobile)',
  tags: ['!dev'],   // docs only: the mobile view is in Page tabs
  parameters: { layout: 'padded' },
  render: ({ section }) => boxed(sectionSelector(SECTIONS.findIndex(([l]) => l === section))),
  argTypes: { ...NO_TAB_ARGS, section: { name: 'Current section', control: 'select', options: SECTIONS.map(([l]) => l) } },
  args: { section: 'Facturación' },
};

export const PeriodSelector = {
  name: 'Period selector (mobile)',
  tags: ['!dev'],   // docs only: the mobile view is in Period tabs
  parameters: { layout: 'padded' },
  render: ({ period }) => boxed(periodSelector(PERIODS.indexOf(period))),
  argTypes: { ...NO_TAB_ARGS, period: { name: 'Current period', control: 'select', options: PERIODS } },
  args: { period: PERIODS[0] },
};

/* ── Design tab: the matching component in the Figma library ── */
Playground.parameters = { ...Playground.parameters, design: figma('23:109') };
TabSelector.parameters = { ...TabSelector.parameters, design: figma('20:135') };
PeriodTabs.parameters = { ...PeriodTabs.parameters, design: figma('23:109') };
ViewToggle.parameters = { ...ViewToggle.parameters, design: figma('20:135') };
SidebarNav.parameters = { ...SidebarNav.parameters, design: figma('23:109') };
States.parameters = { ...States.parameters, design: figma('23:109') };
Mobile.parameters = { ...Mobile.parameters, design: figma('20:135') };
YearTab.parameters = { ...YearTab.parameters, design: figma('24:56') };
YearStrip.parameters = { ...YearStrip.parameters, design: figma('24:57') };
YearStates.parameters = { ...YearStates.parameters, design: figma('24:56') };
Selector.parameters = { ...Selector.parameters, design: figma('20:135') };
PeriodSelector.parameters = { ...PeriodSelector.parameters, design: figma('20:135') };
