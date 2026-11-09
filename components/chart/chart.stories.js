// Chart stories — HTML + Vite
import { figma } from '../../.storybook/figma.js';
import { lineChart, barChart } from './chart.js';
import { barListHTML } from '../list/list.stories.js';

const ON_CANVAS = { globals: { backgrounds: { value: 'canvas' } } };
// Real data: the demo app, year 2026, on 4 November 2026 (the months up to today)
const MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov'];
const ING = [2976.52, 4166.63, 4166.63, 4731.92, 5357.5, 5357.5, 8203.35, 2580.63, 5843.05, 0, 0];
const GAS = [1234.94, 1514.27, 1799.53, 1065.4, 2465.63, 1132.65, 1072.54, 1072.94, 1251.39, 0, 0];
const SAL_PREV = [0, 1827.42, 3619.47, 4247.02, 4026.62, 3592.72, 2386.66, 2519.76, 3005.29, 1822.92, 4237.16];
const SAL_CUR = [1805.1, 1741.58, 2652.36, 2367.1, 3666.52, 2891.87, 4224.85, 4284.96, 1507.69, 5221.69, 0];

/** A chart inside a card, the way it appears on the dashboard. */
const inCard = (title, draw, cfg, width = '540px') => {
  const card = document.createElement('section');
  card.className = 'card';
  card.style.cssText = `width:${width};max-width:100%`;
  const head = document.createElement('div'); head.className = 'card__header';
  const h2 = document.createElement('h2'); h2.className = 'card__title'; h2.textContent = title;
  head.appendChild(h2); card.appendChild(head);
  const el = document.createElement('div'); card.appendChild(el);
  requestAnimationFrame(() => draw(el, { title, ...cfg }));
  return card;
};

export default {
  title: 'App/Components/Chart',
  tags: ['!autodocs'],   // documented in Chart.mdx
  excludeStories: ['distributionHTML'],
  parameters: { layout: 'padded', controls: { disable: true } },
  ...ON_CANVAS,
};

export const Line = {
  name: 'Chart · Line',
  render: () => inCard('Comparativa Ingresos · Gastos', lineChart, {
    labels: MONTHS,
    series: [{ name: 'Ingresos', color: 'var(--chart-1)', values: ING }, { name: 'Gastos', color: 'var(--chart-2)', values: GAS }],
  }),
};

export const Bars = {
  name: 'Chart · Bars',
  render: () => inCard('Comparativa salario neto', barChart, {
    labels: MONTHS,
    series: [{ name: '2025', color: 'var(--chart-compare)', values: SAL_PREV }, { name: '2026', color: 'var(--chart-1)', values: SAL_CUR }],
  }),
};

/** Horizontal bars: the share of each IRPF category in the year's expenses (base). One colour, the section's (Gastos: orange). */
export const distributionHTML = () => `<section class="card card--attention" style="width:540px;max-width:100%" aria-labelledby="dg-t">
    <div class="card__header"><h2 class="card__title" id="dg-t">Distribución del gasto</h2><span class="card__sub">Anual</span></div>
    ${barListHTML()}
  </section>`;

export const Distribution = {
  name: 'Horizontal bars · Distribución del gasto',
  tags: ['!dev'],   // docs only
  render: () => distributionHTML(),
};

export const Dashboard = {
  name: 'In context · Dashboard row',
  tags: ['!dev'],   // docs only
  render: () => {
    const grid = document.createElement('div');
    grid.className = 'card-grid card-grid--2';
    grid.style.maxWidth = '1108px';
    grid.append(Line.render(), Bars.render());
    const d = document.createElement('div'); d.innerHTML = distributionHTML(); grid.append(d.firstElementChild);
    return grid;
  },
};

export const Mobile = {
  name: 'Overview · Mobile',
  tags: ['!dev'],   // docs only
  globals: { ...ON_CANVAS.globals, viewport: { value: 'mobile' } },
  render: () => inCard('Comparativa Ingresos · Gastos', lineChart, {
    labels: MONTHS,
    series: [{ name: 'Ingresos', color: 'var(--chart-1)', values: ING }, { name: 'Gastos', color: 'var(--chart-2)', values: GAS }],
  }, '100%'),
};

/* ── Design tab: the matching component in the Figma library ── */
Line.parameters = { ...Line.parameters, design: figma('56:31') };
Bars.parameters = { ...Bars.parameters, design: figma('56:88') };
Distribution.parameters = { ...Distribution.parameters, design: figma('56:3283') };
Dashboard.parameters = { ...Dashboard.parameters, design: figma('56:3087') };
Mobile.parameters = { ...Mobile.parameters, design: figma('56:31') };
