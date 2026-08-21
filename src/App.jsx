import { useCallback, useEffect, useState } from 'react'
import MapView from './components/MapView'
import SidePanel from './components/SidePanel'
import RoutePanel from './components/RoutePanel'
import IsochronePanel from './components/IsochronePanel'
import { fetchRegion, fetchIsochrone } from './api'
import { useDebouncedValue } from './hooks/useDebouncedValue'
import { useRoutes } from './hooks/useRoutes'

export default function App() {
  const [region, setRegion] = useState(null)
  const [regionError, setRegionError] = useState(null)
  const [mode, setMode] = useState('route')
  const [optimize, setOptimize] = useState('time')

  const {
    startPin,
    endPin,
    routes,
    selectedRouteIndex,
    setSelectedRouteIndex,
    loading: routeLoading,
    error: routeError,
    handleMapClick: handleRouteClick,
    refetchWithOptimize,
  } = useRoutes()

  const [isoCenter, setIsoCenter] = useState(null)
  const [minutes, setMinutes] = useState(15)
  const debouncedMinutes = useDebouncedValue(minutes, 300)
  const [isochrone, setIsochrone] = useState(null)
  const [isoLoading, setIsoLoading] = useState(false)
  const [isoError, setIsoError] = useState(null)

  useEffect(() => {
    fetchRegion()
      .then(setRegion)
      .catch(() =>
        setRegionError('Cannot reach the survey office — make sure the backend is running on port 8080.'),
      )
  }, [])

  const handleMapClick = useCallback(
    (latlng) => {
      if (mode === 'isochrone') {
        setIsoCenter(latlng)
        return
      }
      handleRouteClick(latlng, optimize)
    },
    [mode, optimize, handleRouteClick],
  )

  const handleOptimizeChange = useCallback(
    (value) => {
      setOptimize(value)
      if (mode === 'route') {
        refetchWithOptimize(value)
      }
    },
    [mode, refetchWithOptimize],
  )

  // Isochrone fetching is driven by whichever input last changed — the
  // center click, the debounced minutes slider, or the optimize toggle — so
  // it lives in one synchronizing effect rather than three separate calls.
  useEffect(() => {
    if (mode !== 'isochrone' || !isoCenter) return undefined

    let cancelled = false
    // Unlike route fetches (triggered from discrete event handlers), this one
    // must live in an effect: it reacts to a debounced value settling, which
    // isn't a single discrete user action to hang a handler off of.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsoLoading(true)
    setIsoError(null)

    fetchIsochrone({ lat: isoCenter.lat, lng: isoCenter.lng, minutes: debouncedMinutes, optimize }).then(
      ({ data, error }) => {
        if (cancelled) return
        setIsoLoading(false)
        if (error) {
          setIsoError(error)
          setIsochrone(null)
        } else {
          setIsochrone(data)
        }
      },
    )

    return () => {
      cancelled = true
    }
  }, [mode, isoCenter, debouncedMinutes, optimize])

  const activeError = regionError || (mode === 'route' ? routeError : isoError)
  const activeLoading = mode === 'route' ? routeLoading : isoLoading

  return (
    <div className="app">
      <div className="map-plate">
        <MapView
          region={region}
          mode={mode}
          startPin={startPin}
          endPin={endPin}
          routes={routes}
          selectedRouteIndex={selectedRouteIndex}
          onSelectRoute={setSelectedRouteIndex}
          isoCenter={isoCenter}
          isochrone={isochrone}
          onMapClick={handleMapClick}
        />
      </div>

      <SidePanel region={region} mode={mode} onModeChange={setMode} error={activeError}>
        {mode === 'route' ? (
          <RoutePanel
            optimize={optimize}
            onOptimizeChange={handleOptimizeChange}
            routes={routes}
            selectedRouteIndex={selectedRouteIndex}
            onSelectRoute={setSelectedRouteIndex}
            startPin={startPin}
            endPin={endPin}
            loading={routeLoading}
          />
        ) : (
          <IsochronePanel
            optimize={optimize}
            onOptimizeChange={handleOptimizeChange}
            minutes={minutes}
            onMinutesChange={setMinutes}
            isoCenter={isoCenter}
            isochrone={isochrone}
            loading={activeLoading}
          />
        )}
      </SidePanel>
    </div>
  )
}
