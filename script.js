const LANGS = ['HTML', 'CSS', 'JavaScript'];
const DIFFS = [
  { n: 'Easy', lives: 5 },
  { n: 'Medium', lives: 4 },
  { n: 'Hard', lives: 3 }
];

/* Level number = language * 3 + difficulty. Bug format: [[wrong|right|distractor|distractor]] ; blanks: {{answer|alt}} */
const LEVELS = [
  { lang: 0, diff: 0, time: 90, lines: [
    '<!DOCTYPE html>','<html>','  <body>',
    '    <h1>Hello![[</h1|</h1>|</h1/>|<h1>]]',
    '    <p>I love coding.[[<p>|</p>|<\\p>|</P]]',
    '  </body>','</html>'
  ]},
  { lang: 0, diff: 1, time: 75, lines: [
    '<!DOCTYPE html>','<html>','  <head>',
    '    [[<ttile>|<title>|<tittle>|<titel>]]Hello World</title>',
    '  </head>','  <body>',
    '    <h1>Welcome![[</h1|</h1>|</h1/>|<h1>]]',
    '    <p>Squash the bugs![[<p>|</p>|<\\p>|</P]]',
    '  </body>','</html>'
  ]},
  { lang: 0, diff: 2, time: 120, type: true, lines: [
    '<!DOCTYPE html>','<html lang="en">','  <head>',
    '    <!-- Blank 1: the tag that sets the page title -->',
    '    <{{title}}>My Page</title>',
    '  <!-- Blank 2: the closing tag for the part that holds the page info -->',
    '  </{{head}}>','  <body>',
    '    <!-- Blank 3: the attribute that tells the image which file to load -->',
    '    <img {{src}}="cat.png" alt="Cat">',
    '    <!-- Blank 4: the attribute that tells the link where to go -->',
    '    <a {{href}}="home.html">Home</a>',
    '    <!-- Blank 5: the tag for an unordered (bullet) list -->',
    '    <{{ul}}>','      <li>Apple</li>','    </ul>',
    '  </body>','</html>'
  ]},
  { lang: 1, diff: 0, time: 90, lines: [
    'p {','  [[colr|color|collor|colour]]: red;',
    '  font-size: [[18px|18px;|18px:|18px,]]','}'
  ]},
  { lang: 1, diff: 1, time: 75, lines: [
    'body {','  background: pink;',
    '  [[colr|color|collor|colour]]: #333;',
    '  font-size: [[16px|16px;|16px:|16px,]]','}',
    '.card {','  margin: 10px;',
    '  [[padding|padding:|padding;|padding=]] 20px;','}'
  ]},
  { lang: 1, diff: 2, time: 120, type: true, lines: [
    '.card {',
    '  /* Blank 1: the property that turns on a flexible layout */',
    '  {{display}}: flex;',
    '  /* Blank 2: the value that centers items along the main axis */',
    '  justify-content: {{center}};',
    '  /* Blank 3: the property that sets the background color */',
    '  {{background-color}}: #ffe;',
    '  /* Blank 4: the property that rounds the corners */',
    '  {{border-radius}}: 10px;','}',
    '/* Blank 5: the state when the mouse is over the card */',
    '.card:{{hover}} {',
    '  /* Blank 6: the function that makes the card bigger */',
    '  transform: {{scale}}(1.1);','}'
  ]},
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
    'if (score [[=|===|=>|:=]] 0) {','  start();','}'
  ]},
  { lang: 2, diff: 2, time: 120, type: true, lines: [
    'const names = ["Ana", "Ben", "Cy"];',
    '// Blank 1: the keyword that starts a counting loop',
    '{{for}} (let i = 0; i < names.length; i++) {',
    '  // Blank 2: the console method that prints a message',
    '  console.{{log}}(names[i]);','}',
    '// Blank 3: the keyword for a variable that never changes',
    '{{const}} total = names.length;',
    '// Blank 4: the operator that checks if two values are exactly equal',
    'if (total {{===|==}} 3) {','  console.log("Three names");','}',
    '// Blank 5: the keyword that creates a function',
    '{{function}} greet(name) {',
    '  // Blank 6: the keyword that sends a value back',
    '  {{return}} "Hi " + name;','}'
  ]}
];

