/* ==========================================================================
   RTS TRAVEL HUB - BOOKING ENGINE (SIMPLIFIED TRIP MODES & VALIDATION)
   Reliable • Safe • Luxury (Govt MSME: UDYAM-HR-05-0189707)
   ========================================================================== */

const ROUTE_DATABASE = {
  'gurgaon-hyderabad': { distance: 1580, duration: '26 hrs', expressway: 'NH-44 Pan-India Expressway' },
  'delhi-hyderabad': { distance: 1595, duration: '26 hrs', expressway: 'NH-44 Pan-India Expressway' },
  'gurgaon-jaipur': { distance: 240, duration: '4 hrs', expressway: 'Delhi-Jaipur Expressway' },
  'delhi-jaipur': { distance: 270, duration: '4.5 hrs', expressway: 'NH-48 Corridor' },
  'gurgaon-agra': { distance: 210, duration: '3.5 hrs', expressway: 'Yamuna Expressway' },
  'delhi-agra': { distance: 230, duration: '3.5 hrs', expressway: 'Yamuna Expressway' },
  'gurgaon-chandigarh': { distance: 295, duration: '5 hrs', expressway: 'KMP / NH-44 Expressway' },
  'delhi-chandigarh': { distance: 250, duration: '4.5 hrs', expressway: 'NH-44 Corridor' },
  'gurgaon-mumbai': { distance: 1420, duration: '22 hrs', expressway: 'Delhi-Mumbai Expressway' },
  'gurgaon-bangalore': { distance: 2140, duration: '34 hrs', expressway: 'NH-44 Corridor' },
  'gurgaon-pune': { distance: 1460, duration: '23 hrs', expressway: 'NH-48 Western Corridor' },
  'gurgaon-dehradun': { distance: 285, duration: '5.5 hrs', expressway: 'Delhi-Dehradun Expressway' },
  'gurgaon-manali': { distance: 570, duration: '12 hrs', expressway: 'Kiratpur-Manali Highway' },
  'gurgaon-lucknow': { distance: 550, duration: '8 hrs', expressway: 'Agra-Lucknow Expressway' },
  'gurgaon-igi-airport': { distance: 18, duration: '35 mins', expressway: 'Delhi-Gurgaon Expressway' },
  'delhi-igi-airport': { distance: 16, duration: '30 mins', expressway: 'Airport Express Highway' },
};

const CAR_NAMES = {
  innova: 'Toyota Innova Crysta / Hycross (6+1 / 7+1 Premium SUV)',
  urbania: 'Force Urbania VIP (10 to 17 Seater Luxury Van)',
  fortuner: 'Toyota Fortuner (VIP 4x4 Executive SUV)',
  ertiga: 'Maruti Ertiga / Toyota Rumion (6+1 Executive MPV)',
  carens: 'Kia Carens (6+1 Executive MPV)',
  sedan: 'Executive Sedan (Swift Dzire / Etios / Aura / Verna)',
  traveller: 'Force Tempo Traveller (12-26 Seater) / Mini Coach',
};

class BookingEngine {
  constructor() {
    this.tripType = 'outstation';
    this.pickupCity = 'Gurgaon';
    this.dropCity = 'Hyderabad';
    this.selectedCar = 'innova';
    this.pickupDate = '';
    this.pickupTime = '07:00 (Morning)';
    this.routeData = {
      distance: 1580,
      duration: '26 hrs',
      expressway: 'NH-44 Pan-India Expressway',
    };

    this.init();
  }

  init() {
    this.bindTripTabs();
    this.bindInputs();
    this.bindModalEvents();
    this.setupDateRestrictions();
    this.updateRouteSummary();
  }

  setupDateRestrictions() {
    const hDateInput = document.getElementById('h-pickup-date');
    if (!hDateInput) return;

    // 1. Get today's local date YYYY-MM-DD
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const todayStr = `${yyyy}-${mm}-${dd}`;

    // 2. Set min attribute so PAST DATES CANNOT BE SELECTED
    hDateInput.setAttribute('min', todayStr);

    // 3. Default to today
    this.pickupDate = todayStr;
    hDateInput.value = todayStr;

    hDateInput.addEventListener('change', (e) => {
      if (e.target.value < todayStr) {
        alert('Past dates cannot be selected. Please choose today or a future date.');
        e.target.value = todayStr;
      }
      this.pickupDate = e.target.value;
    });
  }

