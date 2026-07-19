const carouselIntervals = new Map();

function initCarousel() {
  document.querySelectorAll('.card-image').forEach(container => {
    let current = 0;
    const imgs = container.querySelectorAll('img');
    if (imgs.length < 2) { carouselIntervals.set(container, null); return; }

    function showNext() {
      if (window.innerWidth > 768) {
        imgs.forEach(img => img.classList.remove('active'));
        return;
      }
      imgs[current].classList.remove('active');
      current = (current + 1) % imgs.length;
      imgs[current].classList.add('active');
    }

    function start() {
      const existing = carouselIntervals.get(container);
      if (existing) clearInterval(existing);
      if (window.innerWidth <= 768) {
        carouselIntervals.set(container, setInterval(showNext, 3000));
      } else {
        carouselIntervals.set(container, null);
      }
    }

    carouselIntervals.set(container, null);
    start();
  });
}

initCarousel();

document.addEventListener('click', e => {
    const btn = document.querySelector('.hamburger');
    const menu = document.querySelector('.nav-menu');
    if (!btn || !menu) return;
    if (e.target.closest('.hamburger')) {
        btn.classList.toggle('active');
        menu.classList.toggle('open');
    } else if (!e.target.closest('nav')) {
        btn.classList.remove('active');
        menu.classList.remove('open');
    }
});

document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        const btn = document.querySelector('.hamburger');
        const menu = document.querySelector('.nav-menu');
        if (btn) btn.classList.remove('active');
        if (menu) menu.classList.remove('open');
    });
});

window.addEventListener('resize', () => {
  document.querySelectorAll('.card-image').forEach(container => {
    const imgs = container.querySelectorAll('img');
    const isMobile = window.innerWidth <= 768;
    const interval = carouselIntervals.get(container);
    if (imgs.length < 2) return;

    if (!isMobile) {
      imgs.forEach(img => img.classList.remove('active'));
      if (interval) { clearInterval(interval); carouselIntervals.set(container, null); }
    } else if (!interval) {
      let current = 0;
      imgs.forEach((img, i) => { if (img.classList.contains('active')) current = i; });
      imgs[current].classList.add('active');

      carouselIntervals.set(container, setInterval(() => {
        if (window.innerWidth > 768) {
          imgs.forEach(img => img.classList.remove('active'));
          return;
        }
        imgs[current].classList.remove('active');
        current = (current + 1) % imgs.length;
        imgs[current].classList.add('active');
      }, 3000));
    }
  });
});

