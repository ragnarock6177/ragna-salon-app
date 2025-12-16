import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly adminApiUrl = environment.apiUrl;

  getSalons(): Observable<any> {
    return this.http.get(this.adminApiUrl + '/salons');
  }

  addSalon(data: any): Observable<any> {
    return this.http.post(this.adminApiUrl + '/salons', data);
  }

  updateSalon(id: number, data: any): Observable<any> {
    return this.http.put(this.adminApiUrl + `/salons/${id}`, data);
  }

  getCities(): Observable<any> {
    return this.http.get(this.adminApiUrl + '/city');
  }
}
