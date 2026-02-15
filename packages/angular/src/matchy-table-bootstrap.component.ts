import { Component, Input } from '@angular/core';

export interface InvalidCell {
  row: number;
  col: number;
  field: string;
  errors: Array<{ field: string; message: string }>;
}

@Component({
  selector: 'csv-matchy-table-bootstrap',
  template: `
    <div class="table-responsive">
      <table [class]="tableClass">
        <thead class="table-dark">
          <tr>
            <th *ngFor="let header of headers">{{ header }}</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let row of data; let i = index">
            <td
              *ngFor="let header of headers; let j = index"
              [class.table-danger]="isInvalid(i, j)"
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
export class MatchyTableBootstrapComponent {
  @Input() data: Record<string, string>[] = [];
  @Input() headers: string[] = [];
  @Input() invalidCells: InvalidCell[] = [];
  @Input() tableClass = 'table table-striped table-hover';

  isInvalid(row: number, col: number): boolean {
    return this.invalidCells.some(cell => cell.row === row && cell.col === col);
  }

  getErrors(row: number, col: number): string {
    const cell = this.invalidCells.find(c => c.row === row && c.col === col);
    return cell?.errors.map(e => e.message).join('\n') || '';
  }
}
