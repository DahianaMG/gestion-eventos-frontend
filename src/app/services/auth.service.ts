import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import{ environment} from'../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  private authStatus = new BehaviorSubject<boolean>(this.hasToken());
  isAuthenticated$ = this.authStatus.asObservable();

  private currentUserSubject = new BehaviorSubject<any>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
  this.authStatus.next(this.hasToken());

  const storedUser = localStorage.getItem('current_user');
  if (storedUser) {
    this.currentUserSubject.next(JSON.parse(storedUser));
  } else if (this.hasToken()) {
    this.loadCurrentUser();
  }
}

  private hasToken(): boolean {
    return !!localStorage.getItem('auth_token');
  }

  register(userData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, userData);
  }

  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        this.handleAuthSuccess(response.token, response.user);
      })
    );
  }

  logout(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/logout`, {}).pipe(
      tap(() => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('current_user');
        this.authStatus.next(false);
        this.currentUserSubject.next(null);
      })
    );
  }

  private handleAuthSuccess(token: string, user?: any) {
    localStorage.setItem('auth_token', token);
    if (user) {
      localStorage.setItem('current_user', JSON.stringify(user));
      this.currentUserSubject.next(user);
    } else {
      this.loadCurrentUser();
    }
    this.authStatus.next(true);
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  loadCurrentUser(): void {
    const token = this.getToken();
    if (!token) return;

    this.http.get<any>(`${this.apiUrl}/profile`).subscribe({
      next: user => this.currentUserSubject.next(user),
      error: () => {
        localStorage.removeItem('auth_token');
        this.authStatus.next(false);
        this.currentUserSubject.next(null);
      }
    });
  }
}
