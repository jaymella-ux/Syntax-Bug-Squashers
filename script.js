const LANGS = ['HTML', 'CSS', 'JavaScript'];
const DIFFS = [
  { n: 'Easy', lives: 5 },
  { n: 'Medium', lives: 4 },
  { n: 'Hard', lives: 3 }
];


/* Level number = language * 3 + difficulty. Bug format: [[wrong|right|distractor|distractor]] */
const LEVELS = [
  /* HTML */
  { lang: 0, diff: 0, time: 90, lines: [
    '<!DOCTYPE html>',
    '<html>',
    '  <body>',
    '    <h1>Hello![[</h1|</h1>|</h1/>|<h1>]]',
    '    <p>I love coding.[[<p>|</p>|<\\p>|</P]]',
    '  </body>',
    '</html>'
  ]},
  { lang: 0, diff: 1, time: 75, lines: [
    '<!DOCTYPE html>',
    '<html>',
    '  <head>',
    '    [[<ttile>|<title>|<tittle>|<titel>]]Hello World</title>',
    '  </head>',
    '  <body>',
    '    <h1>Welcome![[</h1|</h1>|</h1/>|<h1>]]',
    '    <p>Squash the bugs![[<p>|</p>|<\\p>|</P]]',
    '  </body>',
    '</html>'
  ]},
  { lang: 0, diff: 2, time: 120, type: true, lines: [
    '<!DOCTYPE html>',
    '<html lang="en">',
    '  <head>',
    '    <{{title}}>My Page</title>',
    '  </{{head}}>',
    '  <body>',
    '    <img {{src}}="cat.png" alt="Cat">',
    '    <a {{href}}="home.html">Home</a>',
    '    <{{ul}}>',
    '      <li>Apple</li>',
    '    </ul>',
    '  </body>',
    '</html>'
  ]},
  /* CSS */
  { lang: 1, diff: 0, time: 90, lines: [
    'p {',
    '  [[colr|color|collor|colour]]: red;',
    '  font-size: [[18px|18px;|18px:|18px,]]',
    '}'
  ]},
  { lang: 1, diff: 1, time: 75, lines: [
    'body {',
    '  background: pink;',
    '  [[colr|color|collor|colour]]: #333;',
    '  font-size: [[16px|16px;|16px:|16px,]]',
    '}',
    '.card {',
    '  margin: 10px;',
    '  [[padding|padding:|padding;|padding=]] 20px;',
    '}'
  ]},
  { lang: 1, diff: 2, time: 120, type: true, lines: [
    '.card {',
    '  {{display}}: flex;',
    '  justify-content: {{center}};',
    '  {{background-color}}: #ffe;',
    '  {{border-radius}}: 10px;',
    '}',
    '.card:{{hover}} {',
    '  transform: {{scale}}(1.1);',
    '}'
  ]},
  /* JavaScript */
  { lang: 2, diff: 0, time: 90, lines: [
    'let score = 0;',
    '[[consol.log|console.log|conzole.log|console.lg]]("Hi");',
    '[[alret|alert|alart|allert]]("Welcome!");'
  ]},
  { lang: 2, diff: 1, time: 75, lines: [
    'let score = 0;',
    '[[funtion|function|fucntion|fuction]] start() {',
    '  [[console.lg|console.log|conso1e.log|console.logg]]("Squash them!");',
    '}',
    'if (score [[=|===|=>|:=]] 0) {',
    '  start();',
    '}'
  ]},
  { lang: 2, diff: 2, time: 120, type: true, lines: [
    'const names = ["Ana", "Ben", "Cy"];',
    '{{for}} (let i = 0; i < names.length; i++) {',
    '  console.{{log}}(names[i]);',
    '}',
    '{{const}} total = names.length;',
    'if (total {{===|==}} 3) {',
    '  console.log("Three names");',
    '}',
    '{{function}} greet(name) {',
    '  {{return}} "Hi " + name;',
    '}'
  ]}
];


