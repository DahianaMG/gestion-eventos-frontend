import { Injectable } from '@angular/core';
import{ HttpClient} from'@angular/common/http';
import{ Observable } from'rxjs';
import{ environment} from'../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  //Get schedules by event
  getSchedules(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/get-schedules-by-event/${id}`);
  }

  //Get one schedule
  getSchedule(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/get-schedule/${id}`);
  }

  //Set a schedule (organizer)
  createSchedule(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/set-schedule`, data);
  }

  //Update a schedule (organizer)
  updateSchedule(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/update-schedule/${id}`, data);
  }

  //Delete a schedule
  deleteSchedule(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete-schedule/${id}`);
  }
}
