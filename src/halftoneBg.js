/**
 * Media-Dex Fluid Halftone Background Engine
 * Viscous isoline topographic simulation rendered via HTML5 Canvas
 */

import { prefersReducedMotion } from './motion.js';

class PerlinNoise3D {
  constructor(seed = 2026) {
    this.p = new Uint8Array(512);
    const perm = new Uint8Array(256);
    for (let i = 0; i < 256; i++) perm[i] = i;
    let s = seed;
    for (let i = 255; i > 0; i--) {
      s = (s * 16807) % 2147483647;
      const j = s % (i + 1);
      const tmp = perm[i];
      perm[i] = perm[j];
      perm[j] = tmp;
    }
    for (let i = 0; i < 512; i++) {
      this.p[i] = perm[i & 255];
    }
  }

  fade(t) {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  lerp(t, a, b) {
    return a + t * (b - a);
  }

  grad(hash, x, y, z) {
    const h = hash & 15;
    const u = h < 8 ? x : y;
    const v = h < 4 ? y : (h === 12 || h === 14 ? x : z);
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
  }

  noise(x, y, z) {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    const Z = Math.floor(z) & 255;
    x -= Math.floor(x);
    y -= Math.floor(y);
    z -= Math.floor(z);
    const u = this.fade(x), v = this.fade(y), w = this.fade(z);
    const A = this.p[X] + Y, AA = this.p[A] + Z, AB = this.p[A + 1] + Z;
    const B = this.p[X + 1] + Y, BA = this.p[B] + Z, BB = this.p[B + 1] + Z;
    return this.lerp(w,
      this.lerp(v,
        this.lerp(u, this.grad(this.p[AA], x, y, z), this.grad(this.p[BA], x - 1, y, z)),
        this.lerp(u, this.grad(this.p[AB], x, y - 1, z), this.grad(this.p[BB], x - 1, y - 1, z))
      ),
      this.lerp(v,
        this.lerp(u, this.grad(this.p[AA + 1], x, y, z - 1), this.grad(this.p[BA + 1], x - 1, y, z - 1)),
        this.lerp(u, this.grad(this.p[AB + 1], x, y - 1, z - 1), this.grad(this.p[BB + 1], x - 1, y - 1, z - 1))
      )
    );
  }
}

export function initHalftoneBackground() {
  const canvas = document.getElementById('bg-halftone-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) return;

  const perlin = new PerlinNoise3D(2026);

  const params = {
    speed: 0.16,
    gridSpacing: 16,
    freq: 5.10,
    warp: 0.80,
    dotSize: 3.6,
    contrast: 2.2
  };

  const palette = [
    '#0D0D10', // Bucket 0: Subtle ambient ground dot
    '#111115', // Bucket 1: Faint contour shoulder
    '#16161C', // Bucket 2: Low-mid isoline ridge
    '#1C1C23', // Bucket 3: Mid-tier halftone ridge
    '#23232C', // Bucket 4: High halftone ridge
    '#2A2A34'  // Bucket 5: Peak isoline crest
  ];

  const BUCKET_COUNT = 6;
  const bucketBuffers = Array.from({ length: BUCKET_COUNT }, () => new Float32Array(65536 * 3));
  const bucketCounts = new Int32Array(BUCKET_COUNT);

  let width = 0;
  let height = 0;
  let isRunning = false;
  let simTime = 0;
  let lastTimestamp = performance.now();
  let rafId = null;

  let dpr = 1;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    params.gridSpacing = width > 2560 ? 24 : (width > 1600 ? 18 : 16);
  }

  const mouse = {
    x: -2000,
    y: -2000,
    lastX: -2000,
    lastY: -2000,
    vx: 0,
    vy: 0,
    speed: 0,
    radius: 220,
    radiusSq: 220 * 220,
    active: false
  };

  const ripples = [];

  function addRipple(x, y) {
    ripples.push({
      x,
      y,
      radius: 4,
      maxRadius: Math.max(window.innerWidth, window.innerHeight) * 0.38,
      speed: 380,
      intensity: 1.0,
      waveWidth: 48
    });
    if (ripples.length > 6) ripples.shift();
  }

  window.addEventListener('mousemove', (e) => {
    mouse.active = true;
    const curX = e.clientX;
    const curY = e.clientY;
    if (mouse.lastX > -1000) {
      mouse.vx = (curX - mouse.lastX) * 0.35;
      mouse.vy = (curY - mouse.lastY) * 0.35;
      mouse.speed = Math.min(Math.hypot(mouse.vx, mouse.vy), 45);
    }
    mouse.lastX = curX;
    mouse.lastY = curY;
    mouse.x = curX;
    mouse.y = curY;
  }, { passive: true });

  window.addEventListener('mousedown', (e) => {
    // Only trigger ripple if clicking on page content rather than interactive inputs
    if (e.target.closest('button, a, input, select, textarea')) return;
    addRipple(e.clientX, e.clientY);
  }, { passive: true });

  const BASE_NOISE_SCALE = 0.0028;

  function evaluateFluid(px, py, t) {
    const nx = px * BASE_NOISE_SCALE;
    const ny = py * BASE_NOISE_SCALE;
    const qx = perlin.noise(nx, ny, t);
    const qy = perlin.noise(nx + 5.2, ny + 1.3, t);
    const rx = perlin.noise(nx + params.warp * qx + 1.7, ny + params.warp * qy + 9.2, t * 1.12);
    const ry = perlin.noise(nx + params.warp * qx + 8.3, ny + params.warp * qy + 2.8, t * 1.12);
    return perlin.noise(nx + params.warp * rx, ny + params.warp * ry, t * 0.95);
  }

  function drawFrame(t) {
    ctx.fillStyle = '#070707';
    ctx.fillRect(0, 0, width, height);

    bucketCounts.fill(0);

    const spacing = params.gridSpacing;
    const maxR = params.dotSize;
    const freq = params.freq;
    const contrast = params.contrast;
    const hasRipples = ripples.length > 0;
    const mouseActive = mouse.active && mouse.x > -1000;

    const scrollOffsetY = (window.scrollY || 0) * 0.35;

    for (let y = 0; y < height + spacing; y += spacing) {
      for (let x = 0; x < width + spacing; x += spacing) {
        let evalX = x;
        let evalY = y + scrollOffsetY;

        if (mouseActive) {
          const mdx = x - mouse.x;
          const mdy = y - mouse.y;
          const mDistSq = mdx * mdx + mdy * mdy;
          if (mDistSq < mouse.radiusSq) {
            const mDist = Math.sqrt(mDistSq);
            const mFactor = 1.0 - (mDist / mouse.radius);
            const mForce = mFactor * mFactor;
            const angle = Math.atan2(mdy, mdx);
            const swirlStrength = 36 * (1.0 + mouse.speed * 0.12);
            evalX += (-Math.sin(angle) * swirlStrength + mouse.vx * 1.5) * mForce;
            evalY += ( Math.cos(angle) * swirlStrength + mouse.vy * 1.5) * mForce;
          }
        }

        if (hasRipples) {
          for (let r = 0; r < ripples.length; r++) {
            const rip = ripples[r];
            const rdx = x - rip.x;
            const rdy = y - rip.y;
            const rDist = Math.hypot(rdx, rdy);
            const diff = Math.abs(rDist - rip.radius);
            if (diff < rip.waveWidth) {
              const waveFactor = Math.sin((diff / rip.waveWidth) * Math.PI);
              const push = waveFactor * rip.intensity * 24;
              const normDist = rDist || 1;
              evalX += (rdx / normDist) * push;
              evalY += (rdy / normDist) * push;
            }
          }
        }

        const fluidVal = evaluateFluid(evalX, evalY, t);
        const isolineWave = Math.sin(fluidVal * freq * Math.PI);
        const contour = (isolineWave + 1.0) * 0.5;
        const ridge = Math.pow(contour, contrast);
        const dotRadius = 0.5 + ridge * maxR;

        if (dotRadius < 0.6) continue;

        let bIdx = 0;
        if (ridge < 0.20) {
          bIdx = 0;
        } else if (ridge < 0.45) {
          bIdx = 1;
        } else if (ridge < 0.70) {
          bIdx = 2;
        } else if (ridge < 0.88) {
          bIdx = 3;
        } else if (ridge < 0.96) {
          bIdx = 4;
        } else {
          bIdx = 5;
        }

        const bufIdx = bucketCounts[bIdx];
        const buffer = bucketBuffers[bIdx];
        if (bufIdx + 2 < buffer.length) {
          buffer[bufIdx] = x;
          buffer[bufIdx + 1] = y;
          buffer[bufIdx + 2] = dotRadius;
          bucketCounts[bIdx] += 3;
        }
      }
    }

    for (let b = 0; b < BUCKET_COUNT; b++) {
      const count = bucketCounts[b];
      if (count === 0) continue;

      ctx.fillStyle = palette[b];
      const buffer = bucketBuffers[b];
      for (let i = 0; i < count; i += 3) {
        const bx = buffer[i];
        const by = buffer[i + 1];
        const br = buffer[i + 2];
        ctx.fillRect(bx - br, by - br, br * 2, br * 2);
      }
    }
  }

  function loop(currentTime) {
    if (!isRunning) return;

    const dt = Math.min((currentTime - lastTimestamp) / 1000, 0.1);
    lastTimestamp = currentTime;

    simTime += dt * params.speed * 0.65;

    mouse.vx *= 0.90;
    mouse.vy *= 0.90;
    mouse.speed *= 0.90;

    for (let r = ripples.length - 1; r >= 0; r--) {
      const rip = ripples[r];
      rip.radius += rip.speed * dt;
      rip.intensity = 1.0 - (rip.radius / rip.maxRadius);
      if (rip.radius >= rip.maxRadius) {
        ripples.splice(r, 1);
      }
    }

    drawFrame(simTime);
    rafId = requestAnimationFrame(loop);
  }

  function start() {
    if (isRunning) return;
    if (prefersReducedMotion()) {
      // Reduced motion: render single static frame without continuous animation loop
      resize();
      drawFrame(1.0);
      return;
    }
    isRunning = true;
    lastTimestamp = performance.now();
    rafId = requestAnimationFrame(loop);
  }

  function stop() {
    isRunning = false;
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  let resizeRaf = null;
  window.addEventListener('resize', () => {
    if (resizeRaf) return;
    resizeRaf = requestAnimationFrame(() => {
      resizeRaf = null;
      resize();
      if (!isRunning && prefersReducedMotion()) {
        drawFrame(1.0);
      }
    });
  }, { passive: true });

  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  motionQuery.addEventListener('change', () => {
    if (motionQuery.matches) {
      stop();
      drawFrame(1.0);
    } else {
      start();
    }
  });

  // Suspend when tab is inactive to preserve CPU / battery
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stop();
      if (resizeRaf) {
        cancelAnimationFrame(resizeRaf);
        resizeRaf = null;
      }
    } else {
      start();
    }
  });

  resize();
  start();
}
