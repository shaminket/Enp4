/**
 * EFECTOS VISUALES 3D Y ATMÓSFERA SUTIL — GRUPO 415
 * Alto rendimiento, 60 FPS, Canvas acelerado por GPU.
 * Respeta rigurosamente prefers-reduced-motion.
 */

(function () {
  'use strict';

  // Respeto a accesibilidad y movimiento reducido
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    console.log('[Efectos 415] Movimiento reducido activado: animaciones ambientales desactivadas.');
    return;
  }

  const canvas = document.getElementById('muertos-ambient-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d', { alpha: true });
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  // Redimensionar suavemente
  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // Colección de partículas (pétalos de cempasúchil / chispas de copal)
  const PARTICLE_COUNT = 24; // Cantidad ultra ligera para garantizar 60fps en cualquier iPhone
  const particles = [];

  // Paleta restringida a Cempasúchil (#FF7A00) y Oro Solar (#E5A93C)
  const colors = [
    { r: 255, g: 122, b: 0 },  // Cempasúchil
    { r: 229, g: 169, b: 60 }  // Oro Solar
  ];

  class Petal {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : height + 20;
      this.size = Math.random() * 4 + 2.5; // Tamaño microscópico y refinado
      this.speedY = Math.random() * 0.45 + 0.25;
      this.speedX = (Math.random() - 0.5) * 0.35;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.02;
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.opacity = Math.random() * 0.4 + 0.15;
      this.sway = Math.random() * 0.02;
      this.swayCount = Math.random() * Math.PI;
    }

    update() {
      this.swayCount += this.sway;
      this.x += this.speedX + Math.sin(this.swayCount) * 0.3;
      this.y -= this.speedY; // Flotan suavemente hacia arriba como ofrenda/humo sagrado
      this.rotation += this.rotSpeed;

      if (this.y < -30 || this.x < -30 || this.x > width + 30) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.beginPath();
      // Forma geométrica orgánica de pétalo sutil
      ctx.ellipse(0, 0, this.size * 1.5, this.size * 0.7, 0, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.opacity})`;
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new Petal());
  }

  let animationId;
  function loop() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }
    animationId = requestAnimationFrame(loop);
  }

  // Pausar si la pestaña se oculta (Ahorro de batería en iPhone)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animationId);
    } else {
      animationId = requestAnimationFrame(loop);
    }
  });

  loop();
})();
