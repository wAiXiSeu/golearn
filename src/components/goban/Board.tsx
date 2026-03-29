import { useState, useCallback } from 'react';
import type { BoardState, Position } from '../../types/game';
import { STAR_POINTS } from '../../types/game';
import { Stone } from './Stone';

interface BoardProps {
  boardSize: number;
  boardState: BoardState;
  onCellClick?: (position: Position) => void;
  lastMove?: Position | null;
  showCoordinates?: boolean;
  currentPlayer?: 'black' | 'white';
}

const COLUMN_LABELS = 'ABCDEFGHJKLMNOPQRST';

export function Board({
  boardSize,
  boardState,
  onCellClick,
  lastMove,
  showCoordinates = true,
  currentPlayer = 'black',
}: BoardProps) {
  const [hoverPosition, setHoverPosition] = useState<Position | null>(null);

  const isLastMove = useCallback(
    (x: number, y: number): boolean => {
      return lastMove?.x === x && lastMove?.y === y;
    },
    [lastMove]
  );

  const handleCellClick = (x: number, y: number) => {
    if (onCellClick) {
      onCellClick({ x, y });
    }
  };

  const columns = COLUMN_LABELS.slice(0, boardSize).split('');
  const rows = Array.from({ length: boardSize }, (_, i) => boardSize - i);

  const cellSize = 36;
  const stoneSize = cellSize - 4;
  const gridSize = (boardSize - 1) * cellSize;
  const boardPixelSize = gridSize + cellSize;

  return (
    <div className="flex flex-col items-center">
      {showCoordinates && (
        <div
          className="flex justify-between mb-1"
          style={{ width: `${gridSize}px` }}
        >
          {columns.map((col) => (
            <span
              key={`top-${col}`}
              className="text-xs font-medium text-stone-600 select-none w-4 text-center"
            >
              {col}
            </span>
          ))}
        </div>
      )}

      <div className="flex">
        {showCoordinates && (
          <div
            className="flex flex-col justify-between pr-1"
            style={{ height: `${gridSize}px` }}
          >
            {rows.map((row) => (
              <span
                key={`left-${row}`}
                className="text-xs font-medium text-stone-600 select-none h-4 flex items-center"
              >
                {row}
              </span>
            ))}
          </div>
        )}

        <div
          className="board-grid relative"
          style={{
            width: `${boardPixelSize}px`,
            height: `${boardPixelSize}px`,
            backgroundColor: '#dcb35c',
            border: '2px solid #8b7355',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          }}
        >
          <svg
            className="absolute pointer-events-none"
            style={{
              left: cellSize / 2,
              top: cellSize / 2,
              width: gridSize,
              height: gridSize,
            }}
          >
            {Array.from({ length: boardSize }).map((_, i) => (
              <line
                key={`h-${i}`}
                x1={0}
                y1={i * cellSize}
                x2={gridSize}
                y2={i * cellSize}
                stroke="#5c4a3d"
                strokeWidth="1"
              />
            ))}
            {Array.from({ length: boardSize }).map((_, i) => (
              <line
                key={`v-${i}`}
                x1={i * cellSize}
                y1={0}
                x2={i * cellSize}
                y2={gridSize}
                stroke="#5c4a3d"
                strokeWidth="1"
              />
            ))}
          </svg>

          {STAR_POINTS[boardSize]?.map((point) => (
            <div
              key={`star-${point.x}-${point.y}`}
              className="absolute rounded-full bg-stone-700"
              style={{
                width: `${Math.max(6, cellSize / 4)}px`,
                height: `${Math.max(6, cellSize / 4)}px`,
                left: `${point.x * cellSize + cellSize / 2 - Math.max(3, cellSize / 8)}px`,
                top: `${point.y * cellSize + cellSize / 2 - Math.max(3, cellSize / 8)}px`,
              }}
            />
          ))}

          {Array.from({ length: boardSize }).map((_, y) =>
            Array.from({ length: boardSize }).map((_, x) => {
              const stone = boardState[y]?.[x];
              const isHovered = hoverPosition?.x === x && hoverPosition?.y === y;
              const isEmpty = !stone;

              return (
                <div
                  key={`stone-${x}-${y}`}
                  className="absolute flex items-center justify-center cursor-pointer"
                  style={{
                    left: x * cellSize,
                    top: y * cellSize,
                    width: cellSize,
                    height: cellSize,
                  }}
                  onMouseEnter={() => isEmpty && setHoverPosition({ x, y })}
                  onMouseLeave={() => setHoverPosition(null)}
                  onClick={() => handleCellClick(x, y)}
                >
                  {stone ? (
                    <Stone color={stone} size={stoneSize} />
                  ) : isHovered ? (
                    <Stone
                      color={null}
                      size={stoneSize}
                      isGhost
                      ghostColor={currentPlayer}
                    />
                  ) : null}

                  {isLastMove(x, y) && stone && (
                    <div
                      className={`absolute rounded-full border-2 ${
                        stone === 'black' ? 'border-red-400' : 'border-red-500'
                      }`}
                      style={{
                        width: `${stoneSize * 0.5}px`,
                        height: `${stoneSize * 0.5}px`,
                      }}
                    />
                  )}
                </div>
              );
            })
          )}
        </div>

        {showCoordinates && (
          <div
            className="flex flex-col justify-between pl-1"
            style={{ height: `${gridSize}px` }}
          >
            {rows.map((row) => (
              <span
                key={`right-${row}`}
                className="text-xs font-medium text-stone-600 select-none h-4 flex items-center"
              >
                {row}
              </span>
            ))}
          </div>
        )}
      </div>

      {showCoordinates && (
        <div
          className="flex justify-between mt-1"
          style={{ width: `${gridSize}px` }}
        >
          {columns.map((col) => (
            <span
              key={`bottom-${col}`}
              className="text-xs font-medium text-stone-600 select-none w-4 text-center"
            >
              {col}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default Board;