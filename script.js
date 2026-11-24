/* =========================================================
   Syntax Bug Squasher - script.js
   (same logic as before, only reformatted)
   ========================================================= */


/* ---------- Basic data ---------- */
const LANGS = ['HTML', 'CSS', 'JavaScript'];


const DIFFS = [
  { n: 'Easy', lives: 5 },
  { n: 'Medium', lives: 4 },
  { n: 'Hard', lives: 3 }
];


// Runs the player's code and returns the result of `call` (used to test Hard JavaScript level)
const ex = (c, call) => {
  try {
    return new Function(c + '\nreturn ' + call)();
  } catch (e) {
    return undefined;
  }
};


/*
  LEVELS
  Easy / Medium: [[shown text | correct fix | wrong choice | wrong choice | ...]]
  Hard (editor): the player writes code, and every `reqs` item is tested by its `f` function.
*/
const LEVELS = [
  // ----- HTML -----
  {
    lang: 0, diff: 0, time: 90,
    goal: 'A big heading and a paragraph.',
    lines: [
      '<!DOCTYPE html>',
      '<html>',
      '  <body>',
      '    <h1>Hello![[</h1|</h1>|</h1/>|<h1>]]',
      '    <p>I love coding.[[<p>|</p>|<\\p>|</P]]',
      '  </body>',
      '</html>'
    ]
  },
  {
    lang: 0, diff: 1, time: 75,
    goal: 'A page title, a heading and a paragraph.',
    lines: [
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
    ]
  },
  {
    lang: 0, diff: 2, time: 240, type: true, editor: true,
    goal: 'Finish the page: it needs a title, a picture and a working link.',
    start: '<!DOCTYPE html>\n<html lang="en">\n  <head>\n    <title></title>\n  </head>\n  <body>\n    <h1>Welcome</h1>\n    <img alt="Cat">\n    <a>Home</a>\n  </body>\n</html>',
    reqs: [
      {
        t: 'The page title is "My Page"',
        h: 'Type My Page between the opening and closing title tags.',
        f: x => x.d.title.trim() === 'My Page'
      },
      {
        t: 'The image loads the file "cat.png"',
        h: 'Add src="cat.png" inside the img tag, next to alt.',
        f: x => {
          const i = x.d.querySelector('img');
          return !!i && i.getAttribute('src') === 'cat.png';
        }
      },
      {
        t: 'The "Home" link goes to home.html',
        h: 'Add href="home.html" inside the opening a tag.',
        f: x => {
          const a = x.d.querySelector('a[href="home.html"]');
          return !!a && a.textContent.trim() === 'Home';
        }
      }
    ]
  },


  // ----- CSS -----
  {
    lang: 1, diff: 0, time: 90,
    goal: 'Red text at 18px.',
    demo: '<p>Squash the bugs!</p>',
    lines: [
      'p {',
      '  [[colr|color|collor|colour]]: red;',
      '  font-size: [[18px|18px;|18px:|18px,]]',
      '}'
    ]
  },
  {
    lang: 1, diff: 1, time: 75,
    goal: 'Pink page, dark gray text, and a card with space inside.',
    demo: '<style>.card{border:2px solid #333}</style><div class="card">I am a card</div>',
    lines: [
      'body {',
      '  background: pink;',
      '  [[colr|color|collor|colour]]: #333;',
      '  font-size: [[16px|16px;|16px:|16px,]]',
      '}',
      '.card {',
      '  margin: 10px;',
      '  [[padding|padding:|padding;|padding=]] 20px;',
      '}'
    ]
  },
  {
    lang: 1, diff: 2, time: 240, type: true, editor: true,
    goal: 'Make a centered, rounded, light yellow card.',
    demo: '<style>.card{border:2px solid #333;gap:8px;width:260px;height:80px}</style><div class="card"><span>A</span><span>B</span><span>C</span></div>',
    start: '.card {\n  display: ;\n  justify-content: ;\n  background-color: ;\n}',
    reqs: [
      {
        t: 'The card uses a flexible layout (display)',
        h: 'The value is flex.',
        f: x => getComputedStyle(x.root.querySelector('.card')).display === 'flex'
      },
      {
        t: 'The items are centered (justify-content)',
        h: 'The value is center.',
        f: x => getComputedStyle(x.root.querySelector('.card')).justifyContent === 'center'
      },
      {
        t: 'The background is light yellow (background-color)',
        h: 'Try a hex color like #ffe or #fff8c4.',
        f: x => {
          const m = getComputedStyle(x.root.querySelector('.card')).backgroundColor.match(/\d+/g);
          return !!m && +m[0] >= 240 && +m[1] >= 230 && +m[2] < +m[0] - 8;
        }
      },
      {
        t: 'Add a new line that rounds the corners by 10px or more',
        h: 'Write border-radius: 12px; as a new line inside the braces.',
        f: x => parseFloat(getComputedStyle(x.root.querySelector('.card')).borderTopLeftRadius) >= 10
      }
    ]
  },


  // ----- JavaScript -----
  {
    lang: 2, diff: 0, time: 90,
    goal: 'Print "Hi" in the console and show a Welcome alert.',
    demo: '',
    lines: [
      'let score = 0;',
      '[[consol.log|console.log|conzole.log|console.lg]]("Hi");',
      '[[alret|alert|alart|allert]]("Welcome!");'
    ]
  },
  {
    lang: 2, diff: 1, time: 75,
    goal: 'Define start() and run it when score is 0.',
    demo: '',
    lines: [
      'let score = 0;',
      '[[funtion|function|fucntion|fuction]] start() {',
      '  [[console.lg|console.log|conso1e.log|console.logg]]("Squash them!");',
      '}',
      'if (score [[=|===|=>|:=]] 0) {',
      '  start();',
      '}'
    ]
  },
  {
    lang: 2, diff: 2, time: 240, type: true, editor: true,
    goal: 'Finish the three small functions.',
    demo: 'console.log("add:",add(2,3));console.log("isEven(4):",isEven(4));console.log(greet("Ana"));',
    start: 'function add(a, b) {\n  // return a plus b\n}\n\nfunction isEven(n) {\n  // return true if n is even, otherwise false\n}\n\nfunction greet(name) {\n  // return "Hi " followed by the name, like "Hi Ana"\n}\n',
    reqs: [
      {
        t: 'add(2, 3) returns 5',
        h: 'Write: return a + b;',
        f: x => ex(x.code, 'add(2,3)') === 5 && ex(x.code, 'add(10,-4)') === 6
      },
      {
        t: 'isEven(4) is true and isEven(7) is false',
        h: 'Write: return n % 2 === 0;',
        f: x => ex(x.code, 'isEven(4)') === true && ex(x.code, 'isEven(7)') === false
      },
      {
        t: 'greet("Ana") returns "Hi Ana"',
        h: 'Write: return "Hi " + name;',
        f: x => ex(x.code, 'greet("Ana")') === 'Hi Ana'
      }
    ]
  }
];


