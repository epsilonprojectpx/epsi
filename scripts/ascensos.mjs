// sube de grado a los miembros según pull requests fusionados en el repo.
// 1 fusionado = Devoto, 3 = Iluminado. Hermano-Padre lo concede un hermano-padre a mano; nunca se baja de grado.
import fs from 'node:fs';
import { generarTodas } from './insignia.mjs';

const REPO = process.env.REPO || 'kisnner26/epsi';
const TOKEN = process.env.GITHUB_TOKEN;
const ORDEN = ['Buscador', 'Devoto', 'Iluminado', 'Hermano-Padre'];
const gradoPara = n => (n >= 3 ? 'Iluminado' : n >= 1 ? 'Devoto' : 'Buscador');

const ruta = 'data/miembros.json';
const reg = JSON.parse(fs.readFileSync(ruta, 'utf8'));
let cambios = 0;

for (const m of reg.miembros) {
  if (m.grado === 'Hermano-Padre') continue;
  const q = encodeURIComponent(`repo:${REPO} is:pr is:merged author:${m.usuario}`);
  const r = await fetch(`https://api.github.com/search/issues?q=${q}&per_page=1`, {
    headers: { Authorization: `Bearer ${TOKEN}`, Accept: 'application/vnd.github+json' }
  });
  if (!r.ok) { console.log(`@${m.usuario}: error ${r.status}`); continue; }
  const { total_count } = await r.json();
  const nuevo = gradoPara(total_count);
  if (ORDEN.indexOf(nuevo) > ORDEN.indexOf(m.grado)) {
    console.log(`@${m.usuario}: ${m.grado} -> ${nuevo} (${total_count} PR fusionados)`);
    m.grado = nuevo; cambios++;
  } else console.log(`@${m.usuario}: sigue ${m.grado} (${total_count} PR fusionados)`);
}
if (cambios) fs.writeFileSync(ruta, JSON.stringify(reg, null, 2) + '\n');
generarTodas();
console.log(`${cambios} ascensos`);