const $ = s => document.querySelector(s);
const S = { level: 0, score: 0, lives: 3, maxLives: 3, combo: 0, time: 0, total: 1, bugs: 0, fixed: 0, hints: 3, maxHints: 3, paused: false, active: false, timer: null, cur: null };

function load(key, fallback) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch (e) { return fallback; }
}
function save(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {}
}
let best = load('sbsBest', {});
let unlocked = load('sbsUnlocked', 1);
const totalBest = () => Object.values(best).reduce((a, b) => a + b, 0);
$('#hiStart').textContent = totalBest();

/* Animated background: floating code symbols and bugs */
(function sky() {
  const items = ['</>', '{ }', '( )', ';', '=>', '#', '&#128030;', '&#128027;', '&#10024;', '[ ]', '&&', '&#128375;&#65039;'];
  const box = $('#sky');
  for (let i = 0; i < 22; i++) {
    const e = document.createElement('i');
    e.innerHTML = items[i % items.length];
    e.style.left = Math.random() * 100 + '%';
    e.style.fontSize = 18 + Math.random() * 30 + 'px';
    e.style.animationDuration = 14 + Math.random() * 18 + 's';
    e.style.animationDelay = -Math.random() * 30 + 's';
    box.appendChild(e);
  }
})();

/* Effects */
function pop(el, text, bad) {
  const r = el.getBoundingClientRect();
  const p = document.createElement('div');
  p.className = 'pop' + (bad ? ' bad' : '');
  p.textContent = text;
  p.style.left = r.left + r.width / 2 - 20 + 'px';
  p.style.top = r.top + 'px';
  document.body.appendChild(p);
  setTimeout(() => p.remove(), 900);
}
function burst(el) {
  const r = el.getBoundingClientRect();
  ['\u2728', '\uD83D\uDC1E', '\u2B50', '\u2728', '\uD83D\uDCA5', '\u2B50'].forEach((c, i) => {
    const b = document.createElement('div');
    b.className = 'bit';
    b.textContent = c;
    b.style.left = r.left + r.width / 2 + 'px';
    b.style.top = r.top + r.height / 2 + 'px';
    const a = i / 6 * Math.PI * 2;
    b.style.setProperty('--x', Math.cos(a) * 60 + 'px');
    b.style.setProperty('--y', Math.sin(a) * 60 + 'px');
    document.body.appendChild(b);
    setTimeout(() => b.remove(), 700);
  });
}
function shake() {
  const a = $('#app');
  a.classList.remove('shake');
  void a.offsetWidth;
  a.classList.add('shake');
}
function confetti() {
  const c = ['#ff8fb1', '#8fe0c0', '#c9b6ff', '#ff9a3c', '#e64fc4', '#4cc97a'];
  for (let i = 0; i < 40; i++) {
    const e = document.createElement('div');
    e.className = 'conf';
    e.style.left = Math.random() * 100 + 'vw';
    e.style.width = e.style.height = 8 + Math.random() * 8 + 'px';
    e.style.background = c[i % c.length];
    e.style.animationDelay = Math.random() * .8 + 's';
    document.body.appendChild(e);
    setTimeout(() => e.remove(), 3500);
  }
}