/* ---------- Game state and saved data ---------- */
const $ = s => document.querySelector(s);


const S = {
  level: 0,
  score: 0,
  lives: 3,
  maxLives: 3,
  combo: 0,
  time: 0,
  total: 1,
  bugs: 0,
  fixed: 0,
  hints: 3,
  maxHints: 3,
  paused: false,
  active: false,
  timer: null,
  cur: null
};


function load(k, f) {
  try {
    const v = localStorage.getItem(k);
    return v ? JSON.parse(v) : f;
  } catch (e) {
    return f;
  }
}


function save(k, v) {
  try {
    localStorage.setItem(k, JSON.stringify(v));
  } catch (e) {}
}


let best = load('sbsBest', {});
let unlocked = load('sbsUnlocked', 1);


const totalBest = () => Object.values(best).reduce((a, b) => a + b, 0);


$('#hiStart').textContent = totalBest();


/* ---------- Background decorations ---------- */


// Floating code symbols in the sky
(function () {
  const items = ['</>', '{ }', '01', '0xFF', ';', '=>', '#', 'if()', '1011', '[ ]', '&&', '404', 'git', 'NULL', 'sudo', '0110'];
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





/* ---------- Visual effects ---------- */


// Picks a syntax-highlight class for a piece of code
const sx = t =>
  /^<\/?[\w!][^>]*>$/.test(t) ? 't-tag'
    : /^(function|let|const|var|if|return|else)$/.test(t) ? 't-kw'
      : /^\(?["']/.test(t) ? 't-str'
        : /^[\w.]+\(/.test(t) ? 't-fn'
          : '';


// Floating "+100" / "Oops! -1" text
function pop(el, t, bad) {
  const r = el.getBoundingClientRect();
  const p = document.createElement('div');
  p.className = 'pop' + (bad ? ' bad' : '');
  p.textContent = t;
  p.style.left = r.left + r.width / 2 - 20 + 'px';
  p.style.top = r.top + 'px';
  document.body.appendChild(p);
  setTimeout(() => p.remove(), 900);
}


// Little sparkle burst when a bug is fixed
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


// Shakes the whole window on a mistake
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


/* ---------- Screens and overlays ---------- */


// Shows one screen and hides the others
function show(id) {
  $('#sky').style.display = id === 'start' ? '' : 'none';


  if (id !== 'game') {
    $('#status').textContent = '● idle   UTF-8   LF';
  }


  document.querySelectorAll('.screen').forEach(e => e.classList.toggle('on', e.id === id));
  $('#ov').classList.remove('on');
  $('#pv').classList.remove('on');


  if (id !== 'game' && id !== 'over') {
    document.body.removeAttribute('data-lang');
  }
}


// Pause / message overlay
function overlay(t, m, b, fn) {
  $('#ovT').textContent = t;
  $('#ovM').textContent = m;
  $('#ovB').textContent = b;
  $('#ovB').onclick = () => {
    $('#ov').classList.remove('on');
    fn();
  };
  $('#ovMenu').style.display = 'none';
  $('#ov').classList.add('on');
  $('#ovB').focus();
}


// Random order (Fisher-Yates)
function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}


/* ---------- Level select ---------- */
function showLevels() {
  clearInterval(S.timer);
  S.active = false;


  const box = $('#levelGrid');
  box.textContent = '';


  const FILES = ['index.html', 'style.css', 'script.js'];


  LANGS.forEach((lang, li) => {
    const card = document.createElement('div');
    card.className = 'fcard';
    card.style.setProperty('--a', ['#ff9a3c', '#4cc97a', '#e64fc4'][li]);


    const h = document.createElement('div');
    h.className = 'fhead';
    h.textContent = FILES[li];
    h.dataset.lang = lang;
    card.appendChild(h);


    DIFFS.forEach((d, di) => {
      const i = li * 3 + di;
      const b = document.createElement('button');
      b.className = 'btn lv';
      b.disabled = i >= unlocked;


      const n = document.createElement('span');
      n.textContent = d.n;


      const m = document.createElement('span');
      m.className = 'm';
      m.textContent = i >= unlocked ? 'locked' : best[i] ? 'best ' + best[i] : 'ready';


      b.append(n, m);
      b.onclick = () => startLevel(i);
      card.appendChild(b);
    });


    box.appendChild(card);
  });


  $('#hiStart').textContent = totalBest();
  show('levels');
}


/* ---------- HUD (score, combo, time, hearts, status bar) ---------- */
function hud() {
  const lv = LEVELS[S.level];


  $('#hStage').textContent = LANGS[lv.lang] + ' - ' + DIFFS[lv.diff].n;
  $('#hScore').textContent = S.score;
  $('#hCombo').textContent = S.combo;
  $('#pCombo').classList.toggle('hot', S.combo >= 3);


  const m = Math.floor(S.time / 60);
  const s = S.time % 60;
  $('#hTime').textContent = m + ':' + String(s).padStart(2, '0');
  $('#pTime').classList.toggle('low', S.time <= 10);
  $('#tFill').style.width = Math.max(0, S.time / S.total * 100) + '%';


  $('#hLives').textContent =
    '\u2665'.repeat(Math.max(S.lives, 0)) +
    '\u2661'.repeat(Math.max(S.maxLives - S.lives, 0));
  $('#hHints').textContent = S.hints;
  $('#tabName').textContent = ['index.html', 'style.css', 'script.js'][lv.lang];


  $('#status').textContent =
    '● ' + LANGS[lv.lang] +
    '   ✓ fixed ' + S.fixed + '/' + S.bugs +
    '   ⚠ ' + (S.bugs - S.fixed) + ' to go   UTF-8   LF';
}


/* ---------- Starting and loading a level ---------- */
function startLevel(i) {
  const lv = LEVELS[i];
  const lives = lv.type ? 5 : DIFFS[lv.diff].lives;
  const hints = lv.type ? 5 : 3;


  Object.assign(S, {
    level: i,
    score: 0,
    combo: 0,
    hints: hints,
    maxHints: hints,
    lives: lives,
    maxLives: lives
  });


  document.body.dataset.lang = lv.lang;
  show('game');
  loadLevel();
}


// Builds the code lines on screen from the level data
function loadLevel() {
  const lv = LEVELS[S.level];


  Object.assign(S, {
    hintMode: false,
    time: lv.time,
    total: lv.time,
    fixed: 0,
    bugs: 0,
    cur: null,
    active: true,
    paused: false
  });


  const box = $('#code');
  box.textContent = '';
  box.classList.toggle('edmode', !!lv.editor);


  $('#fix').textContent = 'Goal: ' + lv.goal + ' ' +
    (lv.type ? 'Fill in the blanks, then press Check code.' : 'Tap the line that looks wrong.');
  $('#btnRun').textContent = lv.type ? 'Check code' : 'Run code';
  $('#btnRun').classList.remove('ready');
  $('#code').classList.remove('hinting');
  $('#btnHint').classList.remove('on');


  let lastCm = '';


  (lv.lines || []).forEach(ln => {
    // remember the last comment line (used as a question for typed blanks)
    if (/^\s*(<\x21--|\/\*|\/\/)/.test(ln)) {
      lastCm = ln
        .replace(/^\s*(<\x21--|\/\*|\/\/)\s*(Blank \d+:\s*)?/, '')
        .replace(/\s*(--\x3e|\*\/)\s*$/, '');
    }


    const row = document.createElement('div');
    row.className = 'ln' + (/^\s*(<\x21--|\/\*|\/\/)/.test(ln) ? ' cm' : '');


    ln.split(/(\[\[.*?\]\]|\{\{.*?\}\})/).forEach(p => {
      if (p.startsWith('[[')) {
        // a bug: [[shown | correct | wrong | wrong ...]]
        const [w, r, ...d] = p.slice(2, -2).split('|');
        const s = document.createElement('span');
        s.className = 'tok bug';
        s.textContent = w;
        s.dataset.fix = r;
        s.dataset.d = d.join('|');
        s.tabIndex = 0;
        s.onclick = () => pickBug(s);
        s.onkeydown = e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            pickBug(s);
          }
        };
        row.appendChild(s);
        S.bugs++;
      } else if (p.startsWith('{{')) {
        // a typed blank: {{answer|other answer}}
        const ans = p.slice(2, -2);
        const inp = document.createElement('input');
        inp.className = 'blank';
        inp.dataset.ans = ans;
        inp.dataset.q = lastCm;
        inp.style.width = (Math.max(...ans.split('|').map(a => a.length)) + 2) + 'ch';
        inp.autocomplete = 'off';
        inp.spellcheck = false;
        inp.setAttribute('autocapitalize', 'none');
        inp.setAttribute('aria-label', 'Type the missing code');
        inp.addEventListener('click', () => {
          if (S.hintMode) useHint(inp);
        });
        inp.onkeydown = e => {
          if (e.key === 'Enter') {
            e.preventDefault();
            run();
          }
        };
        row.appendChild(inp);
        S.bugs++;
      } else {
        // normal code: every word is a tappable token (wrong tap = lose a heart)
        p.split(/(\s+)/).forEach(t => {
          if (!t) return;


          if (/^\s+$/.test(t)) {
            row.appendChild(document.createTextNode(t));
            return;
          }


          const s = document.createElement('span');
          const c = sx(t);
          s.className = 'tok' + (c ? ' ' + c : '');
          s.textContent = t;
          if (!lv.type) s.onclick = () => wrongTap(s);
          row.appendChild(s);
        });
      }
    });


    if (!row.childNodes.length) row.textContent = ' ';
    box.appendChild(row);
  });


  if (lv.editor) buildEditor(lv);
  hud();
  fitCode();
  if (lv.type && !lv.editor) focusAll();


  clearInterval(S.timer);
  S.timer = setInterval(tick, 1000);
}


// Shrinks the code font until everything fits in the box
function fitCode() {
  const c = $('#code');
  if (!c.offsetHeight) return;


  if (c.classList.contains('edmode')) {
    c.style.fontSize = '14px';
    return;
  }


  let f = Math.min(18, Math.max(12, innerWidth / 38));
  c.style.fontSize = f + 'px';


  while (c.scrollHeight > c.clientHeight + 1 && f > 9) {
    f -= .5;
    c.style.fontSize = f + 'px';
  }
}


window.addEventListener('resize', fitCode);
new ResizeObserver(fitCode).observe($('#code'));


/* ---------- Timer and hearts ---------- */
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


/* ---------- Tapping and choosing fixes ---------- */


// Tapped a line that has no bug
function wrongTap(el) {
  if (!S.active || S.paused || S.hintMode) return;


  el.classList.add('oops');
  setTimeout(() => el.classList.remove('oops'), 400);
  pop(el, 'Oops! -1', true);
  $('#fix').textContent = '';
  loseLife();
}


// Tapped a bug: show the fix choices
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


// Picked a fix: right = points + combo, wrong = lose a heart
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
      $('#fix').textContent = 'All bugs squashed! Press Run code to see your output.';
    }


    hud();
  } else {
    btn.disabled = true;
    pop(btn, 'Wrong! -1', true);
    loseLife();
  }
}


