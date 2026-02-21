import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FormgenFormComponent, RenderableForm } from '@formgen/ui';

const FIXTURE: RenderableForm = {
  id: 'fixture-001',
  name: 'Contact Us',
  layout: { columns: 2, gap: '16px', breakpoints: { sm: { columns: 1 }, md: { columns: 2 } } },
  fields: [
    {
      key: 'full_name', type: 'text', label: 'Full Name', placeholder: 'Jane Smith',
      hint: '', validators: [{ type: 'required' }], options: [], col_span: 1, order: 0,
      css_class: 'formgen-field--full-name',
    },
    {
      key: 'email', type: 'email', label: 'Email Address', placeholder: 'jane@example.com',
      hint: '', validators: [{ type: 'required' }, { type: 'email' }], options: [], col_span: 1, order: 1,
      css_class: 'formgen-field--email',
    },
    {
      key: 'subject', type: 'select', label: 'Subject', placeholder: 'Choose a topic',
      hint: '', validators: [{ type: 'required' }],
      options: [
        { label: 'General Enquiry', value: 'general' },
        { label: 'Support', value: 'support' },
        { label: 'Billing', value: 'billing' },
      ],
      col_span: 2, order: 2, css_class: 'formgen-field--subject',
    },
    {
      key: 'message', type: 'textarea', label: 'Message', placeholder: 'Write your message here...',
      hint: 'Maximum 500 characters.', validators: [{ type: 'required' }, { type: 'maxLength', value: 500 }],
      options: [], col_span: 2, order: 3, css_class: 'formgen-field--message',
    },
    {
      key: 'newsletter', type: 'checkbox', label: 'Subscribe to our newsletter',
      placeholder: '', hint: '', validators: [], options: [], col_span: 2, order: 4,
      css_class: 'formgen-field--newsletter',
    },
  ],
  actions: [
    { type: 'reset', label: 'Clear', color: 'warn', css_class: 'formgen-action--reset' },
    { type: 'submit', label: 'Send Message', color: 'primary', css_class: 'formgen-action--submit' },
  ],
};

@Component({
  imports: [RouterModule, MatToolbarModule, FormgenFormComponent],
  selector: 'app-root',
  template: `
    <mat-toolbar color="primary">
      <span>Formgen Playground</span>
    </mat-toolbar>
    <main class="playground-main">
      <formgen-form [config]="fixture" (formSubmit)="onSubmit($event)" />
    </main>
  `,
  styles: [`
    .playground-main {
      padding: 32px 24px;
      max-width: 1200px;
      margin: 0 auto;
    }
  `],
})
export class App {
  fixture = FIXTURE;

  onSubmit(value: Record<string, unknown>): void {
    console.log('Form submitted:', value);
  }
}
