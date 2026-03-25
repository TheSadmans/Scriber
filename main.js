/* ============================================================
   Scriber — Digital Marketing Agency
   main.js
   ============================================================ */

/* ── Custom Cursor ── */
const cursor = document.getElementById('cursor');
const ring   = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top  = my + 'px';
});

(function animRing() {
  rx += (mx - rx) * 0.15;
  ry += (my - ry) * 0.15;
  ring.style.left = rx + 'px';
  ring.style.top  = ry + 'px';
  requestAnimationFrame(animRing);
})();

document.querySelectorAll('a, button, .service-card, .portfolio-item').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.transform = 'translate(-50%,-50%) scale(2.5)';
    ring.style.transform   = 'translate(-50%,-50%) scale(1.4)';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.transform = 'translate(-50%,-50%) scale(1)';
    ring.style.transform   = 'translate(-50%,-50%) scale(1)';
  });
});

/* ── Page Loader ── */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
  }, 2200);
});

/* ── Navbar Scroll Effect ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

/* ── Mobile Menu ── */
function toggleMobileMenu() {
  document.getElementById('hamburger').classList.toggle('open');
  document.getElementById('mobileMenu').classList.toggle('open');
}

function closeMobileMenu() {
  document.getElementById('hamburger').classList.remove('open');
  document.getElementById('mobileMenu').classList.remove('open');
}

/* ── Scroll Reveal ── */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ── Marquee ── */
const marqueeItems = [
  'Landing Page', 'Logo Design', 'Motion Poster', 'Website',
  'Animation', 'Ad Boosting', 'Visiting Card', 'Flyer Design',
  'Page Setup', 'Web App'
];

const track = document.getElementById('marqueeTrack');
[...marqueeItems, ...marqueeItems].forEach(text => {
  const el = document.createElement('div');
  el.className = 'marquee-item';
  el.innerHTML = `<span class="marquee-dot"></span>${text}`;
  track.appendChild(el);
});

/* ── Portfolio Filter Buttons ── */
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

/* ── Payment Method Selection ── */
function selectPayment(el) {
  document.querySelectorAll('.payment-opt').forEach(p => p.classList.remove('selected'));
  el.classList.add('selected');
}

/* ── Smooth Scroll to Order ── */
function scrollToOrder() {
  document.getElementById('order').scrollIntoView({ behavior: 'smooth' });
}

/* ── Order Storage ── */
function getOrders() {
  try {
    return JSON.parse(localStorage.getItem('scriber_orders') || '[]');
  } catch (e) {
    return [];
  }
}

function saveOrders(orders) {
  localStorage.setItem('scriber_orders', JSON.stringify(orders));
}

/* ── Submit Order ── */
function submitOrder() {
  const name    = document.getElementById('clientName').value.trim();
  const phone   = document.getElementById('clientPhone').value.trim();
  const service = document.getElementById('serviceSelect').value;
  const desc    = document.getElementById('projectDesc').value.trim();
  const email   = document.getElementById('clientEmail').value.trim();
  const budget  = document.getElementById('budgetSelect').value;
  const payment = document.querySelector('.payment-opt.selected')
                    ?.querySelector('.p-label')?.textContent || 'Not specified';

  if (!name || !phone || !service || !desc) {
    alert('Please fill in all required fields (*).');
    return;
  }

  const order = {
    id: Date.now(),
    name, phone, email, service, budget, desc, payment,
    date: new Date().toLocaleString(),
    location: 'Not available',
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
  } else {
    finalizeOrder(order);
  }
}

function finalizeOrder(order) {
  const orders = getOrders();
  orders.unshift(order);
  saveOrders(orders);

  ['clientName', 'clientPhone', 'clientEmail'].forEach(id => {
    document.getElementById(id).value = '';
  });
  document.getElementById('serviceSelect').value = '';
  document.getElementById('budgetSelect').value  = '';
  document.getElementById('projectDesc').value   = '';

  const msg = document.getElementById('successMsg');
  msg.style.display = 'block';
  setTimeout(() => { msg.style.display = 'none'; }, 5000);
}

/* ── Admin Panel ── */
let adminLoggedIn = false;
// ⚠️  Change this password before deploying!
const ADMIN_PASS = 'scriber2025';

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
    document.getElementById('adminLogin').style.display  = 'none';
    document.getElementById('adminOrders').style.display = 'block';
    renderOrders();
  } else {
    const err = document.getElementById('adminError');
    err.style.display = 'block';
    document.getElementById('adminPass').value = '';
    setTimeout(() => { err.style.display = 'none'; }, 3000);
  }
}

function renderOrders() {
  const orders = getOrders();
  document.getElementById('statTotal').textContent   = orders.length;
  document.getElementById('statRevenue').textContent = `৳${orders.length * 3000}+`;

  const today    = new Date().toLocaleDateString();
  const newToday = orders.filter(o => new Date(o.date).toLocaleDateString() === today).length;
  document.getElementById('statNew').textContent = newToday;

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
        <strong>Payment:</strong> ${o.payment}<br>
        <strong>Date:</strong> ${o.date}<br>
        ${o.location !== 'Not available' ? `<strong>Location:</strong> ${o.location}<br>` : ''}
        <strong>Notes:</strong> ${o.desc}
      </div>
    </div>
  `).join('');
}

function clearOrders() {
  if (confirm('Clear all orders? This cannot be undone.')) {
    localStorage.removeItem('scriber_orders');
    renderOrders();
  }
}

/* ── Allow Enter key in admin password field ── */
document.addEventListener('DOMContentLoaded', () => {
  const passField = document.getElementById('adminPass');
  if (passField) {
    passField.addEventListener('keydown', e => {
      if (e.key === 'Enter') adminLogin();
    });
  }
});
