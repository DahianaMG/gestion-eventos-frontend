import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  //Get all the users
  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/get-users`);
  }

  //Get one user
  getUser(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get-user/${id}`);
  }
}