const $ = s => document.querySelector(s);
const S = { level: 0, score: 0, lives: 3, maxLives: 3, combo: 0, time: 0, bugs: 0, fixed: 0, hints: 3, paused: false, active: false, timer: null, cur: null };


function load(key, fallback) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch (e) { return fallback; }
}
function save(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {}
}
let best = load('sbsBest', {});
let unlocked = load('sbsUnlocked', 1);
let curBlank = null;


function totalBest() {
  return Object.values(best).reduce((a, b) => a + b, 0);
}
$('#hiStart').textContent = totalBest();


function show(id) {
  document.querySelectorAll('.screen').forEach(e => e.classList.toggle('on', e.id === id));
  $('#ov').classList.remove('on');
}


function overlay(t, m, b, fn, showRestart) {
  $('#ovT').textContent = t; $('#ovM').textContent = m; $('#ovB').textContent = b;
  $('#ovR').style.display = showRestart ? '' : 'none';
  $('#ovB').onclick = () => { $('#ov').classList.remove('on'); fn(); };
  $('#ov').classList.add('on');
}


function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}


function showLevels() {
  clearInterval(S.timer);
  S.active = false;
  const box = $('#levelGrid');
  box.textContent = '';
  LANGS.forEach((lang, li) => {
    const row = document.createElement('div');
    row.className = 'lrow';
    const h = document.createElement('h3');
    h.textContent = lang;
    row.appendChild(h);
    const btns = document.createElement('div');
    btns.className = 'lbtns';
    DIFFS.forEach((d, di) => {
      const i = li * 3 + di;
      const b = document.createElement('button');
      b.className = 'btn lv d' + di;
      b.disabled = i >= unlocked;
      b.textContent = d.n + (i >= unlocked ? ' (locked)' : best[i] ? ' - best ' + best[i] : '');
      b.onclick = () => startLevel(i);
      btns.appendChild(b);
    });
    row.appendChild(btns);
    box.appendChild(row);
  });
  $('#hiStart').textContent = totalBest();
  show('levels');
}


function hud() {
  const lv = LEVELS[S.level];
  $('#hStage').textContent = LANGS[lv.lang] + ' - ' + DIFFS[lv.diff].n;
  $('#hScore').textContent = S.score;
  $('#hCombo').textContent = S.combo;
  const m = Math.floor(S.time / 60), s = S.time % 60;
  $('#hTime').textContent = m + ':' + String(s).padStart(2, '0');
  $('#hLives').textContent = '\u2665'.repeat(Math.max(S.lives, 0)) + '\u2661'.repeat(Math.max(S.maxLives - S.lives, 0));
  $('#hHints').textContent = S.hints;
}


function startLevel(i) {
  const lv = LEVELS[i];
  const lives = lv.type ? 5 : DIFFS[lv.diff].lives;
  const hints = lv.type ? 5 : 3;
  Object.assign(S, { level: i, score: 0, combo: 0, hints: hints, maxHints: hints, lives: lives, maxLives: lives });
  show('game');
  loadLevel();
}


