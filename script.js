/* ═══════════════════════════════════════════
   BUS TRAVEL — Main Application Logic
   Full-page scroll-driven background animation
   ═══════════════════════════════════════════ */

// ── Data ──
const cities = [
  'Hyderabad','Bangalore','Chennai','Mumbai','Delhi',
  'Pune','Kolkata','Ahmedabad','Jaipur','Goa',
  'Vizag','Vijayawada','Tirupati','Mysore','Coimbatore'
];

const busOperators = [
  { name: 'SRIVORATECH Travels', rating: 4.9, reviews: 4890 },
  { name: 'Royal Travels', rating: 4.5, reviews: 2340 },
  { name: 'SRS Travels', rating: 4.2, reviews: 1890 },
  { name: 'Kaveri Travels', rating: 4.7, reviews: 3120 },
  { name: 'VRL Travels', rating: 4.3, reviews: 2780 },
  { name: 'Orange Tours', rating: 4.1, reviews: 1560 },
  { name: 'KPN Travels', rating: 4.6, reviews: 2190 },
  { name: 'Jabbar Travels', rating: 4.0, reviews: 980 },
  { name: 'APSRTC', rating: 3.9, reviews: 5430 },
  { name: 'KSRTC', rating: 4.0, reviews: 4210 },
  { name: 'Greenline Travels', rating: 4.4, reviews: 1670 },
];

const busTypes = [
  'Volvo Multi-Axle AC Sleeper','AC Seater (2+2)','Non-AC Seater',
  'AC Sleeper (2+1)','Scania Multi-Axle AC','Mercedes AC Semi-Sleeper',
  'Non-AC Sleeper (2+1)','Volvo AC Seater (2+1)',
];

const amenityIcons = ['🔌','❄️','💧','📶','🎵','🍿','🔋','🛏️'];
const amenityLabels = ['Charging','AC','Water','WiFi','Music','Snacks','Power Bank','Blanket'];

const popularRoutes = [
  { from:'Hyderabad', to:'Bangalore', duration:'8h 30m', buses:245, price:799 },
  { from:'Chennai', to:'Bangalore', duration:'6h 15m', buses:180, price:649 },
  { from:'Mumbai', to:'Pune', duration:'3h 45m', buses:320, price:399 },
  { from:'Delhi', to:'Jaipur', duration:'5h 30m', buses:210, price:549 },
  { from:'Hyderabad', to:'Vijayawada', duration:'5h 00m', buses:190, price:499 },
  { from:'Bangalore', to:'Goa', duration:'10h 00m', buses:135, price:899 },
];

const trackingStops = [
  { name:'Hyderabad (Ameerpet)', time:'22:00', status:'passed' },
  { name:'LB Nagar', time:'22:45', status:'passed' },
  { name:'Kurnool', time:'01:30', status:'passed' },
  { name:'Anantapur', time:'03:15', status:'current' },
  { name:'Penukonda', time:'04:00', status:'upcoming' },
  { name:'Hindupur', time:'04:45', status:'upcoming' },
  { name:'Bangalore (Majestic)', time:'06:30', status:'upcoming' },
];

const travelTips = [
  { icon:'🎫', title:'Book Early', desc:'Book tickets 3-5 days in advance for best prices and preferred seats. Weekend fares are usually higher.' },
  { icon:'🔒', title:'Stay Safe', desc:'Keep valuables secure, share live location with family, and always carry a valid ID proof while traveling.' },
  { icon:'🎒', title:'Pack Smart', desc:'Carry essentials in a small bag — charger, water, snacks, earphones, and a light blanket for AC buses.' },
  { icon:'📱', title:'Track Live', desc:'Use our live tracking to know exact bus location, ETA, and stops. Share tracking link with family.' },
  { icon:'💺', title:'Choose Right Seat', desc:'Window seats in rows 3-8 offer best ride quality. Avoid last row seats on bumpy routes.' },
  { icon:'🌙', title:'Night Travel', desc:'Opt for sleeper buses for overnight journeys. Set a phone alarm 30 mins before your stop.' },
  { icon:'💰', title:'Save Money', desc:'Compare operators, use coupon codes, and check for cashback offers. Non-AC buses cost 40% less.' },
  { icon:'⭐', title:'Rate & Review', desc:'Rate your journey to help other travelers. Look for buses with 4+ rating and 500+ reviews.' },
];

