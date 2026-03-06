import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="container">
      <div className="hero">
        <h1>Tic Tac Toe ✕ ○</h1>
        <p>The classic game with a social twist. Play friends, track wins, share your glory.</p>
        <div className="hero-actions">
          <Link href="/game" className="btn btn-primary btn-lg">
            🎮 Play Now
          </Link>
          <Link href="/leaderboard" className="btn btn-outline btn-lg">
            🏆 Leaderboard
          </Link>
        </div>
      </div>

      <div className="grid-2 mt-8">
        <div className="card">
          <div style={{ fontSize: '2rem', marginBottom: '12px' }}>🎯</div>
          <h3 style={{ marginBottom: '8px', fontWeight: 700 }}>Multiplayer Fun</h3>
          <p className="text-muted text-sm">
            Register as a player and challenge your friends in real-time Tic Tac Toe battles on the same device.
          </p>
        </div>

        <div className="card">
          <div style={{ fontSize: '2rem', marginBottom: '12px' }}>📊</div>
          <h3 style={{ marginBottom: '8px', fontWeight: 700 }}>Track Your Stats</h3>
          <p className="text-muted text-sm">
            Every game is recorded. View your wins, losses, draws and climb the leaderboard rankings.
          </p>
        </div>

        <div className="card">
          <div style={{ fontSize: '2rem', marginBottom: '12px' }}>🔗</div>
          <h3 style={{ marginBottom: '8px', fontWeight: 700 }}>Share Results</h3>
          <p className="text-muted text-sm">
            After each game, generate a shareable result card and post it to your social media feeds.
          </p>
        </div>

        <div className="card">
          <div style={{ fontSize: '2rem', marginBottom: '12px' }}>🏅</div>
          <h3 style={{ marginBottom: '8px', fontWeight: 700 }}>Leaderboard</h3>
          <p className="text-muted text-sm">
            Compete with other players to reach the top of the leaderboard ranked by win percentage.
          </p>
        </div>
      </div>

      <div className="card mt-6" style={{ textAlign: 'center', padding: '32px' }}>
        <h2 style={{ marginBottom: '8px', fontWeight: 800 }}>Ready to play?</h2>
        <p className="text-muted" style={{ marginBottom: '20px' }}>
          Register your username and start your first match right now!
        </p>
        <Link href="/game" className="btn btn-secondary btn-lg">
          Start Playing 🚀
        </Link>
      </div>
    </div>
  );
}
