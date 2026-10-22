import {
  C, text, row, textW, svg, anim, animT, appear, scene, typed, windowFrame, crt, crtDefs, icon, check, sprite, f, CW,
} from './svg.mjs';

/** Linha de comando: prompt aparece e o comando é "digitado". */
function cmdline({ x, y, size, cmd, t0, cps = 18, T, prefix = '$', prefixColor = C.acc, bg = C.bg, keep = false }) {
  const px = x + (prefix.length + 1) * size * CW;
  return appear(text(x, y, prefix, { size, fill: prefixColor, weight: 700 }), t0, T, 0.01) +
    typed({ s: cmd, x: px, y, size, t0: t0 + 0.05, cps, T, bg, keep });
}

// ─────────────────────────────────────────── BANNER ───────────────────────────────────────────
export function banner() {
  const W = 1000; const H = 340; const T = 16;
  let b = windowFrame({
    w: W, h: H, title: 'eduardo@bottino: ~', right: 'zsh', status: 28,
    statusLeft: `<rect x="14" y="${H - 22}" width="68" height="16" rx="3" fill="${C.acc}"/>` +
      text(48, H - 10, 'NORMAL', { size: 11, fill: C.bg, weight: 700, anchor: 'middle' }) +
      text(96, H - 9, 'eoBottino/README.md', { size: 12, fill: C.dim }),
    statusRight: text(W - 16, H - 9, 'utf-8  |  ciautomatiza.com.br', { size: 12, fill: C.mute, anchor: 'end' }),
  });

  // decoração discreta à direita: órbitas finas
  const cx = 845; const cy = 168;
  let deco = '';
  [[44, 16], [78, 26], [112, 40]].forEach(([r, d], i) => {
    deco += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${C.line2}" stroke-dasharray="2 6"/>`;
    deco += `<circle r="${i === 0 ? 3 : 2.2}" fill="${i === 0 ? C.acc : C.dim}"><animateMotion dur="${d}s" repeatCount="indefinite" path="M${cx - r},${cy} a${r},${r} 0 1,${i % 2 ? 0 : 1} ${2 * r},0 a${r},${r} 0 1,${i % 2 ? 0 : 1} ${-2 * r},0"/></circle>`;
  });
  deco += `<rect x="${cx - 5}" y="${cy - 5}" width="10" height="10" fill="${C.acc}"><animate attributeName="opacity" values="1;.35;1" dur="3s" repeatCount="indefinite"/></rect>`;
  deco += text(cx, cy + 134, 'C.IA / ecosystem', { size: 11, fill: C.mute, anchor: 'middle' });

  let s = '';
  s += cmdline({ x: 40, y: 82, size: 18, cmd: 'whoami', t0: 0.5, cps: 14, T });
  s += typed({ s: 'Eduardo Bottino', x: 40, y: 150, size: 60, weight: 700, t0: 1.4, cps: 13, T, fill: C.fg });
  s += appear(`<rect x="42" y="164" width="84" height="3" fill="${C.acc}"/>`, 2.9, T);
  const [sub] = row(40, 198, [['Desenvolvedor Full-Stack', C.fg], ['  /  ', C.mute], ['Estudante de ADS', C.fg], ['  /  ', C.mute], ['24 anos', C.fg]], 17);
  s += appear(sub, 3.1, T);
  s += cmdline({ x: 40, y: 244, size: 16, cmd: 'ls ./ecosystem', t0: 4.0, cps: 16, T });
  const words = ['ciautomatiza', 'virtus', 'studio-codex', 'pixelcraft', 'requiem', 'gamelandia', 'system'];
  let wx = 40;
  words.forEach((w, i) => {
    s += appear(text(wx, 272, w, { size: 15, fill: i === 0 ? C.acc : C.dim }), 5.2 + i * 0.2, T, 0.15);
    wx += textW(w + '  ', 15);
  });
  s += appear(text(40, 298, '$', { size: 16, fill: C.acc, weight: 700 }), 6.8, T, 0.01);
  const blink = [[0, 0]]; for (let t = 7.0, on = 1; t < T - 0.13; t += 0.5, on ^= 1) blink.push([t, on]); blink.push([T - 0.13, 0]);
  s += `<rect x="${40 + 2 * 16 * CW}" y="${298 - 16 + 2}" width="${f(16 * CW * 0.62)}" height="17" fill="${C.acc}" opacity="0">${anim('opacity', blink, T)}</rect>`;

  const body = b + deco + scene(s, T) + crt(W, H);
  return svg(W, H, 'Eduardo Bottino, Desenvolvedor Full-Stack, estudante de ADS e CEO da C.IAutomatiza', body, crtDefs);
}