function loadLevel() {
  const lv = LEVELS[S.level];
  curBlank = null;
  Object.assign(S, { time: lv.time, fixed: 0, bugs: 0, cur: null, active: true, paused: false });
  const box = $('#code');
  box.textContent = '';
  $('#fix').textContent = lv.type ? 'Fill in the blanks: type the missing code, then press Check code.' : '';
  $('#btnRun').textContent = lv.type ? 'Check code' : 'Run code';
  $('#btnRun').classList.remove('ready');
  lv.lines.forEach(ln => {
    const row = document.createElement('div');
    row.className = 'ln';
    ln.split(/(\[\[.*?\]\]|\{\{.*?\}\})/).forEach(p => {
      if (p.startsWith('[[')) {
        const [w, r, ...d] = p.slice(2, -2).split('|');
        const s = document.createElement('span');
        s.className = 'tok bug';
        s.textContent = w;
        s.dataset.fix = r;
        s.dataset.d = d.join('|');
        s.onclick = () => pickBug(s);
        row.appendChild(s);
        S.bugs++;
      } else if (p.startsWith('{{')) {
        const ans = p.slice(2, -2);
        const inp = document.createElement('input');
        inp.className = 'blank';
        inp.dataset.ans = ans;
        inp.style.width = (Math.max(...ans.split('|').map(a => a.length)) + 2) + 'ch';
        inp.autocomplete = 'off';
        inp.spellcheck = false;
        inp.setAttribute('autocapitalize', 'none');
        inp.setAttribute('aria-label', 'Type the missing code');
        inp.onfocus = () => {
            document.querySelectorAll('.blank.cur').forEach(x => x.classList.remove('cur'));
            inp.classList.add('cur');
            curBlank = inp;
        };
        inp.onkeydown = e => {
          if (e.key !== 'Enter') return;
          e.preventDefault();
          const all = [...document.querySelectorAll('input.blank:not(.ok)')];
          const next = all[all.indexOf(inp) + 1];
          if (next) next.focus();
        };
        row.appendChild(inp);
        S.bugs++;
      } else {
        p.split(/(\s+)/).forEach(t => {
          if (!t) return;
          if (/^\s+$/.test(t)) { row.appendChild(document.createTextNode(t)); return; }
          const s = document.createElement('span');
          s.className = 'tok';
          s.textContent = t;
          if (!lv.type) s.onclick = () => wrongTap(s);
          row.appendChild(s);
        });
      }
    });
    if (!row.childNodes.length) row.textContent = ' ';
    box.appendChild(row);
  });
  hud();
  clearInterval(S.timer);
  S.timer = setInterval(tick, 1000);
}


function tick() {
  if (!S.active || S.paused) return;
  S.time--;
  hud();
  if (S.time <= 0) end(false, 'Time ran out before every bug was squashed.');
}


function loseLife() {
  S.lives--;
  S.combo = 0;
  hud();
  if (S.lives <= 0) end(false, 'You ran out of hearts.');
}


function wrongTap(el) {
  if (!S.active || S.paused) return;
  el.classList.add('oops');
  setTimeout(() => el.classList.remove('oops'), 400);
  $('#fix').textContent = '';
  loseLife();
}


function pickBug(el) {
  if (!S.active || S.paused || el.classList.contains('fixed')) return;
  document.querySelectorAll('.tok.sel').forEach(e => e.classList.remove('sel'));
  el.classList.add('sel');
  el.classList.remove('hint');
  S.cur = el;
  const fx = $('#fix');
  fx.textContent = '';
  const q = document.createElement('span');
  q.className = 'q';
  q.textContent = 'Pick the fix:';
  fx.appendChild(q);
  shuffle([el.dataset.fix, ...el.dataset.d.split('|')]).forEach(opt => {
    const b = document.createElement('button');
    b.textContent = opt;
    b.onclick = () => choose(b, opt);
    fx.appendChild(b);
  });
}


function choose(btn, opt) {
  if (!S.active || S.paused || !S.cur) return;
  const el = S.cur;
  if (opt === el.dataset.fix) {
    el.textContent = opt;
    el.className = 'tok fixed';
    el.onclick = null;
    S.combo++;
    S.score += 100 * Math.min(S.combo, 5);
    S.fixed++;
    S.cur = null;
    $('#fix').textContent = '';
    if (S.fixed === S.bugs) {
      $('#btnRun').classList.add('ready');
      $('#fix').textContent = 'All bugs squashed! Press Run code.';
    }
    hud();
  } else {
    btn.disabled = true;
    loseLife();
  }
}


