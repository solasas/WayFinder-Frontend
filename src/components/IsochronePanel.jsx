import OptimizeToggle from './OptimizeToggle'
import Readout from './Readout'

export default function IsochronePanel({ optimize, onOptimizeChange, minutes, onMinutesChange, isoCenter, isochrone, loading }) {
  return (
    <div className="mode-panel">
      <OptimizeToggle value={optimize} onChange={onOptimizeChange} />

      <div className="slider-block">
        <label htmlFor="minutes-slider" className="slider-label">
          Reach within
        </label>
        <input
          id="minutes-slider"
          type="range"
          min={1}
          max={30}
          step={1}
          value={minutes}
          onChange={(e) => onMinutesChange(Number(e.target.value))}
          className="brass-slider"
        />
      </div>

      <Readout stats={[{ label: 'Minutes of travel', value: minutes, unit: 'min' }]} />

      {!isoCenter && <p className="panel-hint">Click the chart to set the survey point.</p>}
      {isoCenter && loading && <p className="panel-hint">Surveying the reachable ground…</p>}
      {isoCenter && !loading && isochrone && (
        <p className="panel-hint mono">{isochrone.reachableNodes?.length ?? 0} points charted</p>
      )}
    </div>
  )
}
