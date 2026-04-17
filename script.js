/* ========================================
   STRATIX — Main JavaScript
   Premium SaaS Corporate Website
======================================== */

// ========== Page Loader ==========
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('page-loader');
    if (loader) loader.classList.add('hidden');
  }, 2000);
});

// ========== Custom Cursor ==========
const cursor = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursor-follower');
let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

if (cursor && cursorFollower) {
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
  });

  function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    cursorFollower.style.left = followerX + 'px';
    cursorFollower.style.top = followerY + 'px';
    requestAnimationFrame(animateFollower);
  }
  animateFollower();
}

// ========== Navbar ==========
const nav = document.querySelector('nav');
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');

window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    nav?.classList.add('scrolled');
  } else {
    nav?.classList.remove('scrolled');
  }
  toggleBackToTop();
});

hamburger?.addEventListener('click', () => {
  mobileMenu?.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');
  if (mobileMenu?.classList.contains('open')) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  }
});

document.querySelectorAll('.mobile-menu a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu?.classList.remove('open');
    const spans = hamburger?.querySelectorAll('span');
    if (spans) {
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    }
  });
});

// ========== Scroll Reveal ==========
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ========== Animated Counters ==========
function animateCounter(el, target, suffix, duration) {
  duration = duration || 2000;
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) {
      start = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(start) + suffix;
  }, 16);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.dataset.target);
      const suffix = el.dataset.suffix || '';
      animateCounter(el, target, suffix);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-counter]').forEach(el => counterObserver.observe(el));

// ========== Back to Top ==========
const backToTop = document.getElementById('back-to-top');

function toggleBackToTop() {
  if (window.scrollY > 400) {
    backToTop?.classList.add('visible');
  } else {
    backToTop?.classList.remove('visible');
  }
}

backToTop?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ========== Product Filters ==========
const filterBtns = document.querySelectorAll('.filter-btn');
const productCards = document.querySelectorAll('.product-card[data-category]');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    productCards.forEach(card => {
      if (filter === 'all' || card.dataset.category === filter) {
        card.style.display = '';
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        requestAnimationFrame(() => {
          card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        });
      } else {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => { card.style.display = 'none'; }, 400);
      }
    });
  });
});

// ========== Contact Form ==========
const contactForm = document.getElementById('contact-form');
contactForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = contactForm.querySelector('.btn-primary');
  const originalText = btn.textContent;
  btn.textContent = 'Sending...';
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = '✓ Message Sent';
    btn.style.background = '#22c55e';
    const success = document.getElementById('form-success');
    if (success) success.style.display = 'block';
    setTimeout(() => {
      btn.textContent = originalText;
      btn.disabled = false;
      btn.style.background = '';
      if (success) success.style.display = 'none';
      contactForm.reset();
    }, 4000);
  }, 1800);
});

// ========== Hero Parallax on Mouse ==========
document.addEventListener('mousemove', (e) => {
  const heroContent = document.querySelector('.hero-content');
  if (!heroContent) return;
  const x = (e.clientX / window.innerWidth - 0.5) * 20;
  const y = (e.clientY / window.innerHeight - 0.5) * 10;
  heroContent.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
});

