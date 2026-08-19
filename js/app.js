/* ==========================================================================
   RTS TRAVEL HUB - CORE APPLICATION CONTROLLER
   Integrated with Location Auto-Suggest, 24-Hr Time, Fullscreen Gallery Lightbox
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Booking Engine & Autocompletes
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

  // 3. Initialize Route Visualizer
  try {
    window.routeVisualizer = new window.RouteVisualizer('route-canvas');
  } catch (err) {
    console.warn('Route visualizer initialization error:', err);
  }

  // 4. Initialize Horizontal Luxury Search Ribbon Events
  initHorizontalSearchRibbon();

  // 5. Fleet Card "Book This Car" buttons
  const fleetBookBtns = document.querySelectorAll('.fleet-book-btn');
  fleetBookBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const carType = e.currentTarget.getAttribute('data-car');
      if (carType) {
        // Sync horizontal bar
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

  // Sync Car Type
  if (hCarType) {
    hCarType.addEventListener('change', (e) => {
      const val = e.target.value;
      if (window.bookingEngine) {
        window.bookingEngine.selectedCar = val;
        window.bookingEngine.updateRouteSummary();
      }
    });
  }

  // Find Car Action
  if (hFindCarBtn) {
    hFindCarBtn.addEventListener('click', () => {
      if (window.bookingEngine) {
        window.bookingEngine.updateRouteSummary();
        window.bookingEngine.openPassengerModal();
      }
    });
  }
}
