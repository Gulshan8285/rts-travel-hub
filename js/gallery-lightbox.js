/* ==========================================================================
   RTS TRAVEL HUB - INTERACTIVE GALLERY LIGHTBOX VIEWER
   Complete Verified Real Fleet Collection (18 High-Res Photos)
   ========================================================================== */

const GALLERY_DATA = [
  {
    src: 'assets/images/fleet_jio_headoffice.jpg',
    title: 'RTS Corporate Cab at Reliance Jio State Head Office, Gurugram',
    category: 'Corporate Client',
    desc: 'Official corporate mobility operations outside Reliance Jio State Head Office glass facade tower in Gurugram.',
    tag: 'Reliance Jio HQ Partner',
  },
  {
    src: 'assets/images/fleet_amenities_real_basket.jpg',
    title: 'Complimentary In-Cab Hospitality Basket',
    category: 'Executive Amenities',
    desc: 'Complimentary KitKat chocolate minis, Zudio lemon wet wipes, snacks, gachak sweets and facial tissue box.',
    tag: 'VIP Hospitality',
  },
  {
    src: 'assets/images/fleet_innova_white_interior.png',
    title: 'Innova Crysta Pristine White Recliner Cabin',
    category: 'SUV Interior',
    desc: 'Spotless white leather captain seats with ergonomic armrests, clean floor mats, and snack tray.',
    tag: 'White Leather Cabin',
  },
  {
    src: 'assets/images/fleet_lineup_drivers.png',
    title: 'Corporate Innova Fleet Lineup & Uniformed Chauffeurs',
    category: 'Fleet Lineup',
    desc: 'Lineup of 8+ Toyota Innova Crysta cabs with verified corporate chauffeurs in formal white uniform in Gurugram.',
    tag: 'Gurugram Fleet Base',
  },
  {
    src: 'assets/images/fleet_urbania_exterior.jpg',
    title: 'Force Urbania VIP Luxury Van (HR55 AU 7813)',
    category: 'Mini Coach',
    desc: 'Top-tier luxury Force Urbania with DRL LED headlamps, high-roof executive frame, and luxury styling.',
    tag: 'VIP Luxury Urbania',
  },
  {
    src: 'assets/images/fleet_urbania_tan_interior.jpg',
    title: 'Force Urbania Ultra-Luxury Tan Leather Cabin',
    category: 'Mini Coach',
    desc: 'Diamond-stitched tan leather captain recliner seats, premium wood finish flooring, and individual aisle lighting.',
    tag: 'First Class Lounge',
  },
  {
    src: 'assets/images/fleet_urbania_tan_seats.jpg',
    title: 'Force Urbania Individual Recliner Lounge Seats',
    category: 'Mini Coach',
    desc: 'Ergonomic lumbar support, personal luggage overhead racks, individual AC vents, and armrests.',
    tag: 'Executive Recliners',
  },
  {
    src: 'assets/images/fleet_tempo_indiagate.png',
    title: 'Force Tempo Traveller & Chauffeur (HR55 AP 3995)',
    category: 'Mini Coach',
    desc: 'Deluxe 12-26 seater Force Tempo Traveller with professional chauffeur near Delhi India Gate corridor.',
    tag: 'Executive Mini Coach',
  },
  {
    src: 'assets/images/fleet_lotus_temple.jpg',
    title: 'RTS Fleet at Lotus Temple, Delhi',
    category: 'Mini Coach & SUV',
    desc: 'Force Tempo Traveller & Toyota Innova Crysta with professional chauffeurs greeting in Namaste.',
    tag: 'Verified Chauffeurs',
  },
  {
    src: 'assets/images/fleet_chauffeur_innova.png',
    title: 'Executive Chauffeur & Innova Crysta (HR38 Z 4746)',
    category: 'SUV',
    desc: 'Courteous, background-verified chauffeur in formal corporate uniform with Toyota Innova Crysta.',
    tag: 'Premium Chauffeur',
  },
  {
    src: 'assets/images/fleet_innova_az4699.jpg',
    title: 'Toyota Innova Crysta Executive Edition (HR55 AZ 4699)',
    category: 'SUV',
    desc: 'Premium chrome grille and crystal LED projector headlamps on executive Toyota Innova Crysta.',
    tag: 'Luxury Innova Crysta',
  },
  {
    src: 'assets/images/fleet_innova_white_front.png',
    title: 'Toyota Innova Crysta (HR55 AR 1170)',
    category: 'SUV',
    desc: 'Front executive profile of pearl white Toyota Innova Crysta for corporate client movement.',
    tag: 'Executive SUV',
  },
  {
    src: 'assets/images/fleet_innova_white_side.jpg',
    title: 'Toyota Innova Crysta Side Profile',
    category: 'SUV',
    desc: 'Spacious 6+1 and 7+1 seating layout with large glasshouse and smooth highway suspension.',
    tag: 'Comfort SUV',
  },
  {
    src: 'assets/images/fleet_innova_luggage.png',
    title: 'Innova Crysta Large Luggage Bay',
    category: 'SUV',
    desc: 'Expansive boot space for corporate luggage, executive bags, and complimentary packaged mineral water.',
    tag: 'Spacious Luggage Bay',
  },
  {
    src: 'assets/images/fleet_traveller_interior.png',
    title: 'VIP Tempo Traveller Ambient Cabin Interior',
    category: 'Mini Coach',
    desc: 'Plush recliner leather seats, ambient ceiling lighting, individual AC vents and spacious aisle.',
    tag: 'Luxury Recliner Cabin',
  },
  {
    src: 'assets/images/fleet_tempo_side.png',
    title: 'Force Tempo Traveller Deluxe Coach',
    category: 'Mini Coach',
    desc: 'Luxury AC mini coach for corporate offsites, delegational transport, and team summits.',
    tag: 'Delegation Transport',
  },
  {
    src: 'assets/images/amenities.jpg',
    title: 'Complimentary In-Cab Amenities & Mineral Water',
    category: 'Amenities',
    desc: 'Complimentary chocolates, sealed mineral water bottles, sanitizers, and tissue boxes.',
    tag: 'Complimentary Treats',
  },
  {
    src: 'assets/images/fleet_hub.jpg',
    title: 'RTS Travel Hub Base - DLF Phase 1, Gurugram',
    category: 'Operations Hub',
    desc: '24/7 centralized dispatch and sanitized fleet maintenance center in DLF Phase 1 Gurgaon.',
    tag: '24/7 Hub Base',
  },
];