  bindTripTabs() {
    const tabs = document.querySelectorAll('.search-service-tab');
    tabs.forEach((tab) => {
      tab.addEventListener('click', (e) => {
        tabs.forEach((t) => t.classList.remove('active'));
        e.currentTarget.classList.add('active');
        const mode = e.currentTarget.getAttribute('data-service');
        this.tripType = mode === 'airport' ? 'airport' : mode === 'local' ? 'local' : 'outstation';
        
        const hBookingMode = document.getElementById('h-booking-mode');
        if (hBookingMode) hBookingMode.value = this.tripType;

        this.adjustUIForTripType();
        this.updateRouteSummary();
      });
    });
  }

  adjustUIForTripType() {
    const hDropCol = document.getElementById('h-drop-col');
    const hDropInput = document.getElementById('h-drop-input');

    if (this.tripType === 'local') {
      if (hDropCol) hDropCol.style.display = 'none';
    } else if (this.tripType === 'airport') {
      if (hDropCol) hDropCol.style.display = 'flex';
      if (hDropInput && !hDropInput.value.trim()) {
        hDropInput.value = 'Delhi IGI Airport Terminal 3';
        this.dropCity = 'Delhi IGI Airport Terminal 3';
      }
    } else {
      if (hDropCol) hDropCol.style.display = 'flex';
    }
  }

  bindInputs() {
    const hPickupInput = document.getElementById('h-pickup-input');
    const hDropInput = document.getElementById('h-drop-input');
    const hCarSelect = document.getElementById('h-car-type');
    const hTimeSelect = document.getElementById('h-pickup-time');
    const hBookingMode = document.getElementById('h-booking-mode');

    // Customer types freely in Pickup City
    if (hPickupInput) {
      hPickupInput.addEventListener('input', (e) => {
        this.pickupCity = e.target.value.trim() || 'Gurgaon';
        this.updateRouteSummary();
      });
    }

    // Customer types freely in Destination City
    if (hDropInput) {
      hDropInput.addEventListener('input', (e) => {
        this.dropCity = e.target.value.trim() || 'Destination';
        this.updateRouteSummary();
      });
    }

    if (hCarSelect) {
      hCarSelect.addEventListener('change', (e) => {
        this.selectedCar = e.target.value;
        this.updateRouteSummary();
      });
    }

    if (hTimeSelect) {
      hTimeSelect.addEventListener('change', (e) => {
        this.pickupTime = e.target.value;
      });
    }

    if (hBookingMode) {
      hBookingMode.addEventListener('change', (e) => {
        this.tripType = e.target.value;
        this.adjustUIForTripType();
        this.updateRouteSummary();
      });
    }
  }

  getRouteDistance(from, to) {
    const cleanFrom = (from || '').toLowerCase().replace(/[^a-z0-9]/g, ' ').trim();
    const cleanTo = (to || '').toLowerCase().replace(/[^a-z0-9]/g, ' ').trim();

    for (const [key, val] of Object.entries(ROUTE_DATABASE)) {
      const [kFrom, kTo] = key.split('-');
      if ((cleanFrom.includes(kFrom) && cleanTo.includes(kTo)) || (cleanFrom.includes(kTo) && cleanTo.includes(kFrom))) {
        return val;
      }
    }

    const estimatedDist = Math.floor(Math.random() * 350) + 250;
    return {
      distance: estimatedDist,
      duration: `${Math.round(estimatedDist / 60)} hrs`,
      expressway: 'Direct National Highway',
    };
  }

  updateRouteSummary() {
    let distance = 0;
    let duration = '';
    let expressway = 'Direct Highway';

    const cleanPickup = this.pickupCity.trim() || 'Gurgaon';
    const cleanDrop = this.dropCity.trim() || 'Destination';

    if (this.tripType === 'local') {
      distance = 80;
      duration = '8 Hours Local Disposal';
      expressway = 'Delhi NCR Local Chauffeur Standby';
    } else if (this.tripType === 'airport') {
      distance = 25;
      duration = '45 Mins';
      expressway = 'Airport Terminal Express';
    } else {
      const info = this.getRouteDistance(cleanPickup, cleanDrop);
      distance = info.distance;
      duration = info.duration;
      expressway = info.expressway;
    }

    this.routeData = { distance, duration, expressway };
  }

