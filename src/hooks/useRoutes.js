import { useCallback, useState } from 'react'
import { fetchShortestPath, normalizeRoutes } from '../api'

// Owns the click-to-set-start/end flow and the route(s) that come back.
// Alternates are always requested now — Yen's k-shortest-paths is just how
// routing works, not an opt-in extra.
export function useRoutes() {
  const [startPin, setStartPin] = useState(null)
  const [endPin, setEndPin] = useState(null)
  const [routes, setRoutes] = useState([])
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const runRoute = useCallback((start, end, optimizeValue) => {
    setLoading(true)
    setError(null)

    fetchShortestPath({ start, end, optimize: optimizeValue, alternates: true }).then(({ data, error: err }) => {
      setLoading(false)
      if (err) {
        setError(err)
        setRoutes([])
      } else {
        setRoutes(normalizeRoutes(data))
        setSelectedRouteIndex(0)
      }
    })
  }, [])

  const handleMapClick = useCallback(
    ({ lat, lng }, optimizeValue) => {
      if (!startPin) {
        setStartPin({ lat, lng })
        setRoutes([])
        setError(null)
        return
      }

      if (!endPin) {
        const end = { lat, lng }
        setEndPin(end)
        runRoute(startPin, end, optimizeValue)
        return
      }

      setStartPin(null)
      setEndPin(null)
      setRoutes([])
      setError(null)
    },
    [startPin, endPin, runRoute],
  )

  const refetchWithOptimize = useCallback(
    (optimizeValue) => {
      if (startPin && endPin) {
        runRoute(startPin, endPin, optimizeValue)
      }
    },
    [startPin, endPin, runRoute],
  )

  return {
    startPin,
    endPin,
    routes,
    selectedRouteIndex,
    setSelectedRouteIndex,
    loading,
    error,
    handleMapClick,
    refetchWithOptimize,
  }
}
