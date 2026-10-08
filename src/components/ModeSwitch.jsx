export default function ModeSwitch({ mode, onChange }) {
  return (
    <div className="segmented mode-switch" role="tablist" aria-label="Map mode">
      <button
        type="button"
        role="tab"
        aria-selected={mode === 'route'}
        className={`segment ${mode === 'route' ? 'active' : ''}`}
        onClick={() => onChange('route')}
      >
        Route
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={mode === 'intent'}
        className={`segment ${mode === 'intent' ? 'active' : ''}`}
        onClick={() => onChange('intent')}
      >
        Ask
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={mode === 'isochrone'}
        className={`segment ${mode === 'isochrone' ? 'active' : ''}`}
        onClick={() => onChange('isochrone')}
      >
        Isochrone
      </button>
    </div>
  )
}
