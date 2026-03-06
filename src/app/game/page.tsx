'use client';

import { useState, useCallback } from 'react';
import PlayerForm from '@/components/PlayerForm';
import Board from '@/components/Board';
import GameStatus from '@/components/GameStatus';
import ShareResult from '@/components/ShareResult';
import {
  createEmptyBoard,
  checkWinner,
  getNextPlayer,
  makeMove,
  generateShareText,
  BoardState,
  GameResult,
} from '@/lib/gameLogic';

interface PlayerInfo {
  id: number;
  username: string;
}

type GamePhase = 'setup' | 'playing' | 'finished';

interface MoveRecord {
  player: string;
  index: number;
  board: BoardState;
}

export default function GamePage() {
  const [phase, setPhase] = useState<GamePhase>('setup');
  const [playerX, setPlayerX] = useState<PlayerInfo | null>(null);
  const [playerO, setPlayerO] = useState<PlayerInfo | null>(null);
  const [board, setBoard] = useState<BoardState>(createEmptyBoard());
  const [currentPlayer, setCurrentPlayer] = useState<string>('X');
  const [gameResult, setGameResult] = useState<GameResult | null>(null);
  const [moves, setMoves] = useState<MoveRecord[]>([]);
  const [saving, setSaving] = useState(false);
  const [shareText, setShareText] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handlePlayersReady = useCallback(
    (px: PlayerInfo, po: PlayerInfo) => {
      setPlayerX(px);
      setPlayerO(po);
      setBoard(createEmptyBoard());
      setCurrentPlayer('X');
      setGameResult(null);
      setMoves([]);
      setPhase('playing');
      setError('');
    },
    []
  );

  const handleSquareClick = useCallback(
    async (index: number) => {
      if (gameResult || board[index]) return;

      const newBoard = makeMove(board, index, currentPlayer);
      if (!newBoard) return;

      const moveRecord: MoveRecord = {
        player: currentPlayer,
        index,
        board: newBoard,
      };
      const newMoves = [...moves, moveRecord];

      setBoard(newBoard);
      setMoves(newMoves);

      const result = checkWinner(newBoard);

      if (result.winner || result.isDraw) {
        setGameResult(result);
        setPhase('finished');

        // Generate share text
        const text = generateShareText(
          playerX!.username,
          playerO!.username,
          result
        );
        setShareText(text);

        // Save game to DB
        setSaving(true);
        try {
          const winnerId = result.winner === 'X'
            ? playerX!.id
            : result.winner === 'O'
            ? playerO!.id
            : null;

          await fetch('/api/games', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              playerXId: playerX!.id,
              playerOId: playerO!.id,
              winnerId,
              moves: newMoves.map((m) => ({ player: m.player, index: m.index })),
              status: result.isDraw ? 'draw' : 'completed',
            }),
          });
        } catch (e) {
          console.error('Failed to save game', e);
          setError('Game ended but failed to save result.');
        } finally {
          setSaving(false);
        }
      } else {
        setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
      }
    },
    [board, currentPlayer, gameResult, moves, playerX, playerO]
  );

  const handleReset = useCallback(() => {
    setBoard(createEmptyBoard());
    setCurrentPlayer('X');
    setGameResult(null);
    setMoves([]);
    setShareText('');
    setError('');
    setPhase('playing');
  }, []);

  const handleNewPlayers = useCallback(() => {
    setPhase('setup');
    setPlayerX(null);
    setPlayerO(null);
    setBoard(createEmptyBoard());
    setCurrentPlayer('X');
    setGameResult(null);
    setMoves([]);
    setShareText('');
    setError('');
  }, []);

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">🎮 Play Game</h1>
        <p className="page-subtitle">Two players, one board, ultimate glory.</p>
      </div>

      {phase === 'setup' && (
        <PlayerForm onReady={handlePlayersReady} />
      )}

      {(phase === 'playing' || phase === 'finished') && playerX && playerO && (
        <div className="board-container">
          {/* Players bar */}
          <div className="players-bar">
            <div className={`player-chip x-player ${currentPlayer === 'X' && !gameResult ? 'active' : ''}`}>
              <div className="avatar avatar-x">{playerX.username[0]}</div>
              <span>{playerX.username}</span>
              <span style={{ color: 'var(--x-color)', fontSize: '1.1rem' }}>✕</span>
            </div>
            <span className="vs-text">VS</span>
            <div className={`player-chip o-player ${currentPlayer === 'O' && !gameResult ? 'active' : ''}`}>
              <span style={{ color: 'var(--o-color)', fontSize: '1.1rem' }}>○</span>
              <span>{playerO.username}</span>
              <div className="avatar avatar-o">{playerO.username[0]}</div>
            </div>
          </div>

          {/* Game Status */}
          <GameStatus
            currentPlayer={currentPlayer}
            gameResult={gameResult}
            playerX={playerX.username}
            playerO={playerO.username}
          />

          {/* Board */}
          <Board
            board={board}
            onSquareClick={handleSquareClick}
            winningLine={gameResult?.winningLine || null}
            disabled={!!gameResult}
          />

          {error && (
            <p style={{ color: 'var(--danger)', fontSize: '0.9rem' }}>{error}</p>
          )}

          {saving && (
            <div className="flex items-center gap-4">
              <div className="spinner" />
              <span className="text-muted text-sm">Saving game result...</span>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-4" style={{ flexWrap: 'wrap', justifyContent: 'center' }}>
            {phase === 'finished' && (
              <button className="btn btn-primary" onClick={handleReset}>
                🔄 Play Again
              </button>
            )}
            <button className="btn btn-outline" onClick={handleNewPlayers}>
              👥 Change Players
            </button>
          </div>

          {/* Share Result */}
          {phase === 'finished' && shareText && (
            <ShareResult shareText={shareText} />
          )}
        </div>
      )}
    </div>
  );
}