// ── State ──
let selectedSeats = [];
let currentBus = null;
let searchResults = [];

// ══════════════════════════════════════════════
// ── FULL-PAGE Scroll Animation (Background)
// ══════════════════════════════════════════════

const canvas = document.getElementById('scrollCanvas');
const ctx = canvas.getContext('2d');
const TOTAL_FRAMES = 300;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const framePaths = [];
for (let i = 1; i <= TOTAL_FRAMES; i++) {
  framePaths.push(`BUS TRAVEL/ezgif-frame-${String(i).padStart(3, '0')}.jpg`);
}

const images = [];
let loadedCount = 0;

function preloadImages() {
  return new Promise((resolve) => {
    framePaths.forEach((src, index) => {
      const img = new Image();
      img.src = src;
      img.onload = img.onerror = () => {
        loadedCount++;
        if (loadedCount === TOTAL_FRAMES) resolve();
      };
      images[index] = img;
    });
  });
}

function drawFrame(index) {
  const img = images[index];
  if (!img || !img.complete || img.naturalWidth === 0) return;
  const cw = canvas.width, ch = canvas.height;
  const iw = img.naturalWidth, ih = img.naturalHeight;
  const scale = Math.max(cw / iw, ch / ih);
  const sw = iw * scale, sh = ih * scale;
  ctx.clearRect(0, 0, cw, ch);
  ctx.drawImage(img, (cw - sw) / 2, (ch - sh) / 2, sw, sh);
}

let currentFrame = 0, targetFrame = 0, animatingBg = false;

// Maps scroll across the ENTIRE page to the 300 frames
function getScrollFrame() {
  const scrollTop = window.scrollY;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  if (maxScroll <= 0) return 0;
  const fraction = Math.min(1, scrollTop / maxScroll);
  return Math.min(TOTAL_FRAMES - 1, Math.floor(fraction * TOTAL_FRAMES));
}

function lerp(a, b, t) { return a + (b - a) * t; }

function animateBg() {
  targetFrame = getScrollFrame();
  currentFrame = lerp(currentFrame, targetFrame, 0.15);
  drawFrame(Math.round(currentFrame));

  if (Math.abs(currentFrame - targetFrame) > 0.1) {
    requestAnimationFrame(animateBg);
  } else {
    currentFrame = targetFrame;
    drawFrame(targetFrame);
    animatingBg = false;
  }
}

function onScroll() {
  if (!animatingBg) {
    animatingBg = true;
    requestAnimationFrame(animateBg);
  }
}

// ══════════════════════════════════════════════
// ── Navigation ──
// ══════════════════════════════════════════════

function initNav() {
  const nav = document.querySelector('.nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 80);
  }, { passive: true });
}

// ══════════════════════════════════════════════
// ── Reveal Animations ──
// ══════════════════════════════════════════════

function initRevealAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// ══════════════════════════════════════════════
// ── Booking / Search ──
// ══════════════════════════════════════════════

function searchBuses() {
  const from = document.getElementById('from').value;
  const to = document.getElementById('to').value;
  const date = document.getElementById('date').value;
  const passengers = document.getElementById('passengers').value;

  if (!from || !to || !date) { showToast('Please fill in all search fields','error'); return; }
  if (from === to) { showToast('Origin and destination cannot be the same','error'); return; }

  searchResults = generateBuses(from, to, parseInt(passengers) || 1);
  renderBusResults(from, to, date, searchResults);

  const resultsSection = document.getElementById('results');
  resultsSection.classList.add('show');
  resultsSection.scrollIntoView({ behavior:'smooth', block:'start' });
  showToast(`Found ${searchResults.length} buses from ${from} to ${to}`,'success');
}

