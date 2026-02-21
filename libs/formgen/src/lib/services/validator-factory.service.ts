import { Injectable } from '@angular/core';
import { ValidatorFn, Validators } from '@angular/forms';
import { ValidatorConfig } from '../types/renderable-form';

@Injectable({ providedIn: 'root' })
export class ValidatorFactoryService {
  build(configs: ValidatorConfig[]): ValidatorFn[] {
    return configs.map((c) => this.toValidatorFn(c)).filter(Boolean) as ValidatorFn[];
  }

  private toValidatorFn(config: ValidatorConfig): ValidatorFn | null {
    switch (config.type) {
      case 'required':    return Validators.required;
      case 'email':       return Validators.email;
      case 'minLength':   return Validators.minLength(Number(config.value));
      case 'maxLength':   return Validators.maxLength(Number(config.value));
      case 'min':         return Validators.min(Number(config.value));
      case 'max':         return Validators.max(Number(config.value));
      case 'pattern':     return Validators.pattern(String(config.value));
      default:            return null;
    }
  }

  errorMessage(config: ValidatorConfig): string {
    if (config.message) return config.message;
    switch (config.type) {
      case 'required':    return 'This field is required.';
      case 'email':       return 'Please enter a valid email address.';
      case 'minLength':   return `Minimum length is ${config.value} characters.`;
      case 'maxLength':   return `Maximum length is ${config.value} characters.`;
      case 'min':         return `Minimum value is ${config.value}.`;
      case 'max':         return `Maximum value is ${config.value}.`;
      case 'pattern':     return 'Value does not match the required pattern.';
      default:            return 'Invalid value.';
    }
  }
}
