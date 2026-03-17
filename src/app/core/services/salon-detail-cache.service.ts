import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SalonDetailCacheService {
  private readonly salonStore = signal<Record<string, any>>({});
  private readonly couponStore = signal<Record<string, any[]>>({});

  getSalon(id: string): any | null {
    return this.salonStore()[id] ?? null;
  }

  setSalon(id: string, salon: any): void {
    this.salonStore.update((store) => ({ ...store, [id]: salon }));
  }

  hasSalon(id: string): boolean {
    return id in this.salonStore();
  }

  getCoupons(id: string): any[] {
    return this.couponStore()[id] ?? [];
  }

  setCoupons(id: string, coupons: any[]): void {
    this.couponStore.update((store) => ({ ...store, [id]: coupons }));
  }

  hasCoupons(id: string): boolean {
    return id in this.couponStore();
  }
}
