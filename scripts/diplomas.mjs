// otorga diplomas de reconocimiento a los hermanos registrados.
// primer diploma: más de 1,000 contribuciones en los últimos 365 días (las visibles en su perfil de github).
// un diploma otorgado no se retira.
import fs from 'node:fs';

const TOKEN = process.env.GITHUB_TOKEN;
const rutaM = 'data/miembros.json';
const reg = JSON.parse(fs.readFileSync(rutaM, 'utf8'));
const { diplomas } = JSON.parse(fs.readFileSync('data/diplomas.json', 'utf8'));
const mil = diplomas.find(d => d.id === 'mil-contribuciones');

async function contribuciones(usuario) {
  const hasta = new Date();
  const desde = new Date(hasta.getTime() - 365 * 24 * 3600 * 1000);
  const query = `query($u:String!,$from:DateTime!,$to:DateTime!){user(login:$u){contributionsCollection(from:$from,to:$to){contributionCalendar{totalContributions}}}}`;
  const r = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables: { u: usuario, from: desde.toISOString(), to: hasta.toISOString() } })
  });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  const j = await r.json();
  if (j.errors) throw new Error(j.errors[0].message);
  return j.data.user.contributionsCollection.contributionCalendar.totalContributions;
}

let numero = reg.miembros.flatMap(m => m.diplomas || []).reduce((a, d) => Math.max(a, d.numero || 0), 0);
let otorgados = 0;
for (const m of reg.miembros) {
  m.diplomas = m.diplomas || [];
  if (m.diplomas.some(d => d.id === mil.id)) { console.log(`@${m.usuario}: ya tiene ${mil.id}`); continue; }
  try {
    const n = await contribuciones(m.usuario);
    if (n > mil.umbral) {
      m.diplomas.push({ id: mil.id, numero: ++numero, fecha: new Date().toISOString().slice(0, 10), valor: n });
      otorgados++;
      console.log(`@${m.usuario}: ${n} contribuciones -> diploma ${mil.id} N.° ${numero}`);
    } else console.log(`@${m.usuario}: ${n} contribuciones (faltan ${mil.umbral + 1 - n})`);
  } catch (e) { console.log(`@${m.usuario}: no se pudo consultar (${e.message})`); }
}
if (otorgados) fs.writeFileSync(rutaM, JSON.stringify(reg, null, 2) + '\n');
console.log(`${otorgados} diplomas otorgados`);
