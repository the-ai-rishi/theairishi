export type Pointer = { x: number; y: number } | null;

function line(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  color: string,
  width: number,
) {
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

/** Procedural structure for one FORGE-120 phase. Geometry is the idea, not a frame. */
export function drawPhase(
  ctx: CanvasRenderingContext2D,
  phase: number,
  w: number,
  h: number,
  pointer: Pointer,
  time: number,
) {
  ctx.clearRect(0, 0, w, h);
  const ink = "#1a1714";
  const faint = "rgba(26,23,20,0.22)";
  const brass = "#8a5a2b";
  const signal = "#0e5c62";
  const weight = Math.max(1.15, Math.min(w, h) / 420);
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.fillStyle = "transparent";

  const x0 = w * 0.08;
  const y0 = h * 0.14;
  const W = w * 0.84;
  const H = h * 0.72;
  const near = (x: number, y: number) =>
    pointer ? Math.hypot(pointer.x - x, pointer.y - y) < Math.min(w, h) * 0.12 : false;

  if (phase === 0) {
    line(ctx, x0, y0 + H * 0.86, x0 + W, y0 + H * 0.86, faint, weight);
    for (let i = 0; i < 6; i += 1) {
      const rh = H * (0.16 + i * 0.1);
      const x = x0 + W * (0.08 + i * 0.14);
      const y = y0 + H * 0.86 - rh;
      const hot = near(x, y);
      ctx.strokeStyle = hot || i === 5 ? brass : ink;
      ctx.lineWidth = hot ? weight * 1.8 : weight;
      ctx.strokeRect(x, y, W * 0.08, rh);
    }
    return;
  }

  if (phase === 1) {
    const y = y0 + H * 0.55;
    line(ctx, x0 + W * 0.12, y, x0 + W * 0.88, y, faint, weight);
    line(ctx, x0 + W * 0.28, y, x0 + W * 0.72, y, brass, weight * 2.2);
    [0.18, 0.82].forEach((t) => {
      const x = x0 + W * t;
      ctx.strokeStyle = near(x, y) ? brass : ink;
      ctx.lineWidth = weight * 1.4;
      ctx.strokeRect(x - 10, y0 + H * 0.22, 20, H * 0.66);
    });
    return;
  }

  if (phase === 2) {
    const y = y0 + H * 0.5;
    const stations = [0.12, 0.5, 0.86];
    line(ctx, x0 + W * 0.12, y, x0 + W * 0.86, y, faint, weight);
    stations.forEach((t, i) => {
      const x = x0 + W * t;
      ctx.strokeStyle = near(x, y) ? brass : ink;
      ctx.lineWidth = weight;
      ctx.strokeRect(x - W * 0.06, y - H * 0.12, W * 0.12, H * 0.24);
      ctx.font = "12px var(--font-geist-mono), ui-monospace, monospace";
      ctx.fillStyle = ink;
      ctx.textAlign = "center";
      ctx.fillText(["source", "CI", "artifact"][i], x, y + H * 0.28);
    });
    const travel = (time * 0.18) % 1;
    const ax = x0 + W * (0.18 + travel * 0.62);
    ctx.fillStyle = brass;
    ctx.fillRect(ax, y - 5, 14, 10);
    return;
  }

  if (phase === 3) {
    for (let i = 0; i < 4; i += 1) {
      const y = y0 + H * (0.18 + i * 0.18);
      const hot = near(x0 + W * 0.5, y);
      ctx.strokeStyle = hot ? brass : ink;
      ctx.lineWidth = weight;
      ctx.strokeRect(x0 + W * (0.18 + i * 0.04), y, W * (0.64 - i * 0.08), H * 0.12);
    }
    line(ctx, x0 + W * 0.12, y0 + H * 0.12, x0 + W * 0.12, y0 + H * 0.9, brass, weight * 1.6);
    return;
  }

  if (phase === 4) {
    const nodes = [0.2, 0.5, 0.8];
    nodes.forEach((t) => {
      const x = x0 + W * t;
      const y = y0 + H * 0.62;
      ctx.strokeStyle = near(x, y) ? brass : ink;
      ctx.lineWidth = weight * 1.3;
      ctx.strokeRect(x - W * 0.08, y, W * 0.16, H * 0.22);
      for (let k = 0; k < 3; k += 1) {
        const wx = x - W * 0.05 + ((k + Math.floor(time * 0.4)) % 3) * W * 0.035;
        ctx.strokeStyle = brass;
        ctx.strokeRect(wx, y0 + H * (0.18 + (k % 2) * 0.12), W * 0.03, H * 0.08);
      }
    });
    line(ctx, x0 + W * 0.12, y0 + H * 0.9, x0 + W * 0.88, y0 + H * 0.9, faint, weight);
    return;
  }

  if (phase === 5) {
    line(ctx, x0, y0 + H * 0.78, x0 + W, y0 + H * 0.78, brass, weight * 2);
    ctx.strokeStyle = ink;
    ctx.lineWidth = weight;
    ctx.strokeRect(x0 + W * 0.28, y0 + H * 0.28, W * 0.44, H * 0.42);
    line(ctx, x0 + W * 0.5, y0 + H * 0.28, x0 + W * 0.5, y0 + H * 0.78, faint, weight);
    ctx.fillStyle = ink;
    ctx.font = "12px var(--font-geist-mono), ui-monospace, monospace";
    ctx.textAlign = "center";
    ctx.fillText("platform", x0 + W * 0.5, y0 + H * 0.9);
    return;
  }

  if (phase === 6) {
    for (let i = 0; i < 4; i += 1) {
      const x = x0 + W * (0.1 + i * 0.22);
      const y = y0 + H * 0.42;
      ctx.strokeStyle = i === 3 ? brass : ink;
      ctx.lineWidth = weight;
      ctx.strokeRect(x, y, W * 0.14, H * 0.16);
      if (i < 3) line(ctx, x + W * 0.14, y + H * 0.08, x + W * 0.22, y + H * 0.08, faint, weight);
    }
    line(ctx, x0 + W * 0.78, y0 + H * 0.58, x0 + W * 0.34, y0 + H * 0.72, brass, weight * 1.5);
    ctx.fillStyle = ink;
    ctx.font = "12px var(--font-geist-mono), ui-monospace, monospace";
    ctx.textAlign = "left";
    ctx.fillText("rollback", x0 + W * 0.36, y0 + H * 0.84);
    return;
  }

  if (phase === 7) {
    const base = y0 + H * 0.62;
    line(ctx, x0, base, x0 + W, base, brass, weight * 1.4);
    ctx.beginPath();
    ctx.strokeStyle = ink;
    ctx.lineWidth = weight * 1.3;
    for (let i = 0; i <= 48; i += 1) {
      const t = i / 48;
      const x = x0 + W * t;
      const spike = i === 30 ? H * 0.34 : 0;
      const y = base - Math.sin(t * Math.PI * 3 + time * 0.6) * H * 0.12 - spike;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.fillStyle = ink;
    ctx.font = "12px var(--font-geist-mono), ui-monospace, monospace";
    ctx.textAlign = "right";
    ctx.fillText("threshold", x0 + W, base - 8);
    return;
  }

  if (phase === 8) {
    for (let i = 0; i < 4; i += 1) {
      const x = x0 + W * (0.06 + i * 0.16);
      const y = y0 + H * 0.22;
      const hot = i === 1 || near(x, y);
      ctx.strokeStyle = hot ? signal : ink;
      ctx.lineWidth = hot ? weight * 1.8 : weight;
      ctx.strokeRect(x, y, W * 0.12, H * 0.42);
    }
    const cx = x0 + W * 0.78;
    const cy = y0 + H * 0.4;
    ctx.strokeStyle = signal;
    ctx.lineWidth = weight * 1.6;
    ctx.strokeRect(cx, cy, W * 0.16, H * 0.22);
    line(ctx, x0 + W * 0.3, y0 + H * 0.42, cx, cy + H * 0.1, signal, weight);
    ctx.fillStyle = signal;
    ctx.font = "12px var(--font-geist-mono), ui-monospace, monospace";
    ctx.textAlign = "left";
    ctx.fillText("cited", cx, cy + H * 0.36);
    return;
  }

  ctx.strokeStyle = ink;
  ctx.lineWidth = weight * 1.6;
  ctx.strokeRect(x0 + W * 0.08, y0 + H * 0.1, W * 0.84, H * 0.78);
  line(ctx, x0 + W * 0.2, y0 + H * 0.72, x0 + W * 0.42, y0 + H * 0.28, faint, weight);
  line(ctx, x0 + W * 0.48, y0 + H * 0.55, x0 + W * 0.78, y0 + H * 0.55, brass, weight * 1.6);
  ctx.strokeStyle = signal;
  ctx.strokeRect(x0 + W * 0.58, y0 + H * 0.24, W * 0.16, H * 0.16);
  ctx.fillStyle = ink;
  ctx.font = "12px var(--font-geist-mono), ui-monospace, monospace";
  ctx.textAlign = "left";
  ctx.fillText("closed", x0 + W * 0.12, y0 + H * 0.2);
}
