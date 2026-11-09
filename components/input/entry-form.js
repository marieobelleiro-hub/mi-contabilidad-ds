// The mobile forms of the app (full-screen dialog), with their real fields, labels, rules and variants:
//   Facturación · Nueva factura nacional · Nueva factura exenta de impuestos   (blue)
//   Gastos      · Nuevo gasto, opened from a category (Por cat. IRPF) or from an IVA rate (Por % IVA)   (orange)
// entryForm() returns a dialog config for dialogHTML(); wireEntryForm() adds the rules of Nuevo gasto.
import { icon } from '../../icons/icons.js';

export const CATS = ['Seguridad Social / RETA', 'Arrendamientos y cánones', 'Suministros (luz, agua, telefonía, internet)', 'Otros suministros',
  'Otros servicios exteriores', 'Transporte y viajes', 'Gastos de manutención', 'Otros consumos de explotación', 'Otros gastos deducibles', 'Otros desgravables'];
export const CAT_OPTS = CATS.map((c, i) => `${i + 1}. ${c}`);
export const IVA = ['21 %', '10 %', '5 %', '4 %', '0 %'];
let n = 0;

const txt = (p, k, label, { optional = false, date = false, num = false } = {}) => `<div class="field">
  <label class="field__label" for="${p}${k}">${label}${optional ? ' <span class="is-optional">(opcional)</span>' : ''}</label>
  <input class="input" id="${p}${k}" type="text" autocomplete="off"${date ? ' placeholder="DD/MM/AAAA" inputmode="numeric"' : ''}${num ? ' inputmode="decimal"' : ''} aria-describedby="${p}${k}-err">
  <p class="field__error" id="${p}${k}-err"></p>
</div>`;
const sel = (p, k, label, opts, { selected, disabled = false, hint = null, placeholder } = {}) => `<div class="field">
  <label class="field__label" for="${p}${k}">${label}</label>
  <select class="input" id="${p}${k}"${hint !== null ? ` aria-describedby="${p}${k}-hint"` : ''}${disabled ? ' disabled' : ''}>
    ${placeholder ? `<option value="">${placeholder}</option>` : ''}${opts.map((o) => `<option${o === selected ? ' selected' : ''}>${o}</option>`).join('')}
  </select>
  ${hint !== null ? `<p class="field__hint" id="${p}${k}-hint">${hint}</p>` : ''}
</div>`;

export const FORMS = {
  'factura-esp': 'Nueva factura nacional',
  'factura-ext': 'Nueva factura exenta de impuestos',
  'gasto-cat': 'Nuevo gasto',
  'gasto-iva': 'Nuevo gasto',
};

/**
 * form: 'factura-esp' · 'factura-ext' · 'gasto-cat' (opened from a category: cat = index 0–9) · 'gasto-iva' (opened from a rate: rate = '21 %'…)
 */
export const entryForm = ({ form = 'factura-esp', year = new Date().getFullYear(), cat = 2, rate = '21 %' } = {}) => {
  const p = `ef${++n}-`;
  const gasto = form.startsWith('gasto');
  const accent = gasto ? 'attention' : 'primary';
  let fields;
  if (gasto) {
    const catSel = form === 'gasto-cat' ? CAT_OPTS[cat] : undefined;
    const reta = form === 'gasto-cat' && Number(cat) === 0;
    const ivaSel = reta ? '0 %' : form === 'gasto-iva' ? rate : '21 %';
    fields = `${txt(p, 'num', 'Número de factura', { optional: true })}
      ${txt(p, 'fecha', `Fecha · ${year}`, { date: true })}
      ${txt(p, 'prov', 'Proveedor')}
      ${txt(p, 'con', 'Concepto')}
      ${txt(p, 'base', 'Base imponible en €', { num: true })}
      ${sel(p, 'iva', '% de IVA', IVA, { selected: ivaSel, disabled: reta, hint: reta ? 'La cuota de autónomos no lleva IVA.' : '' })}
      <p class="field__total" aria-live="polite">Total gasto: — €</p>
      ${sel(p, 'cat', 'Categoría IRPF', CAT_OPTS, { selected: catSel, placeholder: 'Elige una categoría' })}
      <label class="check"><input type="checkbox" data-e303${reta || ivaSel === '0 %' ? ' disabled' : ' checked'}> Incluir en el 303</label>`;
  } else {
    fields = `${txt(p, 'num', 'Número de factura')}
      ${txt(p, 'fecha', `Fecha · ${year}`, { date: true })}
      ${txt(p, 'cli', 'Cliente')}
      ${txt(p, 'con', 'Concepto')}
      ${txt(p, 'base', 'Base imponible en €', { num: true })}
      ${form === 'factura-esp' ? `${sel(p, 'iva', '% de IVA', IVA, { selected: '21 %' })}
      <label class="check"><input type="checkbox" checked> Aplicar retención IRPF del 15 %</label>` : ''}`;
  }
  return {
    form: true,
    title: FORMS[form],
    headerAction: `<button type="button" class="btn btn--ghost btn--${accent}" data-close><span class="btn__label">Cancelar</span></button>`,
    body: `<div class="form form--${accent} form--tinted" data-entry="${gasto ? 'gasto' : 'factura'}">${fields}</div>`,
    actions: `<button type="button" class="btn btn--${accent}" data-close><span class="btn__label">Guardar</span>${icon('save', { size: 'md' })}</button>`,
  };
};

/** The app's rules for Nuevo gasto: Seguridad Social → IVA 0 % (locked) + hint; IVA 0 % → 303 off; live total. */
export const wireEntryForm = (root) => {
  const fmt = (v) => `${v.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`;
  root.querySelectorAll('[data-entry="gasto"]').forEach((f) => {
    const [iva, cat] = f.querySelectorAll('select');
    const base = f.querySelector('input[inputmode="decimal"]');
    const note = f.querySelector('.field__hint');
    const total = f.querySelector('.field__total');
    const e303 = f.querySelector('[data-e303]');
    let prev = iva.disabled ? '21 %' : iva.value;
    const sync = () => {
      const reta = cat.selectedIndex === 1;
      if (reta && !iva.disabled) { prev = iva.value; iva.value = '0 %'; }
      else if (!reta && iva.disabled) iva.value = prev;
      iva.disabled = reta;
      note.textContent = reta ? 'La cuota de autónomos no lleva IVA.' : '';
      const r = parseFloat(iva.value) || 0;
      e303.disabled = !r; if (!r) e303.checked = false; else if (e303.dataset.touched !== '1') e303.checked = true;
      const raw = base.value.trim().replace(/\s|€/g, '');
      const b = raw ? parseFloat(raw.includes(',') ? raw.replace(/\./g, '').replace(',', '.') : raw) : NaN;
      total.textContent = `Total gasto: ${isNaN(b) ? '— €' : fmt(b * (1 + r / 100))}`;
    };
    e303.addEventListener('change', () => { e303.dataset.touched = '1'; });
    [iva, cat].forEach((s) => s.addEventListener('change', sync));
    base.addEventListener('input', sync);
  });
  return root;
};
