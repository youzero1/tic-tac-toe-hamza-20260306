export type BoardState = (string | null)[];

export interface GameResult {
  winner: string | null;
  isDraw: boolean;
  winningLine: number[] | null;
}

const WINNING_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export function checkWinner(board: BoardState): GameResult {
  for (const line of WINNING_LINES) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], isDraw: false, winningLine: line };
    }
  }

  if (board.every((cell) => cell !== null)) {
    return { winner: null, isDraw: true, winningLine: null };
  }

  return { winner: null, isDraw: false, winningLine: null };
}

export function getNextPlayer(board: BoardState): string {
  const xCount = board.filter((c) => c === 'X').length;
  const oCount = board.filter((c) => c === 'O').length;
  return xCount <= oCount ? 'X' : 'O';
}

export function makeMove(
  board: BoardState,
  index: number,
  player: string
): BoardState | null {
  if (board[index] !== null) return null;
  const newBoard = [...board];
  newBoard[index] = player;
  return newBoard;
}

export function createEmptyBoard(): BoardState {
  return Array(9).fill(null);
}

export function generateShareText(
  playerX: string,
  playerO: string,
  result: GameResult
): string {
  const appName = process.env.NEXT_PUBLIC_APP_NAME || 'Tic Tac Toe';
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  let resultLine = '';
  if (result.isDraw) {
    resultLine = `🤝 It's a DRAW between ${playerX} and ${playerO}!`;
  } else if (result.winner === 'X') {
    resultLine = `🏆 ${playerX} (X) defeated ${playerO} (O)!`;
  } else {
    resultLine = `🏆 ${playerO} (O) defeated ${playerX} (X)!`;
  }

  return `${resultLine}\n\nPlayed on ${appName}\n${baseUrl}\n\n#TicTacToe #Gaming`;
}
