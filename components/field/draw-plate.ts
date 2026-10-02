export type PlatePointer = { x: number; y: number } | null;

/** Real phase facts. The plate is drawn from these, not from a generic icon. */
export type PlateModel = {
  index: number;
  summary: string;
  startDay: number;
  endDay: number;
  publishedDays: number[];
  activeDay: number | null;
};

const INK = "#1a1714";
const FAINT = "rgba(26,23,20,0.28)";
const HAIR = "rgba(26,23,20,0.14)";
const BRASS = "#8a5a2b";
const SIGNAL = "#0e5c62";

/** Curriculum evidence classes. Same four words as forge-120 evidenceLabels. */
const EVIDENCE = ["OPERATED", "GENERATED", "SIMULATED", "BLOCKED"] as const;

function terms(summary: string, count: number): string[] {
  const parts = summary
    .replace(/\./g, "")
    .split(/,|\band\b/i)
    .map((part) => part.replace(/\s+/g, " ").trim())
    .filter((part) => part.length > 1);
  return parts.slice(0, count).map((part) => (part.length <= 18 ? part : part.split(" ")[0]));
}

function font(px: number) {
  return `${px}px ui-monospace, monospace`;
}

function near(pointer: PlatePointer, x: number, y: number, reach: number) {
  return pointer ? Math.hypot(pointer.x - x, pointer.y - y) < reach : false;
}

function stroke(
  ctx: CanvasRenderingContext2D,
  color: string,
  width: number,
  run: () => void,
) {
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  run();
  ctx.stroke();
}

