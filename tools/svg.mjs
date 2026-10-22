// Biblioteca mínima para gerar SVGs animados (SMIL) compatíveis com o GitHub.
// Regras: sem JS, sem fontes externas, sem filtros pesados, sem recursos remotos.

export const C = {
  bg: '#0a0b0d', panel: '#0f1114', panel2: '#14171b', line: '#1f242b', line2: '#2e353e',
  fg: '#d7dbe0', dim: '#8b949e', mute: '#566069',
  acc: '#e3b341', ok: '#6fbf73', err: '#e5534b', blue: '#5b8fd6', red: '#c2564e',
};
export const MONO = "ui-monospace,SFMono-Regular,'SF Mono',Menlo,Consolas,'Liberation Mono','DejaVu Sans Mono','Courier New',monospace";
export const CW = 0.6; // largura do caractere monoespaçado / tamanho da fonte

export const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
export const f = (n) => String(Math.round(n * 1000) / 1000);
export const textW = (s, size) => [...String(s)].length * size * CW;

/** Texto com largura fixa (textLength) para renderizar igual em qualquer fonte monoespaçada. */
export function text(x, y, s, { size = 14, fill = C.fg, weight = 400, anchor = 'start', op = 1 } = {}) {
  const n = [...String(s)].length;
  const w = n * size * CW;
  return `<text x="${f(x)}" y="${f(y)}" font-family="${MONO}" font-size="${size}" font-weight="${weight}" fill="${fill}"` +
    `${anchor !== 'start' ? ` text-anchor="${anchor}"` : ''}${op !== 1 ? ` opacity="${op}"` : ''} textLength="${f(w)}" lengthAdjust="spacing" xml:space="preserve">${esc(s)}</text>`;
}

/** Linha com vários trechos coloridos; devolve [svg, larguraTotal]. */
export function row(x, y, parts, size = 14) {
  let cx = x; let out = '';
  for (const [s, fill, weight] of parts) {
    out += text(cx, y, s, { size, fill: fill || C.fg, weight: weight || 400 });
    cx += textW(s, size);
  }
  return [out, cx - x];
}

export function svg(w, h, label, body, defs = '') {
  return `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(label)}"><title>${esc(label)}</title>` +
    `${defs ? `<defs>${defs}</defs>` : ''}${body}</svg>\n`;
}

// ───────── animação (SMIL) ─────────
function prep(pts, T, calc) {
  const p = pts.map((a) => [a[0], a[1]]);
  if (p[0][0] !== 0) p.unshift([0, p[0][1]]);
  const out = [];
  for (const q of p) {
    let t = Math.min(q[0], T);
    if (out.length && t <= out[out.length - 1][0]) t = out[out.length - 1][0] + 0.002;
    out.push([t, q[1]]);
  }
  if (calc !== 'discrete' && out[out.length - 1][0] < T) out.push([T, out[out.length - 1][1]]);
  return calc === 'discrete' ? out.filter((q, i) => q[0] < T || i === 0) : out;
}
export function anim(attr, pts, T, { calc = 'discrete', tag = 'animate', type = '' } = {}) {
  const p = prep(pts, T, calc);
  const kt = p.map((q) => f(q[0] / T)).join(';');
  const vals = p.map((q) => q[1]).join(';');
  return `<${tag} attributeName="${attr}"${type ? ` type="${type}"` : ''} dur="${f(T)}s" repeatCount="indefinite" calcMode="${calc}" keyTimes="${kt}" values="${vals}"/>`;
}
export const animT = (type, pts, T, calc = 'linear') => anim('transform', pts, T, { calc, tag: 'animateTransform', type });

/** Elemento que aparece (fade) em t0 e some no reinício do loop. */
export function appear(inner, t0, T, fade = 0.3) {
  return `<g>${inner}${anim('opacity', [[0, 0], [t0, 0], [t0 + fade, 1], [T, 1]], T, { calc: 'linear' })}</g>`;
}
/** Cena inteira: fade-out curto no fim do loop (efeito "clear"). */
export function scene(inner, T) {
  return `<g>${inner}${anim('opacity', [[0, 1], [T - 0.55, 1], [T - 0.12, 0], [T, 0]], T, { calc: 'linear' })}</g>`;
}

/** Texto "digitado" caractere a caractere, com cobertura (cover) na cor do fundo. */
export function typed({ s, x, y, size = 15, fill = C.fg, weight = 400, t0, cps = 18, T, bg = C.bg, cursor = C.acc, keep = false }) {
  const cw = size * CW; const n = [...s].length; const W = n * cw; const t1 = t0 + n / cps; const tEnd = T - 0.13;
  const cx = [[0, x], [t0, x]]; const wd = [[0, W], [t0, W]];
  for (let i = 1; i <= n; i++) { cx.push([t0 + i / cps, x + i * cw]); wd.push([t0 + i / cps, W - i * cw]); }
  cx.push([tEnd, x]); wd.push([tEnd, W]);
  const top = y - size * 1.0; const hh = size * 1.45;
  const op = [[0, 0], [t0, 1]];
  if (keep) { for (let t = t1, on = 1; t < tEnd; t += 0.5, on ^= 1) op.push([t, on]); op.push([tEnd, 0]); }
  else { op.push([t1 + 0.45, 0]); }
  const pos = [[0, x], [t0, x]]; for (let i = 1; i <= n; i++) pos.push([t0 + i / cps, x + i * cw]);
  return text(x, y, s, { size, fill, weight }) +
    `<rect x="${f(x)}" y="${f(top)}" width="0" height="${f(hh)}" fill="${bg}">${anim('x', cx, T)}${anim('width', wd, T)}</rect>` +
    `<rect x="${f(x)}" y="${f(top + size * 0.12)}" width="${f(cw * 0.62)}" height="${f(size * 1.08)}" fill="${cursor}" opacity="0">${anim('x', pos, T)}${anim('opacity', op, T)}</rect>`;
}

