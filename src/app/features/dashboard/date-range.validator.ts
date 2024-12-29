import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { differenceInWeeks } from 'date-fns';

export function dateRangeValidator(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const startDate = group.get('startDate')?.value;
    const endDate = group.get('endDate');
    const endDateValue = endDate?.value;
    const MAX_WEEK_SIZE = 52;

    if (differenceInWeeks(endDateValue, startDate) > MAX_WEEK_SIZE) {
      endDate!.setErrors({ dateRange: true });
    } else {
      endDate!.setErrors(null);
    }

    return null;
  };
}