function hint() {
  if (!S.active || S.paused) return;
  if (S.hints <= 0) return overlay('No hints left', 'You used all ' + S.maxHints + ' hints.', 'Okay', () => {});
  if (LEVELS[S.level].type) {
        const inp = curBlank && !curBlank.classList.contains('ok') ? curBlank : null;
        if (!inp) return overlay('Pick a blank first', 'Click the box you want help with, then press Hint.', 'Okay', () => {});
        inp.value = inp.dataset.ans.split('|')[0];
        inp.classList.remove('bad', 'cur');
        inp.classList.add('ok');
        inp.readOnly = true;
        curBlank = null;
        S.fixed++;
        S.hints--;
        S.score = Math.max(0, S.score - 50);
        hud();
        if (S.fixed === S.bugs) $('#btnRun').classList.add('ready');
        const nextBlank = document.querySelector('input.blank:not(.ok)');
        if (nextBlank) nextBlank.focus();
        return;
    }
  const b = document.querySelector('.tok.bug:not(.fixed)');
  if (!b) return;
  b.classList.add('hint');
  S.hints--;
  S.score = Math.max(0, S.score - 50);
  hud();
}


function run() {
  if (!S.active || S.paused) return;
  if (LEVELS[S.level].type) return checkBlanks();
  if (S.fixed < S.bugs) return overlay('Not yet', (S.bugs - S.fixed) + ' bug(s) still hiding in the code.', 'Keep looking', () => {});
  S.score += S.time * 5;
  hud();
  end(true, 'Every bug is squashed. Your code runs perfectly.');
}


function checkBlanks() {
  let wrong = 0;
  document.querySelectorAll('input.blank:not(.ok)').forEach(inp => {
    const ok = inp.dataset.ans.split('|').includes(inp.value.trim());
    if (ok) {
      inp.classList.remove('bad');
      inp.classList.add('ok');
      inp.readOnly = true;
      S.fixed++;
      S.score += 150;
    } else {
      inp.classList.remove('bad');
      void inp.offsetWidth;
      inp.classList.add('bad');
      wrong++;
    }
  });
  hud();
  if (S.fixed === S.bugs) {
    S.score += S.time * 5;
    hud();
    end(true, 'Every blank is correct. Your code runs perfectly.');
  } else if (wrong) {
    loseLife();
  }
}


function pause() {
  if (!S.active) return;
  S.paused = true;
  overlay('Paused', 'The timer is stopped.', 'Resume', () => { S.paused = false; }, true);
}


function end(win, msg) {
  S.active = false;
  clearInterval(S.timer);
  const isNew = S.score > (best[S.level] || 0);
  if (isNew) {
    best[S.level] = S.score;
    save('sbsBest', best);
  }
  const hasNext = win && S.level + 1 < LEVELS.length;
  if (win && S.level + 2 > unlocked) {
    unlocked = Math.min(S.level + 2, LEVELS.length);
    save('sbsUnlocked', unlocked);
  }
  $('#oTitle').textContent = win ? 'Level cleared!' : 'Game over';
  $('#oMsg').textContent = win && !hasNext ? 'You beat every level. Great job!' : msg;
  $('#oScore').textContent = S.score;
  $('#oHigh').textContent = best[S.level] || 0;
  $('#oNew').textContent = isNew && S.score > 0 ? 'New high score!' : '';
  $('#btnNext').style.display = hasNext ? '' : 'none';
  $('#hiStart').textContent = totalBest();
  show('over');
}


$('#btnPlay').onclick = showLevels;
$('#btnHow').onclick = () => show('how');
$('#btnGo').onclick = showLevels;
$('#btnBack').onclick = () => show('start');
$('#btnLvBack').onclick = () => show('start');
$('#btnRun').onclick = run;
$('#btnHint').onclick = hint;
$('#btnPause').onclick = pause;
$('#btnNext').onclick = () => startLevel(S.level + 1);
$('#btnAgain').onclick = () => startLevel(S.level);
$('#btnMenu').onclick = showLevels;
$('#btnHome').onclick = () => {
  $('#hiStart').textContent = totalBest();
  show('start');
};
$('#ovR').onclick = () => {
  $('#ov').classList.remove('on');
  startLevel(S.level);
};


