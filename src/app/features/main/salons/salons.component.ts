import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, finalize, map, switchMap, tap } from 'rxjs';
import { SalonDialogComponent } from './components/salon-dialog/salon-dialog.component';
import { ConfirmationService } from '../../../services/confirmation.service';
import { Salon } from '../../../shared/models/salon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { ApiService } from '../../../services/api.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-salons',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatChipsModule,
    MatMenuModule,
    MatCheckboxModule,
    LucideAngularModule
  ],
  templateUrl: './salons.component.html',
  styleUrl: './salons.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SalonsComponent {

  private readonly apiService = inject(ApiService);
  isLoading = signal(true);
  data: any[] = [];
  skeletonData: any[] = Array.from({ length: 10 });

  // Selection model for multi-select
  selection = new SelectionModel<Salon>(true, []);

  private readonly refreshTrigger$ = new BehaviorSubject<void>(undefined);

  // Use signal for salons data
  salons = toSignal<Salon[]>(this.refreshTrigger$.pipe(
    switchMap(() => this.apiService.getSalons().pipe(
      map((data) => data.data),
      tap((data) => {
        this.data = data;
        this.isLoading.set(false);
        this.selection.clear(); // Clear selection on refresh
      }),

    )),
    finalize(() => this.isLoading.set(false))
  ));

  displayedColumns: string[] = ['select', 'name', 'address', 'owner', 'contact', 'rating', 'status', 'actions'];

  constructor(
    private dialog: MatDialog,
    private confirmationService: ConfirmationService
  ) { }

  // Check if all rows are selected
  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.data.length;
    return numSelected === numRows && numRows > 0;
  }

  // Toggle all rows selection
  toggleAllRows(): void {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.selection.select(...this.data);
    }
  }

  // Check if some (but not all) rows are selected
  isSomeSelected(): boolean {
    return this.selection.selected.length > 0 && !this.isAllSelected();
  }

  // Delete selected salons
  deleteSelectedSalons(): void {
    const selectedSalons = this.selection.selected;
    if (selectedSalons.length === 0) return;

    this.confirmationService.confirm({
      title: 'Delete Selected Salons',
      message: `Are you sure you want to delete ${selectedSalons.length} salon(s)? This action cannot be undone.`,
      confirmText: 'Delete All',
      type: 'danger'
    }).subscribe(confirmed => {
      if (confirmed) {
        this.isLoading.set(true);
        const ids = selectedSalons.map(salon => salon.id);
        this.apiService.deleteMultipleSalons(ids).subscribe({
          next: () => {
            this.refreshTrigger$.next();
          },
          error: (err) => {
            console.error('Error deleting salons', err);
            this.isLoading.set(false);
          }
        });
      }
    });
  }

  // Helper to parse services JSON if needed, though we might not show it in the table
  parseServices(servicesJson: string): string[] {
    try {
      return JSON.parse(servicesJson);
    } catch (e) {
      return [];
    }
  }

  openSalonDialog(salon?: Salon, panelClass: string = 'dialog-lg') {
    const dialogRef = this.dialog.open(SalonDialogComponent, {
      data: salon,
      panelClass: panelClass
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.isLoading.set(true);
        if (salon) {
          this.apiService.updateSalon(salon.id, result).subscribe({
            next: () => {
              this.refreshTrigger$.next();
            },
            error: (err) => {
              console.error('Error updating salon', err);
              this.isLoading.set(false);
            }
          });
        } else {
          this.apiService.addSalon(result).subscribe({
            next: () => {
              this.refreshTrigger$.next();
            },
            error: (err) => {
              console.error('Error adding salon', err);
              this.isLoading.set(false);
            }
          });
        }
      }
    });
  }

  toggleStatus(salon: Salon) {
    const newStatus = salon.is_active === 1 ? 0 : 1;
    const action = newStatus === 1 ? 'activate' : 'deactivate';

    this.confirmationService.confirm({
      title: `${action === 'activate' ? 'Activate' : 'Deactivate'} Salon`,
      message: `Are you sure you want to ${action} ${salon.name}?`,
      confirmText: action === 'activate' ? 'Activate' : 'Deactivate',
      type: action === 'activate' ? 'info' : 'danger'
    }).subscribe(confirmed => {
      if (confirmed) {
        this.apiService.updateSalon(salon.id, { is_active: newStatus }).subscribe({
          next: () => {
            this.refreshTrigger$.next();
          }
        });
      }
    });
  }

  editSalon(salon: Salon) {
    this.openSalonDialog(salon);
  }

  deleteSalon(salon: Salon) {
    this.confirmationService.confirm({
      title: 'Delete Salon',
      message: `Are you sure you want to delete ${salon.name}? This action cannot be undone.`,
      confirmText: 'Delete',
      type: 'danger'
    }).subscribe(confirmed => {
      if (confirmed) {
        this.isLoading.set(true);
        this.apiService.deleteSalon(salon.id).subscribe({
          next: () => {
            this.refreshTrigger$.next();
          },
          error: (err) => {
            console.error('Error deleting salon', err);
            this.isLoading.set(false);
          }
        });
      }
    });
  }
}