// ─────────────────────────────────────── CONSOLE DE DEV ───────────────────────────────────────
export function devConsole() {
  const W = 1000; const H = 452; const T = 24; const size = 14; const x0 = 32;
  const Ys = [70, 92, 114, 136, 170, 192, 214, 236, 270, 292, 326, 348, 370, 404];
  const Y = (i) => Ys[i];
  const tabs = `<rect x="82" y="6" width="108" height="33" fill="${C.bg}"/><rect x="82" y="6" width="108" height="2" fill="${C.acc}"/>` +
    text(136, 27, 'terminal', { size: 12, fill: C.fg, anchor: 'middle' }) +
    text(238, 27, 'build.log', { size: 12, fill: C.mute, anchor: 'middle' }) +
    text(336, 27, 'ci.yml', { size: 12, fill: C.mute, anchor: 'middle' });
  const frame = windowFrame({
    w: W, h: H, title: '', right: 'studio-codex  |  zsh', status: 28,
    statusLeft: text(16, H - 9, 'main', { size: 12, fill: C.acc }) + text(64, H - 9, '0 erros  0 avisos', { size: 12, fill: C.dim }),
    statusRight: text(W - 16, H - 9, 'node 22  |  utf-8', { size: 12, fill: C.mute, anchor: 'end' }),
  });
  const prompt = (i, cmd, t0, cps = 20) => cmdline({ x: x0, y: Y(i), size, cmd, t0, cps, T, prefix: '~/codex $' });
  let s = '';
  const dim = (i, str, t) => { s += appear(text(x0, Y(i), str, { size, fill: C.dim }), t, T, 0.2); };
  const ok = (i, str, t) => { s += appear(check(x0, Y(i) - 10, C.ok, 1) + text(x0 + 20, Y(i), str, { size, fill: C.fg }), t, T, 0.2); };

  s += prompt(0, 'npm run build', 0.6);
  dim(1, '> codex-api@1.0.0 build', 2.0);
  dim(2, '> tsc -p . && node scripts/bundle.js', 2.4);
  ok(3, 'build concluído', 3.5);

  s += prompt(4, 'node scripts/riot-sync.js --queue ranked', 4.6, 24);
  s += appear(row(x0, Y(5), [['[riot] ', C.acc], ['match-v5 -> coletando partidas ...', C.dim]], size)[0], 7.0, T, 0.2);
  s += appear(row(x0, Y(6), [['[riot] ', C.acc], ['jogadores resolvidos, lobbies sincronizados', C.dim]], size)[0], 8.1, T, 0.2);
  ok(7, 'sync concluído', 9.0);

  s += prompt(8, 'docker compose up -d', 10.2);
  ['api', 'bot', 'db'].forEach((n, i) => {
    s += appear(check(x0 + i * 130, Y(9) - 10, C.ok, 1) + text(x0 + i * 130 + 20, Y(9), `${n} iniciado`, { size, fill: C.fg }), 12.2 + i * 0.35, T, 0.2);
  });

  s += prompt(10, 'git push origin main', 14.0);
  s += appear(row(x0, Y(11), [['-> ', C.acc], ['deploy: discloud ...', C.dim]], size)[0], 15.8, T, 0.2);
  ok(12, 'online', 17.2);
  s += appear(text(x0, Y(13), '~/codex $', { size, fill: C.acc, weight: 700 }), 18.2, T, 0.01);
  const blink = [[0, 0]]; for (let t = 18.3, on = 1; t < T - 0.13; t += 0.5, on ^= 1) blink.push([t, on]); blink.push([T - 0.13, 0]);
  s += `<rect x="${x0 + 10 * size * CW}" y="${Y(13) - size + 2}" width="${f(size * CW * 0.62)}" height="${size + 2}" fill="${C.acc}" opacity="0">${anim('opacity', blink, T)}</rect>`;

  return svg(W, H, 'Console de desenvolvimento: build, sincronização com a Riot API, docker e deploy', frame + tabs + scene(s, T) + crt(W, H), crtDefs);
}

