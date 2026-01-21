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

  // Salon Details APIs
  getSalon(id: number | string): Observable<any> {
    return this.http.get(this.adminApiUrl + `/salons/${id}`);
  }

  uploadSingle(file: File, salonId?: number | string, salonName?: string): Observable<any> {
    const formData = new FormData();
    formData.append('image', file);
    if (salonId) {
      formData.append('salon_id', salonId.toString());
    }
    if (salonName) {
      formData.append('salon_name', salonName);
    }
    return this.http.post(this.adminApiUrl + '/upload/single', formData);
  }

  uploadMultiple(files: File[], salonId?: number | string, salonName?: string): Observable<any> {
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));
    if (salonId) {
      formData.append('salon_id', salonId.toString());
    }
    if (salonName) {
      formData.append('salon_name', salonName);
    }
    return this.http.post(this.adminApiUrl + '/upload/multiple', formData);
  }

  uploadSalonImage(salonId: number | string, image: File): Observable<any> {
    const formData = new FormData();
    formData.append('image', image);
    return this.http.post(this.adminApiUrl + `/salons/${salonId}/images`, formData);
  }

  uploadSalonLogo(salonId: number | string, image: File): Observable<any> {
    const formData = new FormData();
    formData.append('image', image); // Assuming backend expects 'image' key for logo as well, or 'logo'? Usually standardized.
    // Use specific endpoint for logo if exists, otherwise assume generic update or specific route
    return this.http.post(this.adminApiUrl + `/salons/${salonId}/logo`, formData);
  }

  deleteSalonImage(salonId: number | string, imageUrl: string): Observable<any> {
    return this.http.post(this.adminApiUrl + '/upload/delete', { salon_id: salonId, image_url: imageUrl });
  }

  // Coupon APIs
  getCoupons(salonId: number | string): Observable<any> {
    return this.http.get(this.adminApiUrl + `/coupons/${salonId}`);
  }

  addCoupon(salonId: number | string, data: any): Observable<any> {
    return this.http.post(this.adminApiUrl + `/coupons/${salonId}`, data);
  }

  updateCoupon(id: number | string, data: any): Observable<any> {
    return this.http.put(this.adminApiUrl + `/coupons/${id}`, data);
  }

  deleteCoupon(id: number | string): Observable<any> {
    return this.http.delete(this.adminApiUrl + `/coupons/${id}`);
  }

  // QR Code API
  generateQrCode(salonId: number | string): Observable<any> {
    return this.http.get(this.adminApiUrl + `/salons/${salonId}/qrcode`);
  }

  // Utilities
  getReverseGeocoding(lat: number, lng: number): Observable<any> {
    // using free API for demo purposes
    return this.http.get(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`);
  }
}
