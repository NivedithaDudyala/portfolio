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
