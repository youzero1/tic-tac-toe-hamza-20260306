'use client';

import { GameResult } from '@/lib/gameLogic';

interface GameStatusProps {
  currentPlayer: string;
  gameResult: GameResult | null;
  playerX: string;
  playerO: string;
}

export default function GameStatus({
  currentPlayer,
  gameResult,
  playerX,
  playerO,
}: GameStatusProps) {
  if (!gameResult) {
    const name = currentPlayer === 'X' ? playerX : playerO;
    const mark = currentPlayer === 'X' ? '✕' : '○';
    return (
      <div className="game-status">
        <div className={`turn-indicator ${currentPlayer === 'X' ? 'x-turn' : 'o-turn'}`}>
          {mark} {name}&apos;s turn
        </div>
        <p className="text-muted text-sm" style={{ marginTop: '4px' }}>
          Playing as {currentPlayer}
        </p>
      </div>
    );
  }

  if (gameResult.isDraw) {
    return (
      <div className="game-status">
        <div className="result-text draw">🤝 It&apos;s a Draw!</div>
        <p className="text-muted text-sm" style={{ marginTop: '4px' }}>
          {playerX} and {playerO} are evenly matched
        </p>
      </div>
    );
  }

  const winnerName = gameResult.winner === 'X' ? playerX : playerO;
  const mark = gameResult.winner === 'X' ? '✕' : '○';

  return (
    <div className="game-status">
      <div className="result-text win">🏆 {winnerName} Wins!</div>
      <p className="text-muted text-sm" style={{ marginTop: '4px' }}>
        {mark} triumphs in Tic Tac Toe
      </p>
    </div>
  );
}
