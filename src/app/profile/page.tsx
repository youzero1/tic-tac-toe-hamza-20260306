'use client';

import { useState, useEffect } from 'react';
import GameHistory from '@/components/GameHistory';

interface Player {
  id: number;
  username: string;
  wins: number;
  losses: number;
  draws: number;
  createdAt: string;
}

export default function ProfilePage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/players')
      .then((r) => r.json())
      .then((data) => {
        setPlayers(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const totalGames = selectedPlayer
    ? selectedPlayer.wins + selectedPlayer.losses + selectedPlayer.draws
    : 0;
  const winPct =
    totalGames > 0
      ? Math.round((selectedPlayer!.wins / totalGames) * 100)
      : 0;

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">👤 Player Profile</h1>
        <p className="page-subtitle">View stats and game history for any player.</p>
      </div>

      <div className="card mb-6">
        <label className="form-label">Select a Player</label>
        {loading ? (
          <div className="spinner" />
        ) : players.length === 0 ? (
          <p className="text-muted text-sm">No players yet. Start playing to create profiles!</p>
        ) : (
          <select
            className="form-input"
            value={selectedPlayer?.id || ''}
            onChange={(e) => {
              const p = players.find((pl) => pl.id === Number(e.target.value));
              setSelectedPlayer(p || null);
            }}
          >
            <option value="">— Choose a player —</option>
            {players.map((p) => (
              <option key={p.id} value={p.id}>
                {p.username}
              </option>
            ))}
          </select>
        )}
      </div>

      {selectedPlayer && (
        <>
          <div className="card mb-6">
            <div className="flex items-center gap-4" style={{ marginBottom: '20px' }}>
              <div
                className="avatar avatar-x"
                style={{ width: '56px', height: '56px', fontSize: '1.4rem', borderRadius: '50%' }}
              >
                {selectedPlayer.username[0].toUpperCase()}
              </div>
              <div>
                <h2 style={{ fontWeight: 800, fontSize: '1.4rem' }}>{selectedPlayer.username}</h2>
                <p className="text-muted text-sm">
                  Member since {new Date(selectedPlayer.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="stats-grid">
              <div className="stat-card stat-total">
                <div className="stat-number">{totalGames}</div>
                <div className="stat-label">Games</div>
              </div>
              <div className="stat-card stat-wins">
                <div className="stat-number">{selectedPlayer.wins}</div>
                <div className="stat-label">Wins</div>
              </div>
              <div className="stat-card stat-losses">
                <div className="stat-number">{selectedPlayer.losses}</div>
                <div className="stat-label">Losses</div>
              </div>
              <div className="stat-card stat-draws">
                <div className="stat-number">{selectedPlayer.draws}</div>
                <div className="stat-label">Draws</div>
              </div>
              <div className="stat-card">
                <div className="stat-number" style={{ color: 'var(--primary)' }}>
                  {winPct}%
                </div>
                <div className="stat-label">Win Rate</div>
              </div>
            </div>
          </div>

          <GameHistory playerId={selectedPlayer.id} />
        </>
      )}
    </div>
  );
}
