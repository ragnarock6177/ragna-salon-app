import { Component, inject, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { ApiService } from '../../../services/api.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-all-salons',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule, ReactiveFormsModule],
  templateUrl: './all-salons.component.html',
  styleUrl: './all-salons.component.scss'
})
export class AllSalonsComponent {
  private apiService = inject(ApiService);

  salons = signal<any[]>([]);
  cities = signal<any[]>([]);
  isLoading = signal(true);

  searchControl = new FormControl('');
  cityControl = new FormControl('');

  // Filtered salons based on search and city
  filteredSalons = computed(() => {
    let filtered = this.salons();

    const searchTerm = this.searchControl.value?.toLowerCase() || '';
    const selectedCity = this.cityControl.value || '';

    if (searchTerm) {
      filtered = filtered.filter(salon =>
        salon.name.toLowerCase().includes(searchTerm) ||
        salon.description?.toLowerCase().includes(searchTerm)
      );
    }

    if (selectedCity) {
      filtered = filtered.filter(salon => salon.city_id === selectedCity);
    }

    return filtered;
  });

  constructor() {
    this.loadData();

    // Search debounce
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => {
      // Trigger recomputation
    });
  }

  loadData() {
    this.isLoading.set(true);

    // Load cities
    this.apiService.getCities().subscribe({
      next: (response: any) => {
        // Handle both array and object responses
        const citiesData = Array.isArray(response) ? response : (response.data || []);
        this.cities.set(citiesData);
      },
      error: (err) => {
        console.error('Error loading cities:', err);
        this.cities.set([]);
      }
    });

    // Load all salons
    this.apiService.getSalons().subscribe({
      next: (response: any) => {
        // Handle both array and object responses
        const salonsData = Array.isArray(response) ? response : (response.data || []);
        this.salons.set(salonsData);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading salons:', err);
        this.salons.set([]);
        this.isLoading.set(false);
      }
    });
  }

  selectCity(cityId: string) {
    this.cityControl.setValue(cityId);
  }

  // Helper method to safely get services array
  getServices(salon: any): string[] {
    if (!salon.services) return [];
    if (Array.isArray(salon.services)) return salon.services;
    try {
      return JSON.parse(salon.services);
    } catch {
      return [];
    }
  }
}
