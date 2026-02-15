import { Component, Input } from '@angular/core';

export interface InvalidCell {
  row: number;
  col: number;
  field: string;
  errors: Array<{ field: string; message: string }>;
}

@Component({
  selector: 'csv-matchy-table-tailwind',
  template: `
    <div class="overflow-x-auto">
      <table [class]="tableClass">
        <thead class="bg-gray-50">
          <tr>
            <th *ngFor="let header of headers" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {{ header }}
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr *ngFor="let row of data; let i = index" [class]="i % 2 === 0 ? 'bg-white' : 'bg-gray-50'">
            <td
              *ngFor="let header of headers; let j = index"
              [class]="getCellClass(i, j)"
              [title]="getErrors(i, j)"
            >
              {{ row[header] }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
})
export class MatchyTableTailwindComponent {
  @Input() data: Record<string, string>[] = [];
  @Input() headers: string[] = [];
  @Input() invalidCells: InvalidCell[] = [];
  @Input() tableClass = 'min-w-full divide-y divide-gray-200';

  isInvalid(row: number, col: number): boolean {
    return this.invalidCells.some(cell => cell.row === row && cell.col === col);
  }

  getCellClass(row: number, col: number): string {
    const baseClass = 'px-6 py-4 whitespace-nowrap text-sm';
    if (this.isInvalid(row, col)) {
      return `${baseClass} bg-red-100 text-red-800`;
    }
    return `${baseClass} text-gray-900`;
  }

  getErrors(row: number, col: number): string {
    const cell = this.invalidCells.find(c => c.row === row && c.col === col);
    return cell?.errors.map(e => e.message).join('\n') || '';
  }
}
