import{ Injectable} from'@angular/core';
import{ HttpClient} from'@angular/common/http';
import{ Observable } from'rxjs';
import{ environment} from'../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  //Get all the events
  getEvents(): Observable<any> {
    return this.http.get(`${this.apiUrl}/get-events`);
  }

  //Get one event
  getEventById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/get-event/${id}`);
  }

  //Get the events created by user (admin)
  getEventsByUser(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/events-by-user/${userId}`);
  }

  //Get the events created by the authenticated user
  getMyEvents(): Observable<any> {
    return this.http.get(`${this.apiUrl}/my-events`);
  }

  //Create a new event
  createEvent(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/set-event`, data);
  }

  //Update an event
  updateEvent(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/update-event/${id}`, data);
  }

  //Delete an event
  deleteEvent(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete-event/${id}`);
  }
}
