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

  updateSalon(id: number | string, data: any): Observable<any> {
    return this.http.put(this.adminApiUrl + `/salons/${id}`, data);
  }

  deleteSalon(id: number | string): Observable<any> {
    return this.http.delete(this.adminApiUrl + `/salons/${id}`);
  }

  deleteMultipleSalons(ids: (number | string)[]): Observable<any> {
    return this.http.post(this.adminApiUrl + '/salons/bulk-delete', { ids });
  }

  // City APIs
  getCities(): Observable<any> {
    return this.http.get(this.adminApiUrl + '/city');
  }

  addCity(data: any): Observable<any> {
    return this.http.post(this.adminApiUrl + '/city', data);
  }

  updateCity(id: number | string, data: any): Observable<any> {
    return this.http.put(this.adminApiUrl + `/city/${id}`, data);
  }

  activateCity(id: number | string): Observable<any> {
    return this.http.put(this.adminApiUrl + `/city/activate/${id}`, {});
  }

  deactivateCity(id: number | string): Observable<any> {
    return this.http.put(this.adminApiUrl + `/city/deactivate/${id}`, {});
  }

  deleteCity(id: number | string): Observable<any> {
    return this.http.delete(this.adminApiUrl + `/city/${id}`);
  }
}
