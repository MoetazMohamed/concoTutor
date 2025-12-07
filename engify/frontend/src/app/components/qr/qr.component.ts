import { Component } from '@angular/core';

@Component({
  selector: 'app-qr',
  standalone: true,
  imports: [],
  templateUrl: './qr.component.html',
  styleUrls: ['./qr.component.css']
})
export class QrComponent {
  qrCodeUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://engify.com';
}
