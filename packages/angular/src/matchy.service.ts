import { Injectable } from '@angular/core';
import { RowValidator, RowValidationResult, Option } from '@csv-matchy/core';

export interface ValidationRule {
  field: string;
  option: Option;
}

@Injectable({
  providedIn: 'root',
})
export class MatchyService {
  validate(data: Record<string, string>[], rules: ValidationRule[]): RowValidationResult[] {
    const rowValidator = new RowValidator(rules);
    return rowValidator.validateAll(data);
  }
}
