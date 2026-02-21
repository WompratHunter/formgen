import { Injectable, Type } from '@angular/core';
import { FieldType } from '../types/renderable-form';
import { TextInputComponent } from '../components/fields/text-input/text-input.component';
import { TextareaComponent } from '../components/fields/textarea/textarea.component';
import { SelectComponent } from '../components/fields/select/select.component';
import { CheckboxComponent } from '../components/fields/checkbox/checkbox.component';
import { RadioGroupComponent } from '../components/fields/radio-group/radio-group.component';

const TEXT_TYPES: FieldType[] = ['text', 'email', 'password', 'number', 'tel', 'url', 'date', 'slider', 'toggle'];

@Injectable({ providedIn: 'root' })
export class FormFieldFactoryService {
  resolve(type: FieldType): Type<unknown> {
    if ((TEXT_TYPES as string[]).includes(type)) return TextInputComponent;
    switch (type) {
      case 'textarea':  return TextareaComponent;
      case 'select':    return SelectComponent;
      case 'checkbox':  return CheckboxComponent;
      case 'radio':     return RadioGroupComponent;
      default:          return TextInputComponent;
    }
  }
}