function generateBuses(from, to, passengers) {
  const count = 6 + Math.floor(Math.random() * 5);
  const buses = [];
  for (let i = 0; i < count; i++) {
    const operator = busOperators[Math.floor(Math.random() * busOperators.length)];
    const type = busTypes[Math.floor(Math.random() * busTypes.length)];
    const depHour = 18 + Math.floor(Math.random() * 8);
    const depMin = Math.floor(Math.random() * 60);
    const durationH = 4 + Math.floor(Math.random() * 9);
    const durationM = Math.floor(Math.random() * 60);
    const arrHour = (depHour + durationH) % 24;
    const arrMin = (depMin + durationM) % 60;
    const amenityCount = 3 + Math.floor(Math.random() * 4);
    const selectedAmenities = [];
    const usedIndices = new Set();
    while (selectedAmenities.length < amenityCount) {
      const idx = Math.floor(Math.random() * amenityIcons.length);
      if (!usedIndices.has(idx)) {
        usedIndices.add(idx);
        selectedAmenities.push({ icon: amenityIcons[idx], label: amenityLabels[idx] });
      }
    }
    const basePrice = 400 + Math.floor(Math.random() * 900);
    const totalSeats = 36;
    const bookedSeats = Math.floor(Math.random() * 28);
    buses.push({
      id:`BUS-${Date.now()}-${i}`, operator:operator.name, rating:operator.rating,
      reviews:operator.reviews, type,
      departure:`${String(depHour%24).padStart(2,'0')}:${String(depMin).padStart(2,'0')}`,
      arrival:`${String(arrHour).padStart(2,'0')}:${String(arrMin).padStart(2,'0')}`,
      duration:`${durationH}h ${durationM}m`, from, to,
      amenities:selectedAmenities, price:basePrice,
      totalSeats, bookedSeats, availableSeats: totalSeats - bookedSeats,
    });
  }
  return buses.sort((a, b) => a.price - b.price);
}

function renderBusResults(from, to, date, buses) {
  const container = document.getElementById('busList');
  const header = document.getElementById('resultsHeader');
  header.innerHTML = `
    <div class="section-badge">🔍 Search Results</div>
    <h2 class="section-title">${from} <span class="highlight">→</span> ${to}</h2>
    <p class="section-subtitle">${buses.length} buses found for ${new Date(date).toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}</p>
  `;
  container.innerHTML = buses.map((bus, idx) => `
    <div class="bus-card reveal visible" style="animation-delay:${idx*0.08}s">
      <div class="bus-info">
        <h3>${bus.operator}</h3>
        <div class="bus-type">${bus.type}</div>
        <span class="bus-rating">★ ${bus.rating} <span style="color:var(--text-muted);font-weight:400">(${bus.reviews})</span></span>
      </div>
      <div class="bus-schedule">
        <div class="bus-time"><div class="time">${bus.departure}</div><div class="city">${bus.from}</div></div>
        <div class="bus-duration"><span>${bus.duration}</span><div class="line"></div></div>
        <div class="bus-time"><div class="time">${bus.arrival}</div><div class="city">${bus.to}</div></div>
      </div>
      <div class="bus-amenities">${bus.amenities.map(a=>`<div class="amenity" title="${a.label}">${a.icon}</div>`).join('')}</div>
      <div class="bus-action">
        <div class="bus-price">₹${bus.price}</div>
        <div class="bus-seats-left">${bus.availableSeats} seats left</div>
        <button class="btn-primary" onclick="openSeatSelection(${idx})">Select Seats</button>
      </div>
    </div>
  `).join('');
}

// ══════════════════════════════════════════════
// ── Seat Selection ──
// ══════════════════════════════════════════════

