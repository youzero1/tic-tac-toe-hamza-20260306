'use client';

import Square from './Square';
import { BoardState } from '@/lib/gameLogic';

interface BoardProps {
  board: BoardState;
  onSquareClick: (index: number) => void;
  winningLine: number[] | null;
  disabled: boolean;
}

export default function Board({ board, onSquareClick, winningLine, disabled }: BoardProps) {
  return (
    <div className="board">
      {board.map((value, index) => (
        <Square
          key={index}
          value={value}
          onClick={() => onSquareClick(index)}
          isWinning={winningLine?.includes(index) || false}
          disabled={disabled}
        />
      ))}
    </div>
  );
}
