/* ==========================================================================
   RTS TRAVEL HUB - INTERACTIVE ROUTE VISUALIZER CANVAS
   Simulated Live GPS Route Mapping & Highway Animation
   ========================================================================== */

class RouteVisualizer {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.carProgress = 0;
    this.currentRoute = {
      from: 'Gurgaon',
      to: 'Hyderabad',
      distance: 1580,
      duration: '26 hrs',
    };

    this.init();
    this.animate();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    if (!this.canvas) return;
    this.canvas.width = this.canvas.parentElement.clientWidth;
    this.canvas.height = this.canvas.parentElement.clientHeight;
  }

  updateRoute(from, to, distance, duration) {
    this.currentRoute = { from, to, distance, duration };
    this.carProgress = 0;

    const fromEl = document.getElementById('map-hud-from');
    const toEl = document.getElementById('map-hud-to');
    const distEl = document.getElementById('map-hud-dist');
    const durEl = document.getElementById('map-hud-dur');

    if (fromEl) fromEl.innerText = from;
    if (toEl) toEl.innerText = to;
    if (distEl) distEl.innerText = `${distance} KM`;
    if (durEl) durEl.innerText = duration;
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    this.draw();
  }

  draw() {
    const { width, height } = this.canvas;
    const ctx = this.ctx;

    // Clear background
    ctx.fillStyle = '#0a0e1a';
    ctx.fillRect(0, 0, width, height);

    // Draw Subtle Grid
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.05)';
    ctx.lineWidth = 1;
    const gridSize = 40;
    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Define Route Path Nodes
    const startX = 80;
    const startY = height * 0.25;
    const cp1X = width * 0.35;
    const cp1Y = height * 0.15;
    const midX = width * 0.5;
    const midY = height * 0.55;
    const cp2X = width * 0.65;
    const cp2Y = height * 0.85;
    const endX = width - 90;
    const endY = height * 0.72;

    // 1. Draw Route Glow Outer Line
    ctx.strokeStyle = 'rgba(0, 210, 255, 0.2)';
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.bezierCurveTo(cp1X, cp1Y, midX - 30, midY, midX, midY);
    ctx.bezierCurveTo(midX + 30, midY, cp2X, cp2Y, endX, endY);
    ctx.stroke();

    // 2. Draw Main Glowing Route Path
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.bezierCurveTo(cp1X, cp1Y, midX - 30, midY, midX, midY);
    ctx.bezierCurveTo(midX + 30, midY, cp2X, cp2Y, endX, endY);
    ctx.stroke();

    // 3. Intermediate Highway Toll Nodes
    const waypoints = [
      { x: midX * 0.65, y: height * 0.32, label: 'NH-44 Toll Plaza' },
      { x: midX, y: midY, label: 'Corporate Hub Checkpoint' },
      { x: midX * 1.45, y: height * 0.76, label: 'Expressway Flyover' },
    ];

    waypoints.forEach((wp) => {
      ctx.fillStyle = '#00d2ff';
      ctx.beginPath();
      ctx.arc(wp.x, wp.y, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = 'rgba(154, 165, 190, 0.8)';
      ctx.font = '10px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(wp.label, wp.x + 8, wp.y + 3);
    });

    // 4. Moving Animated Cab Indicator along Bezier
    this.carProgress += 0.003;
    if (this.carProgress > 1) this.carProgress = 0;

    const t = this.carProgress;
    let cx, cy;
    if (t <= 0.5) {
      const segT = t * 2;
      cx = (1 - segT) * (1 - segT) * startX + 2 * (1 - segT) * segT * cp1X + segT * segT * midX;
      cy = (1 - segT) * (1 - segT) * startY + 2 * (1 - segT) * segT * cp1Y + segT * segT * midY;
    } else {
      const segT = (t - 0.5) * 2;
      cx = (1 - segT) * (1 - segT) * midX + 2 * (1 - segT) * segT * cp2X + segT * segT * endX;
      cy = (1 - segT) * (1 - segT) * midY + 2 * (1 - segT) * segT * cp2Y + segT * segT * endY;
    }

    // Cab Pulse Glow
    ctx.fillStyle = 'rgba(0, 210, 255, 0.35)';
    ctx.beginPath();
    ctx.arc(cx, cy, 14 + Math.sin(Date.now() * 0.005) * 4, 0, Math.PI * 2);
    ctx.fill();

    // Cab Pin Point
    ctx.fillStyle = '#00d2ff';
    ctx.beginPath();
    ctx.arc(cx, cy, 7, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(cx, cy, 3, 0, Math.PI * 2);
    ctx.fill();

    // 5. Start Pin (Pickup - Gurgaon)
    this.drawPin(ctx, startX, startY, this.currentRoute.from, '#10b981', 'PICKUP');

    // 6. End Pin (Drop - Hyderabad)
    this.drawPin(ctx, endX, endY, this.currentRoute.to, '#ef4444', 'DESTINATION');
  }

  drawPin(ctx, x, y, cityName, color, tag) {
    // Pulse Ring
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(x, y, 12, 0, Math.PI * 2);
    ctx.stroke();

    // Core Solid Circle
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, Math.PI * 2);
    ctx.fill();

    // Label Card Box
    ctx.fillStyle = 'rgba(16, 22, 38, 0.9)';
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.3)';
    ctx.lineWidth = 1;
    ctx.roundRect(x - 45, y - 46, 90, 32, 6);
    ctx.fill();
    ctx.stroke();

    // Tag
    ctx.fillStyle = color;
    ctx.font = 'bold 8px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(tag, x, y - 34);

    // City Name
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 11px "Outfit", sans-serif';
    ctx.fillText(cityName, x, y - 20);
    ctx.textAlign = 'start'; // Reset
  }
}

window.RouteVisualizer = RouteVisualizer;