/* ---------- Hints ---------- */
function hint() {
  if (!S.active || S.paused) return;
  if (S.hintMode) return setHintMode(false);


  if (S.hints <= 0) {
    return overlay('No hints left', 'You used all ' + S.maxHints + ' hints.', 'Okay', () => {});
  }


  if (LEVELS[S.level].editor) return editorHint();
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
    $('#fix').textContent = 'Goal: ' + LEVELS[S.level].goal + ' ' +
      (LEVELS[S.level].type ? 'Fill in the blanks, then press Check code.' : 'Tap the line that looks wrong.');
  }
}


// Builds clues that reveal more letters step by step, e.g. c____ -> col_r
function clueSteps(el) {
  const blank = el.classList.contains('blank');
  const ans = blank ? el.dataset.ans.split('|')[0] : el.dataset.fix;
  const n = ans.length;
  const tail = !blank && n > 2 ? 1 : 0;
  const mid = n - tail;
  const cap = Math.max(mid - 1, 0);


  const ks = [...new Set([1, Math.ceil(mid / 2), mid - 1].map(k => Math.min(Math.max(k, 0), cap)))]
    .sort((a, b) => a - b);


  return ks.map(k => ans.slice(0, k) + '_'.repeat(mid - k) + (tail ? ans[n - 1] : ''));
}


