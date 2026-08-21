import OptimizeToggle from './OptimizeToggle'
import Readout from './Readout'
import RouteList from './RouteList'

export default function RoutePanel({
  optimize,
  onOptimizeChange,
  routes,
  selectedRouteIndex,
  onSelectRoute,
  startPin,
  endPin,
  loading,
}) {
  const selected = routes[selectedRouteIndex]

  return (
    <div className="mode-panel">
      <OptimizeToggle value={optimize} onChange={onOptimizeChange} />

      {selected ? (
        <>
          <Readout
            stats={[
              { label: 'Distance', value: (selected.distanceMeters / 1000).toFixed(1), unit: 'km' },
              { label: 'Est. Time', value: Math.round(selected.estimatedTimeSecs / 60), unit: 'min' },
            ]}
          />

          <RouteList routes={routes} selectedRouteIndex={selectedRouteIndex} onSelectRoute={onSelectRoute} />
        </>
      ) : (
        <p className="panel-hint">
          {!startPin
            ? 'Click the chart to mark your departure point.'
            : !endPin
              ? 'Click again to mark your destination.'
              : loading
                ? 'Plotting your course…'
                : 'Click the chart to plot a new course.'}
        </p>
      )}
    </div>
  )
}
