import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, map, of, startWith } from 'rxjs';
import { SideCartComponent } from './components/side-cart/side-cart.component';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../core/auth/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { LoginDialogComponent } from '../../features/auth/components/login-dialog/login-dialog.component';
import { MatMenuModule } from '@angular/material/menu';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink, LucideAngularModule, SideCartComponent, MatMenuModule],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss'
})
export class HomeComponent {
    private apiService = inject(ApiService);
    private fb = inject(FormBuilder);
    authService = inject(AuthService);
    dialog = inject(MatDialog);

    currentLocation = signal<string>('Detecting location...');

    constructor() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const { latitude, longitude } = pos.coords;
                    this.apiService.getReverseGeocoding(latitude, longitude).subscribe({
                        next: (res: any) => {
                            const city = res.city || res.locality || res.principalSubdivision || 'Unknown Location';
                            this.currentLocation.set(city);
                        },
                        error: () => {
                            this.currentLocation.set('Location Unavailable');
                        }
                    });
                },
                (err) => {
                    console.error('Geolocation error:', err);
                    this.currentLocation.set('Location Permission Denied');
                }
            );
        } else {
            this.currentLocation.set('Geolocation Not Supported');
        }
    }

    openLoginDialog() {
        this.dialog.open(LoginDialogComponent, {
            width: '400px',
            disableClose: true,
            panelClass: 'custom-dialog-container'
        });
    }

    logout() {
        this.authService.logout();
    }

    searchControl = this.fb.control('');
    cityControl = this.fb.control('');

    // Signals for form controls
    private searchControlValue = toSignal(this.searchControl.valueChanges.pipe(startWith('')), { initialValue: '' });
    private cityControlValue = toSignal(this.cityControl.valueChanges.pipe(startWith('')), { initialValue: '' });

    cities = toSignal(this.apiService.getCities().pipe(
        map((res: any) => (res.data || []) as any[]),
        catchError(() => of([] as any[]))
    ), { initialValue: [] as any[] });

    salons = toSignal(this.apiService.getSalons().pipe(
        map((res: any) => (res.data || []) as any[]),
        catchError(() => of([] as any[]))
    ), { initialValue: [] as any[] });

    // Computed filtered salons based on search and city controls
    filteredSalons = computed(() => {
        const salons = this.salons();
        const cityId = this.cityControlValue();
        const searchTerm = (this.searchControlValue() || '').toLowerCase();

        if (!salons) return [];

        return salons.filter((salon: any) => {
            const matchesCity = cityId ? salon.city_id === cityId : true;
            const matchesSearch = !searchTerm ||
                salon.name.toLowerCase().includes(searchTerm) ||
                salon.address.toLowerCase().includes(searchTerm);
            return matchesCity && matchesSearch;
        });
    });
}