class GalleryLightbox {
  constructor() {
    this.currentIndex = 0;
    this.lightboxEl = document.getElementById('gallery-lightbox-modal');
    this.imgEl = document.getElementById('lightbox-main-img');
    this.titleEl = document.getElementById('lightbox-title');
    this.descEl = document.getElementById('lightbox-desc');
    this.categoryEl = document.getElementById('lightbox-category');
    this.counterEl = document.getElementById('lightbox-counter');
    this.thumbsContainer = document.getElementById('lightbox-thumbnails');

    this.init();
  }

  init() {
    if (!this.lightboxEl) return;

    this.bindGalleryTriggers();
    this.bindControls();
    this.buildThumbnails();
  }

  bindGalleryTriggers() {
    const galleryItems = document.querySelectorAll('.gallery-grid-item, .open-gallery-btn');
    galleryItems.forEach((item) => {
      item.addEventListener('click', (e) => {
        const index = parseInt(item.getAttribute('data-index') || 0, 10);
        this.open(index);
      });
    });
  }

  buildThumbnails() {
    if (!this.thumbsContainer) return;
    this.thumbsContainer.innerHTML = '';

    GALLERY_DATA.forEach((item, idx) => {
      const thumb = document.createElement('div');
      thumb.className = `lightbox-thumb ${idx === this.currentIndex ? 'active' : ''}`;
      thumb.innerHTML = `<img src="${item.src}" alt="${item.title}">`;
      thumb.addEventListener('click', () => this.show(idx));
      this.thumbsContainer.appendChild(thumb);
    });
  }

  open(index = 0) {
    this.currentIndex = index;
    this.show(this.currentIndex);
    this.lightboxEl.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  close() {
    this.lightboxEl.classList.remove('active');
    document.body.style.overflow = '';
  }

  show(index) {
    if (index < 0) index = GALLERY_DATA.length - 1;
    if (index >= GALLERY_DATA.length) index = 0;

    this.currentIndex = index;
    const data = GALLERY_DATA[index];

    if (this.imgEl) {
      this.imgEl.style.opacity = '0';
      setTimeout(() => {
        this.imgEl.src = data.src;
        this.imgEl.alt = data.title;
        this.imgEl.style.opacity = '1';
      }, 150);
    }

    if (this.titleEl) this.titleEl.innerText = data.title;
    if (this.descEl) this.descEl.innerText = data.desc;
    if (this.categoryEl) this.categoryEl.innerText = `${data.category} • ${data.tag}`;
    if (this.counterEl) this.counterEl.innerText = `${index + 1} / ${GALLERY_DATA.length}`;

    // Update Thumbnails Active State
    const thumbs = this.thumbsContainer ? this.thumbsContainer.querySelectorAll('.lightbox-thumb') : [];
    thumbs.forEach((t, i) => {
      t.classList.toggle('active', i === index);
      if (i === index) {
        t.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    });
  }

  next() {
    this.show(this.currentIndex + 1);
  }

  prev() {
    this.show(this.currentIndex - 1);
  }

  bindControls() {
    const closeBtn = document.getElementById('lightbox-close-btn');
    const nextBtn = document.getElementById('lightbox-next-btn');
    const prevBtn = document.getElementById('lightbox-prev-btn');

    if (closeBtn) closeBtn.addEventListener('click', () => this.close());
    if (nextBtn) nextBtn.addEventListener('click', () => this.next());
    if (prevBtn) prevBtn.addEventListener('click', () => this.prev());

    // Close on backdrop click
    this.lightboxEl.addEventListener('click', (e) => {
      if (e.target === this.lightboxEl) this.close();
    });

    // Keyboard support
    document.addEventListener('keydown', (e) => {
      if (!this.lightboxEl.classList.contains('active')) return;
      if (e.key === 'Escape') this.close();
      if (e.key === 'ArrowRight') this.next();
      if (e.key === 'ArrowLeft') this.prev();
    });

    // Touch Swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    this.lightboxEl.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    this.lightboxEl.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      if (touchEndX < touchStartX - 50) this.next();
      if (touchEndX > touchStartX + 50) this.prev();
    }, { passive: true });
  }
}

window.GalleryLightbox = GalleryLightbox;
