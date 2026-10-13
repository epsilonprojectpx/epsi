(() => {
  const REPO = 'kisnner26/epsi';
  const $ = (s, r = document) => r.querySelector(s);

  /* música: sin botón para apagarla. arranca sola; si el navegador lo bloquea,
     arranca con la primera interacción, y se reanuda si algo la pausa */
  const aud = $('#aud');
  aud.volume = .5;
  const play = () => { if (aud.paused) aud.play().catch(() => {}); };
  play();
  ['pointerdown', 'keydown', 'touchstart', 'scroll', 'wheel'].forEach(ev =>
    addEventListener(ev, play, { passive: true }));
  aud.addEventListener('pause', () => { if (!aud.ended) setTimeout(play, 50); });
  document.addEventListener('visibilitychange', play);

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

  /* testimonios: contribuidores reales del repo */
  const wall = $('#wall');
  fetch(`https://api.github.com/repos/${REPO}/contributors?per_page=40`)
    .then(r => r.ok ? r.json() : Promise.reject())
    .then(list => {
      const people = (Array.isArray(list) ? list : []).filter(u => u.type === 'User');
      if (!people.length) { wall.innerHTML = '<span class="empty">Aún nadie ha cruzado la puerta. Sé el primero.</span>'; return; }
      wall.innerHTML = '';
      people.forEach(u => {
        const a = document.createElement('a');
        a.href = u.html_url; a.target = '_blank'; a.rel = 'noopener';
        const img = new Image(); img.src = u.avatar_url + '&s=140'; img.alt = ''; img.loading = 'lazy';
        a.append(img, document.createTextNode(u.login));
        wall.append(a);
      });
    })
    .catch(() => { wall.innerHTML = '<span class="empty">Los fieles meditan. Vuelve en un momento.</span>'; });

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

  /* solicitud: abre un issue prellenado, el usuario decide enviarlo */
  $('#apply').addEventListener('submit', e => {
    e.preventDefault();
    const user = $('#u').value.trim(), why = $('#m').value.trim();
    const title = `juramento de ingreso: @${user}`;
    const body = `usuario: @${user}\n\n¿qué carga quieres entregar al Padre?\n${why || 'pensar demasiado.'}\n\nkifflom.`;
    window.open(`https://github.com/${REPO}/issues/new?title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`, '_blank', 'noopener');
  });

  $('#yr').textContent = new Date().getFullYear();
})();
