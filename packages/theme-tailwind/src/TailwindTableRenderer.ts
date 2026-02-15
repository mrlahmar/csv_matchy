import { TableRenderer as BaseTableRenderer, InvalidCell } from '@csv-matchy/vanilla';

export class TailwindTableRenderer {
  private renderer: BaseTableRenderer;

  constructor(containerId: string) {
    this.renderer = new BaseTableRenderer(containerId, 'bg-red-100', 'bg-green-100');
  }

  render(
    data: Record<string, string>[],
    headers: string[],
    invalidCells: InvalidCell[] = []
  ): void {
    const container = document.getElementById(this.renderer.getContainerId());
    if (!container) return;

    const table = document.createElement('table');
    table.className = 'min-w-full divide-y divide-gray-200';

    const thead = document.createElement('thead');
    thead.className = 'bg-gray-50';
    const headerRow = document.createElement('tr');
    headers.forEach((h: string) => {
      const th = document.createElement('th');
      th.className = 'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider';
      th.textContent = h;
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    tbody.className = 'bg-white divide-y divide-gray-200';
    data.forEach((row: Record<string, string>, rowIdx: number) => {
      const tr = document.createElement('tr');
      if (rowIdx % 2 === 0) {
        tr.className = 'bg-white';
      } else {
        tr.className = 'bg-gray-50';
      }
      
      headers.forEach((h: string, colIdx: number) => {
        const td = document.createElement('td');
        td.className = 'px-6 py-4 whitespace-nowrap text-sm text-gray-900';
        td.textContent = row[h] || '';

        const isInvalid = invalidCells.some(
          (cell: InvalidCell) => cell.row === rowIdx && cell.col === colIdx
        );
        
        if (isInvalid) {
          td.classList.add('bg-red-100', 'text-red-800');
        }

        const cellErrors = invalidCells.find(
          (cell: InvalidCell) => cell.row === rowIdx && cell.col === colIdx
        );
        if (cellErrors?.errors) {
          td.title = cellErrors.errors.map((e: { message: string }) => e.message).join('\n');
        }

        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);

    container.innerHTML = '';
    container.appendChild(table);
  }

  clear(): void {
    this.renderer.clear();
  }
}
