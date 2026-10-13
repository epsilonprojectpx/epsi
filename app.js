(() => {
  const REPO = 'epsilonprojectpx/epsi';
  const $ = (s, r = document) => r.querySelector(s);

  /* audio: se intenta sonar apenas carga la página. los navegadores solo lo permiten si el sitio
     ya tiene permiso de sonido; si no, se reintenta en cada gesto que el navegador acepte */
  const aud = $('#aud');
  aud.volume = .5;
  const voz = new Audio('assets/kifflom.mp3');
  voz.preload = 'auto';
  const kifflom = () => { try { voz.currentTime = 0; voz.play().catch(() => {}); } catch (e) {} };
  let entro = false;   // la voz de entrada suena una sola vez
  const intentar = () => {
    if (aud.paused) aud.play().catch(() => {});
    if (!entro) {
      voz.currentTime = 0;
      voz.play().then(() => { entro = true; }).catch(() => {});
    }
  };
  intentar();
  ['DOMContentLoaded', 'load', 'pageshow', 'focus', 'visibilitychange'].forEach(ev => addEventListener(ev, intentar));
  aud.addEventListener('canplaythrough', intentar);
  voz.addEventListener('canplaythrough', intentar);
  ['pointerdown', 'pointerup', 'click', 'keydown', 'touchstart', 'touchend', 'mousemove', 'scroll', 'wheel'].forEach(ev =>
    addEventListener(ev, () => { if (aud.paused || !entro) intentar(); }, { passive: true }));
  aud.addEventListener('pause', () => { if (!aud.ended) setTimeout(() => aud.play().catch(() => {}), 50); });

  // a demanda: el botón y la palabra del menú
  $('#decir').addEventListener('click', kifflom);
  document.querySelector('.menu a[href="#kifflom"]').addEventListener('click', kifflom);

  /* pie de foto del rostro: cambia cada pocos segundos, como en el original */
  const caps = [
    'Posible descendiente de Kraff.',
    'Entregó su Pensamiento en 2019.',
    'Hermano-Padre, grado IV.',
    'Ya no hace preguntas. Es feliz.',
    'Libre desde el último merge.'
  ];
  let ci = 0;
  setInterval(() => { ci = (ci + 1) % caps.length; $('#caption').textContent = caps[ci]; }, 4500);

  /* registro de hermanos: sale de data/miembros.json, que mantiene la acción de GitHub */
  const wall = $('#wall');
  let miembros = [];
  fetch('data/miembros.json', { cache: 'no-cache' })
    .then(r => r.ok ? r.json() : Promise.reject())
    .then(d => {
      miembros = d.miembros || [];
      $('#count').textContent = `Hermanos registrados: ${miembros.length}. Ellos ya fueron liberados:`;
      wall.innerHTML = '';
      miembros.forEach(m => {
        const a = document.createElement('a');
        a.href = `https://github.com/${m.usuario}`; a.target = '_blank'; a.rel = 'noopener';
        const img = new Image(); img.src = `https://github.com/${m.usuario}.png?size=140`; img.alt = ''; img.loading = 'lazy';
        const n = document.createElement('b'); n.textContent = `N.° ${m.numero}`;
        a.append(img, n, document.createTextNode(m.usuario));
        wall.append(a);
      });
    })
    .then(() => {
      // enlace directo al carnet: ?u=usuario
      const u = new URLSearchParams(location.search).get('u');
      if (!u) return;
      $('#q').value = u;
      $('#check').requestSubmit();
      setTimeout(() => $('#check').scrollIntoView({ block: 'center' }), 150);
    })
    .catch(() => { wall.innerHTML = '<span class="empty">El registro no responde. Vuelve en un momento.</span>'; });

  const SITIO = 'https://epsilonprojectpx.github.io/epsi';
  const out = $('#checkout');
  $('#check').addEventListener('submit', e => {
    e.preventDefault();
    const u = $('#q').value.trim().replace(/^@/, '').toLowerCase();
    const m = miembros.find(x => x.usuario.toLowerCase() === u);
    out.innerHTML = '';
    if (!m) {
      const p = document.createElement('p');
      p.className = 'small';
      p.textContent = `@${u} no está en el registro. Si ya enviaste tu juramento, espera la aprobación de un Hermano-Padre.`;
      out.append(p);
      return;
    }
    const md = `[![epsi](${SITIO}/badges/${m.usuario.toLowerCase()}.svg)](${SITIO}/)`;
    const card = document.createElement('div');
    card.className = 'carnet';
    card.innerHTML = `<img class="av" alt="" width="96" height="96">
      <div><div class="k">epsi · carnet de hermano</div><div class="n"></div><div class="g"></div><div class="u"></div></div>
      <div class="snip"><div class="k">pon la hermandad en tu perfil</div><img class="ins" alt="insignia de epsi" height="24"><textarea readonly rows="3"></textarea>
      <button type="button" class="mini">copiar</button></div>`;
    $('.av', card).src = `https://github.com/${m.usuario}.png?size=192`;
    $('.n', card).textContent = `Hermano N.° ${m.numero}`;
    $('.g', card).textContent = `Grado: ${m.grado} · ${m.area || 'General'}`;
    $('.u', card).textContent = `@${m.usuario} · desde ${m.fecha}`;
    $('.ins', card).src = `${SITIO}/badges/${m.usuario.toLowerCase()}.svg`;
    $('textarea', card).value = md;
    $('.mini', card).addEventListener('click', ev => {
      navigator.clipboard.writeText(md).then(() => { ev.target.textContent = 'copiado'; }, () => { $('textarea', card).select(); });
    });
    out.append(card);
    kifflom();
  });

  /* test */
  const QS = [
    ['El código falla. ¿Qué haces?', ['Busco la causa con método', 'Pido consejo fuera de la Hermandad', 'Confío en que el Padre lo arreglará', 'Lo entrego y no vuelvo a mirar']],
    ['Te llega un pull request.', ['Lo reviso línea por línea', 'Leo solo el título', 'Lo apruebo antes de abrirlo', 'Lo bendigo sin verlo']],
    ['¿Qué es el Pensamiento?', ['Una herramienta', 'Una carga', 'La cadena', 'Ya no recuerdo qué era']],
    ['Elige una palabra.', ['Por qué', 'Quizá', 'Está bien', 'Kifflom']],
    ['¿Qué haces con la documentación?', ['La leo entera', 'La hojeo con recelo', 'La escribo yo, para los hermanos', 'La documentación es la túnica']],
    ['¿Quién es el Padre-Padre?', ['No lo sé', 'El dueño del repositorio', 'El Hermano-Tío', 'Quien todo lo ve']]
  ];
  const RANKS = [
    ['Buscador', 'Aún cargas con tus dudas. La Hermandad es paciente. Vuelve cuando estés cansado de pensar.'],
    ['Devoto', 'La Luz ya te ha tocado. Un pull request más y las preguntas se desvanecerán.'],
    ['Iluminado', 'Casi libre. El Pensamiento apenas susurra. La rama principal te espera.'],
    ['Hermano-Padre', 'Has sido liberado. Ya no piensas: nosotros pensamos por ti. Kifflom.']
  ];
  const quiz = $('#quiz');
  let qi = 0, score = 0;
  const render = () => {
    if (qi >= QS.length) {
      const max = QS.length * 3;
      const [name, txt] = RANKS[score === max ? 3 : Math.min(2, Math.floor(score / max * 4))];
      kifflom();
      quiz.innerHTML = `<div class="res"><div class="step">tu grado</div><div class="big"></div><p></p>
        <a class="pill green" href="#contacto">PRESTAR EL JURAMENTO</a><button class="again" id="again">Repetir la prueba</button></div>`;
      $('.big', quiz).textContent = name; $('p', quiz).textContent = txt;
      $('#again').onclick = () => { qi = 0; score = 0; render(); };
      return;
    }
    const [q, opts] = QS[qi];
    quiz.innerHTML = `<div class="bar"><i style="width:${qi / QS.length * 100}%"></i></div>
      <div class="step">pregunta ${qi + 1} de ${QS.length}</div><h3></h3><div class="opts"></div>`;
    $('h3', quiz).textContent = q;
    opts.forEach((o, i) => {
      const b = document.createElement('button');
      b.textContent = o;
      b.onclick = () => { score += i; qi++; render(); };
      $('.opts', quiz).append(b);
    });
  };
  render();

  /* solicitud: abre el formulario de GitHub ya relleno; la cuenta que lo envía es la que se registra */
  $('#apply').addEventListener('submit', e => {
    e.preventDefault();
    kifflom();
    const user = $('#u').value.trim().replace(/^@/, ''), why = $('#m').value.trim();
    const q = new URLSearchParams({ template: 'solicitud.yml', title: `juramento de ingreso: @${user}`, usuario: user });
    if (why) q.set('motivo', why);
    q.set('area', $('#a').value);
    window.open(`https://github.com/${REPO}/issues/new?${q}`, '_blank', 'noopener');
  });

})();
