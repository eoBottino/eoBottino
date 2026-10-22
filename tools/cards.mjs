import {
  C, text, textW, svg, anim, animT, appear, typed, icon, check, sprite, f, windowFrame,
} from './svg.mjs';

// ─────────────────────────────── artes animadas (110px de altura, 320 de largura) ───────────────────────────────
const artFlow = () => {
  const T = 4; let o = '';
  const labels = ['webhook', 'fluxo', 'IA', 'resposta'];
  labels.forEach((l, i) => {
    const x = i * 88; const t = (4 / 3) * i;
    const hi = [[0, C.line2], [Math.max(t - 0.15, 0.01), C.acc], [t + 0.45, C.line2]];
    if (i === 3) { hi.length = 0; hi.push([0, C.acc], [0.4, C.line2], [3.85, C.acc]); }
    o += `<rect x="${x}" y="28" width="56" height="40" rx="6" fill="${C.panel2}" stroke="${C.line2}">${anim('stroke', hi, T)}</rect>`;
    o += text(x + 28, 52, i === 0 ? '{ }' : i === 1 ? '>>' : i === 2 ? 'AI' : 'OK', { size: 13, fill: C.fg, weight: 700, anchor: 'middle' });
    o += text(x + 28, 92, l, { size: 11, fill: C.mute, anchor: 'middle' });
    if (i < 3) o += `<path d="M${x + 60} 48H${x + 84}" stroke="${C.line2}" stroke-dasharray="3 4"><animate attributeName="stroke-dashoffset" from="0" to="-14" dur="1s" repeatCount="indefinite"/></path>`;
  });
  o += `<rect x="-3" y="-3" width="6" height="6" fill="${C.acc}"><animateMotion dur="${T}s" repeatCount="indefinite" path="M28,48 H292"/></rect>`;
  return o;
};

const SHIELD = 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z';
const artShield = () => {
  const T = 6; let o = `<clipPath id="sh"><path transform="translate(20,6) scale(4)" d="${SHIELD}"/></clipPath>`;
  o += `<path transform="translate(20,6) scale(4)" d="${SHIELD}" fill="${C.panel2}" stroke="${C.acc}" stroke-width=".6" stroke-linejoin="round"/>`;
  o += `<g clip-path="url(#sh)"><rect x="16" y="6" width="104" height="14" fill="${C.acc}" opacity=".16">${anim('y', [[0, 0], [3, 90], [6, 0]], T, { calc: 'linear' })}</rect>` +
    `<rect x="16" y="6" width="104" height="2" fill="${C.acc}" opacity=".9">${anim('y', [[0, 18], [3, 108], [6, 18]], T, { calc: 'linear' })}</rect></g>`;
  ['integridade', 'acessos', 'logs'].forEach((l, i) => {
    o += appear(check(150, 24 + i * 28, C.ok, 1) + text(172, 33 + i * 28, l, { size: 13, fill: C.fg }) + text(172 + textW(l, 13) + 10, 33 + i * 28, 'ok', { size: 11, fill: C.mute }), 0.8 + i * 1.1, T, 0.25);
  });
  return o;
};

const artCode = () => {
  const T = 7; let o = '';
  const L = [
    [0, [[0, 34, C.acc], [42, 76, C.dim]]],
    [1, [[0, 50, C.ok], [58, 40, C.dim], [106, 66, C.dim]]],
    [1, [[0, 28, C.acc], [36, 96, C.fg], [140, 30, C.dim]]],
    [2, [[0, 62, C.dim], [70, 44, C.ok]]],
    [1, [[0, 24, C.acc]]],
    [0, [[0, 18, C.dim]]],
  ];
  L.forEach(([ind, segs], i) => {
    const y = 8 + i * 16;
    let g = text(0, y + 8, String(i + 1), { size: 10, fill: C.mute });
    segs.forEach(([x, w, c]) => { g += `<rect x="${30 + ind * 18 + x}" y="${y}" width="${w}" height="7" rx="2" fill="${c}" opacity=".85"/>`; });
    o += appear(g, 0.4 + i * 0.6, T, 0.2);
  });
  const blink = [[0, 0]]; for (let t = 4.1, on = 1; t < 6.9; t += 0.45, on ^= 1) blink.push([t, on]); blink.push([6.9, 0]);
  o += `<rect x="${30 + 0 * 18 + 22}" y="${8 + 5 * 16 - 1}" width="6" height="9" fill="${C.acc}" opacity="0">${anim('opacity', blink, T)}</rect>`;
  return o;
};

