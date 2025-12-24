import { Component, inject, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, map, Subscription, switchMap, tap } from 'rxjs';
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
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { ApiService } from '../../../services/api.service';
import { toSignal } from '@angular/core/rxjs-interop';

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
    LucideAngularModule
  ],
  templateUrl: './salons.component.html',
  styleUrl: './salons.component.scss',
})
export class SalonsComponent {

  private readonly apiService = inject(ApiService);
  isLoading = signal(true);
  data: any[] = [];
  skeletonData: any[] = Array.from({ length: 10 });

  private readonly refreshTrigger$ = new BehaviorSubject<void>(undefined);

  // Use signal for salons data
  salons = toSignal<Salon[]>(this.refreshTrigger$.pipe(
    switchMap(() => this.apiService.getSalons().pipe(
      map((data) => data.data),
      tap((data) => {
        console.log(data)
        this.data = data
        this.isLoading.set(false);
      })
    ))
  ));

  displayedColumns: string[] = ['name', 'address', 'owner', 'contact', 'rating', 'status', 'actions'];

  constructor(
    private dialog: MatDialog,
    private confirmationService: ConfirmationService
  ) { }

  // Helper to parse services JSON if needed, though we might not show it in the table
  parseServices(servicesJson: string): string[] {
    try {
      return JSON.parse(servicesJson);
    } catch (e) {
      return [];
    }
  }

  openSalonDialog(salon?: Salon) {
    const dialogRef = this.dialog.open(SalonDialogComponent, {
      data: salon,
      width: '800px',
      maxWidth: '95vw',
      panelClass: 'custom-dialog-container'
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
        // Call API to update status
        console.log(`Updating status for ${salon.id} to ${newStatus}`);
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
        console.log('Delete salon', salon.id);
      }
    });
  }
}
