import { routeColor } from '../utils/routeColors'

export default function RouteList({ routes, selectedRouteIndex, onSelectRoute }) {
  if (routes.length <= 1) return null

  return (
    <ul className="route-list" role="listbox" aria-label="Alternate routes">
      {routes.map((r, i) => (
        <li key={i}>
          <button
            type="button"
            role="option"
            aria-selected={i === selectedRouteIndex}
            className={`route-item ${i === selectedRouteIndex ? 'active' : ''}`}
            onClick={() => onSelectRoute(i)}
          >
            <span className="route-swatch" style={{ background: routeColor(i) }} />
            <span className="route-item-label">{i === 0 ? 'Best' : `Alternate ${i}`}</span>
            <span className="route-item-stats">
              {(r.distanceMeters / 1000).toFixed(1)} km · {Math.round(r.estimatedTimeSecs / 60)} min
            </span>
          </button>
        </li>
      ))}
    </ul>
  )
}