// ─────────────────────────────────────── PIPELINE (construção) ───────────────────────────────────────
export function pipeline() {
  const W = 1000; const H = 262; const T = 13;
  const frame = windowFrame({ w: W, h: H, title: 'build pipeline', right: 'on: push -> main' });
  const stages = [['lint', 'eslint + prettier'], ['test', 'node --test'], ['build', 'tsc + bundle'], ['deploy', 'discloud']];
  const bw = 190; const gap = (920 - 4 * bw) / 3; const by = 76; const barW = 158;
  let s = '';
  stages.forEach(([name, tool], i) => {
    const x = 40 + i * (bw + gap); const st = 1.0 + i * 2.2; const en = st + 1.9;
    s += `<rect x="${f(x)}" y="${by}" width="${bw}" height="104" rx="8" fill="${C.panel}" stroke="${C.line2}">${anim('stroke', [[0, C.line2], [st, C.acc], [en, C.ok]], T)}</rect>`;
    s += text(x + 16, by + 26, `0${i + 1}`, { size: 11, fill: C.mute });
    s += text(x + 16, by + 52, name, { size: 20, fill: C.fg, weight: 700 });
    s += text(x + 16, by + 72, tool, { size: 12, fill: C.dim });
    s += `<rect x="${x + 16}" y="${by + 84}" width="${barW}" height="4" rx="2" fill="${C.line}"/>`;
    s += `<rect x="${x + 16}" y="${by + 84}" width="0" height="4" rx="2" fill="${C.acc}">${anim('width', [[0, 0], [st, 0], [en, barW], [T, barW]], T, { calc: 'linear' })}${anim('fill', [[0, C.acc], [en, C.ok]], T)}</rect>`;
    const ix = x + bw - 28; const iy = by + 22;
    s += `<g transform="translate(${ix},${iy})" opacity="0">${anim('opacity', [[0, 0], [st, 1], [en, 0]], T)}<path d="M0 -7A7 7 0 0 1 7 0" fill="none" stroke="${C.acc}" stroke-width="2" stroke-linecap="round"><animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="0.9s" repeatCount="indefinite"/></path></g>`;
    s += `<g opacity="0">${anim('opacity', [[0, 0], [en, 1]], T)}${check(ix - 5, iy - 4, C.ok, 1)}</g>`;
    if (i < 3) {
      const lx = x + bw; const ly = by + 52;
      s += `<path d="M${f(lx + 6)} ${ly}H${f(lx + gap - 10)}" stroke="${C.line2}" stroke-width="1.5">${anim('stroke', [[0, C.line2], [en, C.ok]], T)}</path>` +
        `<path d="M${f(lx + gap - 14)} ${ly - 4}l5 4-5 4" fill="none" stroke="${C.line2}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${anim('stroke', [[0, C.line2], [en, C.ok]], T)}</path>`;
    }
  });
  s += text(40, 222, '$ git push origin main', { size: 13, fill: C.dim });
  s += appear(check(738, 211, C.ok, 1) + text(758, 222, 'pipeline concluído', { size: 13, fill: C.ok }), 9.7, T, 0.25);
  return svg(W, H, 'Pipeline de build: lint, test, build e deploy', frame + scene(s, T) + crt(W, H), crtDefs);
}

