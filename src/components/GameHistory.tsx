'use client';

import { useState, useEffect } from 'react';

interface GameEntry {
  id: number;
  playerX: { id: number; username: string };
  playerO: { id: number; username: string };
  winner: { id: number; username: string } | null;
  status: string;
  moves: { player: string; index: number }[];
  createdAt: string;
  completedAt: string | null;
}

interface GameHistoryProps {
  playerId?: number;
}

export default function GameHistory({ playerId }: GameHistoryProps) {
  const [games, setGames] = useState<GameEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    if (playerId) params.set('playerId', String(playerId));

    fetch(`/api/games?${params}`)
      .then((r) => r.json())
      .then((data) => {
        setGames(data.games || []);
        setTotal(data.total || 0);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [page, playerId]);

  const getResultBadge = (game: GameEntry, pid?: number) => {
    if (game.status === 'draw') {
      return <span className="game-result-badge badge-draw">Draw</span>;
    }
    if (!game.winner) return null;
    if (!pid) {
      return <span className="game-result-badge badge-win">{game.winner.username} Won</span>;
    }
    if (game.winner.id === pid) {
      return <span className="game-result-badge badge-win">Win</span>;
    }
    return <span className="game-result-badge badge-loss">Loss</span>;
  };

  const getMiniBoard = (moves: { player: string; index: number }[]) => {
    const cells: (string | null)[] = Array(9).fill(null);
    moves.forEach((m) => { cells[m.index] = m.player; });
    return (
      <div className="mini-board">
        {cells.map((c, i) => (
          <div key={i} className={`mini-cell ${c === 'X' ? 'x' : c === 'O' ? 'o' : ''}`}>
            {c === 'X' ? '✕' : c === 'O' ? '○' : ''}
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="text-center mt-8">
        <div className="spinner" style={{ margin: '0 auto' }} />
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ fontWeight: 700, marginBottom: '16px' }}>
        {playerId ? 'Game History' : '📜 Recent Games'}
        {total > 0 && (
          <span className="text-muted text-sm" style={{ fontWeight: 400, marginLeft: '8px' }}>
            ({total} total)
          </span>
        )}
      </h2>

      {games.length === 0 ? (
        <div className="card empty-state">
          <div className="empty-icon">🎮</div>
          <p>No games yet. Start playing!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {games.map((game) => (
            <div key={game.id} className="game-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {getMiniBoard(game.moves)}
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>
                    <span style={{ color: 'var(--x-color)' }}>{game.playerX.username}</span>
                    <span className="text-muted" style={{ margin: '0 6px' }}>vs</span>
                    <span style={{ color: 'var(--o-color)' }}>{game.playerO.username}</span>
                  </div>
                  <div className="text-muted text-sm" style={{ marginTop: '2px' }}>
                    {game.moves.length} moves •{' '}
                    {new Date(game.createdAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </div>
                </div>
              </div>
              <div>
                {getResultBadge(game, playerId)}
              </div>
            </div>
          ))}
        </div>
      )}

      {total > limit && (
        <div className="flex justify-center gap-4" style={{ marginTop: '20px' }}>
          <button
            className="btn btn-outline btn-sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            ← Prev
          </button>
          <span className="text-muted text-sm" style={{ lineHeight: '32px' }}>
            Page {page} of {Math.ceil(total / limit)}
          </span>
          <button
            className="btn btn-outline btn-sm"
            onClick={() => setPage((p) => p + 1)}
            disabled={page >= Math.ceil(total / limit)}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