/* SPA — páginas internas */
(function() {
  var saibaMaisPages = document.querySelectorAll('.page-saiba-mais');
  var main = document.querySelector('main');
  var hero = document.querySelector('.hero-br');
  var cardsBr = document.querySelector('.cards-br');
  if (!main || !hero) return;

  function anySaibaMaisVisible() {
    for (var i = 0; i < saibaMaisPages.length; i++) {
      if (saibaMaisPages[i].style.display !== 'none') return true;
    }
    return false;
  }

  function hideAll() {
    saibaMaisPages.forEach(function(p) { p.style.display = 'none'; });
  }

  function showMain() {
    hero.style.display = '';
    if (cardsBr) cardsBr.style.display = '';
    main.style.display = '';
    hideAll();
    var areaSelect = document.getElementById('area');
    if (areaSelect) areaSelect.value = '';
    window.scrollTo(0, 0);
    if (window.innerWidth <= 768) document.body.style.scrollSnapType = '';
    if (window.__navObserver) window.__navObserver.start();
    history.pushState({ page: 'main' }, '', window.location.pathname);
  }

  function showSaibaMais(pageId) {
    var section = document.getElementById(pageId);
    if (!section) return;
    hero.style.display = 'none';
    if (cardsBr) cardsBr.style.display = 'none';
    main.style.display = '';
    hideAll();
    section.style.display = '';
    var areaSelect = document.getElementById('area');
    if (areaSelect) areaSelect.value = pageId.replace('page-', '');
    if (window.__navObserver) window.__navObserver.stop();
    document.querySelectorAll('.nav-menu a').forEach(function(a) { a.classList.remove('active'); });
    window.scrollTo(0, 0);
    if (window.innerWidth <= 768) document.body.style.scrollSnapType = 'none';
    history.pushState({ page: pageId }, '', '#' + pageId);
  }

  document.addEventListener('click', function(e) {
    var logo = e.target.closest('.logo-area a');
    if (logo) {
      e.preventDefault();
      if (anySaibaMaisVisible()) { showMain(); }
      else { window.scrollTo(0, 0); history.replaceState(null, '', window.location.pathname); }
      return;
    }
  });

  document.addEventListener('click', function(e) {
    var link = e.target.closest('a[href^="#page-"]');
    if (link) {
      e.preventDefault();
      var pageId = link.getAttribute('href').replace('#', '');
      showSaibaMais(pageId);
    }
  });

  document.addEventListener('click', function(e) {
    var link = e.target.closest('a[href="#page-main"]');
    if (link) { e.preventDefault(); showMain(); }
  });

  document.addEventListener('click', function(e) {
    var link = e.target.closest('.nav-menu a');
    if (!link) return;
    if (!anySaibaMaisVisible()) return;
    e.preventDefault();
    var name = link.getAttribute('href').replace('#', '');
    if (!name || name === 'contato') {
      var el = document.getElementById('contato');
      if (el) window.scrollTo(0, el.offsetTop - 70);
      return;
    }
    showSaibaMais('page-' + name);
  });

  window.addEventListener('popstate', function(e) {
    if (e.state && e.state.page && e.state.page.indexOf('page-') === 0) {
      hero.style.display = 'none';
      if (cardsBr) cardsBr.style.display = 'none';
      main.style.display = '';
      hideAll();
      var sec = document.getElementById(e.state.page);
      if (sec) sec.style.display = '';
      if (window.__navObserver) window.__navObserver.stop();
      document.querySelectorAll('.nav-menu a').forEach(function(a) { a.classList.remove('active'); });
    } else {
      hero.style.display = '';
      if (cardsBr) cardsBr.style.display = '';
      main.style.display = '';
      hideAll();
      if (window.innerWidth <= 768) document.body.style.scrollSnapType = '';
      if (window.__navObserver) window.__navObserver.start();
    }
  });
})();

/* Active nav link via card visibility (desktop only) */
window.__navObserver = (function() {
  var nav = document.querySelector('.nav-menu');
  if (!nav) return;
  var links = nav.querySelectorAll('a');
  var cards = document.querySelectorAll('.card');
  var observer = null;
  var visibility = new Map();
  cards.forEach(function(c) { visibility.set(c, 0); });

  function getActiveCardId() {
    var best = null, bestRatio = 0;
    visibility.forEach(function(ratio, card) {
      if (ratio > bestRatio) { bestRatio = ratio; best = card; }
    });
    return best ? best.id : null;
  }

  function updateActiveLink() {
    if (window.innerWidth <= 768) return;
    var activeId = getActiveCardId();
    links.forEach(function(link) { link.classList.toggle('active', link.getAttribute('href') === '#' + activeId); });
  }

  function setupObserver() {
    if (observer) observer.disconnect();
    visibility.forEach(function(_, card) { visibility.set(card, 0); });
    if (window.innerWidth > 768) {
      observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(e) { visibility.set(e.target, e.intersectionRatio); });
        updateActiveLink();
      }, { threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1] });
      cards.forEach(function(c) { observer.observe(c); });
    } else {
      links.forEach(function(l) { l.classList.remove('active'); });
    }
  }

  function stopObserver() {
    if (observer) { observer.disconnect(); observer = null; }
  }

  window.addEventListener('resize', setupObserver);
  setupObserver();

  return { start: setupObserver, stop: stopObserver };
})();
