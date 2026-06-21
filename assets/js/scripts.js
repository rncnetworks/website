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
