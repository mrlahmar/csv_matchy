import { RowValidator, RowValidationResult, Option } from '@csv-matchy/core';

export interface ValidationRule {
  field: string;
  option: Option;
}

export interface ValidationResults {
  results: RowValidationResult[];
  invalidCells: Array<{ row: number; col: number; field: string; errors: Array<{ field: string; message: string }> }>;
  isValid: boolean;
}

type EventCallback = (data: unknown) => void;

export class MatchyManager {
  private data: Record<string, string>[] = [];
  private results: ValidationResults | null = null;
  private listeners: Map<string, EventCallback[]> = new Map();
  private validationRules: ValidationRule[];

  constructor(validationRules: ValidationRule[]) {
    this.validationRules = validationRules;
  }

  loadData(data: Record<string, string>[]): void {
    this.data = data;
    this.emit('data-loaded', this.data);
  }

  validate(): ValidationResults {
    const rowValidator = new RowValidator(this.validationRules);
    const results = rowValidator.validateAll(this.data);

    const invalidCells: Array<{ row: number; col: number; field: string; errors: Array<{ field: string; message: string }> }> = [];
    results.forEach((result: RowValidationResult) => {
      if (!result.isValid) {
        result.invalidCells.forEach((cell: { row: number; col: number; field: string; errors: Array<{ field: string; message: string }> }) => {
          invalidCells.push(cell);
        });
      }
    });

    this.results = {
      results,
      invalidCells,
      isValid: invalidCells.length === 0
    };

    this.emit('validation-complete', this.results);
    return this.results;
  }

  getResults(): ValidationResults | null {
    return this.results;
  }

  getData(): Record<string, string>[] {
    return this.data;
  }

  on(event: string, callback: EventCallback): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  off(event: string, callback: EventCallback): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      this.listeners.set(
        event,
        callbacks.filter(cb => cb !== callback)
      );
    }
  }

  private emit(event: string, data: unknown): void {
    const callbacks = this.listeners.get(event) || [];
    callbacks.forEach(cb => cb(data));
  }
}
