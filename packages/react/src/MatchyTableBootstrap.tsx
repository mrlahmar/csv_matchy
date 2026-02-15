import React from 'react';

export interface MatchyTableBootstrapProps {
  data: Record<string, string>[];
  headers: string[];
  invalidCells?: Array<{ row: number; col: number; field: string; errors: Array<{ field: string; message: string }> }>;
  className?: string;
  striped?: boolean;
  hover?: boolean;
  bordered?: boolean;
  condensed?: boolean;
}

export function MatchyTableBootstrap({
  data,
  headers,
  invalidCells = [],
  className = '',
  striped = true,
  hover = true,
  bordered = false,
  condensed = false,
}: MatchyTableBootstrapProps) {
  const isInvalid = (rowIndex: number, colIndex: number) =>
    invalidCells.some(cell => cell.row === rowIndex && cell.col === colIndex);

  const getErrors = (rowIndex: number, colIndex: number): string[] => {
    const cell = invalidCells.find(cell => cell.row === rowIndex && cell.col === colIndex);
    return cell?.errors.map(e => e.message) || [];
  };

  const tableClasses = [
    'table',
    striped && 'table-striped',
    hover && 'table-hover',
    bordered && 'table-bordered',
    condensed && 'table-condensed',
  ].filter(Boolean).join(' ');

  return (
    <div className="table-responsive">
      <table className={`${tableClasses} ${className}`}>
        <thead className="table-dark">
          <tr>
            {headers.map((h, i) => (
              <th key={i} scope="col">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIdx) => (
            <tr key={rowIdx}>
              {headers.map((h, colIdx) => {
                const errors = getErrors(rowIdx, colIdx);
                const hasError = isInvalid(rowIdx, colIdx);
                return (
                  <td
                    key={colIdx}
                    className={hasError ? 'table-danger' : ''}
                    title={errors.join('\n')}
                  >
                    {row[h]}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
