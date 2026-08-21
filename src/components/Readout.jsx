// The signature element: a large serif numeral with a thin brass rule
// beneath, like an instrument gauge. Used for both the route distance/time
// summary and the isochrone minutes readout, so it reads as one system.
export default function Readout({ stats }) {
  return (
    <div className="readout">
      <div className="readout-row">
        {stats.map((s) => (
          <div className="readout-stat" key={s.label}>
            <div className="readout-value">
              {s.value}
              <span className="readout-unit">{s.unit}</span>
            </div>
            <div className="readout-label">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="readout-rule" />
    </div>
  )
}
