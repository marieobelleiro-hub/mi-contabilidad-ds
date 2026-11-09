import '../tokens/tokens.css';
import '../tokens/base.css';
import '../icons/icons.css';
import '../components/button/button.css';
import '../components/tab/tab.css';
import '../components/selectors/selectors.css';
import '../components/card/card.css';
import '../components/list/list.css';
import '../components/table/table.css';
import '../components/input/input.css';
import '../components/result/result.css';
import '../components/feedback/feedback.css';
import '../components/dialog/dialog.css';
import '../components/chart/chart.css';
import '../components/menu/menu.css';
import '../assistant/tokens.css';      // sub-system · Asistente inteligente
import '../assistant/assistant.css';
import '../acceso/tokens.css';         // sub-system · Acceso fácil
import '../acceso/acceso.css';

import { carbonTheme } from './carbon-theme.js';

const BG = { canvas: '#F4F4F4', white: '#FFFFFF' };

/* Docs pages: give each preview box the same background as its story (grey by default, like the app). */
const docsBackground = (story, ctx) => {
  const out = story();
  if (ctx.viewMode !== 'docs') return out;
  const wrap = document.createElement('div');
  wrap.style.display = 'contents';
  if (typeof out === 'string') wrap.innerHTML = out; else wrap.append(out);
  const value = ctx.storyGlobals?.backgrounds?.value || 'canvas';
  requestAnimationFrame(() => { const box = wrap.closest('.docs-story'); if (box) box.style.background = BG[value] || BG.canvas; });
  return wrap;
};

/* Code tab & "Show code": print the HTML one element per line, indented (icons stay on one line) */
const VOID = new Set(['input', 'br', 'img', 'hr', 'col', 'meta', 'link']);
const prettyHTML = (code) => {
  if (typeof document === 'undefined' || !code || !code.trim().startsWith('<')) return code;
  const tpl = document.createElement('template');
  tpl.innerHTML = code.trim();
  const attrs = (el) => [...el.attributes].map((a) => (a.value === '' ? ` ${a.name}` : ` ${a.name}="${a.value}"`)).join('');
  const print = (node, pad) => {
    if (node.nodeType === 3) { const t = node.textContent.trim(); return t ? pad + t : ''; }
    if (node.nodeType !== 1) return '';
    const tag = node.tagName.toLowerCase();
    if (VOID.has(tag)) return `${pad}<${tag}${attrs(node)}>`;
    const kids = [...node.childNodes].filter((n) => n.nodeType === 1 || n.textContent.trim());
    if (tag === 'svg' || kids.every((n) => n.nodeType === 3)) return `${pad}${node.outerHTML.replace(/\s+/g, ' ')}`;
    return `${pad}<${tag}${attrs(node)}>\n${kids.map((k) => print(k, pad + '  ')).filter(Boolean).join('\n')}\n${pad}</${tag}>`;
  };
  return [...tpl.content.childNodes].map((n) => print(n, '')).filter(Boolean).join('\n');
};

/** @type { import('@storybook/html-vite').Preview } */
const preview = {
  parameters: {
    layout: 'centered',
    backgrounds: {
      options: {
        white:  { name: 'Surface (white)', value: '#FFFFFF' },
        canvas: { name: 'Page canvas (default)', value: '#F4F4F4' },
      },
    },
    // Toolbar → viewport: preview any story at the app's design widths (see Foundations/Layout & breakpoints)
    viewport: {
      options: {
        mobile:    { name: 'Mobile · 390',            styles: { width: '390px',  height: '844px' }, type: 'mobile' },
        tablet:    { name: 'Mobile layout · 800',     styles: { width: '800px',  height: '1024px' }, type: 'tablet' },
        desktopSm: { name: 'Desktop · 1024 (min)',    styles: { width: '1024px', height: '768px' }, type: 'desktop' },
        desktop:   { name: 'Desktop · 1232',          styles: { width: '1232px', height: '800px' }, type: 'desktop' },
      },
    },
    a11y: { test: 'error' },
    docs: { codePanel: true, source: { transform: prettyHTML }, theme: carbonTheme },   // a Code tab next to Controls, with the HTML of the story
    options: {
      storySort: { order: [
        'Introduction',
        'App', ['Introduction', 'Foundations', ['Colors', 'Typography', 'Spacing, radius & elevation', 'Layout & breakpoints', 'Icons', 'Tokens'],
          'Components', ['Button', 'Tab', 'Selectors', 'List row', 'Card', 'Input', 'Tables', 'Banner, tooltip & toast', 'Dialog', 'Chart', '*'], 'Showcase'],
        'Chatbot', ['Introduction', 'Foundations', ['Colors', 'Typography', 'Tokens'], 'Components', ['Panel', 'Messages', 'Suggestion chips', 'Composer', 'Question & form cards']],
        'Accessibility assistant', ['Introduction', 'Foundations', ['Colors', 'Typography', 'Tokens'], 'Components', ['Panel', 'Steps & options', 'Answer', 'Form on dark']],
      ] },
    },
  },
  initialGlobals: { backgrounds: { value: 'canvas' } },   // previews sit on the page grey, like in the app
  decorators: [docsBackground],
  tags: ['autodocs'],
};
export default preview;