function show(id) {
  document.querySelectorAll('.screen').forEach(e => e.classList.toggle('on', e.id === id));
  $('#ov').classList.remove('on');
  if (id !== 'game' && id !== 'over') document.body.removeAttribute('data-lang');
}
function overlay(t, m, b, fn) {
  $('#ovT').textContent = t; $('#ovM').textContent = m; $('#ovB').textContent = b;
  $('#ovB').onclick = () => { $('#ov').classList.remove('on'); fn(); };
  $('#ovMenu').style.display = 'none';
  $('#ov').classList.add('on');
  $('#ovB').focus();
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
    row.dataset.lang = li;
    const h = document.createElement('h3');
    h.textContent = lang;
    row.appendChild(h);
    const btns = document.createElement('div');
    btns.className = 'lbtns';
    DIFFS.forEach((d, di) => {
      const i = li * 3 + di;
      const b = document.createElement('button');
      b.className = 'btn lv';
      b.style.setProperty('--a', ['#ff9a3c', '#4cc97a', '#e64fc4'][li]);
      b.style.setProperty('--a2', ['#ffe3c7', '#d8f7e2', '#ffd9f4'][li]);
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
  $('#pCombo').classList.toggle('hot', S.combo >= 3);
  const m = Math.floor(S.time / 60), s = S.time % 60;
  $('#hTime').textContent = m + ':' + String(s).padStart(2, '0');
  $('#pTime').classList.toggle('low', S.time <= 10);
  $('#tFill').style.width = Math.max(0, S.time / S.total * 100) + '%';
  $('#hLives').textContent = '\u2665'.repeat(Math.max(S.lives, 0)) + '\u2661'.repeat(Math.max(S.maxLives - S.lives, 0));
  $('#hHints').textContent = S.hints;
}

function startLevel(i) {
  const lv = LEVELS[i];
  const lives = lv.type ? 5 : DIFFS[lv.diff].lives;
  const hints = lv.type ? 5 : 3;
  Object.assign(S, { level: i, score: 0, combo: 0, hints: hints, maxHints: hints, lives: lives, maxLives: lives });
  document.body.dataset.lang = lv.lang;
  show('game');
  loadLevel();
}

function loadLevel() {
  const lv = LEVELS[S.level];
  Object.assign(S, { hintMode: false, time: lv.time, total: lv.time, fixed: 0, bugs: 0, cur: null, active: true, paused: false });
  const box = $('#code');
  box.textContent = '';
  $('#fix').textContent = lv.type ? 'Fill in the blanks: type the missing code, then press Check code.' : 'Tap the line that looks wrong.';
  $('#btnRun').textContent = lv.type ? 'Check code' : 'Run code';
  $('#btnRun').classList.remove('ready');
  $('#code').classList.remove('hinting');
  $('#btnHint').classList.remove('on');
  lv.lines.forEach(ln => {
    const row = document.createElement('div');
    row.className = 'ln' + (/^\s*(<!--|\/\*|\/\/)/.test(ln) ? ' cm' : '');
    ln.split(/(\[\[.*?\]\]|\{\{.*?\}\})/).forEach(p => {
      if (p.startsWith('[[')) {
        const [w, r, ...d] = p.slice(2, -2).split('|');
        const s = document.createElement('span');
        s.className = 'tok bug';
        s.textContent = w;
        s.dataset.fix = r;
        s.dataset.d = d.join('|');
        s.tabIndex = 0;
        s.onclick = () => pickBug(s);
        s.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pickBug(s); } };
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
        inp.addEventListener('click', () => { if (S.hintMode) useHint(inp); });
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
  fitCode();
  clearInterval(S.timer);
  S.timer = setInterval(tick, 1000);
}

/* Shrink the code text until every line fits on screen without scrolling */
function fitCode() {
  const c = $('#code');
  if (!c.offsetHeight) return;
  let f = Math.min(18, Math.max(12, innerWidth / 38));
  c.style.fontSize = f + 'px';
  while (c.scrollHeight > c.clientHeight + 1 && f > 9) { f -= .5; c.style.fontSize = f + 'px'; }
}
window.addEventListener('resize', fitCode);
new ResizeObserver(fitCode).observe($('#code'));

function tick() {
  if (!S.active || S.paused) return;
  S.time--;
  hud();
  if (S.time <= 0) end(false, 'Time ran out before every bug was squashed.');
}

function loseLife() {
  S.lives--;
  S.combo = 0;
  shake();
  hud();
  if (S.lives <= 0) end(false, 'You ran out of hearts.');
}

function wrongTap(el) {
  if (!S.active || S.paused || S.hintMode) return;
  el.classList.add('oops');
  setTimeout(() => el.classList.remove('oops'), 400);
  pop(el, 'Oops! -1', true);
  $('#fix').textContent = '';
  loseLife();
}

function pickBug(el) {
  if (!S.active || S.paused || el.classList.contains('fixed')) return;
  if (S.hintMode) return useHint(el);
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
  if (el.dataset.clue) {
    const c = document.createElement('span');
    c.className = 'clue';
    c.textContent = el.dataset.clue;
    fx.appendChild(c);
  }
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
    el.tabIndex = -1;
    S.combo++;
    const pts = 100 * Math.min(S.combo, 5);
    S.score += pts;
    S.fixed++;
    S.cur = null;
    pop(el, '+' + pts);
    burst(el);
    $('#fix').textContent = '';
    if (S.fixed === S.bugs) {
      $('#btnRun').classList.add('ready');
      $('#fix').textContent = 'All bugs squashed! Press Run code.';
    }
    hud();
  } else {
    btn.disabled = true;
    pop(btn, 'Wrong! -1', true);
    loseLife();
  }
}

function hint() {
  if (!S.active || S.paused) return;
  if (S.hintMode) return setHintMode(false);
  if (S.hints <= 0) return overlay('No hints left', 'You used all ' + S.maxHints + ' hints.', 'Okay', () => {});
  if (S.fixed >= S.bugs) return;
  setHintMode(true);
}

function setHintMode(on) {
  S.hintMode = on;
  $('#code').classList.toggle('hinting', on);
  $('#btnHint').classList.toggle('on', on);
  if (on) {
    document.querySelectorAll('.tok.sel').forEach(e => e.classList.remove('sel'));
    S.cur = null;
    $('#fix').textContent = 'Hint mode: tap the bug (or blank) you want answered. Press Hint again to cancel.';
  } else {
    $('#fix').textContent = LEVELS[S.level].type ? 'Fill in the blanks: type the missing code, then press Check code.' : 'Tap the line that looks wrong.';
  }
}

function clueSteps(el) {
  const blank = el.classList.contains('blank');
  const ans = blank ? el.dataset.ans.split('|')[0] : el.dataset.fix;
  const n = ans.length;
  const tail = !blank && n > 2 ? 1 : 0;
  const mid = n - tail;
  const cap = Math.max(mid - 1, 0);
  const ks = [...new Set([1, Math.ceil(mid / 2), mid - 1].map(k => Math.min(Math.max(k, 0), cap)))].sort((a, b) => a - b);
  return ks.map(k => ans.slice(0, k) + '_'.repeat(mid - k) + (tail ? ans[n - 1] : ''));
}

function useHint(el) {
  if (!S.active || S.paused || !S.hintMode) return;
  const blank = el.classList.contains('blank');
  if (blank ? el.classList.contains('ok') : el.classList.contains('fixed')) return;
  const steps = clueSteps(el);
  let lvl = +el.dataset.hl || 0;
  let fresh = false;
  if (lvl < steps.length) {
    lvl++;
    fresh = true;
    el.dataset.hl = lvl;
    S.hints--;
    S.score = Math.max(0, S.score - 50);
    pop(el, 'Hint -50', true);
  }
  const mask = steps[lvl - 1];
  el.dataset.clue = 'Clue ' + lvl + ' of ' + steps.length + ': it looks like "' + mask + '" (' + mask.length + ' characters).' + (!fresh ? ' No more clues for this one.' : '');
  el.classList.add('clued');
  if (blank) el.placeholder = mask;
  setHintMode(false);
  const fx = $('#fix');
  fx.textContent = '';
  const c = document.createElement('span');
  c.className = 'clue';
  c.textContent = el.dataset.clue;
  fx.appendChild(c);
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
      pop(inp, '+150');
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
  if (!S.active || S.paused) return;
  if (S.hintMode) setHintMode(false);
  S.paused = true;
  overlay('Paused', 'The timer is stopped.', 'Resume', () => { S.paused = false; });
  $('#ovMenu').style.display = 'flex';
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
  if (win) confetti();
}

/* Keyboard shortcuts (not while typing in a blank) */
document.addEventListener('keydown', e => {
  if (!$('#game').classList.contains('on') || $('#ov').classList.contains('on')) return;
  if (e.target.tagName === 'INPUT') return;
  const k = e.key.toLowerCase();
  if (k >= '1' && k <= '4') { const b = $('#fix').querySelectorAll('button')[+k - 1]; if (b) b.click(); }
  else if (k === 'h') hint();
  else if (k === 'p') pause();
  else if (k === 'enter' && e.target.tagName !== 'BUTTON' && !e.target.classList.contains('tok')) run();
});

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
$('#mRestart').onclick = () => startLevel(S.level);
$('#mLevels').onclick = showLevels;
$('#mHome').onclick = () => { clearInterval(S.timer); S.active = false; $('#hiStart').textContent = totalBest(); show('start'); };
$('#btnHome').onclick = () => {
  $('#hiStart').textContent = totalBest();
  show('start');
};