// Uses one hint on a bug (costs 50 points)
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
  el.dataset.clue = 'Clue ' + lvl + ' of ' + steps.length + ': it looks like "' + mask + '" (' + mask.length + ' characters).' +
    (!fresh ? ' No more clues for this one.' : '');
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


/* ---------- Output preview ---------- */


// Reads the current code from the screen (editor or lines)
function getCode() {
  if ($('#ed')) return $('#ed').value;


  return [...document.querySelectorAll('#code .ln')]
    .map(r => [...r.childNodes]
      .map(n => n.tagName === 'INPUT'
        ? (n.disabled && !n.classList.contains('ok') ? n.dataset.ans.split('|')[0] : n.value)
        : n.textContent)
      .join(''))
    .join('\n');
}


// Draws the result inside a Shadow DOM so the player's CSS cannot break the game page
function renderOut(lv, code) {
  const box = $('#pvOut');
  box.textContent = '';


  const host = document.createElement('div');
  host.style.cssText = 'width:100%;height:100%;overflow:auto;background:#fff;color:#000';
  box.appendChild(host);


  const root = host.attachShadow({ mode: 'open' });
  const base = '<style>.pvbody{font-family:sans-serif;padding:12px;min-height:100%;box-sizing:border-box}a{color:#06c;display:inline-block;margin:6px 0}ul{margin:6px 0;padding-left:24px}img{display:block;border-radius:12px}</style>';


  if (lv.lang === 0) {
    // HTML: parse the code, remove scripts, show the page
    const d = new DOMParser().parseFromString(code, 'text/html');
    d.querySelectorAll('script').forEach(s => s.remove());
    root.innerHTML = base;


    if (d.title) {
      const t = document.createElement('div');
      t.style.cssText = 'background:#eee;padding:4px 10px;font:12px sans-serif;border-bottom:1px solid #ccc';
      t.textContent = 'Tab title: ' + d.title;
      root.appendChild(t);
    }


    const b = document.createElement('div');
    b.className = 'pvbody';


    const cat = 'data:image/svg+xml,' + encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" width="90" height="90"><rect width="90" height="90" rx="14" fill="#ffe3c7"/><text x="45" y="63" font-size="50" text-anchor="middle">\uD83D\uDC31</text></svg>'
    );


    d.querySelectorAll('img').forEach(i => {
      if (i.getAttribute('src')) {
        i.setAttribute('src', cat);
        i.setAttribute('width', '90');
        i.setAttribute('height', '90');
      }
    });


    b.innerHTML = d.body.innerHTML;
    b.querySelectorAll('a').forEach(a => a.addEventListener('click', e => e.preventDefault()));
    root.appendChild(b);
  } else if (lv.lang === 1) {
    // CSS: apply the player's CSS to a demo page ("body" becomes ".pvbody")
    const css = code.replace(/(^|[\s,}])body(?=[\s,{])/g, '$1.pvbody');
    root.innerHTML = base + '<div class="pvbody">' + lv.demo + '</div><style>' + css + '</style>';
  } else {
    // JavaScript: run the code and show console.log / alert messages
    const out = document.createElement('div');
    out.style.cssText = 'font:14px monospace;padding:10px';
    root.appendChild(out);


    const add = (t, c) => {
      const d = document.createElement('div');
      d.textContent = t;
      if (c) d.style.color = c;
      out.appendChild(d);
    };


    try {
      new Function('console', 'alert', code + '\n' + (lv.demo || ''))(
        { log: (...a) => add('> ' + a.join(' ')) },
        m => add('alert: ' + m, '#06c')
      );
    } catch (e) {
      add('Error: ' + e.message, '#c00');
    }


    if (!out.childNodes.length) add('(no output)', '#888');
  }
}