// ─────────────────────────────────────── ECOSSISTEMA ───────────────────────────────────────
export function ecosystem() {
  const W = 1000; const H = 500; const HY = 266;
  let s = `<rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="12" fill="${C.bg}" stroke="${C.line2}"/>`;
  s += `<pattern id="dots" width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".9" fill="#fff" opacity=".07"/></pattern><rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="12" fill="url(#dots)"/>`;
  s += text(20, 28, 'INTERNO', { size: 11, fill: C.mute }) + `<path d="M20 36h300" stroke="${C.line2}"/>`;
  s += text(W - 20, 28, 'EXTERNO', { size: 11, fill: C.mute, anchor: 'end' }) + `<path d="M680 36h300" stroke="${C.line2}"/>`;
  const nodes = [
    { side: 'L', cy: HY - 58, ic: 'shield', name: 'VIRTUS', tag: 'cybersecurity e integridade', url: 'projeto interno' },
    { side: 'L', cy: HY + 58, ic: 'code', name: 'STUDIO CODEX', tag: 'scripts, sistemas e jogos', url: 'projeto interno' },
    { side: 'R', cy: 92, ic: 'pixels', name: 'PIXELCRAFT STUDIO', tag: 'plataformas e sistemas web', url: 'pixelcraft-studio.com' },
    { side: 'R', cy: 208, ic: 'swords', name: 'REQUIEM INHOUSE', tag: 'inhouse de League of Legends', url: 'requiem.discloud.app' },
    { side: 'R', cy: 324, ic: 'pad', name: 'GAMELANDIA', tag: 'LoL, Valorant e outros jogos', url: 'projeto externo' },
    { side: 'R', cy: 440, ic: 'db', name: 'SYSTEM / DPE', tag: 'intranet e banco de dados', url: 'systemdpe.com' },
  ];
  let paths = ''; let boxes = '';
  nodes.forEach((n, i) => {
    const x = n.side === 'L' ? 20 : 680; const y = n.cy - 46;
    const d = n.side === 'L' ? `M400,${HY} H360 V${n.cy} H320` : `M600,${HY} H640 V${n.cy} H680`;
    paths += `<path d="${d}" fill="none" stroke="${C.line2}" stroke-width="1.5" stroke-dasharray="4 6"><animate attributeName="stroke-dashoffset" from="0" to="-20" dur="1.4s" repeatCount="indefinite"/></path>`;
    paths += `<rect x="-3" y="-3" width="6" height="6" fill="${C.acc}"><animateMotion dur="${3.4 + i * 0.4}s" begin="-${i * 0.8}s" repeatCount="indefinite" path="${d}"/></rect>`;
    boxes += `<rect x="${x}" y="${y}" width="300" height="92" rx="8" fill="${C.panel}" stroke="${C.line2}"/>`;
    boxes += `<rect x="${x + 14}" y="${y + 18}" width="56" height="56" rx="8" fill="${C.panel2}" stroke="${C.line}"/>` + icon(n.ic, x + 22, y + 26, 1.67, C.acc, 1.5);
    boxes += text(x + 84, y + 38, n.name, { size: 16, fill: C.fg, weight: 700 }) + text(x + 84, y + 58, n.tag, { size: 12, fill: C.dim }) + text(x + 84, y + 76, n.url, { size: 11, fill: C.mute });
  });
  const hub = `<rect x="400" y="${HY - 50}" width="200" height="100" rx="8" fill="${C.panel}" stroke="${C.acc}" stroke-opacity=".7"><animate attributeName="stroke-opacity" values=".7;.25;.7" dur="4s" repeatCount="indefinite"/></rect>` +
    text(500, HY - 24, 'HOLDING', { size: 11, fill: C.acc, anchor: 'middle' }) + text(500, HY + 6, 'C.IAUTOMATIZA', { size: 18, fill: C.fg, weight: 700, anchor: 'middle' }) +
    text(500, HY + 32, 'ciautomatiza.com.br', { size: 11, fill: C.dim, anchor: 'middle' });
  return svg(W, H, 'Mapa do ecossistema: C.IAutomatiza no centro; VIRTUS e Studio Codex internos; PixelCraft Studio, REQUIEM, Gamelandia e System/DPE externos', s + paths + boxes + hub);
}

