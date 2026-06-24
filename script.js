/* =========================================================
   SAI PRASAD BANDARI — NEURAL.PROFILE
   Immersive sci-fi portfolio interactions
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  runBootSequence(() => {
    initBackground();
    initCursor();
    initNav();
    initTypedText();
    initReveals();
    initTilt();
  });
});

/* ---------------- BOOT SEQUENCE ---------------- */
function runBootSequence(onDone){
  const linesEl = document.getElementById('boot-lines');
  const fillEl = document.getElementById('boot-bar-fill');
  const pctEl = document.getElementById('boot-pct');
  const screen = document.getElementById('boot-screen');

  const messages = [
    '> INITIALIZING NEURAL INTERFACE...',
    '> LOADING IDENTITY MATRIX: SAI_PRASAD_BANDARI',
    '> MOUNTING SKILL MODULES [PYTHON, SQL, PYTORCH]',
    '> SYNCING EXPERIENCE LOG (2020 - 2026)',
    '> COMPILING PROJECT ARCHIVE [4 ENTRIES]',
    '> ESTABLISHING SECURE CHANNEL...',
    '> RENDER PIPELINE READY',
    '> ACCESS GRANTED'
  ];

  let i = 0;
  let pct = 0;

  function addLine(){
    if (i >= messages.length) return;
    const div = document.createElement('div');
    div.className = 'line' + (i === messages.length - 1 ? ' ok' : '');
    div.textContent = messages[i];
    linesEl.appendChild(div);
    i++;
  }

  const lineInterval = setInterval(addLine, 220);
  addLine();

  const barInterval = setInterval(() => {
    pct = Math.min(100, pct + Math.random() * 14 + 4);
    fillEl.style.width = pct + '%';
    pctEl.textContent = Math.floor(pct) + '%';
    if (pct >= 100){
      clearInterval(barInterval);
      clearInterval(lineInterval);
      setTimeout(() => {
        screen.classList.add('hidden');
        document.body.style.overflow = 'auto';
        onDone();
      }, 400);
    }
  }, 180);

  document.body.style.overflow = 'hidden';
}

/* ---------------- THREE.JS BACKGROUND ---------------- */
function initBackground(){
  const canvas = document.getElementById('bg-canvas');
  if (!window.THREE) return;

  const isMobile = window.innerWidth < 768;
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 60;

  // ---- Particle starfield ----
  const particleCount = isMobile ? 900 : 2400;
  const positions = new Float32Array(particleCount * 3);
  const colorChoices = [
    new THREE.Color(0x4cf3ff),
    new THREE.Color(0xb14bff),
    new THREE.Color(0xff2bd6),
    new THREE.Color(0xffffff)
  ];
  const colors = new Float32Array(particleCount * 3);

  for (let p = 0; p < particleCount; p++){
    positions[p*3]   = (Math.random() - 0.5) * 400;
    positions[p*3+1] = (Math.random() - 0.5) * 400;
    positions[p*3+2] = (Math.random() - 0.5) * 400;
    const c = colorChoices[Math.floor(Math.random() * colorChoices.length)];
    colors[p*3] = c.r; colors[p*3+1] = c.g; colors[p*3+2] = c.b;
  }

  const particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const particleMat = new THREE.PointsMaterial({
    size: 1.4,
    vertexColors: true,
    transparent: true,
    opacity: 0.75,
    sizeAttenuation: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  // ---- Abstract wireframe geometries (floating monoliths) ----
  const shapes = [];
  const geoDefs = [
    { geo: new THREE.IcosahedronGeometry(9, 0), color: 0x4cf3ff, pos: [-26, 8, -20] },
    { geo: new THREE.TorusKnotGeometry(6, 1.6, 100, 12), color: 0xb14bff, pos: [28, -10, -30] },
    { geo: new THREE.OctahedronGeometry(7, 0), color: 0xff2bd6, pos: [16, 18, -45] },
    { geo: new THREE.IcosahedronGeometry(5, 1), color: 0x4cf3ff, pos: [-20, -16, -35] }
  ];

  geoDefs.forEach(def => {
    const mat = new THREE.MeshBasicMaterial({ color: def.color, wireframe: true, transparent:true, opacity: 0.35 });
    const mesh = new THREE.Mesh(def.geo, mat);
    mesh.position.set(...def.pos);
    mesh.userData.rotSpeed = {
      x: (Math.random() - 0.5) * 0.004,
      y: (Math.random() - 0.5) * 0.004
    };
    scene.add(mesh);
    shapes.push(mesh);
  });

  // ---- Mouse parallax ----
  const mouse = { x: 0, y: 0 };
  window.addEventListener('mousemove', (e) => {
    mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
    mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  let frame = 0;
  function animate(){
    frame += 1;
    particles.rotation.y += 0.0006;
    particles.rotation.x += 0.0002;

    shapes.forEach(s => {
      s.rotation.x += s.userData.rotSpeed.x;
      s.rotation.y += s.userData.rotSpeed.y;
    });

    camera.position.x += (mouse.x * 8 - camera.position.x) * 0.02;
    camera.position.y += (-mouse.y * 8 - camera.position.y) * 0.02;
    camera.lookAt(0, 0, -20);

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();
}

/* ---------------- CUSTOM CURSOR ---------------- */
function initCursor(){
  if (window.innerWidth < 768) return;
  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  let ringX = 0, ringY = 0, mx = 0, my = 0;

  window.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top = my + 'px';
  });

  function loop(){
    ringX += (mx - ringX) * 0.18;
    ringY += (my - ringY) * 0.18;
    ring.style.left = ringX + 'px';
    ring.style.top = ringY + 'px';
    requestAnimationFrame(loop);
  }
  loop();

  document.querySelectorAll('a, button, .panel, .tag').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('active'));
    el.addEventListener('mouseleave', () => ring.classList.remove('active'));
  });
}

