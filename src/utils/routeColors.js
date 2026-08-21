// Route rendering is rank-based, not identity-based: the k-th shortest path
// always gets the k-th color, whichever pair of points produced it.
const ROUTE_COLORS = ['#C9A15C', '#8B4B3B', '#A66B4F'] // brass, sienna, muted terracotta

export function routeColor(index) {
  return ROUTE_COLORS[index] ?? ROUTE_COLORS[ROUTE_COLORS.length - 1]
}

export const ROUTE_BASE_WEIGHT = 3
export const ROUTE_SELECTED_WEIGHT = 5
export const ROUTE_UNSELECTED_OPACITY = 0.4
