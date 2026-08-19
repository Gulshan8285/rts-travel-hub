/* ==========================================================================
   RTS TRAVEL HUB - SMART LOCATION AUTO-SUGGESTION ENGINE
   Comprehensive Indian Cities & Corporate Hubs Database
   ========================================================================== */

const INDIAN_LOCATIONS = [
  // Gurgaon & NCR
  { city: 'Gurgaon', landmark: 'DLF Cyber City / Cyber Hub', state: 'Haryana', type: 'hub' },
  { city: 'Gurgaon', landmark: 'DLF Phase 1 (Golf Course Road)', state: 'Haryana', type: 'hub' },
  { city: 'Gurgaon', landmark: 'Golf Course Extension Road', state: 'Haryana', type: 'hub' },
  { city: 'Gurgaon', landmark: 'Sector 29 / Leisure Valley', state: 'Haryana', type: 'city' },
  { city: 'Gurgaon', landmark: 'Sohna Road / Candor TechSpace', state: 'Haryana', type: 'hub' },
  { city: 'Gurgaon', landmark: 'Udyog Vihar Phase 1-5', state: 'Haryana', type: 'hub' },
  { city: 'Gurgaon', landmark: 'Manesar Industrial Hub (IMT)', state: 'Haryana', type: 'hub' },
  { city: 'Gurgaon', landmark: 'IFFCO Chowk / MG Road', state: 'Haryana', type: 'city' },
  { city: 'Gurgaon', landmark: 'Sector 54 / Horizon Center', state: 'Haryana', type: 'hub' },

  // Delhi NCR
  { city: 'Delhi', landmark: 'IGI Airport Terminal 3 (T3)', state: 'Delhi', type: 'airport' },
  { city: 'Delhi', landmark: 'IGI Airport Terminal 1 & 2', state: 'Delhi', type: 'airport' },
  { city: 'Delhi', landmark: 'Aerocity Worldmark Hub', state: 'Delhi', type: 'hub' },
  { city: 'Delhi', landmark: 'Connaught Place (CP Central)', state: 'Delhi', type: 'city' },
  { city: 'Delhi', landmark: 'South Extension / Saket', state: 'Delhi', type: 'city' },
  { city: 'Delhi', landmark: 'Nehru Place Corporate Area', state: 'Delhi', type: 'hub' },
  { city: 'Noida', landmark: 'Sector 62 / Electronic City', state: 'Uttar Pradesh', type: 'hub' },
  { city: 'Noida', landmark: 'Noida Expressway / Sector 128', state: 'Uttar Pradesh', type: 'hub' },
  { city: 'Faridabad', landmark: 'Bata Chowk / Mathura Road', state: 'Haryana', type: 'city' },

  // Hyderabad
  { city: 'Hyderabad', landmark: 'HITEC City / Cyber Towers', state: 'Telangana', type: 'hub' },
  { city: 'Hyderabad', landmark: 'Gachibowli Financial District', state: 'Telangana', type: 'hub' },
  { city: 'Hyderabad', landmark: 'Madhapur / Mindspace IT Park', state: 'Telangana', type: 'hub' },
  { city: 'Hyderabad', landmark: 'Rajiv Gandhi Int. Airport (RGIA)', state: 'Telangana', type: 'airport' },
  { city: 'Hyderabad', landmark: 'Banjara Hills & Jubilee Hills', state: 'Telangana', type: 'city' },
  { city: 'Hyderabad', landmark: 'Secunderabad Central', state: 'Telangana', type: 'city' },
  { city: 'Hyderabad', landmark: 'Kondapur / Whitefields', state: 'Telangana', type: 'hub' },

  // Major Outstation Destinations
  { city: 'Jaipur', landmark: 'Tonk Road / MI Road', state: 'Rajasthan', type: 'city' },
  { city: 'Jaipur', landmark: 'Jaipur International Airport', state: 'Rajasthan', type: 'airport' },
  { city: 'Agra', landmark: 'Taj Expressway / Fatehabad Road', state: 'Uttar Pradesh', type: 'city' },
  { city: 'Chandigarh', landmark: 'Sector 17 / IT Park', state: 'Punjab / Chandigarh', type: 'hub' },
  { city: 'Mumbai', landmark: 'Bandra Kurla Complex (BKC)', state: 'Maharashtra', type: 'hub' },
  { city: 'Mumbai', landmark: 'Chhatrapati Shivaji Airport (BOM)', state: 'Maharashtra', type: 'airport' },
  { city: 'Bangalore', landmark: 'Electronic City / Whitefield', state: 'Karnataka', type: 'hub' },
  { city: 'Bangalore', landmark: 'Kempegowda Int. Airport (BLR)', state: 'Karnataka', type: 'airport' },
  { city: 'Pune', landmark: 'Hinjewadi IT Park / Magarpatta', state: 'Maharashtra', type: 'hub' },
  { city: 'Dehradun', landmark: 'Rajpur Road / Clock Tower', state: 'Uttarakhand', type: 'city' },
  { city: 'Haridwar', landmark: 'Har Ki Pauri / Roorkee Road', state: 'Uttarakhand', type: 'city' },
  { city: 'Shimla', landmark: 'Mall Road / Victory Tunnel', state: 'Himachal Pradesh', type: 'city' },
  { city: 'Manali', landmark: 'Mall Road / Old Manali', state: 'Himachal Pradesh', type: 'city' },
  { city: 'Lucknow', landmark: 'Gomti Nagar / Shaheed Path', state: 'Uttar Pradesh', type: 'hub' },
  { city: 'Ahmedabad', landmark: 'SG Highway / GIFT City', state: 'Gujarat', type: 'hub' },
];