function showPreview(done, msg) {
  const lv = LEVELS[S.level];
  S.paused = true;


  $('#pvGoal').textContent = 'Goal: ' + lv.goal;
  $('#pvM').textContent = msg;
  renderOut(lv, getCode());


  $('#pvB').textContent = 'Continue';
  $('#pvB').style.display = done ? '' : 'none';
  $('#pvBack').style.display = done ? 'none' : '';
  $('#pv').classList.add('on');
}


$('#pvBack').onclick = () => {
  $('#pv').classList.remove('on');
  S.paused = false;
};


$('#pvB').onclick = () => {
  $('#pv').classList.remove('on');
  S.paused = false;


  if (S.fixed < S.bugs) {
    focusAll();
    return;
  }


  S.score += S.time * 5; // time bonus
  hud();
  end(true, 'Your code runs perfectly.');
};


/* ---------- Run / Check code ---------- */
function run() {
  if (!S.active || S.paused) return;


  if (LEVELS[S.level].type) {
    return LEVELS[S.level].editor ? checkEditor() : checkAll();
  }


  if (S.fixed < S.bugs) {
    return showPreview(false, (S.bugs - S.fixed) + ' bug(s) still hiding, so the output looks broken.');
  }


  showPreview(true, 'All bugs squashed! Here is your output.');
}


