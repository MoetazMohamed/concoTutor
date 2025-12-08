import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../../../shared/services/api.service';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss'],
})
export class ContactFormComponent {
  form;
  submitted = false;
  submitting = false;

  constructor(private fb: FormBuilder, private api: ApiService) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;
    this.api.post('/contact', this.form.value).subscribe({
      next: (response: any) => {
        console.log('Contact form submitted successfully');
        this.submitted = true;
        this.submitting = false;
        this.form.reset();
        setTimeout(() => {
          this.submitted = false;
        }, 5000);
      },
      error: (err) => {
        console.error('Error submitting contact form:', err);
        this.submitting = false;
        alert('Failed to submit form. Please try again.');
      }
    });
  }
}

