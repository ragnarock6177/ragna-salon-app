import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { LucideAngularModule } from 'lucide-angular';
import { catchError, finalize, of, switchMap, tap } from 'rxjs';
import { ApiService } from '../../../../../services/api.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Salon } from '../../../../../shared/models/salon';
import { Coupon } from '../../../../../shared/models/coupon';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { CouponDialogComponent } from '../../components/coupon-dialog/coupon-dialog.component';
import { formatDate } from '@angular/common';
import { QrDialogComponent } from '../../components/qr-dialog/qr-dialog.component';

@Component({
  selector: 'app-salon-details',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatChipsModule,
    MatSelectModule,
    MatSelectModule,
    LucideAngularModule,
    RouterLink
  ],
  templateUrl: './salon-details.component.html',
  styleUrl: './salon-details.component.scss'
})
export class SalonDetailsComponent {
  private fb = inject(FormBuilder);
  private apiService = inject(ApiService);
  private snackBar = inject(MatSnackBar);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private dialog = inject(MatDialog);

  salon = signal<Salon | null>(null);
  coupons = signal<Coupon[]>([]);
  isLoading = signal(false);
  isSaving = signal(false);
  activeTab = signal(0);

  form: FormGroup;

  constructor() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      owner_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      rating: [''],
      total_reviews: [''],
      opening_time: [''],
      closing_time: [''],
      is_active: [false]
    });

    this.route.params.subscribe(params => {
      if (params['id']) {
        this.loadSalonDetails(params['id']);
        this.loadCoupons(params['id']);
      }
    });
  }

  patchForm(salon: Salon) {
    this.form.patchValue({
      name: salon.name,
      owner_name: salon.owner_name,
      email: salon.email,
      phone: salon.phone,
      address: salon.address,
      rating: salon.rating,
      total_reviews: salon.total_reviews,
      opening_time: salon.opening_time,
      closing_time: salon.closing_time,
      is_active: salon.is_active === 1
    });
  }

  loadSalonDetails(id: number) {
    this.isLoading.set(true);
    this.apiService.getSalon(id).pipe(
      tap((res: any) => {
        if (res.data) {
          this.salon.set(res.data);
          this.patchForm(res.data);
        }
      }),
      finalize(() => this.isLoading.set(false))
    ).subscribe();
  }

  loadCoupons(salonId: number) {
    this.apiService.getCoupons(salonId).pipe(
      catchError(() => of({ data: [] })),
      tap((res: any) => this.coupons.set(res.data || []))
    ).subscribe();
  }

  saveDetails() {
    if (this.form.invalid || !this.salon()) return;

    this.isSaving.set(true);
    const updates = {
      ...this.form.value,
      is_active: this.form.value.is_active ? 1 : 0
    };

    this.apiService.updateSalon(this.salon()!.id, updates).pipe(
      tap(() => {
        this.snackBar.open('Salon updated successfully', 'Close', { duration: 3000 });
        this.router.navigate(['/salons']);
      }),
      catchError(err => {
        this.snackBar.open('Error updating salon', 'Close', { duration: 3000 });
        console.error(err);
        return of(null);
      }),
      finalize(() => this.isSaving.set(false))
    ).subscribe();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    const salon = this.salon();
    if (file && salon) {
      this.apiService.uploadSingle(file, salon.id).pipe(
        switchMap((res: any) => {
          // Assuming response has { url: '...' }
          const newUrl = res.url || res.data; // adjust based on actual API response
          const updatedImages = [...salon.images, newUrl];
          return this.apiService.updateSalon(salon.id, { images: updatedImages });
        })
      ).subscribe({
        next: () => {
          this.snackBar.open('Image uploaded', 'Close', { duration: 3000 });
          this.loadSalonDetails(salon.id);
        },
        error: () => this.snackBar.open('Upload failed', 'Close', { duration: 3000 })
      });
    }
  }

  onLogoSelected(event: any) {
    const file = event.target.files[0];
    const salon = this.salon();
    if (file && salon) {
      this.apiService.uploadSingle(file, salon.id).pipe(
        switchMap((res: any) => {
          const newUrl = res.url || res.data;
          return this.apiService.updateSalon(salon.id, { logo: newUrl });
        })
      ).subscribe({
        next: () => {
          this.snackBar.open('Logo uploaded successfully', 'Close', { duration: 3000 });
          this.loadSalonDetails(salon.id);
        },
        error: () => this.snackBar.open('Logo upload failed', 'Close', { duration: 3000 })
      });
    }
  }

  deleteImage(imageId: number) {
    // Implement delete logic if backend supports it
  }

  openCouponDialog() {
    const dialogRef = this.dialog.open(CouponDialogComponent, {
      width: '600px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Map payload
        const payload = {
          code: result.code,
          description: result.description,
          type: result.type,
          discount: result.discount,
          min_order_amount: result.min_order_amount, // Optional in new payload? keeping strictly to logic if not specified
          // New payload requests: code, discount, type, description, valid_from, valid_to, max_usage, status
          valid_from: result.valid_from ? formatDate(result.valid_from, 'yyyy-MM-dd', 'en-US') : null,
          valid_to: result.valid_to ? formatDate(result.valid_to, 'yyyy-MM-dd', 'en-US') : null,
          max_usage: result.max_usage,
          status: result.status // 'active' or 'inactive'
        };

        this.apiService.addCoupon(this.salon()!.id, payload).subscribe({
          next: () => {
            this.snackBar.open('Coupon added', 'Close', { duration: 3000 });
            this.loadCoupons(this.salon()!.id);
          },
          error: () => this.snackBar.open('Failed to add coupon', 'Close', { duration: 3000 })
        });
      }
    });
  }

  toggleCouponStatus(coupon: Coupon) {
    const newStatus = coupon.is_active ? 0 : 1;
    this.apiService.updateCoupon(coupon.id, { is_active: newStatus }).subscribe(() => {
      this.loadCoupons(this.salon()!.id);
    });
  }

  deleteCoupon(id: number) {
    if (confirm('Are you sure you want to delete this coupon?')) {
      this.apiService.deleteCoupon(id).subscribe(() => {
        this.loadCoupons(this.salon()!.id);
      });
    }
  }

  generateQr() {
    if (!this.salon()) return;

    this.apiService.generateQrCode(this.salon()!.id).subscribe({
      next: (res: any) => {
        const qrUrl = res.data || res.url;
        if (qrUrl) {
          this.dialog.open(QrDialogComponent, {
            data: {
              qrUrl: qrUrl,
              salonName: this.salon()?.name
            },
            width: '400px'
          });
        } else {
          this.snackBar.open('Failed to generate QR code', 'Close', { duration: 3000 });
        }
      },
      error: () => this.snackBar.open('Failed to generate QR code', 'Close', { duration: 3000 })
    });
  }
}
