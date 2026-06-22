// ===== CURSOR =====
const cursor = document.getElementById('cursor');
const cursorRing = document.getElementById('cursorRing');
if (cursor && cursorRing) {
  let mx = 0, my = 0, cx = 0, cy = 0;
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.transform = `translate(${mx - 5}px, ${my - 5}px)`;
  });
  setInterval(() => {
    cx += (mx - cx) * 0.12;
    cy += (my - cy) * 0.12;
    cursorRing.style.transform = `translate(${cx - 18}px, ${cy - 18}px)`;
  }, 16);
  document.querySelectorAll('a, button, .filter-btn, .product-card, .feature-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursorRing.style.width = '60px';
      cursorRing.style.height = '60px';
      cursorRing.style.marginLeft = '-12px';
      cursorRing.style.marginTop = '-12px';
    });
    el.addEventListener('mouseleave', () => {
      cursorRing.style.width = '36px';
      cursorRing.style.height = '36px';
      cursorRing.style.marginLeft = '0';
      cursorRing.style.marginTop = '0';
    });
  });
}

// ===== INTRO =====
const introEl = document.getElementById('intro');
if (introEl) {
  const introCanvas = document.getElementById('intro-canvas');
  const ictx = introCanvas.getContext('2d');
  introCanvas.width = window.innerWidth;
  introCanvas.height = window.innerHeight;

  // Neural nodes
  const nodes = Array.from({ length: 60 }, () => ({
    x: Math.random() * introCanvas.width,
    y: Math.random() * introCanvas.height,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    r: Math.random() * 2 + 1,
  }));

  function drawIntroNetwork() {
    ictx.clearRect(0, 0, introCanvas.width, introCanvas.height);
    nodes.forEach(n => {
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > introCanvas.width) n.vx *= -1;
      if (n.y < 0 || n.y > introCanvas.height) n.vy *= -1;
    });
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          const alpha = (1 - dist / 150) * 0.4;
          ictx.beginPath();
          ictx.strokeStyle = `rgba(0,212,255,${alpha})`;
          ictx.lineWidth = 0.5;
          ictx.moveTo(nodes[i].x, nodes[i].y);
          ictx.lineTo(nodes[j].x, nodes[j].y);
          ictx.stroke();
        }
      }
    }
    nodes.forEach(n => {
      ictx.beginPath();
      ictx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ictx.fillStyle = 'rgba(0,212,255,0.6)';
      ictx.fill();
    });
    requestAnimationFrame(drawIntroNetwork);
  }
  drawIntroNetwork();

  // Dismiss intro after 3.2s
  setTimeout(() => {
    introEl.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    introEl.style.opacity = '0';
    introEl.style.transform = 'scale(1.03)';
    setTimeout(() => { introEl.style.display = 'none'; }, 800);
  }, 3200);
}

// ===== HERO CANVAS =====
const heroCanvas = document.getElementById('heroCanvas');
if (heroCanvas) {
  heroCanvas.width = window.innerWidth;
  heroCanvas.height = window.innerHeight;
  const hctx = heroCanvas.getContext('2d');
  let mouseX = heroCanvas.width / 2, mouseY = heroCanvas.height / 2;

  const hNodes = Array.from({ length: 80 }, () => ({
    x: Math.random() * heroCanvas.width,
    y: Math.random() * heroCanvas.height,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    r: Math.random() * 1.5 + 0.5,
  }));

  document.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });

  function drawHero() {
    hctx.clearRect(0, 0, heroCanvas.width, heroCanvas.height);

    // Ambient glow
    const grad = hctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 400);
    grad.addColorStop(0, 'rgba(10,132,255,0.06)');
    grad.addColorStop(1, 'transparent');
    hctx.fillStyle = grad;
    hctx.fillRect(0, 0, heroCanvas.width, heroCanvas.height);

    hNodes.forEach(n => {
      // Slight mouse attraction
      const dx = mouseX - n.x, dy = mouseY - n.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 200) {
        n.vx += dx * 0.00005;
        n.vy += dy * 0.00005;
      }
      n.x += n.vx; n.y += n.vy;
      n.vx *= 0.999; n.vy *= 0.999;
      if (n.x < 0 || n.x > heroCanvas.width) n.vx *= -1;
      if (n.y < 0 || n.y > heroCanvas.height) n.vy *= -1;
    });

    for (let i = 0; i < hNodes.length; i++) {
      for (let j = i + 1; j < hNodes.length; j++) {
        const dx = hNodes[i].x - hNodes[j].x;
        const dy = hNodes[i].y - hNodes[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 130) {
          const a = (1 - d / 130) * 0.25;
          hctx.beginPath();
          hctx.strokeStyle = `rgba(10,132,255,${a})`;
          hctx.lineWidth = 0.5;
          hctx.moveTo(hNodes[i].x, hNodes[i].y);
          hctx.lineTo(hNodes[j].x, hNodes[j].y);
          hctx.stroke();
        }
      }
    }

    hNodes.forEach(n => {
      hctx.beginPath();
      hctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      hctx.fillStyle = 'rgba(0,212,255,0.4)';
      hctx.fill();
    });

    requestAnimationFrame(drawHero);
  }
  drawHero();

  window.addEventListener('resize', () => {
    heroCanvas.width = window.innerWidth;
    heroCanvas.height = window.innerHeight;
  });
}

// ===== NAV SCROLL =====
const nav = document.getElementById('nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  });
}

// ===== MOBILE MENU =====
function toggleMobile() {
  document.getElementById('mobileMenu').classList.toggle('open');
}
function closeMobile() {
  document.getElementById('mobileMenu').classList.remove('open');
}

// ===== SCROLL REVEAL =====
const revealEls = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });
revealEls.forEach(el => revealObs.observe(el));

// ===== COUNTER =====
function animateCounter(el, target, duration = 1800) {
  let start = 0;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(ease * target).toLocaleString();
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const counterEls = document.querySelectorAll('.counter, [data-target]');
const counterObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const target = parseInt(e.target.dataset.target);
      if (target) animateCounter(e.target, target);
      counterObs.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
counterEls.forEach(el => counterObs.observe(el));

// ===== PRODUCT FILTER (products page) =====
const filterBtns = document.querySelectorAll('.filter-btn');
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    document.querySelectorAll('.product-card[data-category]').forEach(card => {
      card.style.display = (filter === 'all' || card.dataset.category.includes(filter)) ? '' : 'none';
    });
  });
});
