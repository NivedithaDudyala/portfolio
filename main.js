// Asset paths
const FRAME_PATHS = {
  'nh_Frame_9':  'assets/character/blink/nh_frame_9.svg',
  'nh_Frame_8':  'assets/character/blink/nh_frame_8.svg',
  'nh_Frame_10': 'assets/character/blink/nh_frame_10.svg',
  'nh_Frame_4':  'assets/character/blink/nh_frame_4.svg',
  'nh_Frame_5':  'assets/character/blink/nh_frame_5.svg',
  'nh_Frame_6':  'assets/character/blink/nh_frame_6.svg',
  'nh_Frame_7':  'assets/character/blink/nh_frame_7.svg',
  'nh_Frame_11': 'assets/character/blink/nh_frame_11.svg',
  'nh_Frame_2':  'assets/character/blink/nh_frame_2.svg',
  'Frame_21': 'assets/character/walk/frame_21.svg',
  'Frame_22': 'assets/character/walk/frame_22.svg',
  'Frame_23': 'assets/character/walk/frame_23.svg',
  'Frame_24': 'assets/character/walk/frame_24.svg',
};

const HAT_PATHS = {
  'neuron': 'assets/hats/Neuron-final.svg',
  'plant': 'assets/hats/plant.svg',
  'bow': 'assets/hats/bow.svg',
  'party': 'assets/hats/party.svg',
};

// Turn frames reuse walk frames
const TURN_R = ['Frame_22', 'Frame_22', 'Frame_21', 'Frame_21'];
const TURN_L = ['Frame_21', 'Frame_21', 'Frame_22', 'Frame_22'];

// Load all assets then init
async function loadSVG(path) {
  const r = await fetch(path);
  return await r.text();
}

async function init() {
  // Load illustration SVG and inject inline
  const illustSVG = await loadSVG('assets/illustration/illustration.svg');
  const container = document.getElementById('illustrationContainer');
  container.innerHTML = illustSVG;

  // Make it fill the landing div
  const svg = container.querySelector('svg');
  if (svg) {
    svg.style.position = 'absolute';
    svg.style.inset = '0';
    svg.style.width = '100%';
    svg.style.height = '100%';
  }

  // Load all frames and hats in parallel
  const [frames, hats] = await Promise.all([
    Promise.all(
      Object.entries(FRAME_PATHS).map(async ([key, path]) => [
        key,
        await loadSVG(path),
      ])
    ).then(Object.fromEntries),

    Promise.all(
      Object.entries(HAT_PATHS).map(async ([key, path]) => [
        key,
        await loadSVG(path),
      ])
    ).then(Object.fromEntries),
  ]);

  // Start app
  startApp(frames, hats);
}