const artLobby = () => {
  const T = 8; let o = '';
  const rows = [['AZUL', C.blue, 22, 0.4], ['VERMELHO', C.red, 56, 0.65]];
  rows.forEach(([name, col, y, t0]) => {
    o += text(0, y + 4, name, { size: 10, fill: C.mute });
    for (let i = 0; i < 5; i++) {
      const cx = 100 + i * 34; const t = t0 + i * 0.5;
      o += `<circle cx="${cx}" cy="${y}" r="11" fill="none" stroke="${col}" stroke-opacity=".5"/>`;
      o += `<circle cx="${cx}" cy="${y}" r="11" fill="${col}" fill-opacity="0">${anim('fill-opacity', [[0, 0], [t, 0], [t + 0.25, 0.85], [T, 0.85]], T, { calc: 'linear' })}</circle>`;
    }
  });
  o += `<rect x="0" y="84" width="300" height="4" rx="2" fill="${C.line}"/><rect x="0" y="84" width="0" height="4" rx="2" fill="${C.acc}">${anim('width', [[0, 0], [0.4, 0], [3.2, 300], [T, 300]], T, { calc: 'linear' })}</rect>`;
  o += `<g>${text(0, 106, 'aguardando jogadores...', { size: 11, fill: C.dim })}${anim('opacity', [[0, 1], [3.4, 0]], T)}</g>`;
  o += appear(text(0, 106, 'lobby 10/10  |  partida iniciada', { size: 11, fill: C.acc }), 3.4, T, 0.2);
  return o;
};

const INV1 = ['..X.....X..', '...X...X...', '..XXXXXXX..', '.XX.XXX.XX.', 'XXXXXXXXXXX', 'X.XXXXXXX.X', 'X.X.....X.X', '...XX.XX...'];
const INV2 = ['..X.....X..', 'X..X...X..X', 'X.XXXXXXX.X', 'XXX.XXX.XXX', 'XXXXXXXXXXX', '.XXXXXXXXX.', '..X.....X..', '.X.......X.'];
const artInvader = () => {
  let o = `<g transform="translate(30,10)"><g>${animT('translate', [[0, '0 0'], [3, '190 0'], [6, '0 0']], 6)}` +
    `<g>${sprite(INV1, { s: 6, fill: C.ok })}${anim('opacity', [[0, 1], [0.5, 0]], 1)}</g>` +
    `<g opacity="0">${sprite(INV2, { s: 6, fill: C.ok })}${anim('opacity', [[0, 0], [0.5, 1]], 1)}</g></g></g>`;
  o += sprite(['....X....', '...XXX...', 'XXXXXXXXX'], { x: 142, y: 92, s: 4, fill: C.dim });
  o += `<rect x="158" y="84" width="3" height="9" fill="${C.acc}"><animate attributeName="y" values="84;4;4" keyTimes="0;.9;1" dur="1.6s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;1;0" keyTimes="0;.85;1" dur="1.6s" repeatCount="indefinite"/></rect>`;
  return o;
};

const artRecords = () => {
  const T = 4.5; let o = `<rect x="0" y="0" width="320" height="20" rx="4" fill="${C.panel2}"/>`;
  o += text(10, 14, 'ID', { size: 10, fill: C.mute }) + text(70, 14, 'REGISTRO', { size: 10, fill: C.mute }) + text(262, 14, 'STATUS', { size: 10, fill: C.mute });
  o += `<rect x="0" y="24" width="320" height="18" fill="${C.acc}" fill-opacity=".1">${anim('y', [0, 1, 2, 3, 4].map((i) => [i * 0.9, 24 + i * 17]), T)}</rect>`;
  o += `<rect x="0" y="24" width="2" height="18" fill="${C.acc}">${anim('y', [0, 1, 2, 3, 4].map((i) => [i * 0.9, 24 + i * 17]), T)}</rect>`;
  const w = [96, 128, 84, 112, 100]; const st = [C.ok, C.ok, C.acc, C.ok, C.dim];
  for (let i = 0; i < 5; i++) {
    const y = 27 + i * 17;
    o += text(10, y + 9, `#00${i + 1}`, { size: 10, fill: C.mute }) + `<rect x="70" y="${y + 2}" width="${w[i]}" height="6" rx="2" fill="${C.dim}" opacity=".55"/>` +
      `<circle cx="278" cy="${y + 5}" r="3.5" fill="${st[i]}"/>`;
  }
  return o;
};

