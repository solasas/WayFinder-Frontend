import Readout from './Readout'
import { formatDistance, formatDuration } from '../utils/format'

const CONSTRAINT_LABELS = {
  avoidTolls: 'No tolls',
  avoidHighways: 'No highways',
  avoidUnpaved: 'No unpaved roads',
}

const PREFERENCE_LABELS = {
  preferWellLit: 'Well-lit streets',
  minimizeTurns: 'Fewer turns',
}

// Distance/ETA readout, the rules that were enforced, how well soft
// preferences were met, and the engine's own explanation of the choice.
export default function IntentResult({ result }) {
  const distance = formatDistance(result.distanceMeters)
  const duration = formatDuration(result.estimatedTimeSecs)

  const constraints = Object.entries(CONSTRAINT_LABELS).filter(([key]) => result.constraints?.[key])
  const preferences = Object.entries(PREFERENCE_LABELS).filter(([key]) => result.preferences?.[key])
  const limitations = result.dataLimitations ?? []
  const notices = result.notices ?? []

  return (
    <div className="mode-panel">
      <Readout
        stats={[
          { label: result.objective === 'SHORTEST' ? 'Distance · shortest' : 'Distance', ...distance },
          { label: result.objective === 'FASTEST' ? 'Est. Time · fastest' : 'Est. Time', ...duration },
        ]}
      />

      <div className="chip-group" aria-label="Route rules">
        {constraints.map(([key, label]) => (
          <span className="chip" key={key} title="Enforced">
            {label}
          </span>
        ))}
        {result.unknownDataPolicy === 'ALLOW_UNKNOWN' && (
          <span className="chip chip-warn" title="Roads with missing map tags were allowed">
            Unknown map data allowed
          </span>
        )}
        {preferences.map(([key, label]) => {
          const applied = result.preferencesApplied?.[key]
          return (
            <span
              className={`chip ${applied ? '' : 'chip-unmet'}`}
              key={key}
              title={applied ? 'Evidenced in this route' : 'Requested, but not evidenced in the map data'}
            >
              {label}
              {applied ? '' : ' · not evidenced'}
            </span>
          )
        })}
        {constraints.length === 0 && preferences.length === 0 && result.unknownDataPolicy !== 'ALLOW_UNKNOWN' && (
          <span className="chip chip-unmet">No restrictions</span>
        )}
      </div>

      {result.explanation && <p className="explanation">{result.explanation}</p>}

      {(notices.length > 0 || limitations.length > 0) && (
        <details className="data-notes">
          <summary>Data notes ({notices.length + limitations.length})</summary>
          <ul>
            {notices.map((n, i) => (
              <li key={`n${i}`}>{n}</li>
            ))}
            {limitations.map((l, i) => (
              <li key={`l${i}`}>{l}</li>
            ))}
          </ul>
        </details>
      )}
    </div>
  )
}
