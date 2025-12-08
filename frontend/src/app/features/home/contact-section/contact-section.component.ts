import { Component } from '@angular/core';
import { ContactFormComponent } from '../contact-form/contact-form.component';
import { QrCodeComponent } from '../qr-code/qr-code.component';

@Component({
  selector: 'app-contact-section',
  standalone: true,
  imports: [ContactFormComponent, QrCodeComponent],
  templateUrl: './contact-section.component.html',
  styleUrls: ['./contact-section.component.scss'],
})
export class ContactSectionComponent {}
