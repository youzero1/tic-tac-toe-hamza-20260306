'use client';

import { useState, useEffect } from 'react';

interface LeaderboardEntry {
  id: number;
  username: string;
  wins: number;
  losses: number;
  draws: number;
  total: number;
  winPct: number;
}

export default function Leaderboard() {
  const [players, setPlayers] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/leaderboard')
      .then((r) => r.json())
      .then((data) => {
        setPlayers(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load leaderboard.');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="text-center mt-8">
        <div className="spinner" style={{ margin: '0 auto' }} />
      </div>
    );
  }

  if (error) {
    return <div className="card" style={{ color: 'var(--danger)' }}>{error}</div>;
  }

  if (players.length === 0) {
    return (
      <div className="card empty-state">
        <div className="empty-icon">🏆</div>
        <p>No players yet. Play some games to appear on the leaderboard!</p>
      </div>
    );
  }

  return (
    <div className="card">
      <table className="leaderboard-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Player</th>
            <th>Games</th>
            <th>Wins</th>
            <th>Losses</th>
            <th>Draws</th>
            <th>Win %</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player, idx) => (
            <tr key={player.id}>
              <td>
                <span
                  className={`rank-badge ${
                    idx === 0
                      ? 'rank-1'
                      : idx === 1
                      ? 'rank-2'
                      : idx === 2
                      ? 'rank-3'
                      : 'rank-other'
                  }`}
                >
                  {idx + 1}
                </span>
              </td>
              <td>
                <div className="flex items-center gap-4">
                  <div
                    className="avatar avatar-x"
                    style={{ width: '28px', height: '28px', fontSize: '0.8rem', flexShrink: 0 }}
                  >
                    {player.username[0].toUpperCase()}
                  </div>
                  <span style={{ fontWeight: 600 }}>{player.username}</span>
                  {idx === 0 && <span title="Top Player">👑</span>}
                </div>
              </td>
              <td>{player.total}</td>
              <td style={{ color: 'var(--success)', fontWeight: 600 }}>{player.wins}</td>
              <td style={{ color: 'var(--danger)' }}>{player.losses}</td>
              <td style={{ color: 'var(--warning)' }}>{player.draws}</td>
              <td>
                <span className="win-pct">{player.winPct}%</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
