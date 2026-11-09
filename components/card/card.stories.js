// Card stories — HTML + Vite
import { figma } from '../../.storybook/figma.js';
import { icon } from '../../icons/icons.js';
import { inFrame, mobileFrame, reportHeight } from '../../foundations/mobile-frame.js';
const INFO = `<button type="button" class="btn btn--icon btn--sm btn--info" aria-label="Más información">${icon('info')}</button>`;
const ON_CANVAS = { globals: { backgrounds: { value: 'canvas' } } };

/** KPI card: label · amount · optional sub. Colours: 'black' | 'primary' (blue) | 'attention' (orange). */
export const kpiCardHTML = ({ label = 'Total facturado', labelColor = 'black', amount = '50.790,36 €', amountColor = 'black',
  showSub = true, sub = 'Base imponible', info = false, interactive = false, state = 'default', width = '' } = {}) => {
  const cls = ['card', 'card--kpi', `card--${amountColor === 'attention' ? 'attention' : 'primary'}`];   // accent = selected outline
  if (interactive) cls.push('card--interactive');
  if (state === 'selected') cls.push('is-selected');
  if (state === 'disabled') cls.push('is-disabled');
  if (interactive && (state === 'hover' || state === 'focus')) cls.push(`is-${state}`);
  const tag = interactive ? 'a' : 'div';
  const attrs = [interactive ? ' href="#"' : '', state === 'selected' ? ' aria-current="true"' : '', state === 'disabled' ? ' aria-disabled="true"' : '', width ? ` style="width:${width}"` : ''].join('');
  const lbl = `<h2 class="card__label${labelColor !== 'black' ? ` card__label--${labelColor}` : ''}">${label}</h2>`;
  const top = info && !interactive ? `<div class="card__header">${lbl}${INFO}</div>` : lbl;
  return `<${tag} class="${cls.join(' ')}"${attrs}>
  ${top}
  <p class="card__amount${amountColor !== 'black' ? ` card__amount--${amountColor}` : ''}">${amount}</p>${showSub ? `
  <p class="card__sub">${sub}</p>` : ''}
</${tag}>`;
};

const COLOR = (name, description) => ({ name, control: { type: 'inline-radio', labels: { black: 'Black', primary: 'Blue', attention: 'Orange' } }, options: ['black', 'primary', 'attention'], description, table: { category: 'Variant' } });

export default {
  title: 'App/Components/Card',
  tags: ['!autodocs'],   // documented in Card.mdx
  excludeStories: ['kpiCardHTML'],
  ...ON_CANVAS,
};

export const KpiCard = {
  name: 'KPI card',
  render: (a) => kpiCardHTML({ ...a, width: '320px' }),
  argTypes: {
    labelColor: COLOR('Label colour', 'Black in the sections · blue (income) or orange (payments) on the dashboard'),
    amountColor: COLOR('Amount colour', 'Black on the dashboard · the section colour in the sections · orange for pending amounts'),
    state: { name: 'State', control: 'select', options: ['default', 'hover', 'focus', 'selected', 'disabled'], description: 'Hover and focus: interactive cards only · selected / disabled: periods (IRPF)', table: { category: 'Variant' } },
    interactive: { name: 'Interactive', control: 'boolean', description: 'The whole card is a link to its page (dashboard): hover shadow', table: { category: 'Boolean' } },
    showSub: { name: 'Subtitle', control: 'boolean', table: { category: 'Boolean' } },
    info: { name: 'Info button', control: 'boolean', description: 'ⓘ next to the label (not on interactive cards: a button can\'t sit inside a link)', if: { arg: 'interactive', truthy: false }, table: { category: 'Boolean' } },
    label: { name: 'Label', control: 'text', table: { category: 'Text' } },
    amount: { name: 'Amount', control: 'text', table: { category: 'Text' } },
    sub: { name: 'Subtitle text', control: 'text', if: { arg: 'showSub' }, table: { category: 'Text' } },
    width: { table: { disable: true } },
  },
  args: { labelColor: 'black', amountColor: 'primary', state: 'default', interactive: false, showSub: true, info: false, label: 'Total facturado', amount: '50.790,36 €', sub: 'Base imponible' },
};

/* Docs only: every state */
export const KpiStates = {
  name: 'KPI card · States',
  tags: ['!dev'],
  parameters: { layout: 'padded', controls: { disable: true } },
  render: () => {
    const head = 'font-family:var(--font-mono);font-size:var(--text-10);text-transform:uppercase;letter-spacing:var(--ls-caps);color:var(--text-muted)';
    const DASH = { label: 'IVA a pagar', labelColor: 'attention', amount: '1.778,23 €', amountColor: 'black' };
    const cells = [
      ['Default', {}],
      ['Hover · interactive', { state: 'hover', interactive: true, ...DASH }], ['Focus · interactive', { state: 'focus', interactive: true, ...DASH }],
      ['Selected', { state: 'selected' }], ['Disabled', { state: 'disabled' }],
    ];
    return `<div style="display:grid;grid-template-columns:repeat(5,minmax(180px,1fr));gap:var(--space-12) var(--space-16);max-width:1108px">
      ${cells.map(([n]) => `<span style="${head}">${n}</span>`).join('')}
      ${cells.map(([, o]) => kpiCardHTML({ label: 'IRPF acumulado (3T)', amount: '3.508,86 €', amountColor: 'primary', showSub: false, ...o })).join('')}
    </div>`;
  },
};

/* ── In the app ── */
const grid4 = (cards) => `<div class="card-grid card-grid--4" style="max-width:1108px">${cards.map(kpiCardHTML).join('')}</div>`;

