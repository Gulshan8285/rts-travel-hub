/* ==========================================================================
   RTS TRAVEL HUB - CORE APPLICATION CONTROLLER
   Clean White Theme & Smooth Left-to-Right Swipeable Carousels
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Booking Engine
  try {
    window.bookingEngine = new window.BookingEngine();
  } catch (err) {
    console.warn('Booking Engine initialization error:', err);
  }

  // 2. Initialize Interactive Gallery Lightbox
  try {
    window.galleryLightbox = new window.GalleryLightbox();
  } catch (err) {
    console.warn('Gallery Lightbox initialization error:', err);
  }

  // 3. Initialize Horizontal Search Bar & Modals
  initHorizontalSearchRibbon();

  // 4. Initialize Smooth Carousel Navigation Arrows
  initCarouselArrows();

  // 5. Fleet Card "Book Now" buttons
  const fleetBookBtns = document.querySelectorAll('.fleet-book-btn');
  fleetBookBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const carType = e.currentTarget.getAttribute('data-car');
      if (carType) {
        // Sync select dropdown
        const hCarSelect = document.getElementById('h-car-type');
        if (hCarSelect) hCarSelect.value = carType;

        if (window.bookingEngine) {
          window.bookingEngine.selectedCar = carType;
          window.bookingEngine.updateRouteSummary();
          window.bookingEngine.openPassengerModal();
        }
      }
    });
  });
});

function initHorizontalSearchRibbon() {
  const hCarType = document.getElementById('h-car-type');
  const hFindCarBtn = document.getElementById('h-find-car-btn');

  if (hCarType) {
    hCarType.addEventListener('change', (e) => {
      const val = e.target.value;
      if (window.bookingEngine) {
        window.bookingEngine.selectedCar = val;
        window.bookingEngine.updateRouteSummary();
      }
    });
  }

  if (hFindCarBtn) {
    hFindCarBtn.addEventListener('click', () => {
      if (window.bookingEngine) {
        window.bookingEngine.updateRouteSummary();
        window.bookingEngine.openPassengerModal();
      }
    });
  }
}

function initCarouselArrows() {
  // Fleet Track Arrow Controls
  const fleetTrack = document.getElementById('fleet-track');
  const fleetPrev = document.getElementById('fleet-prev-btn');
  const fleetNext = document.getElementById('fleet-next-btn');

  if (fleetTrack && fleetPrev && fleetNext) {
    fleetPrev.addEventListener('click', () => {
      fleetTrack.scrollBy({ left: -320, behavior: 'smooth' });
    });
    fleetNext.addEventListener('click', () => {
      fleetTrack.scrollBy({ left: 320, behavior: 'smooth' });
    });
  }

  // Gallery Track Arrow Controls
  const galleryTrack = document.getElementById('gallery-track');
  const galleryPrev = document.getElementById('gallery-prev-btn');
  const galleryNext = document.getElementById('gallery-next-btn');

  if (galleryTrack && galleryPrev && galleryNext) {
    galleryPrev.addEventListener('click', () => {
      galleryTrack.scrollBy({ left: -280, behavior: 'smooth' });
    });
    galleryNext.addEventListener('click', () => {
      galleryTrack.scrollBy({ left: 280, behavior: 'smooth' });
    });
  }
}