function startApp(frames, hats) {
  const blinkSeq = [
    ['nh_Frame_9', 1200],
    ['nh_Frame_8', 350],
    ['nh_Frame_9', 500],
    ['nh_Frame_10', 350],
    ['nh_Frame_9', 500],
    ['nh_Frame_4', 80],
    ['nh_Frame_5', 60],
    ['nh_Frame_6', 60],
    ['nh_Frame_5', 60],
    ['nh_Frame_4', 80],
    ['nh_Frame_7', 200],
    ['nh_Frame_9', 3000],
  ];

  const VB_W = 1280;
  const VB_H = 832;

  const MONITOR_X = 487;
  const MONITOR_Y = 245;
  const MONITOR_W = 317;
  const MONITOR_H = 278;

  const CAMERA_X = 617;
  const CAMERA_Y = 198;
  const CAMERA_W = 52;
  const CAMERA_H = 12;

  const BRAIN_X = 217;
  const BRAIN_Y = 458;
  const BRAIN_W = 136;
  const BRAIN_H = 178;

  const CHAR_X = 996;
  const CHAR_Y = 353;
  const CHAR_W = 70;
  const CHAR_H = 134;

  // BULB
  const BULB_W = 44;
  const BULB_H = 64;
  const BULB_X = MONITOR_X + MONITOR_W - BULB_W - 11;
  const BULB_Y = MONITOR_Y + 2;

  // Hat is 65x60 viewBox, confirmed top:-15px at 98px character width
  const HAT_TOP_RATIO = -15 / 144;
  const HAT_W_RATIO = 65 / 98;
  const HAT_H_RATIO = (65 / 98) * (60 / 65);

  function svgToScreen(x, y, w, h) {
    const vw = document.documentElement.clientWidth;
    const vh = document.documentElement.clientHeight;
    const scale = Math.min(vw / VB_W, vh / VB_H);
    const ox = (vw - VB_W * scale) / 2;
    const oy = (vh - VB_H * scale) / 2;

    return {
      left: ox + x * scale,
      top: oy + y * scale,
      width: w * scale,
      height: h * scale,
    };
  }

  const charWrap = document.getElementById('charWrap');
  const charAnim = document.getElementById('charAnim');
  const hatLayer = document.getElementById('hatLayer');

  function positionAll() {
    const els = [
      ['monitorHit', MONITOR_X, MONITOR_Y, MONITOR_W, MONITOR_H],
      ['cameraHit', CAMERA_X, CAMERA_Y, CAMERA_W, CAMERA_H],
      ['brainHit', BRAIN_X, BRAIN_Y, BRAIN_W, BRAIN_H],
    ];

    els.forEach(([id, x, y, w, h]) => {
      const el = document.getElementById(id);
      if (!el) return;

      const p = svgToScreen(x, y, w, h);
      el.style.left = p.left + 'px';
      el.style.top = p.top + 'px';
      el.style.width = p.width + 'px';
      el.style.height = p.height + 'px';
    });

    // BULB
    const bulbWrap = document.getElementById('bulbWrap');

    if (bulbWrap) {
      const bulbPos = svgToScreen(BULB_X, BULB_Y, BULB_W, BULB_H);

      bulbWrap.style.left = bulbPos.left + 'px';
      bulbWrap.style.top = bulbPos.top + 'px';
      bulbWrap.style.width = bulbPos.width + 'px';
      bulbWrap.style.height = bulbPos.height + 'px';
    }

    // Position charWrap
    const p = svgToScreen(CHAR_X, CHAR_Y, CHAR_W, CHAR_H);
    charWrap.style.left = p.left + 'px';
    charWrap.style.top = p.top + 'px';
    charWrap.style.width = p.width + 'px';
    charWrap.style.height = p.height + 'px';

    // Hat positioning
    const hatW = p.width * HAT_W_RATIO;
    const hatH = p.height * HAT_H_RATIO;

    hatLayer.style.width = hatW + 'px';
    hatLayer.style.height = hatH + 'px';
    hatLayer.style.left = (p.width - hatW) / 2 + 'px';
    hatLayer.style.top = p.height * HAT_TOP_RATIO + 'px';
  }

  positionAll();
  window.addEventListener('resize', positionAll);

  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', positionAll);
  }

  // Hide neuron spark in illustration
  const star4 =
    document
      .getElementById('illustrationContainer')
      .querySelector('[id="Star 4"]') ||
    document.querySelector('[id="Star 4"]');

  if (star4) star4.style.visibility = 'hidden';

  // Blink
  let bStep = 0;
  let bTimer = null;

  function runBlink() {
    const [name, dur] = blinkSeq[bStep];
    charAnim.innerHTML = frames[name];
    bStep = (bStep + 1) % blinkSeq.length;
    bTimer = setTimeout(runBlink, dur);
  }

  runBlink();

  // Hat system
  let currentHat = 'none';
  const walkerHat = document.getElementById('walkerHat');

  function setHat(name) {
    currentHat = name;

    const hatSvg =
      !name || name === 'none' || !hats[name] ? '' : hats[name];

    hatLayer.innerHTML = hatSvg;

    if (hatLayer.querySelector('svg')) {
      hatLayer.querySelector('svg').style.cssText =
        'width:100%;height:100%;display:block;';
    }

    // Also update walker hat
    if (walkerHat) {
      walkerHat.innerHTML = hatSvg;

      if (walkerHat.querySelector('svg')) {
        walkerHat.querySelector('svg').style.cssText =
          'width:100%;height:auto;display:block;';
      }
    }

    document
      .querySelectorAll('.hat-opt')
      .forEach((o) => o.classList.toggle('active', o.dataset.hat === name));

    try {
      localStorage.setItem('niv_hat', name);
    } catch (e) {}
  }

  document.querySelectorAll('.hat-opt[data-hat]').forEach((opt) => {
    const h = opt.dataset.hat;

    if (h === 'none') return;

    if (hats[h]) {
      const tip = opt.querySelector('.tip');
      opt.innerHTML = '';

      if (tip) opt.appendChild(tip);

      const wrap = document.createElement('div');
      wrap.style.cssText =
        'width:100%;height:100%;display:flex;align-items:center;justify-content:center;';
      wrap.innerHTML = hats[h];
      opt.appendChild(wrap);
    }
  });

  try {
    setHat(localStorage.getItem('niv_hat') || 'none');
  } catch (e) {
    setHat('none');
  }

  const hatPicker = document.getElementById('hatPicker');

  charWrap.addEventListener('click', (e) => {
    e.stopPropagation();
    hatPicker.classList.toggle('visible');
  });

  document.querySelectorAll('.hat-opt').forEach((opt) => {
    opt.addEventListener('click', (e) => {
      e.stopPropagation();
      setHat(opt.dataset.hat);
      hatPicker.classList.remove('visible');
    });
  });

  document.addEventListener('click', () => {
    hatPicker.classList.remove('visible');
  });

  // Portfolio page + tab system
  // This keeps your monitor zoom transition, then opens the second page.
  // The tabs change content without reloading the page.
  const monitorHit = document.getElementById('monitorHit');
  const landing = document.getElementById('landing');
  const portfolio =
  document.getElementById('experiencePage') ||
  document.getElementById('portfolio');
  const overlay = document.getElementById('expandOverlay');
  const backToDesk = document.getElementById('backToDesk');

  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');
  const VALID_TABS = ['work', 'about', 'quests', 'gallery'];

  function switchTab(tabName = 'work') {
    const safeTab = VALID_TABS.includes(tabName) ? tabName : 'work';

    tabButtons.forEach((button) => {
      button.classList.toggle('active', button.dataset.tab === safeTab);
    });

    tabPanels.forEach((panel) => {
      panel.classList.toggle('active', panel.id === `tab-${safeTab}`);
    });
  }

  function setPortfolioHash(tabName) {
    const safeTab = VALID_TABS.includes(tabName) ? tabName : 'work';

    history.replaceState(
      null,
      '',
      `${window.location.pathname}${window.location.search}#${safeTab}`
    );
  }

  function clearPortfolioHash() {
    history.replaceState(
      null,
      '',
      `${window.location.pathname}${window.location.search}`
    );
  }

