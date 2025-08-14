import { Injectable } from '@angular/core';
import{ HttpClient} from'@angular/common/http';
import{ Observable } from'rxjs';
import{ environment} from'../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  //Get all the registrations (admin)
  getRegistrations(): Observable<any> {
    return this.http.get(`${this.apiUrl}/get-registrations`);
  }

  //Get one registration (organizer)
  getRegistrationById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/get-registration/${id}`);
  }

  //Get registrations by user (admin)
  getRegistrationsByUser(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/get-attending-events-by-user/${userId}`);
  }

  //Get registrations by event (organizer)
  getRegistrationsByEvent(eventId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/get-registrations-by-event/${eventId}`);
  }

  //Get registrations of the authenticated user
  getMyRegistrations(): Observable<any> {
    return this.http.get(`${this.apiUrl}/my-attending-events`);
  }

  //Registrate to an event
  createRegistration(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/set-registration`, data);
  }

  //Update a registration (organizer)
  updateRegistration(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/update-registration/${id}`, data);
  }

  //Delete a registration
  deleteRegistration(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete-registration/${id}`);
  }
}