// ───────── janela estilo terminal ─────────
export function windowFrame({ w, h, title = '', right = '', header = 38, status = 0, statusLeft = '', statusRight = '' }) {
  let o = `<rect x=".5" y=".5" width="${w - 1}" height="${h - 1}" rx="12" fill="${C.bg}" stroke="${C.line2}"/>`;
  o += `<path d="M.5 ${header}V12.5a12 12 0 0 1 12-12h${w - 25}a12 12 0 0 1 12 12V${header}z" fill="${C.panel}"/>`;
  o += `<path d="M1 ${header}H${w - 1}" stroke="${C.line}"/>`;
  [22, 40, 58].forEach((cx) => { o += `<circle cx="${cx}" cy="${header / 2}" r="5" fill="${C.line2}"/>`; });
  if (title) o += text(82, header / 2 + 4, title, { size: 12, fill: C.dim });
  if (right) o += text(w - 22, header / 2 + 4, right, { size: 12, fill: C.mute, anchor: 'end' });
  if (status) {
    o += `<path d="M.5 ${h - status}H${w - 0.5}V${h - 12.5}a12 12 0 0 1-12 12H12.5a12 12 0 0 1-12-12z" fill="${C.panel}"/><path d="M1 ${h - status}H${w - 1}" stroke="${C.line}"/>`;
    o += statusLeft + statusRight;
  }
  return o;
}
export const crt = (w, h) =>
  `<rect width="${w}" height="${h}" rx="12" fill="url(#scan)"/><rect width="${w}" height="${h}" rx="12" fill="url(#vig)"/>`;
export const crtDefs = '<pattern id="scan" width="4" height="4" patternUnits="userSpaceOnUse"><rect width="4" height="1" fill="#fff" opacity=".022"/></pattern>' +
  '<radialGradient id="vig" cx="50%" cy="50%" r="75%"><stop offset=".6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".38"/></radialGradient>';

// ───────── ícones (grade 24, traço) ─────────
const ICONS = {
  flow: '<circle cx="5" cy="6" r="2.2"/><circle cx="19" cy="6" r="2.2"/><circle cx="12" cy="18" r="2.2"/><path d="M7.2 6h9.6M6.2 8l4.7 8M17.8 8l-4.7 8"/>',
  shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/>',
  code: '<path d="M8 7l-5 5 5 5M16 7l5 5-5 5M14 5l-4 14"/>',
  swords: '<path d="M5 19L19 5M14 5h5v5M19 19L5 5M10 5H5v5M4 20l3-3M20 20l-3-3"/>',
  pad: '<path d="M6 8h12a4 4 0 0 1 4 4v1.2a3 3 0 0 1-5.3 1.9L15.4 13.5H8.6l-1.3 1.6A3 3 0 0 1 2 13.2V12a4 4 0 0 1 4-4z"/><path d="M7 10.5v3M5.5 12h3"/><circle cx="16" cy="11" r=".8"/><circle cx="18.2" cy="12.6" r=".8"/>',
  pixels: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h7v7h-7z"/>',
  db: '<ellipse cx="12" cy="5.5" rx="8" ry="2.8"/><path d="M4 5.5v6.5c0 1.5 3.6 2.8 8 2.8s8-1.3 8-2.8V5.5M4 12v6.5c0 1.5 3.6 2.8 8 2.8s8-1.3 8-2.8V12"/>',
};
export function icon(name, x, y, s = 1, color = C.acc, sw = 1.6) {
  return `<g transform="translate(${f(x)},${f(y)}) scale(${f(s)})" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">${ICONS[name]}</g>`;
}
export const check = (x, y, color = C.ok, s = 1) =>
  `<path transform="translate(${f(x)},${f(y)}) scale(${f(s)})" d="M0 5l3.6 3.6L10 1" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`;

/** Sprite pixel-art a partir de linhas de bits. */
export function sprite(rows, { x = 0, y = 0, s = 4, fill = C.fg } = {}) {
  let d = '';
  rows.forEach((r, j) => {
    let i = 0;
    while (i < r.length) {
      if (r[i] === 'X' || r[i] === '1') {
        let k = i;
        while (k < r.length && (r[k] === 'X' || r[k] === '1')) k++;
        d += `M${i * s} ${j * s}h${(k - i) * s}v${s}h${-(k - i) * s}z`;
        i = k;
      } else i++;
    }
  });
  return `<path transform="translate(${f(x)},${f(y)})" d="${d}" fill="${fill}"/>`;
}
