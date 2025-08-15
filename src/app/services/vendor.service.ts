import { Injectable } from '@angular/core';
import{ HttpClient} from'@angular/common/http';
import{ Observable } from'rxjs';
import{ environment} from'../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VendorService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  //Get vendors by event
  getVendors(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/get-vendors-by-event/${id}`);
  }

  //Get one vendor
  getVendor(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/get-vendor/${id}`);
  }

  //Set a vendor (organizer)
  createVendor(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/set-vendor`, data);
  }

  //Update a vendor
  updateVendor(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/update-vendor/${id}`, data);
  }

  //Delete a vendor
  deleteVendor(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete-vendor/${id}`);
  }
}
