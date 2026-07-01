import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [health, setHealth] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/health')
      .then((response) => response.json())
      .then((data) => {
        setHealth(data)
        setLoading(false)
      })
      .catch(() => {
        setHealth({ status: 'offline' })
        setLoading(false)
      })
  }, [])

  return (
    <main className="app-shell">
      <section className="hero-card">
        <div>
          <p className="eyebrow">OctoFit Tracker</p>
          <h1>Move more, compete kindly, and stay motivated.</h1>
          <p className="lead">
            Track workouts, celebrate streaks, and see how your team is performing.
          </p>
        </div>
        <div className="stats-card">
          <h2>Live status</h2>
          {loading ? (
            <p>Connecting to the backend…</p>
          ) : (
            <p className="status-pill">{health?.status}</p>
          )}
          <ul>
            <li>Workout logging</li>
            <li>Team challenges</li>
            <li>Personalized goals</li>
          </ul>
        </div>
      </section>
    </main>
  )
}

export default App
