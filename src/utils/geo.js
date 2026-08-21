// Accepts a couple of plausible shapes for the backend's boundingBox payload.
export function normalizeBoundingBox(bb) {
  if (!bb) return null

  if (bb.southWest && bb.northEast) {
    return [
      [bb.southWest.lat, bb.southWest.lng],
      [bb.northEast.lat, bb.northEast.lng],
    ]
  }

  if (bb.south != null && bb.west != null && bb.north != null && bb.east != null) {
    return [
      [bb.south, bb.west],
      [bb.north, bb.east],
    ]
  }

  if (bb.minLat != null && bb.minLng != null && bb.maxLat != null && bb.maxLng != null) {
    return [
      [bb.minLat, bb.minLng],
      [bb.maxLat, bb.maxLng],
    ]
  }

  return null
}

// Andrew's monotone chain convex hull over {lat,lng} points. Used to turn the
// isochrone's scattered reachable-node cloud into a fillable area polygon.
export function convexHull(points) {
  if (!points || points.length < 3) return null

  const pts = [...points].sort((a, b) => a.lng - b.lng || a.lat - b.lat)
  const cross = (o, a, b) => (a.lng - o.lng) * (b.lat - o.lat) - (a.lat - o.lat) * (b.lng - o.lng)

  const lower = []
  for (const p of pts) {
    while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0) {
      lower.pop()
    }
    lower.push(p)
  }

  const upper = []
  for (let i = pts.length - 1; i >= 0; i--) {
    const p = pts[i]
    while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 0) {
      upper.pop()
    }
    upper.push(p)
  }

  upper.pop()
  lower.pop()
  const hull = lower.concat(upper)

  return hull.length >= 3 ? hull.map((p) => [p.lat, p.lng]) : null
}
