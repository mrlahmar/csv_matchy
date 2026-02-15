import { TableRenderer as BaseTableRenderer, InvalidCell } from '@csv-matchy/vanilla';

export class BootstrapTableRenderer {
  private renderer: BaseTableRenderer;

  constructor(containerId: string) {
    this.renderer = new BaseTableRenderer(containerId, 'table-danger', 'table-success');
  }

  render(
    data: Record<string, string>[],
    headers: string[],
    invalidCells: InvalidCell[] = []
  ): void {
    const container = document.getElementById(this.renderer.getContainerId());
    if (!container) return;

    const table = document.createElement('table');
    table.className = 'table table-striped table-hover table-bordered';

    const thead = document.createElement('thead');
    thead.className = 'table-dark';
    const headerRow = document.createElement('tr');
    headers.forEach((h: string) => {
      const th = document.createElement('th');
      th.scope = 'col';
      th.textContent = h;
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    data.forEach((row: Record<string, string>, rowIdx: number) => {
      const tr = document.createElement('tr');
      headers.forEach((h: string, colIdx: number) => {
        const td = document.createElement('td');
        td.textContent = row[h] || '';

        const isInvalid = invalidCells.some(
          (cell: InvalidCell) => cell.row === rowIdx && cell.col === colIdx
        );
        
        if (isInvalid) {
          td.classList.add('table-danger');
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
