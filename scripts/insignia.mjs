// genera una insignia svg por miembro a partir de data/miembros.json
import fs from 'node:fs';
import { pathToFileURL } from 'node:url';

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export function insignia({ numero, grado }) {
  const derecha = `HERMANO N.° ${numero} · ${grado}`.toUpperCase();
  const wl = 56;
  const tr = Math.round(derecha.length * 8.2);
  const wr = tr + 24;
  const w = wl + wr;
  const etiqueta = `epsi: hermano N.° ${numero}, grado ${grado}`;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="24" viewBox="0 0 ${w} 24" role="img" aria-label="${esc(etiqueta)}">
<title>${esc(etiqueta)}</title>
<rect width="${w}" height="24" rx="4" fill="#87a5d6"/>
<path d="M4 0h${wl - 4}v24H4a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4z" fill="#1f4f82"/>
<g font-family="Georgia,'Times New Roman',serif" font-size="11" font-weight="700" text-anchor="middle" >
<text x="${wl / 2}" y="16" fill="#ffffff" textLength="34" lengthAdjust="spacingAndGlyphs">EPSI</text>
<text x="${wl + wr / 2}" y="16" fill="#12304f" textLength="${tr}" lengthAdjust="spacingAndGlyphs">${esc(derecha)}</text>
</g>
</svg>
`;
}

export function generarTodas(ruta = 'data/miembros.json', salida = 'badges') {
  const { miembros } = JSON.parse(fs.readFileSync(ruta, 'utf8'));
  fs.mkdirSync(salida, { recursive: true });
  for (const m of miembros) fs.writeFileSync(`${salida}/${m.usuario.toLowerCase()}.svg`, insignia(m));
  return miembros.length;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  console.log(`${generarTodas()} insignias generadas`);
}
