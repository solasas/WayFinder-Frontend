import OptimizeToggle from './OptimizeToggle'
import IntentResult from './IntentResult'
import { MAX_INSTRUCTION_LENGTH } from '../hooks/useIntentRoute'

const OBJECTIVE_OPTIONS = [
  { value: 'AUTO', label: 'Auto' },
  { value: 'FASTEST', label: 'Fastest' },
  { value: 'SHORTEST', label: 'Shortest' },
]

export default function IntentPanel({
  startPin,
  endPin,
  instruction,
  onInstructionChange,
  objective,
  onObjectiveChange,
  result,
  loading,
  error,
  canSubmit,
  onSubmit,
}) {
  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit()
  }

  const pinHint = !startPin
    ? 'Click the chart to mark your departure point.'
    : !endPin
      ? 'Click again to mark your destination.'
      : null

  return (
    <div className="mode-panel">
      <form className="intent-form" onSubmit={handleSubmit}>
        <label htmlFor="intent-text" className="slider-label">
          Describe the journey
        </label>
        <textarea
          id="intent-text"
          className="intent-input"
          rows={3}
          maxLength={MAX_INSTRUCTION_LENGTH}
          placeholder="Find the fastest route without tolls"
          value={instruction}
          onChange={(e) => onInstructionChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) onSubmit()
          }}
        />
        <div className="intent-meta">
          <span className="mono">
            {instruction.length}/{MAX_INSTRUCTION_LENGTH}
          </span>
        </div>

        <OptimizeToggle value={objective} onChange={onObjectiveChange} options={OBJECTIVE_OPTIONS} />

        <button type="submit" className="brass-button" disabled={!canSubmit}>
          {loading ? 'Plotting your course…' : 'Plot course'}
        </button>
      </form>

      {pinHint && <p className="panel-hint">{pinHint}</p>}
      {!pinHint && !instruction.trim() && !result && !loading && (
        <p className="panel-hint">Tell the chart what matters — avoiding tolls, highways or unpaved roads.</p>
      )}
      {!pinHint && !result && !loading && !error && instruction.trim() && (
        <p className="panel-hint">Press Plot course, or ⌘/Ctrl + Enter.</p>
      )}

      {error?.clarificationNeeded ? (
        <div className="log-note log-question" role="alert">
          {error.question || error.message}
        </div>
      ) : (
        error && (
          <div className="log-note" role="alert">
            {error.message}
          </div>
        )
      )}

      {error?.retryWithAllowUnknown && (
        <div className="retry-block">
          <p className="panel-hint">
            Many roads lack toll or surface tags in the map data. You can retry and treat untagged roads as
            acceptable — the route may then not fully honour your rules.
          </p>
          <button type="button" className="brass-button brass-button-outline" onClick={() => onSubmit('ALLOW_UNKNOWN')}>
            Retry allowing unknown data
          </button>
        </div>
      )}

      {result && <IntentResult result={result} />}
    </div>
  )
}
