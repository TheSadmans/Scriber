// CURSOR
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; cursor.style.left = mx+'px'; cursor.style.top = my+'px'; });
(function animRing() {
  rx += (mx - rx) * 0.15; ry += (my - ry) * 0.15;
  ring.style.left = rx+'px'; ring.style.top = ry+'px';
  requestAnimationFrame(animRing);
})();
document.querySelectorAll('a,button,.service-card,.portfolio-item').forEach(el => {
  el.addEventListener('mouseenter', () => { cursor.style.transform = 'translate(-50%,-50%) scale(2.5)'; ring.style.transform = 'translate(-50%,-50%) scale(1.4)'; });
  el.addEventListener('mouseleave', () => { cursor.style.transform = 'translate(-50%,-50%) scale(1)'; ring.style.transform = 'translate(-50%,-50%) scale(1)'; });
});

// LOADER
window.addEventListener('load', () => {
  setTimeout(() => { document.getElementById('loader').classList.add('hidden'); }, 2200);
});

// NAV SCROLL
const nav = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
});

// MOBILE MENU
function toggleMobileMenu() {
  const hb = document.getElementById('hamburger');
  const mm = document.getElementById('mobileMenu');
  hb.classList.toggle('open');
  mm.classList.toggle('open');
}
function closeMobileMenu() {
  document.getElementById('hamburger').classList.remove('open');
  document.getElementById('mobileMenu').classList.remove('open');
}

// SCROLL REVEAL
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if(e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
}, { threshold: 0.12 });
reveals.forEach(r => observer.observe(r));

// MARQUEE
const items = ['Landing Page','Logo Design','Motion Poster','Website','Animation','Ad Boosting','Visiting Card','Flyer Design','Page Setup','Web App'];
const track = document.getElementById('marqueeTrack');
const doubled = [...items, ...items];
doubled.forEach(t => {
  const el = document.createElement('div');
  el.className = 'marquee-item';
  el.innerHTML = `<span class="marquee-dot"></span>${t}`;
  track.appendChild(el);
});

// FILTER BUTTONS
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

// PAYMENT SELECTION
function selectPayment(el) {
  document.querySelectorAll('.payment-opt').forEach(p => p.classList.remove('selected'));
  el.classList.add('selected');
}

// SCROLL TO ORDER
function scrollToOrder() {
  document.getElementById('order').scrollIntoView({ behavior: 'smooth' });
}

// ORDERS STORAGE
function getOrders() { try { return JSON.parse(localStorage.getItem('scriber_orders') || '[]'); } catch(e) { return []; } }
function saveOrders(o) { localStorage.setItem('scriber_orders', JSON.stringify(o)); }

// SUBMIT ORDER
function submitOrder() {
  const name = document.getElementById('clientName').value.trim();
  const phone = document.getElementById('clientPhone').value.trim();
  const service = document.getElementById('serviceSelect').value;
  const desc = document.getElementById('projectDesc').value.trim();
  const email = document.getElementById('clientEmail').value.trim();
  const budget = document.getElementById('budgetSelect').value;
  const payment = document.querySelector('.payment-opt.selected')?.querySelector('.p-label')?.textContent || 'Not specified';

  if (!name || !phone || !service || !desc) {
    alert('Please fill in all required fields (*).');
    return;
  }

  // Geolocation
  let locStr = 'Not available';
  const order = {
    id: Date.now(),
    name, phone, email, service, budget, desc, payment,
    date: new Date().toLocaleString(),
    location: locStr,
    status: 'New'
  };

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      pos => {
        order.location = `${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`;
        finalizeOrder(order);
      },
      () => { finalizeOrder(order); },
      { timeout: 3000 }
    );
  } else { finalizeOrder(order); }
}

function finalizeOrder(order) {
  const orders = getOrders();
  orders.unshift(order);
  saveOrders(orders);
  document.getElementById('successMsg').style.display = 'block';
  document.getElementById('clientName').value = '';
  document.getElementById('clientPhone').value = '';
  document.getElementById('clientEmail').value = '';
  document.getElementById('serviceSelect').value = '';
  document.getElementById('budgetSelect').value = '';
  document.getElementById('projectDesc').value = '';
  setTimeout(() => { document.getElementById('successMsg').style.display = 'none'; }, 5000);
}

// ADMIN PANEL
let adminLoggedIn = false;
const ADMIN_PASS = 'scriber2025'; // Change this

function openAdmin() {
  document.getElementById('admin-panel').classList.add('open');
  document.getElementById('panelOverlay').classList.add('active');
  if (adminLoggedIn) renderOrders();
}
function closeAdmin() {
  document.getElementById('admin-panel').classList.remove('open');
  document.getElementById('panelOverlay').classList.remove('active');
}
function adminLogin() {
  const pass = document.getElementById('adminPass').value;
  if (pass === ADMIN_PASS) {
    adminLoggedIn = true;
    document.getElementById('adminLogin').style.display = 'none';
    document.getElementById('adminOrders').style.display = 'block';
    renderOrders();
  } else {
    document.getElementById('adminError').style.display = 'block';
    document.getElementById('adminPass').value = '';
    setTimeout(() => { document.getElementById('adminError').style.display = 'none'; }, 3000);
  }
}
function renderOrders() {
  const orders = getOrders();
  document.getElementById('statTotal').textContent = orders.length;
  const today = new Date().toLocaleDateString();
  const newToday = orders.filter(o => new Date(o.date).toLocaleDateString() === today).length;
  document.getElementById('statNew').textContent = newToday;
  document.getElementById('statRevenue').textContent = `৳${orders.length * 3000}+`;

  const list = document.getElementById('orderList');
  if (!orders.length) {
    list.innerHTML = '<div class="order-empty">No orders yet. Orders will appear here once received.</div>';
    return;
  }
  list.innerHTML = orders.map(o => `
    <div class="order-item">
      <div class="order-item-top">
        <span class="order-name">${o.name}</span>
        <span class="order-badge">${o.status}</span>
      </div>
      <div class="order-detail">
        <strong>Service:</strong> ${o.service}<br>
        <strong>Phone:</strong> ${o.phone}<br>
        ${o.email ? `<strong>Email:</strong> ${o.email}<br>` : ''}
        <strong>Budget:</strong> ${o.budget || 'Not specified'}<br>
        <strong>Payment:</strong> ${o.pay
      <strong>Payment:</strong> ${o.payment}<br>
        <strong>Description:</strong> ${o.desc}<br>
        <strong>Date:</strong> ${o.date}<br>
        <strong>Location:</strong> ${o.location}
      </div>
    </div>
  `).join('');
}
function clearOrders() {
  if (confirm('Clear all orders? This cannot be undone.')) {
    saveOrders([]);
    renderOrders();
  }
}