function showPortfolio(defaultTab = 'work', startWalkerDelay = 0) {
  if (!portfolio) return;

  switchTab(defaultTab);

  if (landing) {
    landing.style.opacity = '0';
    landing.style.display = 'none';
  }

  document.body.style.overflow = 'auto';

  // IMPORTANT: remove hidden class from the new second page
  portfolio.classList.remove('hidden');

  // IMPORTANT: your second page uses grid layout
  if (portfolio.classList.contains('experience-page')) {
    portfolio.style.display = 'grid';
  } else {
    portfolio.style.display = 'block';
  }

  requestAnimationFrame(() => {
    portfolio.classList.add('faded-in');

    if (startWalkerDelay >= 0) {
      setTimeout(startWalker, startWalkerDelay);
    }
  });
}

  function openPortfolioPage(defaultTab = 'work') {
    clearTimeout(bTimer);
    bTimer = null;

    showPortfolio(defaultTab, 200);
    setPortfolioHash(defaultTab);
  }

  function closePortfolioPage() {
  if (overlay) overlay.style.display = 'none';

  if (portfolio) {
    portfolio.classList.remove('faded-in');
    portfolio.classList.add('hidden');
    portfolio.style.display = 'none';
  }

  if (landing) {
    landing.style.display = 'block';

    requestAnimationFrame(() => {
      landing.style.opacity = '1';
    });
  }

  document.body.style.overflow = '';
  stopWalker();

  if (!bTimer) runBlink();

  switchTab('work');
  clearPortfolioHash();
}

  // Optional: makes openPortfolioPage() / openExperiencePage() callable from HTML or other scripts.
  window.openPortfolioPage = openPortfolioPage;
  window.openExperiencePage = openPortfolioPage;

  tabButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const tabName = button.dataset.tab;
      switchTab(tabName);
      setPortfolioHash(tabName);
    });
  });

  if (backToDesk) {
    backToDesk.addEventListener('click', closePortfolioPage);
  }

  if (monitorHit) {
    monitorHit.addEventListener('click', () => {
      const rect = monitorHit.getBoundingClientRect();

      clearTimeout(bTimer);
      bTimer = null;

      if (!overlay || !landing || !portfolio) {
        openPortfolioPage('work');
        return;
      }

      overlay.style.cssText = `
        display:block;
        position:fixed;
        left:${rect.left}px;
        top:${rect.top}px;
        width:${rect.width}px;
        height:${rect.height}px;
        border-radius:8px;
        background:white;
        transition:none;
        z-index:100;
      `;

      landing.style.opacity = '0';

      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          overlay.style.transition =
            'all 0.65s cubic-bezier(0.25,0.46,0.45,0.94)';
          overlay.style.left = '0';
          overlay.style.top = '0';
          overlay.style.width = '100vw';
          overlay.style.height = '100vh';
          overlay.style.borderRadius = '0';
        })
      );

      setTimeout(() => {
        overlay.style.display = 'none';
        showPortfolio('work', 200);
        setPortfolioHash('work');
      }, 700);
    });
  }

  // Walker
  const walkR = [frames['Frame_21'], frames['Frame_23']];
  const walkL = [frames['Frame_22'], frames['Frame_24']];
  const turnR = [
    frames['Frame_22'],
    frames['Frame_22'],
    frames['Frame_21'],
    frames['Frame_21'],
  ];
  const turnL = [
    frames['Frame_21'],
    frames['Frame_21'],
    frames['Frame_22'],
    frames['Frame_22'],
  ];

  const hoverMsgs = [
    "hi! this is my boss's work, do you like it?",
    'just chilling here tbh',
    "i've been walking for hours, send help",
    'psst — click the brain jar',
    'i study people. including you right now.',
    'neuroscience? basically vibes with citations',
    "don't mind me, just doing laps",
    "yes i have a neuron on my head. it's fine.",
  ];

  const walkerEl = document.getElementById('walker');
  const walkerChar = document.getElementById('walkerChar');
  const walkerBubble = document.getElementById('walkerBubble');

  let wx = 20;
  let wdir = 1;
  let wtick = 0;
  let wturning = false;
  let wturnIdx = 0;
  let wturnFrames = [];
  let wpDir = 1;
  let walkerRaf = null;
  let walkerStarted = false;

  function doTurn() {
    if (wturnIdx < wturnFrames.length) {
      walkerChar.innerHTML = wturnFrames[wturnIdx];
      walkerChar.style.transform = 'scaleX(1)';
      wturnIdx++;
      setTimeout(doTurn, 180);
    } else {
      wturning = false;
      wdir = wpDir;
      walkerRaf = requestAnimationFrame(walkerStep);
    }
  }

  function walkerStep() {
    if (wturning) return;

    const maxX = document.documentElement.clientWidth - 68;

    wx += wdir * 0.6;

    if (wx >= maxX) {
      wx = maxX;
      wpDir = -1;
      wturning = true;
      wturnIdx = 0;
      wturnFrames = turnR;
      setTimeout(doTurn, 0);
      return;
    } else if (wx <= 20) {
      wx = 20;
      wpDir = 1;
      wturning = true;
      wturnIdx = 0;
      wturnFrames = turnL;
      setTimeout(doTurn, 0);
      return;
    }

    walkerEl.style.left = wx + 'px';

    const fset = wdir === 1 ? walkR : walkL;
    const fi = Math.floor(wtick / 28) % 2;
    const key = wdir + '_' + fi;

    if (walkerChar.dataset.lastFrame !== key) {
      walkerChar.innerHTML = fset[fi];
      walkerChar.style.transform = 'scaleX(1)';
      walkerChar.dataset.lastFrame = key;
    }

    wtick++;
    walkerRaf = requestAnimationFrame(walkerStep);
  }

  function startWalker() {
    if (!walkerEl || !walkerChar) return;
    if (walkerStarted) return;

    walkerStarted = true;
    walkerEl.style.display = 'block';
    wx = 20;
    wdir = 1;
    wtick = 0;
    wturning = false;
    wturnIdx = 0;
    walkerChar.dataset.lastFrame = '';

    // Force hat sync now that walker exists
    setHat(currentHat);

    walkerRaf = requestAnimationFrame(walkerStep);
  }

  function stopWalker() {
    walkerStarted = false;

    if (walkerRaf) {
      cancelAnimationFrame(walkerRaf);
      walkerRaf = null;
    }

    if (walkerEl) {
      walkerEl.style.display = 'none';
    }
  }

  // Walker hat picker — reuse same hatPicker
  if (walkerEl) {
    walkerEl.addEventListener('click', (e) => {
      e.stopPropagation();

      const rect = walkerEl.getBoundingClientRect();

      hatPicker.style.position = 'fixed';
      hatPicker.style.left = rect.left + rect.width / 2 + 'px';
      hatPicker.style.top = rect.top - 10 + 'px';
      hatPicker.style.transform = 'translateX(-50%) translateY(-100%)';
      hatPicker.style.bottom = 'auto';
      hatPicker.classList.toggle('visible');
    });
  }

  let lastMsg = -1;

  if (walkerEl && walkerBubble) {
    walkerEl.addEventListener('mouseenter', () => {
      let i;

      do {
        i = Math.floor(Math.random() * hoverMsgs.length);
      } while (i === lastMsg);

      lastMsg = i;
      walkerBubble.textContent = hoverMsgs[i];
      walkerBubble.style.opacity = '1';
      walkerBubble.style.transform = 'translateX(-50%) translateY(-4px)';
    });

    walkerEl.addEventListener('mouseleave', () => {
      walkerBubble.style.opacity = '0';
      walkerBubble.style.transform = 'translateX(-50%) translateY(0)';
    });
  }

  // Open the correct tab if the URL is already #work, #about, #quests, or #gallery.
  // This lets refresh/direct links work without reloading between tab changes.
  const initialTab = window.location.hash.replace('#', '');

  if (VALID_TABS.includes(initialTab)) {
    clearTimeout(bTimer);
    bTimer = null;
    showPortfolio(initialTab, 0);
  } else {
    switchTab('work');
  }

  window.addEventListener('hashchange', () => {
    const hashTab = window.location.hash.replace('#', '');

    if (VALID_TABS.includes(hashTab)) {
      openPortfolioPage(hashTab);
    }
  });
}

init();