function text(
  ctx: CanvasRenderingContext2D,
  value: string,
  x: number,
  y: number,
  color: string,
  px: number,
  align: CanvasTextAlign = "left",
) {
  ctx.fillStyle = color;
  ctx.font = font(px);
  ctx.textAlign = align;
  ctx.textBaseline = "middle";
  ctx.fillText(value, x, y);
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const radius = Math.max(0, Math.min(r, w / 2, h / 2));
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

function crops(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  weight: number,
) {
  const mark = Math.min(16, w * 0.04);
  const corners = [
    [x, y, 1, 1],
    [x + w, y, -1, 1],
    [x, y + h, 1, -1],
    [x + w, y + h, -1, -1],
  ] as const;
  corners.forEach(([cx, cy, sx, sy]) => {
    stroke(ctx, FAINT, weight, () => {
      ctx.moveTo(cx, cy + sy * mark);
      ctx.lineTo(cx, cy);
      ctx.lineTo(cx + sx * mark, cy);
    });
  });
}

function dayRuler(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  model: PlateModel,
  pointer: PlatePointer,
  weight: number,
) {
  const count = Math.max(1, model.endDay - model.startDay + 1);
  stroke(ctx, HAIR, weight, () => {
    ctx.moveTo(x, y);
    ctx.lineTo(x + w, y);
  });
  const reach = Math.max(14, w / count);
  for (let i = 0; i < count; i += 1) {
    const day = model.startDay + i;
    const px = count === 1 ? x + w / 2 : x + (w * i) / (count - 1);
    const open = model.publishedDays.includes(day);
    const hot = model.activeDay === day || near(pointer, px, y, reach);
    const tick = open || hot ? 14 : 7;
    stroke(ctx, hot ? BRASS : open ? INK : FAINT, hot ? weight * 1.8 : weight, () => {
      ctx.moveTo(px, y - tick);
      ctx.lineTo(px, y + (hot ? 4 : 0));
    });
    if (hot || count <= 12) {
      text(ctx, String(day).padStart(2, "0"), px, y + 16, hot || open ? INK : FAINT, count > 16 ? 9 : 10, "center");
    }
  }
}

function bounds(w: number, h: number) {
  const wide = w >= 520;
  const x = wide ? w * 0.42 : w * 0.06;
  const y = h * 0.06;
  const pw = Math.max(40, w - x - w * 0.05);
  const ph = h * 0.78;
  return { x, y, pw, ph };
}

function foundations(
  ctx: CanvasRenderingContext2D,
  model: PlateModel,
  x: number,
  y: number,
  w: number,
  h: number,
  pointer: PlatePointer,
  weight: number,
) {
  const words = terms(model.summary, 6);
  const count = Math.max(1, model.endDay - model.startDay + 1);
  words.forEach((word, index) => {
    const yy = y + h * (0.08 + index * 0.12);
    text(ctx, word, x + w * 0.62, yy, FAINT, 11);
    stroke(ctx, HAIR, weight, () => {
      ctx.moveTo(x + w * 0.58, yy);
      ctx.lineTo(x + w * 0.6, yy);
    });
  });
  for (let i = 0; i < count; i += 1) {
    const day = model.startDay + i;
    const yy = y + h * (0.06 + (i / count) * 0.82);
    const open = model.publishedDays.includes(day);
    const hot = model.activeDay === day || near(pointer, x + w * 0.2, yy, h / count);
    const len = w * (0.12 + (i / Math.max(1, count - 1)) * 0.4);
    stroke(ctx, hot || open ? BRASS : INK, hot ? weight * 2.2 : open ? weight * 1.5 : weight, () => {
      ctx.moveTo(x, yy);
      ctx.lineTo(x + len, yy);
    });
    if (hot || open) text(ctx, String(day).padStart(2, "0"), x + len + 8, yy, INK, 11);
  }
}

function azure(
  ctx: CanvasRenderingContext2D,
  model: PlateModel,
  x: number,
  y: number,
  w: number,
  h: number,
  pointer: PlatePointer,
  weight: number,
) {
  const labels = terms(model.summary, 5);
  const outerX = x + w * 0.18;
  const outerY = y + h * 0.08;
  const outerW = w * 0.7;
  const outerH = h * 0.62;
  ctx.strokeStyle = INK;
  ctx.lineWidth = weight * 1.3;
  roundRect(ctx, outerX, outerY, outerW, outerH, 18);
  ctx.stroke();
  const gapY = outerY + outerH * 0.38;
  ctx.strokeStyle = "#efe8dc";
  ctx.lineWidth = weight * 3;
  stroke(ctx, "#efe8dc", weight * 3.2, () => {
    ctx.moveTo(outerX + outerW, gapY);
    ctx.lineTo(outerX + outerW, gapY + outerH * 0.16);
  });
  stroke(ctx, BRASS, weight * 1.6, () => {
    ctx.moveTo(outerX + outerW - 8, gapY);
    ctx.lineTo(outerX + outerW + 10, gapY);
    ctx.moveTo(outerX + outerW - 8, gapY + outerH * 0.16);
    ctx.lineTo(outerX + outerW + 10, gapY + outerH * 0.16);
  });
  text(ctx, labels[1] || "NSG", outerX + outerW + 14, gapY + outerH * 0.08, BRASS, 11);

  const inX = outerX + outerW * 0.22;
  const inY = outerY + outerH * 0.28;
  const inW = outerW * 0.42;
  const inH = outerH * 0.46;
  const hot = near(pointer, inX + inW / 2, inY + inH / 2, inW * 0.6);
  ctx.strokeStyle = hot ? BRASS : INK;
  ctx.lineWidth = hot ? weight * 1.8 : weight;
  roundRect(ctx, inX, inY, inW, inH, 28);
  ctx.stroke();
  text(ctx, labels[2] || "private", inX + inW / 2, inY + inH / 2, hot ? BRASS : INK, 12, "center");

  const idX = outerX + outerW * 0.78;
  const idY = outerY + outerH * 0.22;
  stroke(ctx, INK, weight * 1.3, () => {
    ctx.arc(idX, idY, 16, 0, Math.PI * 2);
  });
  stroke(ctx, INK, weight, () => {
    ctx.moveTo(idX - 7, idY);
    ctx.lineTo(idX + 7, idY);
    ctx.moveTo(idX, idY - 7);
    ctx.lineTo(idX, idY + 7);
  });
  text(ctx, labels[4] || "identity", idX, idY + 28, INK, 11, "center");
  text(ctx, labels[0] || "VNet", outerX + 12, outerY + 16, INK, 11);
  text(ctx, labels[3] || "DNS", outerX + 12, outerY + outerH - 14, FAINT, 11);
}

function deliveryPath(
  ctx: CanvasRenderingContext2D,
  labels: string[],
  x: number,
  y: number,
  w: number,
  h: number,
  pointer: PlatePointer,
  weight: number,
  time: number,
) {
  const baseline = y + h * 0.46;
  const travel = time === 0 ? 0.62 : (time * 0.12) % 1;
  stroke(ctx, HAIR, weight, () => {
    ctx.moveTo(x + w * 0.06, baseline);
    ctx.lineTo(x + w * 0.94, baseline);
  });
  stroke(ctx, BRASS, weight * 2, () => {
    ctx.moveTo(x + w * 0.06, baseline);
    ctx.lineTo(x + w * (0.06 + travel * 0.88), baseline);
  });
  labels.forEach((label, index) => {
    const px = x + w * (0.12 + index * (0.76 / Math.max(1, labels.length - 1)));
    const hot = near(pointer, px, baseline, w * 0.08);
    stroke(ctx, hot ? BRASS : INK, weight * (hot ? 1.8 : 1.2), () => {
      ctx.moveTo(px, baseline - 18);
      ctx.lineTo(px, baseline + 18);
    });
    text(ctx, label, px, baseline + 36, hot ? BRASS : INK, 11, "center");
  });
  const ax = x + w * (0.06 + travel * 0.88);
  ctx.fillStyle = BRASS;
  ctx.beginPath();
  ctx.moveTo(ax, baseline - 7);
  ctx.lineTo(ax + 8, baseline);
  ctx.lineTo(ax, baseline + 7);
  ctx.lineTo(ax - 8, baseline);
  ctx.closePath();
  ctx.fill();
}

function strata(
  ctx: CanvasRenderingContext2D,
  labels: string[],
  x: number,
  y: number,
  w: number,
  h: number,
  pointer: PlatePointer,
  weight: number,
) {
  const left = x + w * 0.14;
  const width = w * 0.72;
  stroke(ctx, BRASS, weight * 1.8, () => {
    ctx.moveTo(left - 10, y + h * 0.08);
    ctx.lineTo(left - 10, y + h * 0.86);
  });
  text(ctx, "state", left - 16, y + h * 0.94, BRASS, 11, "center");
  labels.forEach((label, index) => {
    const top = y + h * (0.1 + index * 0.18);
    const hot = near(pointer, left + width / 2, top + 12, h * 0.1);
    stroke(ctx, hot ? BRASS : INK, hot ? weight * 1.7 : weight, () => {
      ctx.moveTo(left, top + 16);
      for (let i = 0; i <= 20; i += 1) {
        const t = i / 20;
        ctx.lineTo(left + width * t, top + Math.sin(t * Math.PI * 2 + index) * 5);
      }
    });
    text(ctx, label, left + 8, top + 4, hot ? BRASS : INK, 12);
  });
}

function kubernetes(
  ctx: CanvasRenderingContext2D,
  model: PlateModel,
  x: number,
  y: number,
  w: number,
  h: number,
  pointer: PlatePointer,
  weight: number,
  time: number,
) {
  const labels = terms(model.summary, 4);
  const nodes = [0.22, 0.5, 0.78];
  const cy = y + h * 0.42;
  const shift = time === 0 ? 1 : Math.floor(time * 0.35) % 3;
  nodes.forEach((t, index) => {
    const cx = x + w * t;
    const hot = near(pointer, cx, cy, w * 0.1);
    stroke(ctx, hot ? BRASS : INK, weight * 1.4, () => {
      ctx.arc(cx, cy, Math.min(w, h) * 0.09, 0, Math.PI * 2);
    });
    if (index < nodes.length - 1) {
      const nx = x + w * nodes[index + 1];
      stroke(ctx, FAINT, weight, () => {
        ctx.moveTo(cx, cy - Math.min(w, h) * 0.09);
        ctx.quadraticCurveTo((cx + nx) / 2, cy - h * 0.22, nx, cy - Math.min(w, h) * 0.09);
      });
    }
  });
  for (let i = 0; i < 3; i += 1) {
    const node = nodes[(i + shift) % 3];
    const cx = x + w * node + (i - 1) * 11;
    const py = cy + (i === 1 ? -28 : 22);
    ctx.strokeStyle = i === shift ? BRASS : INK;
    ctx.lineWidth = weight;
    ctx.strokeRect(cx - 5, py - 5, 10, 10);
  }
  text(ctx, labels[0] || "workloads", x + w * 0.5, y + h * 0.16, FAINT, 11, "center");
  text(ctx, labels[1] || "networking", x + w * 0.5, y + h * 0.72, FAINT, 11, "center");
}

function aks(
  ctx: CanvasRenderingContext2D,
  model: PlateModel,
  x: number,
  y: number,
  w: number,
  h: number,
  pointer: PlatePointer,
  weight: number,
) {
  const labels = terms(model.summary, 4);
  const bandY = y + h * 0.22;
  stroke(ctx, BRASS, weight * 2.4, () => {
    ctx.moveTo(x + w * 0.08, bandY);
    ctx.lineTo(x + w * 0.92, bandY);
  });
  stroke(ctx, HAIR, weight, () => {
    ctx.moveTo(x + w * 0.08, bandY + 8);
    ctx.lineTo(x + w * 0.92, bandY + 8);
  });
  text(ctx, "managed", x + w * 0.08, bandY - 14, BRASS, 11);
  labels.forEach((label, index) => {
    const px = x + w * (0.18 + index * 0.2);
    const hot = near(pointer, px, bandY, w * 0.08);
    const ly = y + h * (0.48 + (index % 2) * 0.16);
    stroke(ctx, hot ? BRASS : FAINT, weight, () => {
      ctx.moveTo(px, bandY + 8);
      ctx.lineTo(px, ly - 8);
    });
    text(ctx, label, px, ly, hot ? BRASS : INK, 11, "center");
  });
}

function rollback(
  ctx: CanvasRenderingContext2D,
  model: PlateModel,
  x: number,
  y: number,
  w: number,
  h: number,
  pointer: PlatePointer,
  weight: number,
) {
  const labels = terms(model.summary, 4);
  const baseline = y + h * 0.4;
  labels.forEach((label, index) => {
    const px = x + w * (0.12 + index * 0.24);
    const hot = near(pointer, px, baseline, w * 0.08);
    stroke(ctx, hot ? BRASS : INK, weight * 1.2, () => {
      ctx.arc(px, baseline, 5, 0, Math.PI * 2);
    });
    if (index < labels.length - 1) {
      stroke(ctx, FAINT, weight, () => {
        ctx.moveTo(px + 8, baseline);
        ctx.lineTo(px + w * 0.2, baseline);
      });
    }
    text(ctx, label, px, baseline + 28, hot ? BRASS : INK, 11, "center");
  });
  const from = x + w * (0.12 + 3 * 0.24);
  const back = x + w * (0.12 + 1 * 0.24);
  stroke(ctx, BRASS, weight * 1.6, () => {
    ctx.moveTo(from, baseline + 10);
    ctx.bezierCurveTo(from, y + h * 0.78, back, y + h * 0.78, back, baseline + 10);
  });
  text(ctx, "return", (from + back) / 2, y + h * 0.84, BRASS, 11, "center");
}

function reliability(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  pointer: PlatePointer,
  weight: number,
  time: number,
) {
  const left = x + w * 0.12;
  const right = x + w * 0.9;
  const base = y + h * 0.72;
  const top = y + h * 0.12;
  const threshold = y + h * 0.36;
  stroke(ctx, INK, weight, () => {
    ctx.moveTo(left, top);
    ctx.lineTo(left, base);
    ctx.lineTo(right, base);
  });
  stroke(ctx, BRASS, weight * 1.4, () => {
    ctx.moveTo(left, threshold);
    ctx.lineTo(right, threshold);
  });
  text(ctx, "threshold", right, threshold - 12, BRASS, 11, "right");
  text(ctx, "SLI", left - 8, base + 16, INK, 11, "left");
  const points: { x: number; y: number }[] = [];
  for (let i = 0; i <= 40; i += 1) {
    const t = i / 40;
    const spike = i > 24 && i < 30 ? Math.sin(((i - 24) / 6) * Math.PI) * h * 0.28 : 0;
    points.push({
      x: left + (right - left) * t,
      y: base - h * 0.18 - Math.sin(t * Math.PI * 2) * h * 0.06 - spike,
    });
  }
  stroke(ctx, INK, weight * 1.3, () => {
    points.forEach((point, index) => {
      if (index === 0) ctx.moveTo(point.x, point.y);
      else ctx.lineTo(point.x, point.y);
    });
  });
  const breach = points[27];
  const hot = near(pointer, breach.x, breach.y, 36);
  stroke(ctx, hot ? BRASS : SIGNAL, weight * 1.6, () => {
    ctx.moveTo(breach.x, breach.y);
    ctx.lineTo(breach.x + 28, breach.y - 22);
  });
  text(ctx, "page", breach.x + 32, breach.y - 22, SIGNAL, 11);
  if (time > 0) {
    const probe = points[Math.floor((time * 6) % points.length)];
    ctx.fillStyle = BRASS;
    ctx.beginPath();
    ctx.arc(probe.x, probe.y, 3.2, 0, Math.PI * 2);
    ctx.fill();
  }
}

function retrieval(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  pointer: PlatePointer,
  weight: number,
) {
  const lines = [0.92, 0.7, 0.84, 0.55, 0.78, 0.4, 0.66];
  let cited = 2;
  lines.forEach((_, index) => {
    const yy = y + h * (0.12 + index * 0.1);
    if (near(pointer, x + w * 0.28, yy, h * 0.06)) cited = index;
  });
  lines.forEach((len, index) => {
    const yy = y + h * (0.12 + index * 0.1);
    const on = index === cited;
    stroke(ctx, on ? SIGNAL : INK, on ? weight * 1.8 : weight, () => {
      ctx.moveTo(x + w * 0.06, yy);
      ctx.lineTo(x + w * (0.06 + len * 0.48), yy);
    });
  });
  const cy = y + h * (0.12 + cited * 0.1);
  const cardX = x + w * 0.66;
  const cardY = y + h * 0.28;
  stroke(ctx, SIGNAL, weight, () => {
    ctx.moveTo(x + w * 0.56, cy);
    ctx.lineTo(cardX, cardY + 28);
  });
  ctx.strokeStyle = SIGNAL;
  ctx.lineWidth = weight * 1.4;
  roundRect(ctx, cardX, cardY, w * 0.28, h * 0.28, 2);
  ctx.stroke();
  text(ctx, "cited", cardX + 12, cardY + 22, SIGNAL, 12);
  text(ctx, "one passage", cardX + 12, cardY + 42, INK, 11);
}

function defence(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  pointer: PlatePointer,
  weight: number,
) {
  const fx = x + w * 0.08;
  const fy = y + h * 0.08;
  const fw = w * 0.84;
  const fh = h * 0.7;
  ctx.strokeStyle = INK;
  ctx.lineWidth = weight * 1.7;
  ctx.strokeRect(fx, fy, fw, fh);
  text(ctx, "closed", fx + 10, fy + 14, INK, 11);
  EVIDENCE.forEach((label, index) => {
    const col = index % 2;
    const row = Math.floor(index / 2);
    const cx = fx + fw * (0.28 + col * 0.44);
    const cy = fy + fh * (0.38 + row * 0.34);
    const hot = near(pointer, cx, cy, fw * 0.18);
    const blocked = label === "BLOCKED";
    text(ctx, label, cx, cy, hot ? BRASS : blocked ? SIGNAL : INK, 12, "center");
  });
  stroke(ctx, BRASS, weight * 1.4, () => {
    ctx.moveTo(x, fy + fh * 0.38);
    ctx.lineTo(fx, fy + fh * 0.38);
  });
}

export function drawPlate(
  ctx: CanvasRenderingContext2D,
  model: PlateModel,
  w: number,
  h: number,
  pointer: PlatePointer,
  time: number,
) {
  ctx.clearRect(0, 0, w, h);
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  const weight = Math.max(1.05, Math.min(w, h) / 380);
  const { x, y, pw, ph } = bounds(w, h);
  crops(ctx, x, y, pw, ph, weight);
  text(
    ctx,
    `${String(model.startDay).padStart(2, "0")}–${String(model.endDay).padStart(2, "0")}`,
    x + pw,
    y + 8,
    FAINT,
    11,
    "right",
  );

  const index = model.index;
  if (index === 0) foundations(ctx, model, x, y, pw, ph * 0.82, pointer, weight);
  else if (index === 1) azure(ctx, model, x, y, pw, ph * 0.78, pointer, weight);
  else if (index === 2) deliveryPath(ctx, terms(model.summary, 4), x, y, pw, ph * 0.78, pointer, weight, time);
  else if (index === 3) strata(ctx, terms(model.summary, 4), x, y, pw, ph * 0.78, pointer, weight);
  else if (index === 4) kubernetes(ctx, model, x, y, pw, ph * 0.78, pointer, weight, time);
  else if (index === 5) aks(ctx, model, x, y, pw, ph * 0.78, pointer, weight);
  else if (index === 6) rollback(ctx, model, x, y, pw, ph * 0.78, pointer, weight);
  else if (index === 7) reliability(ctx, x, y, pw, ph * 0.78, pointer, weight, time);
  else if (index === 8) retrieval(ctx, x, y, pw, ph * 0.78, pointer, weight);
  else defence(ctx, x, y, pw, ph * 0.78, pointer, weight);

  if (index !== 0) {
    dayRuler(ctx, x + pw * 0.06, y + ph * 0.9, pw * 0.88, model, pointer, weight);
  }
}

/** Same geometry as the plate, so a click on a day mark selects that day. */
export function dayUnderPointer(
  model: PlateModel,
  w: number,
  h: number,
  pointer: { x: number; y: number },
): number | null {
  const count = Math.max(1, model.endDay - model.startDay + 1);
  const { x, y, pw, ph } = bounds(w, h);
  if (model.index === 0) {
    const localH = ph * 0.82;
    const reach = Math.max(12, localH / count);
    for (let i = 0; i < count; i += 1) {
      const yy = y + localH * (0.06 + (i / count) * 0.82);
      if (Math.hypot(pointer.x - (x + pw * 0.2), pointer.y - yy) < reach) {
        return model.startDay + i;
      }
    }
    return null;
  }
  const rx = x + pw * 0.06;
  const ry = y + ph * 0.9;
  const rw = pw * 0.88;
  const reach = Math.max(14, rw / count);
  for (let i = 0; i < count; i += 1) {
    const px = count === 1 ? rx + rw / 2 : rx + (rw * i) / (count - 1);
    if (Math.hypot(pointer.x - px, pointer.y - ry) < reach) return model.startDay + i;
  }
  return null;
}
