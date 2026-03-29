interface CoordinateProps {
  boardSize: number;
  showCoordinates?: boolean;
}

const COLUMN_LABELS = 'ABCDEFGHJKLMNOPQRST';

export function Coordinate({ boardSize, showCoordinates = true }: CoordinateProps) {
  if (!showCoordinates) {
    return null;
  }

  const columns = COLUMN_LABELS.slice(0, boardSize).split('');
  const rows = Array.from({ length: boardSize }, (_, i) => boardSize - i);

  return (
    <>
      <div className="flex justify-between px-8 mb-1">
        {columns.map((col) => (
          <span
            key={`top-${col}`}
            className="text-xs font-medium text-stone-600 select-none w-4 text-center"
          >
            {col}
          </span>
        ))}
      </div>

      <div className="flex">
        <div className="flex flex-col justify-between py-4 pr-1">
          {rows.map((row) => (
            <span
              key={`left-${row}`}
              className="text-xs font-medium text-stone-600 select-none h-4 flex items-center"
            >
              {row}
            </span>
          ))}
        </div>

        <div className="flex-1" />

        <div className="flex flex-col justify-between py-4 pl-1">
          {rows.map((row) => (
            <span
              key={`right-${row}`}
              className="text-xs font-medium text-stone-600 select-none h-4 flex items-center"
            >
              {row}
            </span>
          ))}
        </div>
      </div>

      <div className="flex justify-between px-8 mt-1">
        {columns.map((col) => (
          <span
            key={`bottom-${col}`}
            className="text-xs font-medium text-stone-600 select-none w-4 text-center"
          >
            {col}
          </span>
        ))}
      </div>
    </>
  );
}

export default Coordinate;