// ─────────────────────────────────────── RUNNER (minigame autoplay) ───────────────────────────────────────
export function runner() {
  const W = 1000; const H = 196; const T = 12; const v = 300; const px = 120; const gy = 136;
  const player = ['..XXXXXX..', '.XXXXXXXX.', '.XX.XX.XX.', '.XXXXXXXX.', '..XXXXXX..', '...XXXX...', '.XXXXXXXX.', 'X.XXXXXX.X'];
  const legsA = ['..XX..XX..', '..X....X..'];
  const legsB = ['...XXXX...', '...X..X...'];
  const bug = ['.X.....X.', '..X...X..', '..XXXXX..', '.XX.X.XX.', 'XXXXXXXXX', 'X.XXXXX.X', 'X.X...X.X', '..X...X..'];
  const sc = 4;
  let s = `<rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="12" fill="${C.bg}" stroke="${C.line2}"/>`;
  s += text(24, 30, 'dev-runner.exe', { size: 12, fill: C.dim }) + text(W - 24, 30, 'autoplay  |  sem bugs em produção', { size: 12, fill: C.mute, anchor: 'end' });
  s += `<path d="M24 ${gy + 40}H${W - 24}" stroke="${C.line2}"/>`;
  // chão em movimento
  let dashes = ''; for (let x = 0; x < W + 120; x += 60) dashes += `<rect x="${x}" y="${gy + 48}" width="16" height="2" fill="${C.line2}"/>`;
  s += `<g>${dashes}${animT('translate', [[0, '0 0'], [0.2, '-60 0']], 0.2)}</g>`;
  // obstáculos e saltos
  const spawn = [0.3, 3.5, 6.4, 8.6]; const travel = (W + 70) / v; const jumps = [[0, 0]];
  spawn.forEach((t) => {
    const pts = [[0, W + 10], [t, W + 10], [t + travel, -60], [T, -60]].map(([a, b]) => [a, `${b} 0`]);
    s += `<g transform="translate(0,${gy + 40 - bug.length * sc})"><g>${sprite(bug, { s: sc, fill: C.err })}${animT('translate', pts, T)}</g></g>`;
    const tc = t + (W + 10 - px - 20) / v;
    [[-0.45, 0], [-0.3, -40], [-0.15, -58], [0, -64], [0.15, -58], [0.3, -40], [0.45, 0]].forEach(([d, y]) => jumps.push([tc + d, `0 ${y}`]));
  });
  jumps[0] = [0, '0 0'];
  const pyBase = gy + 40 - (player.length + 2) * sc;
  s += `<g transform="translate(${px},${pyBase})"><g>${animT('translate', jumps, T)}` +
    sprite(player, { s: sc, fill: C.acc }) +
    `<g transform="translate(0,${player.length * sc})">${sprite(legsA, { s: sc, fill: C.acc })}${anim('opacity', [[0, 1], [0.12, 0]].concat([]), 0.24)}</g>` +
    `<g transform="translate(0,${player.length * sc})" opacity="0">${sprite(legsB, { s: sc, fill: C.acc })}${anim('opacity', [[0, 0], [0.12, 1]], 0.24)}</g></g></g>`;
  // placar: dígitos alternados a cada desvio
  let hud = text(24, 62, 'bugs desviados:', { size: 14, fill: C.dim });
  const marks = spawn.map((t) => t + (W + 10 - px - 20) / v + 0.05);
  for (let n = 0; n <= spawn.length; n++) {
    const on = n === 0 ? [[0, 1], [marks[0], 0]] : [[0, 0], [marks[n - 1], 1]].concat(n < spawn.length ? [[marks[n], 0]] : []);
    hud += `<text x="${24 + textW('bugs desviados: ', 14)}" y="62" font-family="'Courier New',monospace" font-size="14" font-weight="700" fill="${C.acc}" opacity="${n === spawn.length ? 0 : (n === 0 ? 1 : 0)}">${n}${anim('opacity', on, T)}</text>`;
  }
  s += hud;
  return svg(W, H, 'Minigame automático: um dev pixel-art desvia de bugs', s);
}

