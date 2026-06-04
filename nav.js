(function () {
  'use strict';

  const html = document.documentElement;
  const DARK_KEY = 'uchitelyat-dark';

  // ── Dark mode ───────────────────────────────────────────────────────────────
  function applyDark(dark) {
    html.classList.toggle('dark', dark);
    const sun  = document.getElementById('icon-sun');
    const moon = document.getElementById('icon-moon');
    if (sun)  sun.style.display  = dark ? ''     : 'none';
    if (moon) moon.style.display = dark ? 'none' : '';
  }

  const savedDark = localStorage.getItem(DARK_KEY) === '1';
  applyDark(savedDark);

  document.getElementById('theme-btn')?.addEventListener('click', () => {
    const dark = !html.classList.contains('dark');
    localStorage.setItem(DARK_KEY, dark ? '1' : '0');
    applyDark(dark);
  });

  // ── Sticky header ───────────────────────────────────────────────────────────
  const header = document.getElementById('site-header');
  if (header) {
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ── Dropdowns ───────────────────────────────────────────────────────────────
  // Order matters — determines slide direction when switching between items.
  const DD_KEYS = ['blog', 'app', 'dzi', 'port', 'links'];
  let closeTimer = null;
  let prevKey    = null;

  function openDd(key, slideDir) {
    // Close all others
    DD_KEYS.forEach(k => {
      if (k === key) return;
      document.getElementById('dd-' + k)
        ?.classList.remove('open', 'slide-right', 'slide-left');
      document.querySelector(`[data-dd="${k}"] .nav-trigger`)
        ?.classList.remove('active');
    });

    const wrap    = document.getElementById('dd-' + key);
    const trigger = document.querySelector(`[data-dd="${key}"] .nav-trigger`);
    if (!wrap) return;

    // Remove slide classes, force reflow, then re-add so the animation restarts.
    wrap.classList.remove('slide-right', 'slide-left');
    void wrap.offsetWidth;
    if (slideDir === 'right') wrap.classList.add('slide-right');
    if (slideDir === 'left')  wrap.classList.add('slide-left');

    wrap.classList.add('open');
    trigger?.classList.add('active');
  }

  function closeAll() {
    DD_KEYS.forEach(k => {
      document.getElementById('dd-' + k)
        ?.classList.remove('open', 'slide-right', 'slide-left');
      document.querySelector(`[data-dd="${k}"] .nav-trigger`)
        ?.classList.remove('active');
    });
    prevKey = null;
  }

  DD_KEYS.forEach(key => {
    const item = document.querySelector(`[data-dd="${key}"]`);
    const wrap = document.getElementById('dd-' + key);
    if (!item) return;

    const onEnter = () => {
      clearTimeout(closeTimer);
      let slideDir = 'none';
      if (prevKey && prevKey !== key) {
        const pi = DD_KEYS.indexOf(prevKey);
        const ni = DD_KEYS.indexOf(key);
        slideDir = ni > pi ? 'right' : 'left';
      }
      prevKey = key;
      openDd(key, slideDir);
    };

    const onLeave = () => {
      closeTimer = setTimeout(closeAll, 130);
    };

    item.addEventListener('mouseenter', onEnter);
    item.addEventListener('mouseleave', onLeave);

    // Keep open while the panel itself is hovered
    wrap?.addEventListener('mouseenter', () => clearTimeout(closeTimer));
    wrap?.addEventListener('mouseleave', onLeave);
  });

  // ── Mobile menu ─────────────────────────────────────────────────────────────
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileBtn  = document.getElementById('mobile-btn');
  const iconMenu   = document.getElementById('icon-menu');
  const iconX      = document.getElementById('icon-x');
  let mobileOpen   = false;

  mobileBtn?.addEventListener('click', () => {
    mobileOpen = !mobileOpen;
    if (mobileMenu) mobileMenu.hidden = !mobileOpen;
    if (iconMenu) iconMenu.style.display = mobileOpen ? 'none' : '';
    if (iconX)    iconX.style.display    = mobileOpen ? ''     : 'none';
  });

})();
