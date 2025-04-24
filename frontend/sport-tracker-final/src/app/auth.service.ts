
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) {}

  login(username: string, password: string) {
    return this.http.post(`${this.apiUrl}/login/`, { username, password });
  }

  logout(refresh: string) {
    return this.http.post(`${this.apiUrl}/logout/`, { refresh });
  }

  saveTokens(data: any) {
    localStorage.setItem('access', data.access);
    localStorage.setItem('refresh', data.refresh);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refresh');
  }

  getAccessToken(): string | null {
    return localStorage.getItem('access');
  }

  clearTokens() {
    localStorage.clear();
  }
}
