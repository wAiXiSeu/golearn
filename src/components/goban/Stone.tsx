import type { StoneColor } from '../../types/game';

interface StoneProps {
  color: StoneColor;
  size?: number;
  onClick?: () => void;
  isGhost?: boolean;
  ghostColor?: 'black' | 'white';
}

export function Stone({
  color,
  size = 32,
  onClick,
  isGhost = false,
  ghostColor = 'black',
}: StoneProps) {
  if (!color && !isGhost) {
    return null;
  }

  const stoneColor = color || ghostColor;
  const isBlack = stoneColor === 'black';

  return (
    <div
      onClick={onClick}
      className={`
        rounded-full cursor-pointer transition-transform duration-100 ease-out
        ${isBlack ? 'stone-black' : 'stone-white'}
        ${isGhost ? 'opacity-50' : 'opacity-100'}
        ${!isGhost ? 'hover:scale-105' : ''}
      `}
      style={{
        width: `${size}px`,
        height: `${size}px`,
      }}
    />
  );
}

export default Stone;
