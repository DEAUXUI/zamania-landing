// Огонёк 🔥 за курсором с искрящимся шлейфом.
// Работает только с мышью (на телефонах и планшетах выключен)
// и не включается, если в системе выбрано «уменьшить движение».
(() => {
  const hasMouse = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!hasMouse || reduceMotion) return;

  const canvas = document.createElement('canvas');
  canvas.className = 'cursor-fire';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  let dpr = 1;
  const resize = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = innerWidth * dpr;
    canvas.height = innerHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize();
  addEventListener('resize', resize);

  const mouse = { x: -100, y: -100 };
  const fire = { x: -100, y: -100, size: 26, angle: 0 };
  const sparks = [];
  let visible = false;
  let hot = false;      // курсор над кнопкой — огонь разгорается
  let running = false;

  addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    if (!visible) { fire.x = mouse.x; fire.y = mouse.y; visible = true; }
    hot = !!e.target.closest('a, button');
    start();
  }, { passive: true });
  document.addEventListener('mouseleave', () => { visible = false; start(); });

  const addSpark = (x, y, speed) => {
    sparks.push({
      x: x + (Math.random() - 0.5) * 8,
      y: y + (Math.random() - 0.5) * 8,
      vx: (Math.random() - 0.5) * 0.8,
      vy: -0.6 - Math.random() * 1.2,
      r: 3 + Math.random() * 4 + Math.min(speed, 20) * 0.15,
      life: 1,
      decay: 0.025 + Math.random() * 0.025,
    });
  };

  // жёлтый → оранжевый → красный по мере затухания
  const sparkColor = (life) => {
    const g = Math.round(80 + 140 * life);
    return `rgba(255, ${g}, ${Math.round(40 * life)}, ${life * 0.85})`;
  };

  const frame = () => {
    ctx.clearRect(0, 0, innerWidth, innerHeight);

    const dx = mouse.x - fire.x;
    const dy = mouse.y - fire.y;
    const speed = Math.hypot(dx, dy);
    fire.x += dx * 0.22;
    fire.y += dy * 0.22;

    if (visible && speed > 1) {
      const count = Math.min(3, 1 + Math.floor(speed / 15));
      for (let i = 0; i < count; i++) addSpark(fire.x, fire.y + 6, speed);
    }

    // шлейф
    for (let i = sparks.length - 1; i >= 0; i--) {
      const s = sparks[i];
      s.x += s.vx;
      s.y += s.vy;
      s.life -= s.decay;
      if (s.life <= 0) { sparks.splice(i, 1); continue; }
      const r = s.r * (0.4 + s.life * 0.6);
      const grad = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, r);
      grad.addColorStop(0, sparkColor(s.life));
      grad.addColorStop(1, 'rgba(255, 90, 0, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(s.x, s.y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // сам огонёк: наклоняется по движению и слегка мерцает
    if (visible) {
      const targetSize = hot ? 36 : 26;
      fire.size += (targetSize - fire.size) * 0.15;
      fire.angle += ((Math.max(-0.5, Math.min(0.5, -dx * 0.02))) - fire.angle) * 0.2;
      const flicker = 1 + Math.sin(performance.now() / 70) * 0.05;
      ctx.save();
      ctx.translate(fire.x, fire.y);
      ctx.rotate(fire.angle);
      ctx.scale(flicker, flicker);
      ctx.font = `${fire.size}px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = 'rgba(255, 140, 0, .6)';
      ctx.shadowBlur = 14;
      ctx.fillText('🔥', 0, 0);
      ctx.restore();
    }

    // останавливаемся, когда всё догорело и мышь стоит — не грузим процессор
    if (sparks.length || (visible && speed > 0.5)) {
      requestAnimationFrame(frame);
    } else {
      running = false; // последний кадр с огоньком остаётся на экране
    }
  };

  function start() {
    if (!running) { running = true; requestAnimationFrame(frame); }
  }
})();
