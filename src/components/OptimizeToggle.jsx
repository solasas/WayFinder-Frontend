export default function OptimizeToggle({ value, onChange }) {
  return (
    <div className="segmented" role="radiogroup" aria-label="Route optimization">
      <button
        type="button"
        role="radio"
        aria-checked={value === 'time'}
        className={`segment ${value === 'time' ? 'active' : ''}`}
        onClick={() => onChange('time')}
      >
        Fastest
      </button>
      <button
        type="button"
        role="radio"
        aria-checked={value === 'distance'}
        className={`segment ${value === 'distance' ? 'active' : ''}`}
        onClick={() => onChange('distance')}
      >
        Shortest
      </button>
    </div>
  )
}
