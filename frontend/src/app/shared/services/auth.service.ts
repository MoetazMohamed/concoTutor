import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, tap } from 'rxjs';

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
    type: 'student' | 'ta';
    credits?: number;
  };
  token: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  name: string;
  userType: 'student' | 'ta';
  degree?: string;
  initialCredits?: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private currentUserKey = 'current_user';
  private tokenKey = 'auth_token';

  constructor(private http: HttpClient) {}

  register(dto: any): Observable<AuthResponse> {
    const registerDto = {
      email: dto.email,
      password: dto.password,
      name: dto.name,
      type: dto.userType === 'student' ? 'student' : 'ta',
      degree: dto.degree,
    };
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/auth/register`, registerDto)
      .pipe(
        tap((response) => {
          this.setToken(response.token);
          this.setCurrentUser({
            id: response.user.id,
            email: response.user.email,
            name: response.user.name,
            type: dto.userType,
          });
        }),
      );
  }

  login(email: string, password: string, userType: 'student' | 'ta'): Observable<AuthResponse> {
    const endpoint = userType === 'student' ? '/auth/login/student' : '/auth/login/ta';
    const loginDto = { email, password };
    
    return this.http.post<AuthResponse>(`${this.apiUrl}${endpoint}`, loginDto).pipe(
      tap((response) => {
        this.setToken(response.token);
        this.setCurrentUser({
          id: response.user.id,
          email: response.user.email,
          name: response.user.name,
          type: userType,
        });
      }),
    );
  }

  logout(): void {
    localStorage.removeItem(this.currentUserKey);
    localStorage.removeItem(this.tokenKey);
  }

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  setCurrentUser(user: any): void {
    localStorage.setItem(this.currentUserKey, JSON.stringify(user));
  }

  getCurrentUser() {
    const user = localStorage.getItem(this.currentUserKey);
    return user ? JSON.parse(user) : null;
  }

  getUser() {
    return this.getCurrentUser();
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  isStudent(): boolean {
    return this.getCurrentUser()?.type === 'student';
  }

  isTA(): boolean {
    return this.getCurrentUser()?.type === 'ta';
  }
}