/* ---------------- NAV ---------------- */
function initNav(){
  const navbar = document.getElementById('navbar');
  const toggle = document.getElementById('nav-toggle');
  const links = document.getElementById('nav-links');
  const navAnchors = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('.section');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  });

  toggle.addEventListener('click', () => links.classList.toggle('open'));
  navAnchors.forEach(a => a.addEventListener('click', () => links.classList.remove('open')));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        const id = entry.target.id;
        navAnchors.forEach(a => a.classList.toggle('active', a.dataset.nav === id));
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => observer.observe(s));
}

/* ---------------- TYPED TEXT ---------------- */
function initTypedText(){
  const el = document.getElementById('typed-text');
  if (!el) return;
  const phrases = [
    'AI / DATA SCIENCE ENGINEER',
    'MACHINE LEARNING ENGINEER',
    'BUILDER OF INTELLIGENT SYSTEMS',
    'MSc AI SYSTEMS — EPITA, PARIS'
  ];
  let pIndex = 0, charIndex = 0, deleting = false;

  function tick(){
    const current = phrases[pIndex];
    if (!deleting){
      charIndex++;
      el.textContent = current.slice(0, charIndex);
      if (charIndex === current.length){
        deleting = true;
        setTimeout(tick, 1800);
        return;
      }
    } else {
      charIndex--;
      el.textContent = current.slice(0, charIndex);
      if (charIndex === 0){
        deleting = false;
        pIndex = (pIndex + 1) % phrases.length;
      }
    }
    setTimeout(tick, deleting ? 35 : 55);
  }
  tick();
}

/* ---------------- SCROLL REVEALS (GSAP) ---------------- */
function initReveals(){
  if (!window.gsap){
    document.querySelectorAll('.panel, .section-head, .timeline-item').forEach(el => {
      el.style.opacity = 1; el.style.transform = 'none';
    });
    return;
  }
  gsap.registerPlugin(ScrollTrigger);

  gsap.from('.hero-tag-row, .hero-title, .hero-subtitle, .hero-desc, .hero-cta, .hero-coords', {
    opacity: 0, y: 30, duration: 0.9, ease: 'power3.out', stagger: 0.12, delay: 0.1
  });

  document.querySelectorAll('.section:not(.hero)').forEach(section => {
    const head = section.querySelector('.section-head');
    if (head){
      gsap.from(head, {
        opacity: 0, x: -40, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: section, start: 'top 75%' }
      });
    }
    const targets = section.querySelectorAll('.panel, .timeline-item');
    gsap.from(targets, {
      opacity: 0, y: 50, duration: 0.8, ease: 'power3.out', stagger: 0.12,
      scrollTrigger: { trigger: section, start: 'top 70%' }
    });
  });
}

/* ---------------- 3D TILT ON PANELS ---------------- */
function initTilt(){
  if (window.innerWidth < 768) return;
  document.querySelectorAll('[data-tilt]').forEach(el => {
    el.style.transformStyle = 'preserve-3d';
    el.style.willChange = 'transform';

    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      el.style.transform = `perspective(900px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateZ(6px)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = 'perspective(900px) rotateY(0deg) rotateX(0deg) translateZ(0)';
    });
  });
}