// ─────────────────────────────────────── BUG HUNT (minigame autoplay) ───────────────────────────────────────
export function bugHunt() {
  const W = 1000; const H = 220; const T = 14; const sc = 3; const cols = 6; const rows = 2; const gx = 58;
  const bug = ['..X.....X..', '...X...X...', '..XXXXXXX..', '.XX.XXX.XX.', 'XXXXXXXXXXX', 'X.XXXXXXX.X', 'X.X.....X.X', '...XX.XX...'];
  const ship = ['....X....', '...XXX...', 'XXXXXXXXX', 'XXXXXXXXX'];
  const ew = 11 * sc; const x0 = (W - ((cols - 1) * gx + ew)) / 2; const ey = (r) => 58 + r * 40; const shipY = 170; const sw = 9 * 5;
  let s = `<rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="12" fill="${C.bg}" stroke="${C.line2}"/>`;
  s += text(24, 30, 'bug-hunt.exe', { size: 12, fill: C.dim }) + text(W - 24, 30, 'autoplay  |  caçando bugs', { size: 12, fill: C.mute, anchor: 'end' });
  const order = [[1, 0], [0, 1], [3, 0], [2, 1], [5, 0], [4, 1], [1, 1], [0, 0], [3, 1], [2, 0], [5, 1], [4, 0]]; // [col,row]
  const step = 1.0; const start = 1.0; const hits = [];
  const shipPts = [[0, `${x0 + 2 * gx + ew / 2 - sw / 2} 0`]]; const cx = (c) => x0 + c * gx + ew / 2 - sw / 2;
  order.forEach(([c, r], k) => {
    const t = start + k * step; hits.push(t + 0.62);
    shipPts.push([t - 0.4, k === 0 ? `${cx(c)} 0` : `${cx(order[k - 1][0])} 0`], [t, `${cx(c)} 0`]);
  });
  shipPts.push([start + order.length * step + 0.5, `${cx(order[order.length - 1][0])} 0`]);
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const k = order.findIndex(([cc, rr]) => cc === c && rr === r);
    s += `<g transform="translate(${x0 + c * gx},${ey(r)})"><g>${sprite(bug, { s: sc, fill: C.err })}${anim('opacity', [[0, 1], [hits[k], 0]], T)}</g></g>`;
    const t = start + k * step; const bx = x0 + c * gx + ew / 2 - 1.5;
    s += `<rect x="${f(bx)}" y="${shipY}" width="3" height="10" fill="${C.acc}" opacity="0">${anim('opacity', [[0, 0], [t + 0.05, 1], [t + 0.6, 0]], T)}${anim('y', [[0, shipY], [t + 0.05, shipY], [t + 0.6, ey(r) + 10], [T, ey(r) + 10]], T, { calc: 'linear' })}</rect>`;
    s += `<rect x="${f(bx - 8)}" y="${ey(r) + 4}" width="19" height="19" fill="none" stroke="${C.acc}" opacity="0">${anim('opacity', [[0, 0], [t + 0.62, 0.9], [t + 0.85, 0]], T)}</rect>`;
  }
  s += `<g transform="translate(0,${shipY + 6})"><g>${animT('translate', shipPts, T)}${sprite(ship, { s: 5, fill: C.acc })}</g></g>`;
  s += `<path d="M24 ${shipY + 38}H${W - 24}" stroke="${C.line2}"/>`;
  let hud = text(24, 62, 'bugs eliminados:', { size: 14, fill: C.dim });
  const tx = 24 + textW('bugs eliminados: ', 14);
  for (let n = 0; n <= order.length; n++) {
    const on = [[0, n === 0 ? 1 : 0]];
    if (n > 0) on.push([hits[n - 1], 1]); else on.push([hits[0], 0]);
    if (n > 0 && n < order.length) on.push([hits[n], 0]);
    hud += `<text x="${tx}" y="62" font-family="'Courier New',monospace" font-size="14" font-weight="700" fill="${C.acc}" opacity="${n === 0 ? 1 : 0}">${n}${anim('opacity', on, T)}</text>`;
  }
  hud += text(tx + 24, 62, '/ 12', { size: 14, fill: C.mute });
  return svg(W, H, 'Minigame automático: uma nave pixel-art elimina bugs', s + hud);
}
