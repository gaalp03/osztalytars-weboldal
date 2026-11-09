/* Macher Mihály — portfólió
   Kis, függőség nélküli szkript: nyitó animáció, görgetésre megjelenés,
   enyhe parallax, fejléc, mobil menü, szűrő-előkészítés és képnézegető. */
(() => {
  'use strict';

  const root = document.documentElement;
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  let reduceMotion = motionQuery.matches;
  motionQuery.addEventListener?.('change', (e) => {
    reduceMotion = e.matches;
    if (reduceMotion) resetParallax();
  });

  const EASE_OUT = 'cubic-bezier(0.16, 1, 0.3, 1)';
  let lightboxOpen = false;
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* ------------------------------------------------------------------
     Évszám a láblécben
     ------------------------------------------------------------------ */
  $$('[data-year]').forEach((el) => { el.textContent = String(new Date().getFullYear()); });

  /* ------------------------------------------------------------------
     Nyitó animáció: akkor indul, ha a nyitókép betöltött
     ------------------------------------------------------------------ */
  const heroImg = $('.hero__img');
  let loadedOnce = false;
  const markLoaded = () => {
    if (loadedOnce) return;
    loadedOnce = true;
    requestAnimationFrame(() => requestAnimationFrame(() => root.classList.add('is-loaded')));
  };
  if (!heroImg || heroImg.complete) {
    markLoaded();
  } else {
    heroImg.addEventListener('load', markLoaded, { once: true });
    heroImg.addEventListener('error', markLoaded, { once: true });
    setTimeout(markLoaded, 2500);
  }

  /* ------------------------------------------------------------------
     Görgetésre megjelenés
     ------------------------------------------------------------------ */
  const revealTargets = [...$$('[data-reveal]'), ...$$('.g-item')];

  const showNow = (el) => el.classList.add('is-in');

  if (!('IntersectionObserver' in window)) {
    revealTargets.forEach(showNow);
  } else {
    const revealObserver = new IntersectionObserver((entries) => {
      const entering = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top
          || a.boundingClientRect.left - b.boundingClientRect.left);
      entering.forEach((entry, i) => {
        const el = entry.target;
        // Az egyszerre beérkező elemek kis késleltetéssel, egymás után jelennek meg
        el.style.setProperty('--delay', reduceMotion ? '0s' : `${Math.min(i, 4) * 0.09}s`);
        showNow(el);
        revealObserver.unobserve(el);
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.01 });

    revealTargets.forEach((el) => revealObserver.observe(el));
  }

  /* ------------------------------------------------------------------
     Parallax (csak transform, requestAnimationFrame-mel)
     ------------------------------------------------------------------ */
  const parallaxEls = $$('[data-parallax]').map((el) => ({
    el,
    speed: parseFloat(el.dataset.parallax) || 0,
    local: el.hasAttribute('data-parallax-local'),
    fade: el.hasAttribute('data-parallax-fade'),
    visible: true,
  }));

  if ('IntersectionObserver' in window) {
    const visObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const item = parallaxEls.find((p) => p.el === entry.target || p.el.parentElement === entry.target);
        if (item) item.visible = entry.isIntersecting;
      });
    }, { rootMargin: '20% 0px 20% 0px' });
    parallaxEls.forEach((p) => visObserver.observe(p.local ? p.el.parentElement : p.el));
  }

  function resetParallax() {
    parallaxEls.forEach(({ el }) => { el.style.transform = ''; el.style.opacity = ''; });
  }

  function updateParallax() {
    if (reduceMotion) return;
    const vh = window.innerHeight;
    const y = window.scrollY;
    for (const p of parallaxEls) {
      if (!p.visible) continue;
      if (p.local) {
        const box = p.el.parentElement.getBoundingClientRect();
        const progress = (box.top + box.height / 2 - vh / 2) / vh; // kb. -1 … 1
        const max = box.height * 0.085;
        const offset = Math.max(-max, Math.min(max, progress * box.height * p.speed * 1.6));
        p.el.style.transform = `translate3d(0, ${offset.toFixed(2)}px, 0)`;
      } else {
        if (y > vh * 1.3) continue;
        p.el.style.transform = `translate3d(0, ${(y * p.speed).toFixed(2)}px, 0)`;
        if (p.fade) p.el.style.opacity = String(Math.max(0, 1 - y / (vh * 0.75)).toFixed(3));
      }
    }
  }

  /* ------------------------------------------------------------------
     Fejléc: tömör háttér a nyitókép után, lefelé görgetéskor elrejtve
     ------------------------------------------------------------------ */
  const header = $('[data-header]');
  const hero = $('.hero');
  const navList = $('#fomenu');
  const navToggle = $('[data-nav-toggle]');
  let lastY = window.scrollY;

  function updateHeader() {
    if (!header) return;
    const y = window.scrollY;
    const heroBottom = hero ? hero.offsetHeight - header.offsetHeight : 200;
    header.classList.toggle('is-solid', y > heroBottom);

    const menuOpen = navList?.classList.contains('is-open');
    const delta = y - lastY;
    if (!menuOpen && !lightboxOpen) {
      if (delta > 6 && y > window.innerHeight * 0.6) header.classList.add('is-hidden');
      else if (delta < -6 || y < 80) header.classList.remove('is-hidden');
    }
    lastY = y;
  }

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      updateParallax();
      updateHeader();
      ticking = false;
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  onScroll();

  // Aktuális szekció kiemelése a menüben
  const navLinks = $$('.nav__link');
  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        navLinks.forEach((a) => {
          const on = a.getAttribute('href') === `#${id}`;
          a.classList.toggle('is-current', on);
          if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    $$('main section[id]').forEach((s) => sectionObserver.observe(s));
  }

  /* ------------------------------------------------------------------
     Mobil menü
     ------------------------------------------------------------------ */
  if (navToggle && navList) {
    const label = $('.nav__toggle-label', navToggle);
    const setMenu = (open) => {
      navList.classList.toggle('is-open', open);
      navToggle.setAttribute('aria-expanded', String(open));
      label.textContent = open ? label.dataset.closeLabel : label.dataset.openLabel;
      root.classList.toggle('lb-lock', open);
      if (open) header.classList.remove('is-hidden');
    };
    navToggle.addEventListener('click', () => setMenu(!navList.classList.contains('is-open')));
    navList.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navList.classList.contains('is-open')) {
        setMenu(false);
        navToggle.focus();
      }
    });
    window.matchMedia('(min-width: 760px)').addEventListener?.('change', (e) => { if (e.matches) setMenu(false); });
  }

  /* ------------------------------------------------------------------
     Galéria adatai
     ------------------------------------------------------------------ */
  const gallery = $('[data-gallery]');
  const supportsWebp = (() => {
    try {
      return document.createElement('canvas').toDataURL('image/webp').startsWith('data:image/webp');
    } catch { return false; }
  })();

  const parseSrcset = (str) => str.split(',').map((part) => {
    const [url, w] = part.trim().split(/\s+/);
    return { url, w: parseInt(w, 10) };
  });

  const items = $$('.g-item', gallery || document).map((fig) => {
    const link = $('.g-link', fig);
    const img = $('img', fig);
    const srcset = supportsWebp ? link.dataset.fullWebp : link.dataset.fullJpg;
    return {
      fig,
      link,
      img,
      frame: $('.g-frame', fig),
      category: fig.dataset.category || '',
      srcset,
      candidates: parseSrcset(srcset),
      width: parseInt(img.getAttribute('width'), 10) || 2400,
      height: parseInt(img.getAttribute('height'), 10) || 1350,
      alt: img.alt,
      caption: $('.g-title', fig)?.textContent.trim() || img.alt,
      num: $('.g-num', fig)?.textContent.trim() || '',
    };
  });

  /* ------------------------------------------------------------------
     Szűrő: csak akkor jelenik meg, ha több kategória van (pl. Portré)
     ------------------------------------------------------------------ */
  const filtersEl = $('[data-filters]');
  const CATEGORY_LABELS = { koncert: 'Koncert', portre: 'Portré' };
  const categories = [...new Set(items.map((it) => it.category).filter(Boolean))];

  if (filtersEl && categories.length > 1) {
    const makeButton = (value, text) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'filter';
      b.dataset.filter = value;
      b.textContent = text;
      b.setAttribute('aria-pressed', value === 'osszes' ? 'true' : 'false');
      return b;
    };
    filtersEl.setAttribute('role', 'group');
    filtersEl.setAttribute('aria-label', 'Képek szűrése kategória szerint');
    filtersEl.append(makeButton('osszes', 'Összes'));
    categories.forEach((c) => filtersEl.append(makeButton(c, CATEGORY_LABELS[c] || c)));
    filtersEl.hidden = false;

    filtersEl.addEventListener('click', (e) => {
      const btn = e.target.closest('.filter');
      if (!btn) return;
      const value = btn.dataset.filter;
      $$('.filter', filtersEl).forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
      items.forEach((it) => {
        const hide = value !== 'osszes' && it.category !== value;
        it.fig.classList.toggle('is-filtered-out', hide);
        if (!hide) it.fig.classList.add('is-in');
      });
    });
  }

  const visibleItems = () => items.filter((it) => !it.fig.classList.contains('is-filtered-out'));

  /* ------------------------------------------------------------------
     Képnézegető
     ------------------------------------------------------------------ */
  const lb = $('[data-lightbox]');
  if (!lb || !items.length) return;

  const stage = $('[data-lb-stage]', lb);
  const elCurrent = $('[data-lb-current]', lb);
  const elTotal = $('[data-lb-total]', lb);
  const elCaption = $('[data-lb-caption]', lb);
  const btnClose = $('.lightbox__close', lb);
  const btnPrev = $('[data-lb-prev]', lb);
  const btnNext = $('[data-lb-next]', lb);
  const background = [$('.site-header'), $('main'), $('.site-footer'), $('.skip-link')].filter(Boolean);

  let busy = false;
  let list = [];      // a jelenleg látható elemek
  let pos = 0;        // index a list-ben
  let currentImg = null;

  const pad2 = (n) => String(n).padStart(2, '0');

  // A kép helye a képernyőn (contain illesztés a feliratok közötti területen)
  function fitBox(item) {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const small = vw < 760;
    const top = small ? 64 : 76;
    const bottom = small ? 76 : 72;
    const side = small ? 0 : Math.min(120, Math.max(72, vw * 0.07));
    const availW = vw - side * 2;
    const availH = Math.max(120, vh - top - bottom);
    const scale = Math.min(availW / item.width, availH / item.height);
    const w = item.width * scale;
    const h = item.height * scale;
    return { x: (vw - w) / 2, y: top + (availH - h) / 2, w, h };
  }

  function placeImg(img, box) {
    img.style.left = `${box.x}px`;
    img.style.top = `${box.y}px`;
    img.style.width = `${box.w}px`;
    img.style.height = `${box.h}px`;
  }

  function placeholderSrc(item) {
    if (item.img.complete && item.img.currentSrc) return item.img.currentSrc;
    const mid = item.candidates.find((c) => c.w >= 1200) || item.candidates[item.candidates.length - 1];
    return mid.url;
  }

  // Először a már betöltött (kisebb) kép jelenik meg, majd a nagy felbontású cserélődik be
  function createImg(item, box) {
    const img = document.createElement('img');
    img.className = 'lightbox__img';
    img.alt = item.alt;
    img.decoding = 'async';
    img.draggable = false;
    img.src = placeholderSrc(item);
    placeImg(img, box);

    const sizes = `${Math.ceil(box.w)}px`;
    const hi = new Image();
    hi.decoding = 'async';
    hi.sizes = sizes;
    hi.srcset = item.srcset;
    const swap = () => {
      if (!img.isConnected && img !== currentImg) return;
      img.sizes = sizes;
      img.srcset = item.srcset;
    };
    if (hi.complete) swap(); else hi.addEventListener('load', swap, { once: true });
    return img;
  }

  function preload(item) {
    if (!item) return;
    const box = fitBox(item);
    const hi = new Image();
    hi.sizes = `${Math.ceil(box.w)}px`;
    hi.srcset = item.srcset;
  }

  function updateMeta(item) {
    elCurrent.textContent = pad2(pos + 1);
    elTotal.textContent = pad2(list.length);
    elCaption.textContent = item.caption;
    const single = list.length < 2;
    btnPrev.hidden = single;
    btnNext.hidden = single;
  }

  // A galéria-kivágás pontos helye → ebből "nő ki" a teljes kép (FLIP + clip-path)
  function thumbTransform(item, box) {
    const fr = item.frame.getBoundingClientRect();
    if (!fr.width || !fr.height) return null;
    const cs = getComputedStyle(item.img).objectPosition.split(' ');
    const px = (parseFloat(cs[0]) || 50) / 100;
    const py = (parseFloat(cs[1] ?? cs[0]) || 50) / 100;
    const s = Math.max(fr.width / item.width, fr.height / item.height);
    const iw = item.width * s;
    const ih = item.height * s;
    const ix = fr.left + (fr.width - iw) * px;
    const iy = fr.top + (fr.height - ih) * py;
    const k = iw / box.w;
    const clip = [
      (fr.top - iy) / k,
      (ix + iw - fr.right) / k,
      (iy + ih - fr.bottom) / k,
      (fr.left - ix) / k,
    ].map((v) => `${Math.max(0, v).toFixed(2)}px`).join(' ');
    return {
      transform: `translate(${(ix - box.x).toFixed(2)}px, ${(iy - box.y).toFixed(2)}px) scale(${k.toFixed(5)})`,
      clipPath: `inset(${clip})`,
    };
  }

  const inViewport = (el) => {
    const r = el.getBoundingClientRect();
    return r.bottom > 0 && r.top < window.innerHeight && r.width > 0;
  };

  function setBackgroundInert(on) {
    background.forEach((el) => {
      if (on) el.setAttribute('inert', ''); else el.removeAttribute('inert');
    });
  }

  function lockScroll(on) {
    if (on) {
      const sbw = window.innerWidth - root.clientWidth;
      if (sbw > 0) {
        document.body.style.paddingRight = `${sbw}px`;
        header.style.paddingRight = `${sbw}px`;
      }
      root.classList.add('lb-lock');
    } else {
      root.classList.remove('lb-lock');
      document.body.style.paddingRight = '';
      header.style.paddingRight = '';
    }
  }

  function open(item) {
    if (lightboxOpen || busy) return;
    list = visibleItems();
    pos = Math.max(0, list.indexOf(item));
    lightboxOpen = true;

    lb.hidden = false;
    lockScroll(true);
    setBackgroundInert(true);
    updateMeta(item);

    const box = fitBox(item);
    currentImg = createImg(item, box);
    stage.append(currentImg);

    // reflow → a CSS átmenetek elindulnak
    void lb.offsetWidth;
    lb.classList.add('is-open');
    btnClose.focus({ preventScroll: true });

    const from = !reduceMotion && thumbTransform(item, box);
    if (from && currentImg.animate) {
      busy = true;
      item.frame.style.visibility = 'hidden';
      const anim = currentImg.animate(
        [from, { transform: 'translate(0px, 0px) scale(1)', clipPath: 'inset(0px 0px 0px 0px)' }],
        { duration: 820, easing: EASE_OUT },
      );
      anim.onfinish = () => { busy = false; };
      anim.oncancel = () => { busy = false; };
    }

    preload(list[(pos + 1) % list.length]);
    preload(list[(pos - 1 + list.length) % list.length]);
  }

  function close() {
    if (!lightboxOpen || busy) return;
    const item = list[pos];
    const img = currentImg;

    // Ha a kép a galériában nem látszik, odagörgetünk (a háttér takarja, nem látszik az ugrás)
    if (!inViewport(item.frame)) {
      item.fig.classList.add('is-in');
      const r = item.frame.getBoundingClientRect();
      window.scrollTo({ top: window.scrollY + r.top - (window.innerHeight - r.height) / 2, behavior: 'instant' });
      header.classList.add('is-hidden');
    }

    items.forEach((it) => { if (it !== item) it.frame.style.visibility = ''; });

    const finish = () => {
      lb.hidden = true;
      lb.classList.remove('is-open');
      stage.replaceChildren();
      currentImg = null;
      item.frame.style.visibility = '';
      lockScroll(false);
      setBackgroundInert(false);
      lightboxOpen = false;
      busy = false;
      // a fókusz az éppen nézett kép galérialinkjére kerül vissza
      item.link.focus({ preventScroll: true });
    };

    lb.classList.remove('is-open');

    if (reduceMotion || !img?.animate) { finish(); return; }

    busy = true;
    const box = fitBox(item);
    const to = thumbTransform(item, box);
    item.frame.style.visibility = 'hidden';
    const anim = to
      ? img.animate([{ transform: 'translate(0px, 0px) scale(1)', clipPath: 'inset(0px 0px 0px 0px)' }, to],
        { duration: 700, easing: EASE_OUT, fill: 'forwards' })
      : img.animate([{ opacity: 1, transform: 'scale(1)' }, { opacity: 0, transform: 'scale(0.96)' }],
        { duration: 350, easing: 'ease', fill: 'forwards' });
    anim.onfinish = finish;
    anim.oncancel = finish;
  }

  function go(dir) {
    if (!lightboxOpen || busy || list.length < 2) return;
    const oldImg = currentImg;
    const oldItem = list[pos];
    pos = (pos + dir + list.length) % list.length;
    const item = list[pos];
    updateMeta(item);

    oldItem.frame.style.visibility = '';
    item.frame.style.visibility = 'hidden';

    const box = fitBox(item);
    const img = createImg(item, box);
    currentImg = img;
    stage.append(img);

    if (reduceMotion || !img.animate) {
      oldImg?.remove();
    } else {
      busy = true;
      const shift = Math.min(60, window.innerWidth * 0.05) * dir;
      oldImg?.animate(
        [{ opacity: 1, transform: 'translateX(0px)' }, { opacity: 0, transform: `translateX(${-shift}px)` }],
        { duration: 450, easing: 'cubic-bezier(0.4, 0, 0.2, 1)', fill: 'forwards' },
      ).finished.then(() => oldImg.remove(), () => oldImg.remove());
      const a = img.animate(
        [{ opacity: 0, transform: `translateX(${shift}px)` }, { opacity: 1, transform: 'translateX(0px)' }],
        { duration: 700, delay: 80, easing: EASE_OUT, fill: 'backwards' },
      );
      a.onfinish = () => { busy = false; };
      a.oncancel = () => { busy = false; };
    }

    preload(list[(pos + dir + list.length) % list.length]);
  }

  // Megnyitás kattintásra
  items.forEach((item) => {
    item.link.setAttribute('aria-haspopup', 'dialog');
    item.link.addEventListener('click', (e) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
      e.preventDefault();
      open(item);
    });
  });

  $$('[data-lb-close]', lb).forEach((el) => el.addEventListener('click', close));
  btnPrev.addEventListener('click', () => go(-1));
  btnNext.addEventListener('click', () => go(1));

  // A kép melletti üres területre kattintás bezár
  stage.addEventListener('click', (e) => {
    if (e.target === stage && !swipe.moved) close();
  });

  // Billentyűzet + fókuszcsapda
  document.addEventListener('keydown', (e) => {
    if (!lightboxOpen) return;
    switch (e.key) {
      case 'Escape': e.preventDefault(); close(); break;
      case 'ArrowRight': e.preventDefault(); go(1); break;
      case 'ArrowLeft': e.preventDefault(); go(-1); break;
      case 'Tab': {
        const focusables = [btnClose, btnPrev, btnNext].filter((b) => !b.hidden);
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (!lb.contains(document.activeElement)) { e.preventDefault(); first.focus(); }
        else if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        break;
      }
      default:
    }
  });

  // Érintéses lapozás
  const swipe = { x: 0, y: 0, t: 0, active: false, moved: false };
  stage.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'mouse') { swipe.moved = false; return; }
    Object.assign(swipe, { x: e.clientX, y: e.clientY, t: performance.now(), active: true, moved: false });
  });
  stage.addEventListener('pointerup', (e) => {
    if (!swipe.active) return;
    swipe.active = false;
    const dx = e.clientX - swipe.x;
    const dy = e.clientY - swipe.y;
    const fast = performance.now() - swipe.t < 700;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.2 && fast) {
      swipe.moved = true;
      go(dx < 0 ? 1 : -1);
    } else if (dy > 90 && Math.abs(dy) > Math.abs(dx) * 1.5 && fast) {
      swipe.moved = true;
      close();
    }
  });
  stage.addEventListener('pointercancel', () => { swipe.active = false; });

  // Átméretezéskor újraillesztés
  window.addEventListener('resize', () => {
    if (!lightboxOpen || !currentImg) return;
    placeImg(currentImg, fitBox(list[pos]));
  }, { passive: true });
})();
