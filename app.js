(() => {
  const REPO = 'kisnner26/epsi';
  const $ = (s, r = document) => r.querySelector(s);

  /* música */
  const aud = $('#aud'), music = $('#music');
  music.addEventListener('click', () => {
    if (aud.paused) {
      aud.volume = .5;
      aud.play().then(() => { music.setAttribute('aria-pressed', 'true'); music.textContent = 'música: sí'; }).catch(() => {});
    } else {
      aud.pause(); music.setAttribute('aria-pressed', 'false'); music.textContent = 'música: no';
    }
  });

  /* pie de foto del rostro: cambia cada pocos segundos, como en el original */
  const caps = [
    'Posible descendiente de Kraff.',
    'Antes pensaba mucho.',
    'Hermano-padre, nivel 4.',
    'Nunca ha leído un pull request.',
    'Ya no hace preguntas.'
  ];
  let ci = 0;
  setInterval(() => { ci = (ci + 1) % caps.length; $('#caption').textContent = caps[ci]; }, 4500);

  /* testimonios: contribuidores reales del repo */
  const wall = $('#wall');
  fetch(`https://api.github.com/repos/${REPO}/contributors?per_page=40`)
    .then(r => r.ok ? r.json() : Promise.reject())
    .then(list => {
      const people = (Array.isArray(list) ? list : []).filter(u => u.type === 'User');
      if (!people.length) { wall.innerHTML = '<span class="empty">aún nadie. sé el primero.</span>'; return; }
      wall.innerHTML = '';
      people.forEach(u => {
        const a = document.createElement('a');
        a.href = u.html_url; a.target = '_blank'; a.rel = 'noopener';
        const img = new Image(); img.src = u.avatar_url + '&s=140'; img.alt = ''; img.loading = 'lazy';
        a.append(img, document.createTextNode(u.login));
        wall.append(a);
      });
    })
    .catch(() => { wall.innerHTML = '<span class="empty">los devotos están meditando. vuelve en un momento.</span>'; });

  /* test */
  const QS = [
    ['¿qué haces cuando el código falla?', ['lo leo con calma y busco la causa', 'pregunto en un foro', 'lo hago commit y confío', 'lo cierro y lo olvido']],
    ['¿cómo revisas un pull request?', ['línea por línea', 'leo el título', 'lo apruebo antes de abrirlo', 'no lo reviso, lo siento']],
    ['¿qué opinas de pensar?', ['es esencial', 'a veces cansa', 'es el origen de mis problemas', 'ya no lo hago']],
    ['elige una palabra', ['por qué', 'quizá', 'ok', 'kifflom']],
    ['¿qué haces con la documentación?', ['la leo entera', 'la hojeo', 'la escribo yo', 'la documentación es la túnica']],
    ['¿quién es el padre-padre?', ['no lo sé', 'el dueño del repo', 'el hermano-tío', 'el que todo lo ve']]
  ];
  const RANKS = [
    ['buscador', 'aún piensas demasiado. sigue por aquí, algo se te va a contagiar.'],
    ['devoto', 'ya hay luz en ti. un pull request más y no harás preguntas.'],
    ['iluminado', 'casi libre de pensamiento. la rama principal te espera.'],
    ['hermano-padre', 'felicidades. ya no piensas. nosotros lo hacemos por ti.']
  ];
  const quiz = $('#quiz');
  let qi = 0, score = 0;
  const render = () => {
    if (qi >= QS.length) {
      const max = QS.length * 3;
      const [name, txt] = RANKS[score === max ? 3 : Math.min(2, Math.floor(score / max * 4))];
      quiz.innerHTML = `<div class="res"><div class="step">tu rango</div><div class="big"></div><p></p>
        <a class="pill green" href="#contacto">APLICA AHORA</a><button class="again" id="again">repetir</button></div>`;
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
    const title = `solicitud de ingreso: @${user}`;
    const body = `usuario: @${user}\n\n¿por qué quieres soltar el pensamiento?\n${why || 'porque sí.'}\n\nkifflom.`;
    window.open(`https://github.com/${REPO}/issues/new?title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`, '_blank', 'noopener');
  });

  $('#yr').textContent = new Date().getFullYear();
})();
