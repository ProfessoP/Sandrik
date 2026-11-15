/* ============================================================
   ЗАГРУЗКА НАВИГАЦИИ И ФУТЕРА
   ============================================================ */
document.addEventListener('DOMContentLoaded', async () => {
  const navPlaceholder = document.getElementById('nav-placeholder');
  if (navPlaceholder) {
    try {
      const response = await fetch('nav.html');
      if (response.ok) {
        navPlaceholder.innerHTML = await response.text();
        const nav = document.getElementById('nav');
        const burger = document.getElementById('burger');
        if (burger) burger.addEventListener('click', () => nav.classList.toggle('is-open'));
        navPlaceholder.querySelectorAll('.nav__links a').forEach(link => {
          link.addEventListener('click', () => nav.classList.remove('is-open'));
        });
      }
    } catch (e) { console.error('Ошибка загрузки навигации:', e); }
  }

  const footerPlaceholder = document.getElementById('footer-placeholder');
  if (footerPlaceholder) {
    try {
      const response = await fetch('footer.html');
      if (response.ok) footerPlaceholder.innerHTML = await response.text();
    } catch (e) { console.error('Ошибка загрузки футера:', e); }
  }
});

/* ============================================================
   ЛОГИКА ГЛАВНОЙ СТРАНИЦЫ
   ============================================================ */
const isProductPage = document.body.classList.contains('product-page');

if (!isProductPage) {
  // 1. ТЕМЫ ПРИ СКРОЛЛЕ
  const html = document.documentElement;
  const themeSections = document.querySelectorAll('[data-section-theme]');
  const themeObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const theme = entry.target.dataset.sectionTheme;
        if (theme && html.dataset.theme !== theme) html.dataset.theme = theme;
      }
    });
  }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });
  themeSections.forEach((s) => themeObserver.observe(s));

  const hero = document.getElementById('hero');
  if (hero) {
    const heroObserver = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && e.intersectionRatio > 0.3) html.dataset.theme = 'hero';
      });
    }, { threshold: 0.3 });
    heroObserver.observe(hero);
  }

  // 2. СЛАЙДЕРЫ
  document.querySelectorAll('[data-slider]').forEach((slider) => {
    const track = slider.querySelector('.slider__track');
    const prev = slider.querySelector('[data-slider-prev]');
    const next = slider.querySelector('[data-slider-next]');
    if (!track || !prev || !next) return;

    const getStepSize = () => {
      const card = track.querySelector('.card');
      if (!card) return 300;
      return card.getBoundingClientRect().width + (parseFloat(getComputedStyle(track).gap) || 16);
    };

    prev.addEventListener('click', () => track.scrollBy({ left: -getStepSize(), behavior: 'smooth' }));
    next.addEventListener('click', () => track.scrollBy({ left: getStepSize(), behavior: 'smooth' }));

    const checkArrows = () => {
      const maxScroll = track.scrollWidth - track.clientWidth;
      if (maxScroll <= 5) { prev.disabled = true; next.disabled = true; return; }
      if (track.scrollLeft <= 5) { prev.disabled = true; next.disabled = false; }
      else if (track.scrollLeft >= maxScroll - 5) { prev.disabled = false; next.disabled = true; }
      else { prev.disabled = false; next.disabled = false; }
    };

    track.addEventListener('scroll', checkArrows, { passive: true });
    window.addEventListener('resize', checkArrows);
    setTimeout(checkArrows, 200);
  });

  // 3. STICKY NAV
  const navLinks = document.querySelectorAll('.nav__links a');
  const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach((l) => l.classList.toggle('is-active', l.getAttribute('href') === `#${id}`));
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  document.querySelectorAll('section[id]').forEach((s) => spyObserver.observe(s));

  // 4. REVEAL
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible');
        revealObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

  // 5. МОДАЛКА
  const modal = document.getElementById('collection-modal');
  if (modal) {
    const modalImg = document.getElementById('modal-img');
    const modalLabel = document.getElementById('modal-label');
    const modalTitle = document.getElementById('modal-title');
    const modalText1 = document.getElementById('modal-text-1');
    const modalText2 = document.getElementById('modal-text-2');

    const COLLECTION_INFO = {
      mission: { label: 'Коллекция 01 · Красно-чёрно-белая', title: 'Mission to Moon', text1: 'Космическая капсула о дерзости.', text2: 'Плотный хлопок, вышивка.', img: 'assets/images/cover-mission.jpg' },
      love: { label: 'Коллекция 02 · Бело-розовая', title: 'Взор любви', text1: 'Нежность и ирония.', text2: 'Мягкий хлопок.', img: 'assets/images/cover-love.jpg' },
      beauty: { label: 'Коллекция 03 · Бело-кремово-бежевая', title: 'Красота в глазах смотрящего', text1: 'Тёплая эстетика.', text2: 'Деликатная вышивка.', img: 'assets/images/cover-beauty.jpg' },
      cosmea: { label: 'Коллекция 04 · Бежево-коричневая', title: 'Космея', text1: 'Гармония природы.', text2: 'Переплетение с радужкой.', img: 'assets/images/cover-cosmea.jpg' },
      dandelion: { label: 'Коллекция 05 · Голубо-синяя', title: 'Dandelion', text1: 'Цветок перемен.', text2: 'Лёгкость и движение.', img: 'assets/images/cover-dandelion.jpg' },
    };

    function openModal(key) {
      const data = COLLECTION_INFO[key];
      if (!data) return;
      modalLabel.textContent = data.label;
      modalTitle.textContent = data.title;
      modalText1.textContent = data.text1;
      modalText2.textContent = data.text2;
      modalImg.src = data.img;
      modalImg.alt = data.title;
      modal.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      modal.classList.remove('is-open');
      document.body.style.overflow = '';
    }

    document.querySelectorAll('[data-open-modal]').forEach((el) => {
      el.addEventListener('click', () => openModal(el.dataset.openModal));
    });
    modal.querySelectorAll('[data-close-modal]').forEach((el) => el.addEventListener('click', closeModal));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal(); });
  }
}

/* ============================================================
   ПРЕЛОАДЕР И КНОПКА НАВЕРХ
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  if (!isProductPage) {
    const preloader = document.getElementById('preloader');
    if (preloader) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          preloader.classList.add('is-hidden');
          document.body.style.overflow = '';
        }, 500);
      });
      document.body.style.overflow = 'hidden';
    }
  }

  const scrollTopBtn = document.getElementById('scroll-top');
  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) scrollTopBtn.classList.add('is-visible');
      else scrollTopBtn.classList.remove('is-visible');
    });
    scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }
});