  openPassengerModal() {
    const modal = document.getElementById('booking-modal');
    if (!modal) return;

    const hpInput = document.getElementById('h-pickup-input');
    const hdInput = document.getElementById('h-drop-input');
    const hDateInput = document.getElementById('h-pickup-date');

    const fromCity = hpInput ? hpInput.value.trim() || 'Gurgaon' : this.pickupCity;
    const toCity = hdInput ? hdInput.value.trim() || 'Destination' : this.dropCity;
    const travelDate = hDateInput ? hDateInput.value : this.pickupDate;

    this.pickupCity = fromCity;
    this.dropCity = toCity;
    this.pickupDate = travelDate;

    const modalRoute = document.getElementById('modal-summary-route');
    const modalCar = document.getElementById('modal-summary-car');
    const modalTime = document.getElementById('modal-summary-time');

    if (modalRoute) {
      modalRoute.innerText = this.tripType === 'local' 
        ? `${fromCity} • Full-Day Local Disposal`
        : `${fromCity} ➔ ${toCity} (${this.routeData.distance} km)`;
    }
    if (modalCar) modalCar.innerText = CAR_NAMES[this.selectedCar] || 'Executive Fleet';
    if (modalTime) modalTime.innerText = `Pickup: ${travelDate} at ${this.pickupTime}`;

    modal.classList.add('active');
  }

  bindModalEvents() {
    const modal = document.getElementById('booking-modal');
    const closeBtn = document.getElementById('modal-close-btn');
    const form = document.getElementById('passenger-form');

    if (closeBtn && modal) {
      closeBtn.addEventListener('click', () => modal.classList.remove('active'));
    }

    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('active');
      });
    }

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.submitBooking();
      });
    }
  }

  submitBooking() {
    const name = document.getElementById('cust-name').value.trim();
    const phone = document.getElementById('cust-phone').value.trim();
    const email = document.getElementById('cust-email') ? document.getElementById('cust-email').value.trim() : '';
    const address = document.getElementById('cust-address') ? document.getElementById('cust-address').value.trim() : '';
    const notes = document.getElementById('cust-notes') ? document.getElementById('cust-notes').value.trim() : '';
    const dateInput = document.getElementById('h-pickup-date');

    // STRICT VALIDATION: Name, Mobile, Email, and Pickup Address are MANDATORY. Only Notes/Message is optional.
    if (!name) {
      alert('Please enter Passenger Full Name.');
      document.getElementById('cust-name').focus();
      return;
    }

    if (!phone || phone.length < 10) {
      alert('Please enter a valid 10-digit Mobile Number.');
      document.getElementById('cust-phone').focus();
      return;
    }

    if (!email || !email.includes('@')) {
      alert('Please enter a valid Email ID (e.g. name@company.com).');
      document.getElementById('cust-email').focus();
      return;
    }

    if (!address) {
      alert('Please enter exact Pickup Address / Location.');
      document.getElementById('cust-address').focus();
      return;
    }

    const modal = document.getElementById('booking-modal');
    if (modal) modal.classList.remove('active');

    // Trip type label for dispatch
    const tripTypeLabel = this.tripType === 'local' ? 'FULL-DAY LOCAL DISPOSAL' : this.tripType === 'airport' ? 'AIRPORT TRANSFER' : 'OUTSTATION';

    // ROUTE DIRECTLY TO WHATSAPP (+91 7412894128)
    if (window.whatsappDispatcher) {
      window.whatsappDispatcher.dispatchToWhatsApp({
        customer: {
          name,
          phone,
          email,
          address,
          notes: notes || 'None',
          date: dateInput ? dateInput.value : this.pickupDate,
          time: this.pickupTime,
        },
        trip: {
          type: tripTypeLabel,
          from: this.pickupCity,
          to: this.tripType === 'local' ? 'Local Disposal (City)' : this.dropCity,
          car: CAR_NAMES[this.selectedCar] || 'Executive Cab',
          distance: this.routeData.distance,
          duration: this.routeData.duration,
        },
      });
    }
  }
}

window.BookingEngine = BookingEngine;
