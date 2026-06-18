export type BoundingBox = {
  id?: string;
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
};

type ValidationResult = {
  ok: boolean;
  error?: string;
};

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);

const normalizeLabels = (labels: unknown): string[] => {
  if (!Array.isArray(labels)) return [];
  return Array.from(
    new Set(
      labels
        .map((label) => String(label || "").trim())
        .filter(Boolean)
    )
  );
};

export const validateImageAnnotation = (
  boxes: unknown,
  allowedLabels?: unknown,
  polygons?: unknown
): ValidationResult => {
  const normalizedAllowed = normalizeLabels(allowedLabels);

  if (polygons !== undefined && polygons !== null) {
    if (!Array.isArray(polygons)) {
      return { ok: false, error: "Annotation payload is malformed (polygons array missing)." };
    }
    if (polygons.length === 0) {
      return { ok: false, error: "At least one annotation region is required." };
    }
    for (let i = 0; i < polygons.length; i += 1) {
      const poly = polygons[i];
      if (!poly || typeof poly !== "object") {
        return { ok: false, error: `Region ${i + 1} is invalid.` };
      }
      const label = String(poly.label || "").trim();
      const coords = poly.polygon;
      if (!label) {
        return { ok: false, error: `Region ${i + 1} is missing a class label.` };
      }
      if (normalizedAllowed.length > 0 && !normalizedAllowed.includes(label)) {
        return { ok: false, error: `Region ${i + 1} uses a label not in protocol classes.` };
      }
      if (!Array.isArray(coords) || coords.length < 3) {
        return { ok: false, error: `Region ${i + 1} must have at least 3 points.` };
      }
      for (let j = 0; j < coords.length; j += 1) {
        const pt = coords[j];
        if (!Array.isArray(pt) || pt.length !== 2) {
          return { ok: false, error: `Region ${i + 1} has invalid points.` };
        }
        const px = pt[0];
        const py = pt[1];
        if (!isFiniteNumber(px) || !isFiniteNumber(py)) {
          return { ok: false, error: `Region ${i + 1} point ${j + 1} has invalid coordinates.` };
        }
      }
    }
    return { ok: true };
  }

  if (!Array.isArray(boxes)) {
    return { ok: false, error: "Annotation payload is malformed (boxes array missing)." };
  }

  if (boxes.length === 0) {
    return { ok: false, error: "At least one annotation region is required." };
  }

  for (let i = 0; i < boxes.length; i += 1) {
    const box = boxes[i] as Partial<BoundingBox> | null;
    if (!box || typeof box !== "object") {
      return { ok: false, error: `Region ${i + 1} is invalid.` };
    }

    const { x, y, w, h } = box;
    const label = String(box.label || "").trim();
    if (!isFiniteNumber(x) || !isFiniteNumber(y) || !isFiniteNumber(w) || !isFiniteNumber(h)) {
      return { ok: false, error: `Region ${i + 1} has invalid coordinates.` };
    }

    if (x < 0 || y < 0 || w <= 0 || h <= 0 || x > 100 || y > 100 || x + w > 100 || y + h > 100) {
      return { ok: false, error: `Region ${i + 1} is outside image bounds.` };
    }

    if (!label) {
      return { ok: false, error: `Region ${i + 1} is missing a class label.` };
    }

    if (normalizedAllowed.length > 0 && !normalizedAllowed.includes(label)) {
      return { ok: false, error: `Region ${i + 1} uses a label not in protocol classes.` };
    }
  }

  return { ok: true };
};
