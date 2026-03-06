'use client';

interface SquareProps {
  value: string | null;
  onClick: () => void;
  isWinning: boolean;
  disabled: boolean;
}

export default function Square({ value, onClick, isWinning, disabled }: SquareProps) {
  const classes = [
    'square',
    value === 'X' ? 'x-mark' : value === 'O' ? 'o-mark' : '',
    isWinning ? 'winning' : '',
    disabled || value ? 'disabled' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={classes} onClick={onClick} disabled={disabled || !!value}>
      {value === 'X' ? '✕' : value === 'O' ? '○' : ''}
    </button>
  );
}
