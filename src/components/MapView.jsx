import { useEffect, useRef } from 'react'
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Polygon,
  Circle,
  Rectangle,
  useMapEvents,
  useMap,
} from 'react-leaflet'
import L from 'leaflet'
import { normalizeBoundingBox, convexHull } from '../utils/geo'
import { startIcon, endIcon, isoCenterIcon } from '../utils/mapIcons'
import { routeColor, ROUTE_BASE_WEIGHT, ROUTE_SELECTED_WEIGHT, ROUTE_UNSELECTED_OPACITY } from '../utils/routeColors'

const DEFAULT_CENTER = [16.985, 81.79]

function ClickHandler({ onMapClick }) {
  useMapEvents({ click: (e) => onMapClick(e.latlng) })
  return null
}

// The region loads async, after MapContainer has already mounted — this
// applies its center/bounds once, and locks panning to the surveyed area.
function RegionSetup({ region, bounds }) {
  const map = useMap()
  const applied = useRef(false)

  useEffect(() => {
    if (!region || applied.current) return
    applied.current = true

    if (bounds) {
      map.setMaxBounds(bounds)
      map.fitBounds(bounds, { padding: [24, 24] })
    } else if (region.center) {
      map.setView([region.center.lat, region.center.lng], 14)
    }
  }, [region, bounds, map])

  return null
}

function FitRoutes({ routes }) {
  const map = useMap()
  const prev = useRef(null)

  useEffect(() => {
    if (routes.length && routes !== prev.current) {
      prev.current = routes
      const pts = routes.flatMap((r) => r.path.map((p) => [p.lat, p.lng]))
      if (pts.length) map.fitBounds(L.latLngBounds(pts), { padding: [48, 48] })
    }
  }, [routes, map])

  return null
}

function FitIsochrone({ isochrone }) {
  const map = useMap()
  const prev = useRef(null)

  useEffect(() => {
    if (isochrone && isochrone !== prev.current) {
      prev.current = isochrone
      const pts = (isochrone.reachableNodes || []).map((n) => [n.lat, n.lng])
      if (pts.length) map.fitBounds(L.latLngBounds(pts), { padding: [48, 48] })
    }
  }, [isochrone, map])

  return null
}

export default function MapView({
  region,
  mode,
  startPin,
  endPin,
  routes,
  selectedRouteIndex,
  onSelectRoute,
  isoCenter,
  isochrone,
  snapLinks = [],
  onMapClick,
}) {
  const isRouteMode = mode !== 'isochrone'
  const center = region?.center ? [region.center.lat, region.center.lng] : DEFAULT_CENTER
  const bounds = normalizeBoundingBox(region?.boundingBox)

  const nonSelectedRoutes = routes.map((r, i) => ({ r, i })).filter(({ i }) => i !== selectedRouteIndex)
  const selectedRoute = routes[selectedRouteIndex]

  const isoHull = mode === 'isochrone' ? convexHull(isochrone?.reachableNodes) : null
  const scatterNodes = mode === 'isochrone' && !isoHull ? isochrone?.reachableNodes || [] : []

  return (
    <MapContainer
      center={center}
      zoom={14}
      style={{ height: '100%', width: '100%' }}
      zoomControl={true}
      maxBoundsViscosity={1.0}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <ClickHandler onMapClick={onMapClick} />
      <RegionSetup region={region} bounds={bounds} />
      <FitRoutes routes={isRouteMode ? routes : []} />
      <FitIsochrone isochrone={mode === 'isochrone' ? isochrone : null} />

      {bounds && (
        <Rectangle bounds={bounds} pathOptions={{ color: '#C9A15C', weight: 1, fillOpacity: 0, dashArray: '5 5' }} />
      )}

      {isRouteMode && startPin && <Marker position={[startPin.lat, startPin.lng]} icon={startIcon} />}
      {isRouteMode && endPin && <Marker position={[endPin.lat, endPin.lng]} icon={endIcon} />}

      {isRouteMode &&
        nonSelectedRoutes.map(({ r, i }) => (
          <Polyline
            key={i}
            positions={r.path.map((p) => [p.lat, p.lng])}
            pathOptions={{ color: routeColor(i), weight: ROUTE_BASE_WEIGHT, opacity: ROUTE_UNSELECTED_OPACITY }}
            eventHandlers={{ click: () => onSelectRoute(i) }}
          />
        ))}

      {isRouteMode &&
        snapLinks.map((link, i) => (
          <Polyline
            key={`snap-${i}`}
            positions={link.map((p) => [p.lat, p.lng])}
            pathOptions={{ color: '#8B4B3B', weight: 2, dashArray: '4 6', opacity: 0.9 }}
            interactive={false}
          />
        ))}

      {isRouteMode && selectedRoute && (
        <Polyline
          positions={selectedRoute.path.map((p) => [p.lat, p.lng])}
          pathOptions={{ color: routeColor(selectedRouteIndex), weight: ROUTE_SELECTED_WEIGHT, opacity: 1 }}
          eventHandlers={{ click: () => onSelectRoute(selectedRouteIndex) }}
        />
      )}

      {mode === 'isochrone' && isoCenter && (
        <Marker position={[isoCenter.lat, isoCenter.lng]} icon={isoCenterIcon} />
      )}

      {mode === 'isochrone' && isoHull && (
        <Polygon positions={isoHull} pathOptions={{ color: '#C9A15C', weight: 1, fillColor: '#5A6B5D', fillOpacity: 0.35 }} />
      )}

      {mode === 'isochrone' &&
        scatterNodes.map((n, i) => (
          <Circle
            key={i}
            center={[n.lat, n.lng]}
            radius={35}
            pathOptions={{ color: '#5A6B5D', fillColor: '#5A6B5D', fillOpacity: 0.4, weight: 1 }}
          />
        ))}
    </MapContainer>
  )
}
