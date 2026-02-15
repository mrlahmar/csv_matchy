import { Component, Input } from '@angular/core';

export interface InvalidCell {
  row: number;
  col: number;
  field: string;
  errors: Array<{ field: string; message: string }>;
}

@Component({
  selector: 'csv-matchy-table',
  template: `
    <table [class]="tableClass">
      <thead>
        <tr>
          <th *ngFor="let header of headers" [class]="headerClass">{{ header }}</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let row of data; let i = index" [class]="rowClass">
          <td
            *ngFor="let header of headers; let j = index"
            [ngClass]="getCellClass(i, j)"
            [title]="getErrors(i, j)"
          >
            {{ row[header] }}
          </td>
        </tr>
      </tbody>
    </table>
  `,
  styles: [`
    :host {
      display: block;
    }
    
    .matchy-table {
      --matchy-border-color: #ddd;
      --matchy-header-bg: #f8f9fa;
      --matchy-header-text: #333;
      --matchy-row-bg: #fff;
      --matchy-row-alt-bg: #f8f9fa;
      --matchy-valid-bg: #d4edda;
      --matchy-valid-text: #155724;
      --matchy-invalid-bg: #f8d7da;
      --matchy-invalid-text: #721c24;
      --matchy-cell-padding: 12px;
      
      width: 100%;
      border-collapse: collapse;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 14px;
      border: 1px solid var(--matchy-border-color);
    }
    
    .matchy-table th {
      background-color: var(--matchy-header-bg);
      color: var(--matchy-header-text);
      padding: var(--matchy-cell-padding);
      text-align: left;
      font-weight: 600;
      border-bottom: 2px solid var(--matchy-border-color);
    }
    
    .matchy-table td {
      padding: var(--matchy-cell-padding);
      border-bottom: 1px solid var(--matchy-border-color);
    }
    
    .matchy-table tr:nth-child(even) {
      background-color: var(--matchy-row-alt-bg);
    }
    
    .matchy-table tr:hover {
      background-color: #e9ecef;
    }
    
    .matchy-valid {
      background-color: var(--matchy-valid-bg) !important;
      color: var(--matchy-valid-text) !important;
    }
    
    .matchy-invalid {
      background-color: var(--matchy-invalid-bg) !important;
      color: var(--matchy-invalid-text) !important;
    }
  `]
})
export class MatchyTableComponent {
  @Input() data: Record<string, string>[] = [];
  @Input() headers: string[] = [];
  @Input() invalidCells: InvalidCell[] = [];
  @Input() className = 'matchy-table';
  @Input() validCellClass = 'matchy-valid';
  @Input() invalidCellClass = 'matchy-invalid';
  @Input() headerClass = '';
  @Input() rowClass = '';

  get tableClass(): string {
    return this.className || 'matchy-table';
  }

  isInvalid(row: number, col: number): boolean {
    return this.invalidCells.some(cell => cell.row === row && cell.col === col);
  }

  getCellClass(row: number, col: number): string {
    const baseClass = this.isInvalid(row, col) 
      ? this.invalidCellClass 
      : this.validCellClass;
    return baseClass;
  }

  getErrors(row: number, col: number): string {
    const cell = this.invalidCells.find(c => c.row === row && c.col === col);
    return cell?.errors.map(e => e.message).join('\n') || '';
  }
}
