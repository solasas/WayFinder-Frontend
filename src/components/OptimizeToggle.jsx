const DEFAULT_OPTIONS = [
  { value: 'time', label: 'Fastest' },
  { value: 'distance', label: 'Shortest' },
]

export default function OptimizeToggle({ value, onChange, options = DEFAULT_OPTIONS }) {
  return (
    <div className="segmented" role="radiogroup" aria-label="Route optimization">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={value === o.value}
          className={`segment ${value === o.value ? 'active' : ''}`}
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}
