// @flow

function inBounds(p1: number[], p2: number[], p: number[]) {
  const bounds = [
    Math.min(p1[0], p2[0]),
    Math.max(p1[0], p2[0]),
    Math.min(p1[1], p2[1]),
    Math.max(p1[1], p2[1])
  ];

  return p[0] >= bounds[0] && p[0] <= bounds[1] && p[1] >= bounds[2] && p[1] <= bounds[3];
}

export function findClosestPointOnLineSegment(p1: number[], p2: number[], p: number[]) {
  // line
  const k = (p2[1] - p1[1]) / (p2[0] - p1[0]);
  const b = p1[1] - k * p1[0];

  // vertical line
  if (!isFinite(k)) {
    const q = [p1[0], p[1]];
    return inBounds(p1, p2, q) ? q : null;
  }

  // p is on line [p1, p2]
  if (p[0] * k + b - p[1] === 0) {
    return inBounds(p1, p2, p) ? p : null;
  }

  const qx = (k * p[1] + p[0] - k * b) / (k * k + 1);
  const qy = k * qx + b;

  return inBounds(p1, p2, [qx, qy]) ? [qx, qy] : null;
}

export function isNumeric(n: any) {
  return !Array.isArray(n) && !isNaN(parseFloat(n)) && isFinite(n);
}

export function parseElemDataAttributes(elem: HTMLElement) {
  const data = elem && elem.dataset;
  if (!data) {
    return null;
  }

  const featureIndex = data.featureIndex;
  const vertexIndex = data.vertexIndex;

  return {
    type: data.type,
    operation: data.operation,
    featureIndex: isNumeric(featureIndex) ? Number(featureIndex) : undefined,
    vertexIndex: isNumeric(vertexIndex) ? Number(vertexIndex) : undefined
  };
}
