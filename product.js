/* ============================================================
   ДАННЫЕ ТОВАРОВ
   ============================================================ */
const PRODUCTS_DATA = {
  mission: { id: 'mission', label: 'Коллекция 01', title: 'Футболка «Mission to Moon»', price: '4 900 ₽', desc: 'Унисекс · вышивка · плотный хлопок 240 г', images: ['assets/images/mission-1.jpg', 'assets/images/mission-2.jpg', 'assets/images/mission-3.jpg', 'assets/images/mission-4.jpg'], cover: 'assets/images/cover-mission.jpg', collectionTitle: 'Mission to Moon', collectionDesc: 'Космическая капсула о дерзости и предельном контрасте.' },
  love: { id: 'love', label: 'Коллекция 02', title: 'Футболка «Взор любви»', price: '4 500 ₽', desc: 'Женская · вышивка · мягкий хлопок', images: ['assets/images/love-1.jpg', 'assets/images/love-2.jpg', 'assets/images/love-3.jpg', 'assets/images/love-4.jpg'], cover: 'assets/images/cover-love.jpg', collectionTitle: 'Взор любви', collectionDesc: 'Бело-розовая палитра. Нежность, ирония и сердечки.' },
  beauty: { id: 'beauty', label: 'Коллекция 03', title: 'Футболка «Красота»', price: '4 900 ₽', desc: 'Унисекс · вышивка · хлопок', images: ['assets/images/beauty-1.jpg', 'assets/images/beauty-2.jpg', 'assets/images/beauty-3.jpg', 'assets/images/beauty-4.jpg'], cover: 'assets/images/cover-beauty.jpg', collectionTitle: 'Красота в глазах смотрящего', collectionDesc: 'Бело-кремово-бежевая палитра.' },
  cosmea: { id: 'cosmea', label: 'Коллекция 04', title: 'Футболка «Космея»', price: '4 900 ₽', desc: 'Унисекс · вышивка · хлопок', images: ['assets/images/cosmea-1.jpg', 'assets/images/cosmea-2.jpg', 'assets/images/cosmea-3.jpg', 'assets/images/cosmea-4.jpg'], cover: 'assets/images/cover-cosmea.jpg', collectionTitle: 'Космея', collectionDesc: 'Бежево-коричневая палитра.' },
  dandelion: { id: 'dandelion', label: 'Коллекция 05', title: 'Футболка «Dandelion»', price: '4 900 ₽', desc: 'Унисекс · вышивка · хлопок', images: ['assets/images/dandelion-1.jpg', 'assets/images/dandelion-2.jpg', 'assets/images/dandelion-3.jpg', 'assets/images/dandelion-4.jpg'], cover: 'assets/images/cover-dandelion.jpg', collectionTitle: 'Dandelion', collectionDesc: 'Голубо-синяя палитра.' }
};

const COLLECTION_INFO = {
  mission: { label: '01', title: 'Mission to Moon', text1: 'Космос.', text2: 'Хлопок.', img: 'assets/images/cover-mission.jpg' },
  love: { label: '02', title: 'Взор любви', text1: 'Нежность.', text2: 'Хлопок.', img: 'assets/images/cover-love.jpg' },
  beauty: { label: '03', title: 'Красота...', text1: 'Эстетика.', text2: 'Вышивка.', img: 'assets/images/cover-beauty.jpg' },
  cosmea: { label: '04', title: 'Космея', text1: 'Природа.', text2: 'Радужка.', img: 'assets/images/cover-cosmea.jpg' },
  dandelion: { label: '05', title: 'Dandelion', text1: 'Свобода.', text2: 'Лёгкость.', img: 'assets/images/cover-dandelion.jpg' },
};

