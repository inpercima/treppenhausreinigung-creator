import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { differenceInWeeks } from 'date-fns';

export function dateRangeValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const startDate = control.get('startDate')?.value;
    const endDate = control.get('endDate')?.value;
    const MAX_WEEK_SIZE = 52;

    return differenceInWeeks(endDate, startDate) > MAX_WEEK_SIZE ? { dateRange: true } : null;
  };
}
