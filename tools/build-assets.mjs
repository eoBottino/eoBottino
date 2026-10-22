// Gera todos os SVGs do perfil (nenhuma dependência externa).  Uso:  node tools/build-assets.mjs
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { banner, devConsole, pipeline, ecosystem, runner, bugHunt } from './scenes.mjs';
import { projectCard, button, navButton, divider, footer, chips, stackPanel } from './cards.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = (p, data) => { const file = join(root, p); mkdirSync(dirname(file), { recursive: true }); writeFileSync(file, data); console.log('ok', p, `(${(data.length / 1024).toFixed(1)} KB)`); };

out('assets/banner.svg', banner());
out('assets/chips.svg', chips(['FULL-STACK', 'ESTUDANTE DE ADS', 'CEO @ C.IAUTOMATIZA', 'CTO @ PIXELCRAFT', 'BRASIL']));
out('assets/divider.svg', divider());
out('assets/footer.svg', footer());
out('assets/ecosystem.svg', ecosystem());
out('assets/console.svg', devConsole());
out('assets/pipeline.svg', pipeline());
out('assets/runner.svg', runner());
out('assets/bughunt.svg', bugHunt());
out('assets/stack.svg', stackPanel([
  ['LINGUAGENS E FRONT-END', ['JavaScript', 'TypeScript', 'React', 'Python', 'PHP', 'HTML5', 'CSS3']],
  ['BACK-END E BANCOS', ['Node.js', 'Express', 'FastAPI', 'MySQL', 'SQLite']],
  ['INTEGRAÇÕES', ['Riot API', 'Discord Bots', 'WhatsApp', 'Android APK']],
  ['FERRAMENTAS', ['VS Code', 'Git', 'GitHub', 'Docker', 'Linux', 'Windows', 'Figma']],
]));

const cards = {
  ciautomatiza: { ic: 'flow', title: 'C.IAUTOMATIZA', sub: 'CEO & Dev  |  automação, SaaS e segurança', kind: 'EMPRESA', url: 'ciautomatiza.com.br' },
  pixelcraft: { ic: 'pixels', title: 'PIXELCRAFT STUDIO', sub: 'CTO & Dev  |  sistemas e experiências digitais', kind: 'EMPRESA', url: 'pixelcraft-studio.com' },
  virtus: { ic: 'shield', title: 'VIRTUS', sub: 'cybersecurity  |  segurança e integridade de sistemas', kind: 'INTERNO C.IA' },
  codex: { ic: 'code', title: 'STUDIO CODEX', sub: 'Dev  |  scripts, sistemas, jogos e plataformas de API', kind: 'INTERNO C.IA' },
  requiem: { ic: 'swords', title: 'REQUIEM INHOUSE', sub: 'antigo ARISE Inhouse  |  League of Legends', kind: 'EXTERNO', url: 'requiem.discloud.app' },
  gamelandia: { ic: 'pad', title: 'GAMELANDIA', sub: 'ecossistema Riot API  |  LoL, Valorant e mais', kind: 'EXTERNO' },
  system: { ic: 'db', title: 'SYSTEM  /  DPE', sub: 'intranet, banco de dados e automação', kind: 'EXTERNO', url: 'systemdpe.com' },
};
for (const [k, v] of Object.entries(cards)) out(`assets/cards/${k}.svg`, projectCard(v));

const nav = [['portfolio', '01', 'PORTFÓLIO'], ['ecossistema', '02', 'ECOSSISTEMA'], ['projetos', '03', 'PROJETOS'], ['stack', '04', 'STACK'], ['lab', '05', 'LAB'], ['contato', '06', 'CONTATO'], ['english', '07', 'ENGLISH']];
for (const [k, n, l] of nav) out(`assets/buttons/nav-${k}.svg`, navButton(n, l)[0]);

const go = [
  ['cia', 'ciautomatiza.com.br', true], ['portfolio', 'ver portfólio', false], ['pixelcraft', 'pixelcraft-studio.com', true],
  ['requiem', 'requiem.discloud.app', true], ['dpe', 'dpe-system.discloud.dev', true], ['systemdpe', 'systemdpe.com', false],
  ['email', 'contatobottino@gmail.com', true], ['github', 'github.com/eoBottino', false], ['instagram', 'instagram.com/edubottino', false], ['discord', 'discord: eubottino', false],
];
for (const [k, l, p] of go) out(`assets/buttons/go-${k}.svg`, button(l, { primary: p })[0]);
