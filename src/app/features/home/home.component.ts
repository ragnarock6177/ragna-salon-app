import { Component, inject, signal, computed, effect, untracked, ElementRef, ViewChild, HostListener, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, map, of, startWith, tap } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../core/auth/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { LoginDialogComponent } from '../../features/auth/components/login-dialog/login-dialog.component';
import { MatMenuModule } from '@angular/material/menu';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink, LucideAngularModule, MatMenuModule],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
    private apiService = inject(ApiService);
    private fb = inject(FormBuilder);
    authService = inject(AuthService);
    dialog = inject(MatDialog);

    @ViewChild('cityDropdownContainer') cityDropdownContainer!: ElementRef;

    currentLocation = signal<string>('Detecting location...');

    constructor() {
        this.getLocation();

        // Auto-select city based on location
        effect(() => {
            const currentLoc = this.currentLocation().toLowerCase();
            const cities = this.cities();

            if (!currentLoc || currentLoc.includes('detecting') || currentLoc.includes('unavailable') || !cities.length) {
                return;
            }

            const matchedCity = cities.find((city: any) =>
                city.name.toLowerCase() === currentLoc ||
                currentLoc.includes(city.name.toLowerCase())
            );

            if (matchedCity) {
                untracked(() => {
                    // Only select if not already selected (optional, but cleaner)
                    if (this.cityControl.value !== matchedCity.id) {
                        this.selectCity(matchedCity.id);
                    }
                });
            }
        });
    }

    getLocation() {
        if (!navigator.geolocation) {
            this.currentLocation.set('Geolocation Not Supported');
            return;
        }

        this.currentLocation.set('Detecting location...');

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
                // If denied, we set a message. Clicking this message (via the template binding we will add) will call this function again.
                this.currentLocation.set('Enable Location');
            },
            { timeout: 10000 }
        );
    }

    openLoginDialog() {
        this.dialog.open(LoginDialogComponent, {
            maxWidth: '95vw',
            width: 'auto',
            disableClose: false,
            panelClass: 'login-dialog-container'
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

    isLoading = signal(true);

    cities = toSignal(this.apiService.getCities().pipe(
        map((res: any) => (res.data || []) as any[]),
        catchError(() => of([] as any[]))
    ), { initialValue: [] as any[] });

    salons = toSignal(this.apiService.getSalons().pipe(
        map((res: any) => (res.data || []) as any[]),
        tap(() => this.isLoading.set(false)),
        catchError(() => {
            this.isLoading.set(false);
            return of([] as any[]);
        })
    ), { initialValue: [] as any[] });

    // Custom Dropdown State
    isCityDropdownOpen = signal(false);

    toggleCityDropdown() {
        this.isCityDropdownOpen.update(v => !v);
    }

    selectCity(cityId: any) {
        this.cityControl.setValue(cityId);
        this.isCityDropdownOpen.set(false);
    }

    get selectedCityName() {
        const cityId = this.cityControlValue();
        if (!cityId) return 'All Cities';
        const city = this.cities().find((c: any) => c.id === cityId);
        return city ? city.name : 'All Cities';
    }

    @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent) {
        if (this.isCityDropdownOpen() && this.cityDropdownContainer && !this.cityDropdownContainer.nativeElement.contains(event.target)) {
            this.isCityDropdownOpen.set(false);
        }
    }

    // Computed filtered salons based on search and city controls
    filteredSalons = computed(() => {
        const salons = this.salons();
        const cityId = this.cityControlValue();
        const searchTerm = (this.searchControlValue() || '').toLowerCase();

        if (!salons) return [];

        return salons.filter((salon: any) => {
            const matchesCity = cityId ? salon.city_id == cityId : true;
            const matchesSearch = !searchTerm ||
                salon.name.toLowerCase().includes(searchTerm) ||
                salon.address.toLowerCase().includes(searchTerm);
            return matchesCity && matchesSearch;
        });
    });

    // Categories for filter chips
    categories = [
        { id: 'hair', name: 'Hair', icon: 'scissors' },
        { id: 'spa', name: 'Spa', icon: 'sparkles' },
        { id: 'nails', name: 'Nails', icon: 'hand' },
        { id: 'makeup', name: 'Makeup', icon: 'palette' },
        { id: 'skincare', name: 'Skincare', icon: 'droplet' },
    ];

    selectedCategory = signal<string>('all');

    // Displayed salons (limited for featured section)
    displayedSalons = computed(() => {
        const salons = this.filteredSalons();
        // Return first 8 for featured section
        return salons.slice(0, 8);
    });
}
