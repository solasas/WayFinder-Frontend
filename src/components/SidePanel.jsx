import ModeSwitch from './ModeSwitch'

export default function SidePanel({ region, mode, onModeChange, error, children }) {
  return (
    <aside className="ships-log">
      <header className="log-header">
        <p className="log-kicker">Field Log</p>
        <h1 className="log-title">{region?.name ?? 'Chart'}</h1>
      </header>

      <ModeSwitch mode={mode} onChange={onModeChange} />

      <div className="log-body">{children}</div>

      {error && (
        <div className="log-note" role="alert">
          {error}
        </div>
      )}
    </aside>
  )
}
