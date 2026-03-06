'use client';

import { useState } from 'react';

interface PlayerInfo {
  id: number;
  username: string;
}

interface PlayerFormProps {
  onReady: (playerX: PlayerInfo, playerO: PlayerInfo) => void;
}

export default function PlayerForm({ onReady }: PlayerFormProps) {
  const [usernameX, setUsernameX] = useState('');
  const [usernameO, setUsernameO] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!usernameX.trim() || !usernameO.trim()) {
      setError('Both player names are required.');
      return;
    }

    if (usernameX.trim().toLowerCase() === usernameO.trim().toLowerCase()) {
      setError('Players must have different usernames.');
      return;
    }

    setLoading(true);
    try {
      const [resX, resO] = await Promise.all([
        fetch('/api/players', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: usernameX.trim() }),
        }),
        fetch('/api/players', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: usernameO.trim() }),
        }),
      ]);

      if (!resX.ok || !resO.ok) {
        throw new Error('Failed to register players');
      }

      const px: PlayerInfo = await resX.json();
      const po: PlayerInfo = await resO.json();

      onReady(px, po);
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto' }}>
      <div className="card">
        <h2 style={{ fontWeight: 800, marginBottom: '4px' }}>Register Players</h2>
        <p className="text-muted text-sm" style={{ marginBottom: '24px' }}>
          Enter usernames for both players to start the game.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">
              <span style={{ color: 'var(--x-color)', fontWeight: 700 }}>✕ Player X</span>
            </label>
            <input
              className="form-input"
              type="text"
              placeholder="e.g. Alice"
              value={usernameX}
              onChange={(e) => setUsernameX(e.target.value)}
              maxLength={30}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <span style={{ color: 'var(--o-color)', fontWeight: 700 }}>○ Player O</span>
            </label>
            <input
              className="form-input"
              type="text"
              placeholder="e.g. Bob"
              value={usernameO}
              onChange={(e) => setUsernameO(e.target.value)}
              maxLength={30}
              disabled={loading}
            />
          </div>

          {error && (
            <p style={{ color: 'var(--danger)', fontSize: '0.875rem', marginBottom: '12px' }}>
              {error}
            </p>
          )}

          <button
            className="btn btn-primary w-full"
            type="submit"
            disabled={loading}
            style={{ justifyContent: 'center' }}
          >
            {loading ? (
              <><div className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }} /> Registering...</>
            ) : (
              '🎮 Start Game'
            )}
          </button>
        </form>
      </div>

      <div className="card card-sm mt-4" style={{ background: 'var(--bg-card2)' }}>
        <p className="text-muted text-sm">
          💡 <strong>Tip:</strong> If a username already exists, your stats will be added to the existing profile.
        </p>
      </div>
    </div>
  );
}
