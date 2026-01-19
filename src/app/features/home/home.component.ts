import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, map, of, startWith } from 'rxjs';
import { SideCartComponent } from './components/side-cart/side-cart.component';
import { ApiService } from '../../services/api.service';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink, LucideAngularModule, SideCartComponent],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss'
})
export class HomeComponent {
    private apiService = inject(ApiService);
    private fb = inject(FormBuilder);

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
