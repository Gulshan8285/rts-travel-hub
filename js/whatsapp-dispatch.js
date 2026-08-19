/* ==========================================================================
   RTS TRAVEL HUB - WHATSAPP DISPATCHER (TARGET: +91 7412894128)
   Reliable • Safe • Luxury | Govt. MSME: UDYAM-HR-05-0189707
   ========================================================================== */

const DISPATCH_PHONE = '917412894128';

class WhatsAppDispatcher {
  constructor() {
    this.bindVoucherEvents();
  }

  generateBookingId() {
    const timestamp = Date.now().toString().slice(-5);
    return `RTS-CORP-${timestamp}`;
  }

  dispatchToWhatsApp(data) {
    const bookingId = this.generateBookingId();
    const { customer, trip } = data;

    const message = `*🚖 RTS TRAVEL HUB - CORPORATE CAB BOOKING REQUEST*
_Reliable • Safe • Luxury (Govt MSME: UDYAM-HR-05-0189707)_
----------------------------------------
*Booking ID:* ${bookingId}
*Date:* ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}

*👤 PASSENGER DETAILS:*
• *Name:* ${customer.name}
• *Mobile Number:* ${customer.phone}
• *Email:* ${customer.email}
• *Pickup Address:* ${customer.address}

*🗺️ JOURNEY DETAILS:*
• *Trip Mode:* ${trip.type}
• *Route:* ${trip.from} ➔ ${trip.to}
• *Travel Date:* ${customer.date}
• *Pickup Time:* ${customer.time}
• *Est. Distance & Duration:* ${trip.distance} km (${trip.duration})

*🚘 FLEET SELECTED:*
• *Vehicle Category:* ${trip.car}
• *Billing Type:* Standard Corporate Account / Quotation

*📝 SPECIAL REQUIREMENTS:*
${customer.notes}
----------------------------------------
🏢 *RTS TRAVEL HUB*
📜 Govt. MSME Reg: UDYAM-HR-05-0189707
📍 B-26, Vyapar Kendra, Sushant Lok, DLF Phase 1, Gurugram - 122002
📞 Helplines: +91 7412894128 | +91 9811708801 | +91 7409534724
✉️ Email: rtstravelhub@gmail.com
🌐 Facebook: https://www.facebook.com/share/1DXZkn7j9b/
📸 Instagram: @rtstravelhub`;

    const encoded = encodeURIComponent(message);
    const url = `https://wa.me/${DISPATCH_PHONE}?text=${encoded}`;

    // 1. Open WhatsApp
    window.open(url, '_blank');

    // 2. Display Confirmation Voucher
    this.displayVoucher(bookingId, customer, trip);
  }

  displayVoucher(bookingId, customer, trip) {
    const modal = document.getElementById('voucher-modal');
    if (!modal) return;

    document.getElementById('v-booking-id').innerText = bookingId;
    document.getElementById('v-cust-name').innerText = customer.name;
    document.getElementById('v-cust-phone').innerText = customer.phone;
    document.getElementById('v-route').innerText = `${trip.from} ➔ ${trip.to}`;
    document.getElementById('v-vehicle').innerText = trip.car;
    document.getElementById('v-date-time').innerText = `${customer.date} at ${customer.time}`;
    document.getElementById('v-distance').innerText = `${trip.distance} KM (${trip.duration})`;

    modal.classList.add('active');
  }

  bindVoucherEvents() {
    const modal = document.getElementById('voucher-modal');
    const closeBtn = document.getElementById('voucher-close-btn');
    const printBtn = document.getElementById('voucher-print-btn');

    if (closeBtn && modal) {
      closeBtn.addEventListener('click', () => modal.classList.remove('active'));
    }

    if (printBtn) {
      printBtn.addEventListener('click', () => window.print());
    }
  }
}

window.whatsappDispatcher = new WhatsAppDispatcher();
