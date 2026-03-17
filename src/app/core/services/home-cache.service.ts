import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class HomeCacheService {
  private readonly salonsSignal = signal<any[]>([]);
  private readonly citiesSignal = signal<any[]>([]);
  private readonly salonsLoadedSignal = signal(false);
  private readonly citiesLoadedSignal = signal(false);

  getSalons(): any[] {
    return this.salonsSignal();
  }

  getCities(): any[] {
    return this.citiesSignal();
  }

  setSalons(data: any[]): void {
    this.salonsSignal.set(data);
    this.salonsLoadedSignal.set(true);
  }

  setCities(data: any[]): void {
    this.citiesSignal.set(data);
    this.citiesLoadedSignal.set(true);
  }

  hasSalons(): boolean {
    return this.salonsLoadedSignal();
  }

  hasCities(): boolean {
    return this.citiesLoadedSignal();
  }
}