/** View control: the same composition on desktop or on mobile (390px frame, real mobile CSS). One component, fully responsive. */
const VIEW = {
  argTypes: { view: { name: 'View', control: { type: 'inline-radio', labels: { desktop: 'Desktop', mobile: 'Mobile (390px)' } }, options: ['desktop', 'mobile'] } },
  args: { view: 'desktop' },
};
const responsive = (storyId, draw) => ({ view }) => {
  if (inFrame()) { const el = document.createElement('div'); el.innerHTML = draw(); return reportHeight(el); }
  if (view === 'mobile') return mobileFrame(storyId, { view: 'desktop' });
  return draw();
};

export const Dashboard = {
  name: 'Dashboard',
  tags: ['!dev'],   // docs only: the KPI card in the app
  parameters: { layout: 'padded', controls: { disable: true } },
  render: () => `<div class="card-grid card-grid--2" style="max-width:1108px">
    ${kpiCardHTML({ label: 'Salario neto del mes', labelColor: 'primary', amount: '5.221,69 €', sub: 'En base al beneficio neto del mes anterior', info: true })}
    ${kpiCardHTML({ label: 'IVA a pagar', labelColor: 'attention', amount: '1.778,23 €', sub: '3T · Jul–Sep · vence 20 de octubre', interactive: true })}
    ${kpiCardHTML({ label: 'Previsión de ahorro mensual', labelColor: 'primary', amount: '626,60 €', sub: 'Estimación del 12 % del salario neto mensual' })}
    ${kpiCardHTML({ label: 'IRPF a pagar', labelColor: 'attention', amount: '2.683,99 €', sub: '3T · Jul–Sep · vence 20 de octubre', interactive: true })}
  </div>`,
};

export const Facturacion = {
  name: 'Facturación',
  tags: ['!dev'],   // docs only: the KPI card in the app
  parameters: { layout: 'padded' },
  ...VIEW,
  render: responsive('app-components-card--facturacion', () => grid4([
    { label: 'Total facturado', amount: '50.790,36 €', amountColor: 'primary', sub: 'Base imponible' },
    { label: 'Cobrado', amount: '43.383,73 €', amountColor: 'primary', sub: '11 facturas' },
    { label: 'Pendiente de cobro', amount: '7.406,63 €', amountColor: 'attention', sub: '2 facturas' },
    { label: 'IRPF retenido', amount: '1.443,37 €', amountColor: 'primary', sub: '15% retención' },
  ]),)
};

export const Gastos = {
  name: 'Gastos',
  tags: ['!dev'],   // docs only: the KPI card in the app
  parameters: { layout: 'padded' },
  ...VIEW,
  render: responsive('app-components-card--gastos', () => grid4([
    { label: 'Total gastos', amount: '12.609,29 €', amountColor: 'attention', sub: 'Base imponible' },
    { label: 'IVA soportado', amount: '515,66 €', amountColor: 'attention', sub: 'Total' },
    { label: 'IVA incluido 303', amount: '90,69 €', amountColor: 'attention', sub: 'Checkboxes activos' },
    { label: 'Total gastado', amount: '13.124,95 €', amountColor: 'attention', sub: 'Base + IVA' },
  ]),)
};

export const IrpfPeriods = {
  name: 'IRPF · Periods',
  tags: ['!dev'],   // docs only: the KPI card in the app
  parameters: { layout: 'padded' },
  ...VIEW,
  render: responsive('app-components-card--irpf-periods', () => grid4([
    { label: 'IRPF abonado (1T)', amount: '1.367,23 €', amountColor: 'primary', showSub: false, state: 'disabled' },
    { label: 'IRPF acumulado (2T)', amount: '3.508,86 €', amountColor: 'primary', showSub: false, state: 'disabled' },
    { label: 'IRPF acumulado (3T)', amount: '3.508,86 €', amountColor: 'primary', showSub: false, state: 'selected' },
    { label: 'IRPF acumulado (4T)', amount: '— €', amountColor: 'primary', showSub: false, state: 'disabled' },
  ]),)
};

export const Salario = {
  name: 'Container · Cálculo del salario',
  tags: ['!dev'],   // docs only: the container card (a building block, _Container card in Figma)
  parameters: { layout: 'padded' },
  ...VIEW,
  render: responsive('app-components-card--salario', () => `<section class="card card--primary" style="max-width:1108px" aria-labelledby="sal-t">
    <div class="card__header"><h2 class="card__title card__title--caps" id="sal-t">Cálculo del salario (Dashboard)</h2></div>
    <p class="card__text" id="sal-h">Defina los clientes en base a cuyas facturas se calculará el salario mensual. Sepáralos por el signo + entre medias, si son varios nombres o escriba «Todas» en caso de querer considerar la facturación total mensual.</p>
    <div class="field field--primary field--inline">
      <label class="field__label" for="sal-c">Clientes</label>
      <input class="input" id="sal-c" type="text" value="Main client" placeholder="Main client" autocomplete="off" aria-describedby="sal-h">
    </div>
  </section>`),
};

/* ── Design tab: the matching component in the Figma library ── */
KpiCard.parameters = { ...KpiCard.parameters, design: figma('32:369') };
KpiStates.parameters = { ...KpiStates.parameters, design: figma('32:369') };
Dashboard.parameters = { ...Dashboard.parameters, design: figma('33:33') };
Facturacion.parameters = { ...Facturacion.parameters, design: figma('32:369') };
Gastos.parameters = { ...Gastos.parameters, design: figma('32:369') };
IrpfPeriods.parameters = { ...IrpfPeriods.parameters, design: figma('33:72') };
Salario.parameters = { ...Salario.parameters, design: figma('51:76') };
