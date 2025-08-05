import{ Injectable} from'@angular/core';
import{ HttpClient} from'@angular/common/http';
import{ Observable } from'rxjs';
import{ environment} from'../../environments/environment'; // Ajusta la ruta

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getEvents(): Observable<any> { // Definir un tipo de dato más específico después
    return this.http.get(`${this.apiUrl}/get-events`);
  }

  getEventById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/get-event/${id}`);
  }
}
