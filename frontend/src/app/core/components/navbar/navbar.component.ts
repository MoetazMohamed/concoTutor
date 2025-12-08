import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  constructor(
    public authService: AuthService,
    private router: Router,
  ) {}

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getDashboardLink(): string {
    return this.authService.isStudent() ? '/student-dashboard' : '/ta-dashboard';
  }

  getDashboardLabel(): string {
    return this.authService.isStudent() ? 'Student Dashboard' : 'Tutor Dashboard';
  }
}