function openSeatSelection(busIndex) {
  currentBus = searchResults[busIndex];
  selectedSeats = [];
  const modal = document.getElementById('seatModal');
  modal.querySelector('.modal-header h2').textContent = `${currentBus.operator} — Select Seats`;
  renderSeatLayout();
  updateSeatFooter();
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function renderSeatLayout() {
  const container = document.getElementById('seatGrid');
  const totalRows = 9;
  const bookedSeats = new Set();
  while (bookedSeats.size < currentBus.bookedSeats && bookedSeats.size < totalRows * 4) {
    const row = Math.floor(Math.random() * totalRows) + 1;
    const col = String.fromCharCode(65 + Math.floor(Math.random() * 4));
    bookedSeats.add(`${row}${col}`);
  }
  let html = `<div style="display:flex;justify-content:flex-end;margin-bottom:16px;padding-right:24px"><div class="seat-driver" title="Driver">🚌</div></div>`;
  for (let r = 1; r <= totalRows; r++) {
    html += `<div class="seat-row">`;
    for (let c = 0; c < 4; c++) {
      const col = String.fromCharCode(65 + c);
      const seatId = `${r}${col}`;
      const isBooked = bookedSeats.has(seatId);
      html += `<div class="${isBooked?'seat booked':'seat'}" id="seat-${seatId}" ${isBooked?'':`onclick="toggleSeat('${seatId}')"`}>${seatId}</div>`;
      if (c === 1) html += `<div class="gap"></div>`;
    }
    html += `</div>`;
  }
  container.innerHTML = html;
}

function toggleSeat(seatId) {
  const el = document.getElementById(`seat-${seatId}`);
  const idx = selectedSeats.indexOf(seatId);
  if (idx > -1) { selectedSeats.splice(idx, 1); el.classList.remove('selected'); }
  else {
    if (selectedSeats.length >= 6) { showToast('Maximum 6 seats can be selected','error'); return; }
    selectedSeats.push(seatId); el.classList.add('selected');
  }
  updateSeatFooter();
}

function updateSeatFooter() {
  const info = document.getElementById('seatSelectedInfo');
  const btn = document.getElementById('proceedBooking');
  if (selectedSeats.length === 0) {
    info.innerHTML = 'No seats selected'; btn.disabled = true; btn.style.opacity = '0.5';
  } else {
    const total = selectedSeats.length * currentBus.price;
    info.innerHTML = `Seats: <strong>${selectedSeats.join(', ')}</strong> — Total: <strong>₹${total}</strong>`;
    btn.disabled = false; btn.style.opacity = '1';
  }
}

function closeSeatModal() {
  document.getElementById('seatModal').classList.remove('active');
  document.body.style.overflow = '';
}

function proceedToBooking() {
  if (selectedSeats.length === 0) return;
  closeSeatModal();
  const total = selectedSeats.length * currentBus.price;
  const bookingId = 'BT' + Date.now().toString(36).toUpperCase();
  const modal = document.getElementById('confirmModal');
  modal.querySelector('.modal-body').innerHTML = `
    <div class="confirmation-content">
      <div class="confirmation-icon">✅</div>
      <h3>Booking Confirmed!</h3>
      <p>Your bus ticket has been booked successfully</p>
      <div class="booking-id">${bookingId}</div>
      <div class="booking-summary">
        <div class="booking-summary-row"><span>Operator</span><span>${currentBus.operator}</span></div>
        <div class="booking-summary-row"><span>Bus Type</span><span>${currentBus.type}</span></div>
        <div class="booking-summary-row"><span>Route</span><span>${currentBus.from} → ${currentBus.to}</span></div>
        <div class="booking-summary-row"><span>Departure</span><span>${currentBus.departure}</span></div>
        <div class="booking-summary-row"><span>Arrival</span><span>${currentBus.arrival}</span></div>
        <div class="booking-summary-row"><span>Seats</span><span>${selectedSeats.join(', ')}</span></div>
        <div class="booking-summary-row"><span>Total Amount</span><span style="color:var(--accent-primary);font-size:1.1rem">₹${total}</span></div>
      </div>
      <p style="font-size:0.85rem;color:var(--text-muted)">A confirmation has been sent to your email</p>
    </div>`;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
  showToast('🎉 Booking confirmed! ID: ' + bookingId, 'success');
}

function closeConfirmModal() {
  document.getElementById('confirmModal').classList.remove('active');
  document.body.style.overflow = '';
}

// ══════════════════════════════════════════════
// ── Route Card Click ──
// ══════════════════════════════════════════════

function selectRoute(from, to) {
  document.getElementById('from').value = from;
  document.getElementById('to').value = to;
  const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
  document.getElementById('date').value = tomorrow.toISOString().split('T')[0];
  document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
  showToast(`Route ${from} → ${to} selected. Click Search!`, 'info');
}

// ══════════════════════════════════════════════
// ── Bus Tracking ──
// ══════════════════════════════════════════════

function trackBus() {
  const input = document.getElementById('trackingInput').value.trim();
  if (!input) { showToast('Please enter a PNR or Booking ID','error'); return; }
  const panel = document.getElementById('trackingPanel');
  panel.classList.add('show');
  panel.scrollIntoView({ behavior:'smooth', block:'start' });
  renderTrackingRoute();
  startTrackingAnimation();
  showToast('🚌 Live tracking activated for ' + input, 'success');
}

function renderTrackingRoute() {
  const container = document.getElementById('routeStops');
  const currentIdx = trackingStops.findIndex(s => s.status === 'current');
  document.getElementById('routeProgressLine').style.height = (currentIdx / (trackingStops.length - 1)) * 100 + '%';
  container.innerHTML = trackingStops.map(stop => `
    <div class="route-stop ${stop.status}">
      <div class="route-stop-dot"></div>
      <div class="route-stop-name">${stop.name}</div>
      <div class="route-stop-time">${stop.status==='passed'?'✓ Departed':stop.status==='current'?'📍 Current Location':'ETA'} ${stop.time}</div>
    </div>`).join('');
  document.getElementById('trackSpeed').textContent = '72 km/h';
  document.getElementById('trackETA').textContent = '06:30 AM';
  document.getElementById('trackDistance').textContent = '267 / 570 km';
  document.getElementById('trackStatus').textContent = 'On Time';
  document.getElementById('trackLocation').textContent = 'Near Anantapur';
  document.getElementById('trackNextStop').textContent = 'Penukonda (45 min)';
}

let trackingInterval;
function startTrackingAnimation() {
  if (trackingInterval) clearInterval(trackingInterval);
  trackingInterval = setInterval(() => {
    document.getElementById('trackSpeed').textContent = (65 + Math.floor(Math.random() * 20)) + ' km/h';
  }, 3000);
}

// ══════════════════════════════════════════════
// ── Contact Form ──
// ══════════════════════════════════════════════

function submitContact(e) {
  e.preventDefault();
  const name = document.getElementById('contactName').value;
  const email = document.getElementById('contactEmail').value;
  const message = document.getElementById('contactMessage').value;
  if (!name || !email || !message) { showToast('Please fill in all required fields','error'); return; }
  showToast('✉️ Message sent successfully! We\'ll reply within 24 hours.', 'success');
  e.target.reset();
}

// ══════════════════════════════════════════════
// ── Toast Notifications ──
// ══════════════════════════════════════════════

function showToast(message, type='info') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  const icons = { success:'✅', error:'❌', info:'ℹ️' };
  toast.innerHTML = `<span>${icons[type]||'ℹ️'}</span><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// ══════════════════════════════════════════════
// ── Render Sections ──
// ══════════════════════════════════════════════

function renderPopularRoutes() {
  document.getElementById('routesGrid').innerHTML = popularRoutes.map(r => `
    <div class="route-card reveal" onclick="selectRoute('${r.from}','${r.to}')">
      <div class="route-cities"><span class="route-city">${r.from}</span><span class="route-arrow">→</span><span class="route-city">${r.to}</span></div>
      <div class="route-meta"><span>🕐 ${r.duration}</span><span>🚌 ${r.buses} buses</span></div>
      <div class="route-price"><div class="price">₹${r.price} <small>onwards</small></div><button class="btn-secondary" style="padding:8px 16px;font-size:0.82rem">Book Now</button></div>
    </div>`).join('');
}

function renderTips() {
  document.getElementById('tipsGrid').innerHTML = travelTips.map(t => `
    <div class="tip-card reveal">
      <div class="tip-icon">${t.icon}</div>
      <h3>${t.title}</h3>
      <p>${t.desc}</p>
    </div>`).join('');
}

function setDefaultDate() {
  const d = document.getElementById('date');
  const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
  d.min = new Date().toISOString().split('T')[0];
  d.value = tomorrow.toISOString().split('T')[0];
}

function toggleMobileNav() {
  document.querySelector('.nav-links').classList.toggle('mobile-open');
}

// ══════════════════════════════════════════════
// ── Initialize ──
// ══════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  renderPopularRoutes();
  setDefaultDate();

  // Preload all frames then start background scroll animation
  preloadImages().then(() => {
    drawFrame(0);
    // Listen to scroll across ENTIRE page
    window.addEventListener('scroll', onScroll, { passive: true });
  });

  setTimeout(initRevealAnimations, 100);

  const contactForm = document.getElementById('contactForm');
  if (contactForm) contactForm.addEventListener('submit', submitContact);
});
