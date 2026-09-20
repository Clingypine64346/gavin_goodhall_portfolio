/* Browser translation of Gavin's Projectile_Launcher.m and App Designer app.
   No dependencies. Physics retains the original 100-sample maximum-height rule. */
(function () {
  'use strict';
  const GRAVITIES = [3.70, 8.87, 9.81, 1.62, 3.71, 24.79, 10.44, 8.69, 11.15, 0.62];

  function calculateProjectile(speed, angle, height, gravity) {
    if (![speed, angle, height, gravity].every(Number.isFinite) ||
        speed < 10 || speed > 100 || angle < 0 || angle > 90 ||
        height < 0 || height > 100 || !GRAVITIES.includes(gravity)) {
      throw new RangeError('Choose a speed of 10–100 m/s, angle of 0–90°, height of 0–100 m, and a listed gravity.');
    }
    const radians = angle * Math.PI / 180;
    // MATLAB cosd(90) returns exactly zero.
    const vx = angle === 90 ? 0 : speed * Math.cos(radians);
    const vy = speed * Math.sin(radians);
    const flightTime = (vy + Math.sqrt(vy * vy + 2 * gravity * height)) / gravity;
    const points = Array.from({ length: 100 }, (_, i) => {
      const t = flightTime * i / 99;
      return { t, x: vx * t, y: height + vy * t - 0.5 * gravity * t * t };
    });
    let peakIndex = 0;
    points.forEach((point, i) => { if (point.y > points[peakIndex].y) peakIndex = i; });
    return {
      points, peakIndex, flightTime,
      maxHeight: points[peakIndex].y,
      range: points[99].x,
      impactSpeed: Math.hypot(vx, vy - gravity * flightTime)
    };
  }

  // Enables calculation checks in a development environment; not needed by the site.
  if (typeof module !== 'undefined' && module.exports) module.exports = { calculateProjectile, GRAVITIES };
  if (typeof document === 'undefined') return;
  const app = document.getElementById('projectile-app');
  if (!app) return;
  const form = app.querySelector('form');
  const svg = app.querySelector('svg');
  const status = app.querySelector('[data-launch-status]');
  const fields = ['speed', 'angle', 'height', 'gravity'].map(name => form.elements.namedItem(name));
  const metrics = app.querySelectorAll('[data-result]');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let result = null;
  let visiblePoints = 100;
  let frame = 0;
  let complete = false;
  const ns = 'http://www.w3.org/2000/svg';
  const make = (tag, attrs, text) => {
    const element = document.createElementNS(ns, tag);
    Object.entries(attrs).forEach(([key, value]) => element.setAttribute(key, value));
    if (text !== undefined) element.textContent = text;
    svg.append(element);
    return element;
  };
  const number = value => value.toLocaleString('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 });
  const tick = value => value.toLocaleString('en-US', { maximumFractionDigits: value < 10 ? 2 : 0 });

  function draw() {
    const width = Math.max(280, svg.clientWidth || 650);
    const height = 350;
    const left = 64, top = 22, bottom = 56, right = 20;
    const plotWidth = width - left - right, plotHeight = height - top - bottom;
    const xMax = result ? Math.max(result.range * 1.1, 1) : 100;
    const yMax = result ? Math.max(xMax * plotHeight / plotWidth, result.maxHeight * 1.1, 1) : 100;
    const x = value => left + value / xMax * plotWidth;
    // Clamp tiny floating-point residuals only for drawing, never for results.
    const y = value => height - bottom - Math.max(0, value) / yMax * plotHeight;
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    svg.replaceChildren();
    make('title', { id: 'trajectory-title' }, 'Projectile trajectory');
    make('desc', { id: 'trajectory-description' }, result
      ? `Horizontal range ${number(result.range)} meters; maximum sampled height ${number(result.maxHeight)} meters. ${complete ? 'Launch complete.' : 'Trajectory animation.'}`
      : 'Choose launch conditions and press Launch to plot horizontal and vertical position in meters.');
    for (let i = 0; i <= 4; i++) {
      const xv = xMax * i / 4, yv = yMax * i / 4;
      make('line', { x1: x(xv), x2: x(xv), y1: top, y2: height - bottom, class: 'launcher-gridline' });
      make('line', { x1: left, x2: width - right, y1: y(yv), y2: y(yv), class: 'launcher-gridline' });
      make('text', { x: x(xv), y: height - bottom + 23, 'text-anchor': 'middle', class: 'launcher-tick' }, tick(xv));
      make('text', { x: left - 9, y: y(yv) + 4, 'text-anchor': 'end', class: 'launcher-tick' }, tick(yv));
    }
    make('text', { x: left + plotWidth / 2, y: height - 8, 'text-anchor': 'middle', class: 'launcher-axis-label' }, 'Horizontal position (m)');
    make('text', { transform: `translate(15 ${top + plotHeight / 2}) rotate(-90)`, 'text-anchor': 'middle', class: 'launcher-axis-label' }, 'Vertical position (m)');
    if (!result) return;
    const points = result.points.slice(0, visiblePoints);
    make('polyline', { points: points.map(p => `${x(p.x)},${y(p.y)}`).join(' '), class: 'launcher-path' });
    const current = points[points.length - 1];
    make('circle', { cx: x(current.x), cy: y(current.y), r: 5, class: 'launcher-projectile' });
    if (complete) {
      [0, result.peakIndex, 99].forEach((index, i) => {
        const point = result.points[index], px = x(point.x), py = y(point.y);
        make('path', { d: `M${px-5} ${py-5}L${px+5} ${py+5}M${px-5} ${py+5}L${px+5} ${py-5}`, class: i === 1 ? 'launcher-marker launcher-peak' : 'launcher-marker' });
      });
    }
  }

  function clearResults(message) {
    cancelAnimationFrame(frame);
    result = null;
    complete = false;
    metrics.forEach(output => { output.textContent = '—'; });
    fields.forEach(field => {
      const output = app.querySelector(`[data-value="${field.name}"]`);
      output.textContent = field.name === 'gravity' ? Number(field.value).toFixed(2) : field.value;
    });
    status.textContent = message;
    draw();
  }
  function finish() {
    complete = true;
    visiblePoints = 100;
    metrics.forEach(output => {
      output.textContent = `${number(result[output.dataset.result])} ${output.dataset.unit}`;
    });
    status.textContent = 'Launch complete. Start, maximum sampled height, and impact are marked on the plot.';
    draw();
  }
  form.addEventListener('submit', event => {
    event.preventDefault();
    cancelAnimationFrame(frame);
    try {
      result = calculateProjectile(...fields.map(field => Number(field.value)));
    } catch (error) {
      clearResults(error.message);
      return;
    }
    complete = false;
    metrics.forEach(output => { output.textContent = '—'; });
    if (reducedMotion.matches || result.flightTime === 0) { finish(); return; }
    status.textContent = 'Launching… animation is a one-second playback, not real-time flight.';
    let started;
    function animate(now) {
      if (started === undefined) started = now;
      visiblePoints = Math.min(100, 1 + Math.floor((now - started) / 1000 * 99));
      if (visiblePoints >= 100 || reducedMotion.matches) { finish(); return; }
      draw();
      frame = requestAnimationFrame(animate);
    }
    frame = requestAnimationFrame(animate);
  });
  fields.forEach(field => field.addEventListener('input', () => clearResults('Conditions changed. Press Launch to run the simulation.')));
  form.addEventListener('reset', () => {
    // Form values reset after the reset event finishes.
    queueMicrotask(() => clearResults('Defaults restored. Press Launch to begin.'));
  });
  new ResizeObserver(draw).observe(svg);
  clearResults('Ready. Adjust the conditions and press Launch.');
})();