const artPixels = () => {
  let o = '';
  for (let r = 0; r < 4; r++) for (let c = 0; c < 11; c++) {
    const x = c * 29; const y = 8 + r * 26; const ph = (c * 0.17 + r * 0.31).toFixed(2);
    o += `<rect x="${x}" y="${y}" width="21" height="19" rx="3" fill="${(c + r) % 5 === 0 ? C.acc : C.dim}" opacity=".15"><animate attributeName="opacity" values=".12;.85;.12" dur="3.4s" begin="-${ph}s" repeatCount="indefinite"/></rect>`;
  }
  o += text(0, 118, 'render  |  design  |  sistemas', { size: 11, fill: C.mute });
  return o;
};

const ART = { pixels: artPixels, flow: artFlow, shield: artShield, code: artCode, swords: artLobby, pad: artInvader, db: artRecords };

export function projectCard({ ic, title, sub, kind, url }) {
  const W = 1000; const H = 150;
  let s = `<rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="12" fill="${C.bg}" stroke="${C.line2}"/>`;
  s += `<rect x="28" y="32" width="86" height="86" rx="12" fill="${C.panel}" stroke="${C.line}"/>` + icon(ic, 28 + 19, 32 + 19, 2.04, C.acc, 1.4);
  s += text(140, 66, title, { size: 30, fill: C.fg, weight: 700 }) + text(140, 92, sub, { size: 14, fill: C.dim });
  const cw = textW(kind, 11) + 20;
  s += `<rect x="140" y="104" width="${f(cw)}" height="20" rx="4" fill="${C.panel2}" stroke="${C.line2}"/>` + text(150, 118, kind, { size: 11, fill: C.acc });
  if (url) s += text(140 + cw + 14, 119, url, { size: 12, fill: C.mute });
  s += `<path d="M620 24V126" stroke="${C.line}"/>`;
  s += `<g transform="translate(650,20)">${ART[ic === 'flow' ? 'flow' : ic]()}</g>`;
  return svg(W, H, `${title}: ${sub}`, s);
}

// ─────────────────────────────── botões ───────────────────────────────
export function button(label, { primary = false } = {}) {
  const size = 13; const w = Math.ceil(textW(label, size) + 56); const h = 38;
  const col = primary ? C.acc : C.fg;
  let s = `<rect x=".5" y=".5" width="${w - 1}" height="${h - 1}" rx="7" fill="${primary ? C.acc : C.panel}" fill-opacity="${primary ? 0.1 : 1}" stroke="${primary ? C.acc : C.line2}" stroke-opacity="${primary ? 0.7 : 1}"/>`;
  s += text(18, 24, label, { size, fill: col, weight: primary ? 700 : 400 });
  s += `<g transform="translate(${w - 34},${h / 2})"><g>${animT('translate', [[0, '0 0'], [1.2, '4 0'], [2.4, '0 0']], 2.4)}<path d="M0 0h14M9-5l5 5-5 5" fill="none" stroke="${C.acc}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></g></g>`;
  return [svg(w, h, label, s), w, h];
}

export function navButton(num, label) {
  const size = 12; const w = Math.ceil(textW(`${num}  ${label}`, size) + 32); const h = 32;
  let s = `<rect x=".5" y=".5" width="${w - 1}" height="${h - 1}" rx="6" fill="${C.panel}" stroke="${C.line2}"/>`;
  s += text(16, 20.5, num, { size, fill: C.acc, weight: 700 }) + text(16 + textW(`${num}  `, size), 20.5, label, { size, fill: C.fg });
  return [svg(w, h, label, s), w, h];
}