/* ============================================================
   ИНИЦИАЛИЗАЦИЯ
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  let currentTheme = urlParams.get('theme') || 'mission';
  if (!PRODUCTS_DATA[currentTheme]) currentTheme = 'mission';

  const html = document.documentElement;
  const mainImg = document.getElementById('main-image');
  const thumbContainer = document.getElementById('thumbnails');
  const label = document.getElementById('product-label');
  const title = document.getElementById('product-title');
  const desc = document.getElementById('product-desc');
  const price = document.getElementById('product-price');
  const coverImg = document.getElementById('cover-img');
  const coverLabel = document.getElementById('cover-label');
  const coverTitle = document.getElementById('cover-title');
  const coverText = document.getElementById('cover-text');
  const coverBlock = document.getElementById('product-collection-cover');
  const otherGrid = document.getElementById('other-collections');
  const breadcrumb = document.getElementById('breadcrumb-collection');

  function loadProduct(themeId) {
    const data = PRODUCTS_DATA[themeId];
    if (!data) return;

    html.dataset.theme = themeId;
    window.history.pushState({}, '', `?theme=${themeId}`);

    if (label) label.textContent = data.label;
    if (title) title.textContent = data.title;
    if (desc) desc.textContent = data.desc;
    if (price) price.textContent = data.price;
    if (breadcrumb) breadcrumb.textContent = data.collectionTitle;

    if (mainImg) mainImg.src = data.images[0];
    if (thumbContainer) {
      thumbContainer.innerHTML = '';
      data.images.forEach((imgSrc, index) => {
        const img = document.createElement('img');
        img.src = imgSrc;
        img.alt = `Фото ${index + 1}`;
        img.loading = 'lazy';
        if (index === 0) img.classList.add('active');
        
        img.addEventListener('click', () => {
          if (mainImg) mainImg.src = imgSrc;
          thumbContainer.querySelectorAll('img').forEach(t => t.classList.remove('active'));
          img.classList.add('active');
          initZoom();
        });
        thumbContainer.appendChild(img);
      });
    }

    if (coverImg) coverImg.src = data.cover;
    if (coverLabel) coverLabel.textContent = data.label;
    if (coverTitle) coverTitle.textContent = data.collectionTitle;
    if (coverText) coverText.textContent = data.collectionDesc;
    if (coverBlock) coverBlock.setAttribute('data-open-modal', themeId);

    if (otherGrid) {
      otherGrid.innerHTML = '';
      Object.keys(PRODUCTS_DATA).forEach(key => {
        if (key === themeId) return;
        const p = PRODUCTS_DATA[key];
        const card = document.createElement('div');
        card.className = 'other-card';
        card.innerHTML = `
          <div class="other-card__img" style="background-image: url('${p.cover}')"></div>
          <div class="other-card__content">
            <h4>${p.collectionTitle}</h4>
            <p>${p.label}</p>
          </div>
        `;
        card.addEventListener('click', () => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          setTimeout(() => loadProduct(key), 300);
        });
        otherGrid.appendChild(card);
      });
    }

    initZoom();
  }

  loadProduct(currentTheme);

  window.addEventListener('popstate', () => {
    const newTheme = new URLSearchParams(window.location.search).get('theme') || 'mission';
    loadProduct(newTheme);
  });

  function initZoom() {
    const container = document.getElementById('zoom-container');
    const img = document.getElementById('main-image');
    const lens = document.getElementById('zoom-lens');
    if (!container || !img || !lens) return;
    
    if (('ontouchstart' in window) || (navigator.maxTouchPoints > 0)) {
      lens.style.display = 'none'; return;
    }

    const zoomLevel = 2.5; 
    lens.style.backgroundImage = `url('${img.src}')`;
    lens.style.backgroundRepeat = 'no-repeat';
    lens.style.backgroundSize = `${container.offsetWidth * zoomLevel}px ${container.offsetHeight * zoomLevel}px`;

    container.addEventListener('mousemove', (e) => {
      lens.style.display = 'block';
      const rect = container.getBoundingClientRect();
      let x = e.clientX - rect.left;
      let y = e.clientY - rect.top;
      let lensX = x - lens.offsetWidth / 2;
      let lensY = y - lens.offsetHeight / 2;

      if (lensX < 0) lensX = 0;
      if (lensY < 0) lensY = 0;
      if (lensX > rect.width - lens.offsetWidth) lensX = rect.width - lens.offsetWidth;
      if (lensY > rect.height - lens.offsetHeight) lensY = rect.height - lens.offsetHeight;

      lens.style.left = `${lensX}px`;
      lens.style.top = `${lensY}px`;

      const bgWidth = container.offsetWidth * zoomLevel;
      const bgHeight = container.offsetHeight * zoomLevel;
      lens.style.backgroundPosition = `${-lensX * (bgWidth / rect.width)}px ${-lensY * (bgHeight / rect.height)}px`;
    });

    container.addEventListener('mouseleave', () => { lens.style.display = 'none'; });
  }

  const modal = document.getElementById('collection-modal');
  const modalImg = document.getElementById('modal-img');
  const modalLabel = document.getElementById('modal-label');
  const modalTitle = document.getElementById('modal-title');
  const modalText1 = document.getElementById('modal-text-1');
  const modalText2 = document.getElementById('modal-text-2');

  function openModal(key) {
    const data = COLLECTION_INFO[key];
    if (!data || !modal) return;
    if (modalLabel) modalLabel.textContent = data.label;
    if (modalTitle) modalTitle.textContent = data.title;
    if (modalText1) modalText1.textContent = data.text1;
    if (modalText2) modalText2.textContent = data.text2;
    if (modalImg) {
      modalImg.src = data.img;
      modalImg.alt = data.title;
    }
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (modal) modal.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  document.body.addEventListener('click', (e) => {
    const openBtn = e.target.closest('[data-open-modal]');
    if (openBtn) openModal(openBtn.dataset.openModal);
    if (e.target.closest('[data-close-modal]')) closeModal();
  });

  const contactModal = document.getElementById('contact-modal');
  const openContactBtn = document.getElementById('open-contact-modal');

  if (openContactBtn && contactModal) {
    openContactBtn.addEventListener('click', () => {
      contactModal.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    });

    contactModal.querySelectorAll('[data-close-contact]').forEach(el => {
      el.addEventListener('click', () => {
        contactModal.classList.remove('is-open');
        document.body.style.overflow = '';
      });
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (modal?.classList.contains('is-open')) closeModal();
      if (contactModal?.classList.contains('is-open')) {
        contactModal.classList.remove('is-open');
        document.body.style.overflow = '';
      }
    }
  });

  const scrollTopBtn = document.getElementById('scroll-top');
  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) scrollTopBtn.classList.add('is-visible');
      else scrollTopBtn.classList.remove('is-visible');
    });
    scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }
});