function focusAll() {
  const all = [...document.querySelectorAll('input.blank')];


  all.forEach(i => {
    i.disabled = false;
    i.placeholder = '';
  });


  if (all[0]) all[0].focus();


  $('#fix').textContent = 'Goal: ' + LEVELS[S.level].goal + ' Fill in all ' + S.bugs + ' blanks, then press Check code.';
}


// Checks typed blanks
function checkAll() {
  let wrong = 0;


  document.querySelectorAll('input.blank:not(.ok)').forEach(inp => {
    if (inp.dataset.ans.split('|').includes(inp.value.trim())) {
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
    showPreview(true, 'All blanks are correct! Here is your final output.');
  } else if (wrong) {
    $('#fix').textContent = wrong + ' blank(s) are still wrong. Fix the red ones, then press Check code again.';
    loseLife();
  }
}


/* ---------- Hard levels: code editor ---------- */


// Builds the requirement list and the text editor
function buildEditor(lv) {
  const box = $('#code');
  box.textContent = '';


  const ul = document.createElement('ul');
  ul.className = 'reqs';
  ul.id = 'reqs';


  lv.reqs.forEach((r, i) => {
    const li = document.createElement('li');
    li.id = 'rq' + i;
    li.textContent = r.t;
    ul.appendChild(li);
  });


  box.appendChild(ul);


  const ta = document.createElement('textarea');
  ta.id = 'ed';
  ta.value = lv.start;
  ta.spellcheck = false;
  ta.setAttribute('autocapitalize', 'none');
  ta.setAttribute('aria-label', 'Code editor');


  ta.onkeydown = e => {
    if (e.key === 'Tab') {
      e.preventDefault();
      ta.setRangeText('  ', ta.selectionStart, ta.selectionEnd, 'end');
    } else if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      run();
    }
  };


  box.appendChild(ta);


  S.bugs = lv.reqs.length;
  S.fixed = 0;


  $('#fix').textContent = 'Goal: ' + lv.goal + ' Write the code until every requirement turns green, then press Check code.';
}


// Tests every requirement of a Hard level
function checkEditor() {
  const lv = LEVELS[S.level];
  const code = getCode();
  const n = lv.reqs.length;


  renderOut(lv, code);


  const x = { code: code, d: null, root: null };
  if (lv.lang === 0) x.d = new DOMParser().parseFromString(code, 'text/html');
  if (lv.lang === 1) x.root = $('#pvOut').firstChild.shadowRoot;


  let pass = 0;


  lv.reqs.forEach((r, i) => {
    let ok = false;


    try {
      ok = !!r.f(x);
    } catch (e) {}


    const li = $('#rq' + i);
    li.className = ok ? 'ok' : 'no';
    li.textContent = (ok ? '\u2713 ' : '\u2717 ') + r.t;


    if (ok) pass++;
  });


  S.fixed = pass;


  if (pass === n) {
    S.score += n * 150;
    hud();
    showPreview(true, 'All ' + n + ' requirements passed! Here is your final output.');
  } else {
    loseLife();


    if (S.active) {
      showPreview(false, pass + ' of ' + n + ' requirements passed. Fix the red ones and try again.');
    }
  }
}


function editorHint() {
  const lv = LEVELS[S.level];
  const i = [...document.querySelectorAll('#reqs li')].findIndex(l => !l.classList.contains('ok'));


  if (i < 0) return;


  S.hints--;
  S.score = Math.max(0, S.score - 50);
  pop($('#btnHint'), 'Hint -50', true);
  $('#fix').textContent = 'Hint for requirement ' + (i + 1) + ': ' + lv.reqs[i].h;
  hud();
}


/* ---------- Pause and end of level ---------- */
function pause() {
  if (!S.active || S.paused) return;
  if (S.hintMode) setHintMode(false);


  S.paused = true;
  overlay('Paused', 'The timer is stopped.', 'Resume', () => {
    S.paused = false;
  });
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


/* ---------- Keyboard shortcuts: 1-4, H, P, Enter ---------- */
document.addEventListener('keydown', e => {
  if (!$('#game').classList.contains('on') || $('#ov').classList.contains('on') || $('#pv').classList.contains('on')) return;
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;


  const k = e.key.toLowerCase();


  if (k >= '1' && k <= '4') {
    const b = $('#fix').querySelectorAll('button')[+k - 1];
    if (b) b.click();
  } else if (k === 'h') {
    hint();
  } else if (k === 'p') {
    pause();
  } else if (k === 'enter' && e.target.tagName !== 'BUTTON' && !e.target.classList.contains('tok')) {
    run();
  }
});


/* ---------- How-to-play tutorial ---------- */
const TUT = [
  { img: 'images/1.png', cap: 'Check the <b>Goal</b> at the bottom of the screen and read through the HTML code to spot any errors, then tap the line that looks wrong.' },
  { img: 'images/2.png', cap: 'Once you tap a buggy line, the broken tag highlights with a dashed pink border and "Pick the fix:" options appear below. Select the correct closing tag (<code>&lt;/h1&gt;</code>).' },
  { img: 'images/3.png', cap: 'Choosing the right fix turns the tag green, adds points to your Score, and builds your Combo multiplier (<code>x1</code>).' },
  { img: 'images/4.png', cap: 'Tap and fix the remaining buggy lines (like changing the second <code>&lt;p&gt;</code> to <code>&lt;/p&gt;</code>) until the message says "All bugs squashed! Press Run code to see your output.", then click the green <b>Run code</b> button.' },
  { img: 'images/5.png', cap: 'Review how your fixed HTML renders in the <b>Output</b> preview window, then click the pink <b>Continue</b> button.' },
  { img: 'images/6.png', cap: 'You reach the <b>Level cleared!</b> screen showing your final score and high score, where you can move on to the Next level or replay.' },
  { img: 'images/7.png', cap: 'Tapping a line or word that doesn\'t have a bug triggers an "Oops! -1" penalty, resets your combo to <code>x0</code>, and costs you a heart in the top-right corner.' },
  { img: 'images/8.png', cap: 'Losing all 5 hearts triggers the <b>Game over</b> screen with the message "You ran out of hearts."' },
  { img: 'images/9.png', cap: 'Keep an eye on the countdown timer in the top-right corner, which turns pink as it gets low (such as <code>0:08</code>).' },
  { img: 'images/10.png', cap: 'If the timer reaches <code>0:00</code> before you fix all the errors, you get a <b>Game over</b> screen stating "Time ran out before every bug was squashed."' }
];


let tutI = 0;
const seen = new Set();


// preload the tutorial images
TUT.forEach(t => {
  new Image().src = t.img;
});


// step number buttons
TUT.forEach((t, n) => {
  const b = document.createElement('button');
  b.className = 'tstep';
  b.textContent = n + 1;
  b.setAttribute('aria-label', 'Go to step ' + (n + 1));
  b.onclick = () => showTut(n);
  $('#tutSteps').appendChild(b);
});


function showTut(i) {
  tutI = Math.min(Math.max(i, 0), TUT.length - 1);
  seen.add(tutI);


  const t = TUT[tutI];


  $('#tutTitle').textContent = 'Step ' + (tutI + 1) + ' of ' + TUT.length;
  $('#tutImg').src = t.img;
  fitFrame();
  $('#tutImg').alt = 'Tutorial step ' + (tutI + 1);
  $('#tutCap').innerHTML = t.cap;


  document.querySelectorAll('#tutSteps .tstep').forEach((d, n) => {
    d.classList.toggle('on', n === tutI);
    d.classList.toggle('seen', n !== tutI && seen.has(n));
  });


  $('#btnTutNext').textContent = tutI === TUT.length - 1 ? "Let's play!" : 'Next';
}


// Keeps the tutorial picture's proportions while filling the available space
function fitFrame() {
  const st = $('#tutStage');
  const fr = $('#tutFrame');
  const im = $('#tutImg');


  if (!st || !st.clientHeight) return;


  const r = (im.naturalWidth && im.naturalHeight) ? im.naturalWidth / im.naturalHeight : 2245 / 1587;
  const aw = st.clientWidth - 20;
  const ah = st.clientHeight - 20;
  const w = Math.max(120, Math.min(aw, ah * r));


  fr.style.width = w + 'px';
  fr.style.height = (w / r) + 'px';
}


$('#tutImg').addEventListener('load', fitFrame);
window.addEventListener('resize', fitFrame);
new ResizeObserver(fitFrame).observe($('#tutStage'));


// Click the tutorial image to zoom
const lb = () => $('#lightbox');


$('#tutImg').onclick = () => {
  $('#lbImg').src = $('#tutImg').src;
  lb().classList.add('on');
};


lb().onclick = () => lb().classList.remove('on');


// Arrow keys and Esc in the tutorial
document.addEventListener('keydown', e => {
  if (!$('#intro').classList.contains('on')) return;


  if (e.key === 'Escape') lb().classList.remove('on');
  else if (e.key === 'ArrowRight') showTut(tutI + 1);
  else if (e.key === 'ArrowLeft') showTut(tutI - 1);
});


/* ---------- Button wiring ---------- */
$('#btnPlay').onclick = showLevels;
$('#btnHow').onclick = () => show('how');
$('#btnGo').onclick = () => {
  show('intro');
  showTut(0);
};


$('#btnTutPrev').onclick = () => tutI === 0 ? show('how') : showTut(tutI - 1);
$('#btnTutNext').onclick = () => tutI === TUT.length - 1 ? showLevels() : showTut(tutI + 1);
$('#btnTutSkip').onclick = showLevels;


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


$('#mHome').onclick = () => {
  clearInterval(S.timer);
  S.active = false;
  $('#hiStart').textContent = totalBest();
  show('start');
};


$('#btnHome').onclick = () => {
  $('#hiStart').textContent = totalBest();
  show('start');
};