// ─────────────────────────────── divisor e rodapé ───────────────────────────────
export function divider() {
  const W = 1000; const H = 28;
  const s = `<path d="M0 14H${W}" stroke="${C.line2}" stroke-dasharray="1 6"/><path d="M${W / 2 - 30} 14H${W / 2 + 30}" stroke="${C.bg}" stroke-width="12"/>` +
    `<rect x="${W / 2 - 3}" y="11" width="6" height="6" fill="${C.acc}"><animate attributeName="opacity" values="1;.3;1" dur="3.2s" repeatCount="indefinite"/></rect>` +
    `<rect x="${W / 2 - 24}" y="13" width="10" height="2" fill="${C.line2}"/><rect x="${W / 2 + 14}" y="13" width="10" height="2" fill="${C.line2}"/>`;
  return svg(W, H, '', s);
}

export function footer() {
  const W = 1000; const H = 120; const T = 14;
  const msg = 'construindo automação, sistemas e experiências digitais que ajudam pessoas e negócios a crescer';
  const x = (W - textW(msg, 14)) / 2;
  let s = `<path d="M0 20H${W}" stroke="${C.line2}" stroke-dasharray="1 6"/>`;
  s += typed({ s: msg, x, y: 66, size: 14, fill: C.dim, t0: 0.6, cps: 40, T, keep: true });
  s += appear(text(W / 2, 100, 'Eduardo Bottino  |  C.IAutomatiza  |  2026', { size: 12, fill: C.mute, anchor: 'middle' }), 3.2, T, 0.4);
  return svg(W, H, 'Construindo automação, sistemas e experiências digitais que ajudam pessoas e negócios a crescer', s);
}

// ─────────────────────────────── chips de identidade ───────────────────────────────
export function chips(list) {
  const size = 12; const h = 32; const gap = 10;
  const ws = list.map((t) => Math.ceil(textW(t, size) + 40));
  const total = ws.reduce((a, b) => a + b, 0) + gap * (list.length - 1);
  const W = 1000; let x = (W - total) / 2; let o = '';
  list.forEach((t, i) => {
    o += `<g opacity="0"><rect x="${f(x + 0.5)}" y="4.5" width="${ws[i] - 1}" height="${h - 1}" rx="6" fill="${C.panel}" stroke="${C.line2}"/>` +
      `<rect x="${f(x + 14)}" y="${4 + h / 2 - 3}" width="6" height="6" fill="${C.acc}"/>` + text(x + 28, 4 + h / 2 + 4, t, { size, fill: C.fg }) +
      `<animate attributeName="opacity" from="0" to="1" dur=".5s" begin="${(i * 0.12).toFixed(2)}s" fill="freeze"/></g>`;
    x += ws[i] + gap;
  });
  return svg(W, 40, list.join(', '), o);
}

// ─────────────────────────────── painel de stack ───────────────────────────────
export function stackPanel(groups) {
  const W = 1000; const size = 13; const rowH = 46; const top = 56; const H = top + groups.length * rowH + 14;
  let s = windowFrame({ w: W, h: H, title: 'stack.json', right: 'ADS + prática' });
  let n = 0;
  groups.forEach(([label, items], gi) => {
    const y = top + gi * rowH;
    s += text(26, y + 20, label, { size: 11, fill: C.mute });
    if (gi) s += `<path d="M24 ${y - 8}H${W - 24}" stroke="${C.line}"/>`;
    let x = 250;
    items.forEach((it) => {
      const w = Math.ceil(textW(it, size) + 30);
      s += `<g opacity="0"><rect x="${x + 0.5}" y="${y + 3.5}" width="${w - 1}" height="26" rx="5" fill="${C.panel}" stroke="${C.line2}"/>` +
        `<rect x="${x + 11}" y="${y + 13}" width="5" height="5" fill="${C.acc}"/>` + text(x + 22, y + 21, it, { size, fill: C.fg }) +
        `<animate attributeName="opacity" from="0" to="1" dur=".4s" begin="${(n++ * 0.05).toFixed(2)}s" fill="freeze"/></g>`;
      x += w + 8;
    });
  });
  return svg(W, H, 'Stack: ' + groups.map(([l, i]) => `${l}: ${i.join(', ')}`).join('. '), s);
}
