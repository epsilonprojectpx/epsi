(() => {
  const REPO = 'kisnner26/epsi';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  const aud = $('#aud'), music = $('#music');
  const setMusic = on => {
    if (on) { aud.volume = .5; aud.play().then(() => music.setAttribute('aria-pressed', 'true')).catch(() => {}); }
    else { aud.pause(); music.setAttribute('aria-pressed', 'false'); }
  };
  music.addEventListener('click', () => setMusic(aud.paused));

  /* puerta */
  const gate = $('#gate');
  const open = withMusic => {
    gate.classList.add('out');
    document.body.classList.remove('locked');
    if (withMusic) setMusic(true);
    try { sessionStorage.setItem('epsi-in', '1'); } catch (e) {}
  };
  let seen = false;
  try { seen = sessionStorage.getItem('epsi-in') === '1'; } catch (e) {}
  if (location.search.includes('nogate')) seen = true;
  if (seen) { gate.classList.add('out'); document.body.classList.remove('locked'); }
  $('#enter').addEventListener('click', () => open(true));
  $('#enterQuiet').addEventListener('click', () => open(false));

  /* menú */
  const menu = $('#menu'), burger = $('#burger');
  burger.addEventListener('click', () => {
    const o = menu.classList.toggle('open');
    burger.setAttribute('aria-expanded', o);
  });
  menu.addEventListener('click', e => { if (e.target.tagName === 'A') menu.classList.remove('open'); });

  /* progreso y sección activa */
  const bar = $('#progress');
  addEventListener('scroll', () => {
    const h = document.documentElement;
    bar.style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight) * 100) + '%';
  }, { passive: true });
  const links = $$('#menu a');
  const spy = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) links.forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id));
  }), { rootMargin: '-45% 0px -50% 0px' });
  links.forEach(a => { const s = $(a.getAttribute('href')); if (s) spy.observe(s); });

  /* revelado */
  const rv = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); rv.unobserve(e.target); }
  }), { threshold: .12 });
  $$('.rv').forEach(el => rv.observe(el));

  /* contadores */
  const counts = { stars: 0, forks: 0, devotos: 0, pensamientos: 0 };
  const paint = () => $$('[data-k]').forEach(el => {
    const to = counts[el.dataset.k], from = +el.textContent || 0, t0 = performance.now();
    const step = t => {
      const p = Math.min((t - t0) / 900, 1);
      el.textContent = Math.round(from + (to - from) * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });
  let painted = false;
  const statsObs = new IntersectionObserver(es => {
    if (es[0].isIntersecting && !painted) { painted = true; paint(); }
  }, { threshold: .3 });
  statsObs.observe($('.stats'));

  fetch(`https://api.github.com/repos/${REPO}`)
    .then(r => r.ok ? r.json() : Promise.reject())
    .then(d => { counts.stars = d.stargazers_count; counts.forks = d.forks_count; if (painted) paint(); })
    .catch(() => {});

  /* devotos */
  const wall = $('#wall');
  fetch(`https://api.github.com/repos/${REPO}/contributors?per_page=40`)
    .then(r => r.ok ? r.json() : Promise.reject())
    .then(list => {
      const people = (Array.isArray(list) ? list : []).filter(u => u.type === 'User');
      counts.devotos = people.length;
      if (painted) paint();
      if (!people.length) { wall.innerHTML = '<span class="empty">aún nadie. sé el primero.</span>'; return; }
      wall.innerHTML = '';
      people.forEach(u => {
        const a = document.createElement('a');
        a.href = u.html_url; a.target = '_blank'; a.rel = 'noopener';
        const img = new Image(); img.src = u.avatar_url + '&s=168'; img.alt = ''; img.loading = 'lazy';
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
      const idx = Math.min(3, Math.floor(score / (QS.length * 3) * 4));
      const [name, txt] = RANKS[score === QS.length * 3 ? 3 : idx];
      quiz.innerHTML = `<div class="res"><div class="step">tu rango</div><div class="big">${name}</div><p>${txt}</p>
        <a class="btn" href="#unirse">aplicar ahora</a> <button class="btn ghost" id="again">repetir</button></div>`;
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

  /* formulario: abre una solicitud prellenada en github */
  $('#apply').addEventListener('submit', e => {
    e.preventDefault();
    const user = $('#u').value.trim(), why = $('#m').value.trim();
    const title = `solicitud de ingreso: @${user}`;
    const body = `usuario: @${user}\n\n¿por qué quieres soltar el pensamiento?\n${why || 'porque sí.'}\n\nkifflom.`;
    const url = `https://github.com/${REPO}/issues/new?title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`;
    open_(url);
  });
  const open_ = u => window.open(u, '_blank', 'noopener');

  /* contador de pensamientos: baja con el scroll */
  addEventListener('scroll', () => {
    const h = document.documentElement;
    const p = h.scrollTop / (h.scrollHeight - h.clientHeight);
    counts.pensamientos = Math.max(0, Math.round(100 * (1 - p)));
    if (painted) { const el = $('[data-k="pensamientos"]'); el.textContent = counts.pensamientos; }
  }, { passive: true });
  counts.pensamientos = 100;

  $('#yr').textContent = new Date().getFullYear();
})();
