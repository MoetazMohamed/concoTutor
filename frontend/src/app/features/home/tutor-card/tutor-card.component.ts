import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Tutor } from '../../../shared/model/tutor.model';
@Component({
  selector: 'app-tutor-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './tutor-card.component.html',
  styleUrls: ['./tutor-card.component.scss'],
})
export class TutorCardComponent {
  @Input({ required: true }) tutor!: Tutor;
}