class LocationAutocomplete {
  constructor(inputElement, onSelectCallback) {
    this.input = inputElement;
    this.onSelect = onSelectCallback;
    this.dropdown = null;
    this.init();
  }

  init() {
    if (!this.input) return;

    // Create Dropdown Container
    this.dropdown = document.createElement('div');
    this.dropdown.className = 'autocomplete-dropdown';
    this.input.parentElement.style.position = 'relative';
    this.input.parentElement.appendChild(this.dropdown);

    // Bind Input Listener
    this.input.addEventListener('input', (e) => this.handleInput(e.target.value));
    this.input.addEventListener('focus', (e) => this.handleInput(e.target.value));

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (!this.input.contains(e.target) && !this.dropdown.contains(e.target)) {
        this.dropdown.style.display = 'none';
      }
    });
  }

  handleInput(query) {
    const q = query.trim().toLowerCase();
    let matches = [];

    if (!q) {
      // Show popular hubs if empty
      matches = INDIAN_LOCATIONS.slice(0, 6);
    } else {
      matches = INDIAN_LOCATIONS.filter((item) => {
        return (
          item.city.toLowerCase().includes(q) ||
          item.landmark.toLowerCase().includes(q) ||
          item.state.toLowerCase().includes(q)
        );
      }).slice(0, 8);
    }

    this.renderSuggestions(matches);
  }

  renderSuggestions(list) {
    if (!list || list.length === 0) {
      this.dropdown.style.display = 'none';
      return;
    }

    this.dropdown.innerHTML = '';
    list.forEach((item) => {
      const row = document.createElement('div');
      row.className = 'autocomplete-item';

      let iconClass = 'fa-solid fa-location-dot';
      if (item.type === 'airport') iconClass = 'fa-solid fa-plane-departure';
      if (item.type === 'hub') iconClass = 'fa-solid fa-building';

      row.innerHTML = `
        <div class="auto-icon"><i class="${iconClass}"></i></div>
        <div class="auto-details">
          <div class="auto-title"><strong>${item.city}</strong> - ${item.landmark}</div>
          <div class="auto-state">${item.state}</div>
        </div>
      `;

      row.addEventListener('click', () => {
        this.input.value = `${item.city} (${item.landmark})`;
        this.dropdown.style.display = 'none';
        if (this.onSelect) {
          this.onSelect(item.city, item.landmark);
        }
      });

      this.dropdown.appendChild(row);
    });

    this.dropdown.style.display = 'block';
  }
}

window.LocationAutocomplete = LocationAutocomplete;
