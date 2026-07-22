import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { Textarea } from 'primeng/textarea';
import { Select } from 'primeng/select';
import { Message } from 'primeng/message';

@Component({
  selector: 'app-contact-page',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, Button, InputText, Textarea, Select, Message],
  templateUrl: './contact-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactPageComponent {
  protected readonly isSubmitting = signal(false);
  protected readonly submitted = signal(false);
  protected readonly error = signal<string | null>(null);

  protected readonly subjectOptions = [
    { label: 'Register as a Center Admin', value: 'CENTER_REGISTRATION' },
    { label: 'Partnership Inquiry', value: 'PARTNERSHIP' },
    { label: 'Technical Support', value: 'SUPPORT' },
    { label: 'General Inquiry', value: 'GENERAL' },
  ];

  protected readonly form = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    organization: new FormControl(''),
    subject: new FormControl('GENERAL', { nonNullable: true, validators: [Validators.required] }),
    message: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(10)] }),
  });

  protected onSubmit(): void {
    if (this.form.invalid) return;

    this.isSubmitting.set(true);
    this.error.set(null);

    // Simulate form submission (no backend endpoint exists for contact)
    setTimeout(() => {
      this.isSubmitting.set(false);
      this.submitted.set(true);
    }, 1000);
  }
}
