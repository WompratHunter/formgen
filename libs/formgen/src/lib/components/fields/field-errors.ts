import { AbstractControl } from '@angular/forms';
import { ValidatorConfig } from '../../types/renderable-form';
import { ValidatorFactoryService } from '../../services/validator-factory.service';

export function getFirstError(
  control: AbstractControl,
  validators: ValidatorConfig[],
  factory: ValidatorFactoryService,
): string | null {
  if (!control.errors || !control.touched) return null;
  for (const config of validators) {
    if (control.errors[config.type] || control.errors[config.type.toLowerCase()]) {
      return factory.errorMessage(config);
    }
  }
  // Fallback for any error key
  const firstKey = Object.keys(control.errors)[0];
  return firstKey ? `Validation error: ${firstKey}` : null;
}
