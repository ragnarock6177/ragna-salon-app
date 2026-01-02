import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationService } from '../../../services/confirmation.service';
import { ApiService } from '../../../services/api.service';
import { City } from '../../../shared/models/city';
import { CityDialogComponent } from './city-dialog/city-dialog.component';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-city',
  imports: [CommonModule, LucideAngularModule, MatButtonModule],
  templateUrl: './city.component.html',
  styleUrl: './city.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CityComponent {
  cities: City[] = [];
  displayedCities: City[] = [];
  filter: 'all' | 'active' = 'all';
  search = '';
  loading = false;

  private itemsPerLoad = 10;
  private currentLoadedCount = 0;

  constructor(
    private apiService: ApiService,
    private dialog: MatDialog,
    private confirmationService: ConfirmationService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.refreshCities();
  }

  refreshCities() {
    this.loading = true;
    this.apiService.getCities().subscribe({
      next: (cities) => {
        this.cities = cities.data;
        this.loading = false;
        this.loadInitialCities();
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Failed to load cities', err);
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  loadInitialCities(): void {
    const filteredList = this.filtered;
    this.currentLoadedCount = Math.min(this.itemsPerLoad, filteredList.length);
    this.displayedCities = filteredList.slice(0, this.currentLoadedCount);
  }

  loadMoreCities(): void {
    if (this.currentLoadedCount >= this.filtered.length) {
      return;
    }

    const nextCount = Math.min(
      this.currentLoadedCount + this.itemsPerLoad,
      this.filtered.length
    );
    this.displayedCities = this.filtered.slice(0, nextCount);
    this.currentLoadedCount = nextCount;
  }

  onScroll(event: any): void {
    const element = event.target;
    const atBottom = element.scrollHeight - element.scrollTop <= element.clientHeight + 50;

    if (atBottom) {
      this.loadMoreCities();
    }
  }

  openDialog(data: { city?: City }): void {
    const dialogRef = this.dialog.open(CityDialogComponent, {
      width: '500px',
      maxWidth: '90vw',
      data: data,
      panelClass: 'custom-dialog-container',
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.refreshCities();
      }
    });
  }

  get filtered() {
    let list = this.cities;
    if (this.filter === 'active') {
      list = list.filter(c => c.is_active === 1);
    }
    if (this.search) {
      const kw = this.search.toLowerCase();
      list = list.filter(c => c.name.toLowerCase().includes(kw));
    }
    return list;
  }

  openAdd() {
    this.openDialog({});
  }

  edit(city: City) {
    if (city) {
      this.openDialog({ city });
    }
  }

  delete(city: City) {
    if (!city) return;
    this.confirmationService.confirm({
      title: 'Delete City',
      message: `Are you sure you want to delete ${city.name}? This action cannot be undone.`,
      confirmText: 'Delete',
      type: 'danger'
    }).subscribe(confirmed => {
      if (confirmed && city.id) {
        this.apiService.deleteCity(city.id).subscribe({
          next: () => this.refreshCities(),
          error: (err) => console.error('Delete failed', err)
        });
      }
    });
  }

  toggleStatus(city: City) {
    if (!city || !city.id) return;

    const previousStatus = city.is_active;
    const newStatus = city.is_active === 1 ? 0 : 1;

    // Optimistic update
    city.is_active = newStatus;
    this.cdr.markForCheck();

    const apiCall = newStatus
      ? this.apiService.activateCity(city.id)
      : this.apiService.deactivateCity(city.id);

    apiCall.subscribe({
      next: () => {
        this.cdr.markForCheck();
      },
      error: () => {
        // Revert on error
        city.is_active = previousStatus;
        this.cdr.markForCheck();
      }
    });
  }

  getOriginalIndex(displayedIndex: number): number {
    const city = this.displayedCities[displayedIndex];
    return this.cities.findIndex(c => c === city);
  }

  getInitials(city: City): string {
    return city.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  }
}