// ========== Three.js Hero 3D Animation ==========
function initHeroThreeJS() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
  camera.position.set(0, 0, 7);

  // Lights
  const ambientLight = new THREE.AmbientLight(0x2563ff, 0.4);
  scene.add(ambientLight);
  const pointLight1 = new THREE.PointLight(0x2563ff, 2, 20);
  pointLight1.position.set(5, 5, 5);
  scene.add(pointLight1);
  const pointLight2 = new THREE.PointLight(0x00d4ff, 1.5, 20);
  pointLight2.position.set(-5, -3, 3);
  scene.add(pointLight2);

  // Main wireframe icosahedron
  const geoMain = new THREE.IcosahedronGeometry(1.8, 1);
  const matMain = new THREE.MeshPhongMaterial({
    color: 0x2563ff, wireframe: true, transparent: true, opacity: 0.25
  });
  const mainMesh = new THREE.Mesh(geoMain, matMain);
  scene.add(mainMesh);

  // Inner solid sphere
  const geoInner = new THREE.SphereGeometry(0.9, 32, 32);
  const matInner = new THREE.MeshPhongMaterial({
    color: 0x0c1226, emissive: 0x2563ff, emissiveIntensity: 0.18,
    transparent: true, opacity: 0.85, shininess: 140
  });
  const innerMesh = new THREE.Mesh(geoInner, matInner);
  scene.add(innerMesh);

  // Orbit rings
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(2.4, 0.015, 8, 120),
    new THREE.MeshBasicMaterial({ color: 0x2563ff, transparent: true, opacity: 0.4 })
  );
  ring.rotation.x = Math.PI / 3;
  scene.add(ring);

  const ring2 = new THREE.Mesh(
    new THREE.TorusGeometry(2.9, 0.01, 8, 120),
    new THREE.MeshBasicMaterial({ color: 0x00d4ff, transparent: true, opacity: 0.2 })
  );
  ring2.rotation.x = Math.PI / 5;
  ring2.rotation.y = Math.PI / 4;
  scene.add(ring2);

  // Particles
  const pCount = 200;
  const pPos = new Float32Array(pCount * 3);
  for (let i = 0; i < pCount; i++) {
    pPos[i * 3] = (Math.random() - 0.5) * 14;
    pPos[i * 3 + 1] = (Math.random() - 0.5) * 10;
    pPos[i * 3 + 2] = (Math.random() - 0.5) * 8 - 2;
  }
  const partGeo = new THREE.BufferGeometry();
  partGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  const particles = new THREE.Points(partGeo,
    new THREE.PointsMaterial({ color: 0x4d8bff, size: 0.05, transparent: true, opacity: 0.55 })
  );
  scene.add(particles);

  // Floating cubes
  const cubeData = [
    { pos: [-3.5, 1.5, -1] }, { pos: [3.2, -1.2, -2] },
    { pos: [-2.8, -2, 0] }, { pos: [3.8, 2, -1.5] }, { pos: [0, 3, -2] }
  ];
  const cubeObjs = cubeData.map(({ pos }) => {
    const s = 0.15 + Math.random() * 0.2;
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(s, s, s),
      new THREE.MeshPhongMaterial({ color: 0x2563ff, wireframe: true, transparent: true, opacity: 0.5 })
    );
    mesh.position.set(...pos);
    mesh.userData = { baseY: pos[1], speed: 0.5 + Math.random(), phase: Math.random() * Math.PI * 2 };
    scene.add(mesh);
    return mesh;
  });

  // Mouse interaction
  let targetRotX = 0, targetRotY = 0, curRotX = 0, curRotY = 0;
  document.addEventListener('mousemove', (e) => {
    targetRotY = (e.clientX / window.innerWidth - 0.5) * 0.8;
    targetRotX = (e.clientY / window.innerHeight - 0.5) * 0.5;
  });

  window.addEventListener('resize', () => {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  });

  let t = 0;
  (function animate() {
    requestAnimationFrame(animate);
    t += 0.008;
    curRotX += (targetRotX - curRotX) * 0.04;
    curRotY += (targetRotY - curRotY) * 0.04;

    mainMesh.rotation.x = t * 0.3 + curRotX;
    mainMesh.rotation.y = t * 0.5 + curRotY;
    innerMesh.rotation.x = t * 0.1;
    innerMesh.rotation.y = -t * 0.2;
    ring.rotation.z = t * 0.4;
    ring2.rotation.z = -t * 0.25;
    particles.rotation.y = t * 0.05;

    cubeObjs.forEach(cube => {
      const { baseY, speed, phase } = cube.userData;
      cube.rotation.x += 0.01 * speed;
      cube.rotation.y += 0.015 * speed;
      cube.position.y = baseY + Math.sin(t * speed + phase) * 0.3;
    });

    renderer.render(scene, camera);
  })();
}

// ========== DOM Ready ==========
document.addEventListener('DOMContentLoaded', () => {
  // Active nav highlight
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  // Three.js init
  if (document.getElementById('hero-canvas')) {
    const loadThree = () => {
      const s = document.createElement('script');
      s.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
      s.onload = initHeroThreeJS;
      document.head.appendChild(s);
    };
    if (typeof THREE !== 'undefined') {
      initHeroThreeJS();
    } else {
      loadThree();
    }
  }
});
