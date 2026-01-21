import { Component, inject, signal, computed } from '@angular/core';
import { provideNativeDateAdapter } from '@angular/material/core';
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
import { MatTimepickerModule } from '@angular/material/timepicker';
import { ConfirmationService } from '../../../../../services/confirmation.service';
import { ImageCompressionService } from '../../../../../services/image-compression.service';
import { ImagePreviewDialogComponent } from '../image-preview-dialog/image-preview-dialog.component';

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
    MatTimepickerModule,
    LucideAngularModule,
    RouterLink
  ],
  templateUrl: './salon-details.component.html',
  styleUrl: './salon-details.component.scss',
  providers: [provideNativeDateAdapter()]
})
export class SalonDetailsComponent {
  private fb = inject(FormBuilder);
  private apiService = inject(ApiService);
  private snackBar = inject(MatSnackBar);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private confirmationService = inject(ConfirmationService);
  private imageCompressionService = inject(ImageCompressionService);

  salon = signal<Salon | null>(null);
  coupons = signal<Coupon[]>([]);
  isLoading = signal(false);
  isSaving = signal(false);
  activeTab = signal(0);

  form: FormGroup;

  get isActiveControl() {
    return this.form.get('is_active') as any;
  }

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

  private parseTime(time: string | undefined | null): Date | null {
    if (!time) return null;
    const [hours, minutes, seconds] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(hours || 0);
    date.setMinutes(minutes || 0);
    date.setSeconds(seconds || 0);
    return date;
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
      opening_time: this.parseTime(salon.opening_time),
      closing_time: this.parseTime(salon.closing_time),
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

  private formatTime(date: Date): string | null {
    if (!date) return null;
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:00`;
  }

  saveDetails() {
    if (this.form.invalid || !this.salon()) return;

    this.isSaving.set(true);
    const formValue = this.form.value;

    const updates = {
      ...formValue,
      opening_time: formValue.opening_time instanceof Date ? this.formatTime(formValue.opening_time) : formValue.opening_time,
      closing_time: formValue.closing_time instanceof Date ? this.formatTime(formValue.closing_time) : formValue.closing_time,
      is_active: formValue.is_active ? 1 : 0
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

  async onFileSelected(event: any) {
    const file = event.target.files[0];
    const salon = this.salon();
    if (file && salon) {
      this.isLoading.set(true);
      try {
        const compressedFile = await this.imageCompressionService.compressImage(file);
        this.apiService.uploadSingle(compressedFile, salon.id, salon.name).subscribe({
          next: () => {
            this.snackBar.open('Image uploaded', 'Close', { duration: 3000 });
            this.loadSalonDetails(salon.id);
            this.isLoading.set(false);
          },
          error: () => {
            this.snackBar.open('Upload failed', 'Close', { duration: 3000 });
            this.isLoading.set(false);
          }
        });
      } catch (error) {
        console.error('Compression or upload error:', error);
        this.isLoading.set(false);
        this.snackBar.open('Upload failed', 'Close', { duration: 3000 });
      }
    }
  }

  async onLogoSelected(event: any) {
    const file = event.target.files[0];
    const salon = this.salon();
    if (file && salon) {
      this.isLoading.set(true);
      try {
        const compressedFile = await this.imageCompressionService.compressImage(file);
        this.apiService.uploadSingle(compressedFile, salon.id, salon.name).pipe(
          switchMap((res: any) => {
            const newUrl = res.url || res.data;
            return this.apiService.updateSalon(salon.id, { logo: newUrl });
          })
        ).subscribe({
          next: () => {
            this.snackBar.open('Logo uploaded successfully', 'Close', { duration: 3000 });
            this.loadSalonDetails(salon.id);
            this.isLoading.set(false);
          },
          error: () => {
            this.snackBar.open('Logo upload failed', 'Close', { duration: 3000 });
            this.isLoading.set(false);
          }
        });
      } catch (error) {
        console.error('Compression or upload error:', error);
        this.isLoading.set(false);
        this.snackBar.open('Logo upload failed', 'Close', { duration: 3000 });
      }
    }
  }

  deleteImage(img: any) {
    const salon = this.salon();
    if (!salon || !img) return;

    this.confirmationService.confirm({
      title: 'Delete Image',
      message: 'Are you sure you want to delete this image?',
      confirmText: 'Delete',
      type: 'danger'
    }).subscribe(confirmed => {
      if (confirmed) {
        // User requested to use image URL for deletion
        const imageUrl = img.image_url;

        if (imageUrl) {
          this.apiService.deleteSalonImage(salon.id, imageUrl).subscribe({
            next: () => {
              this.snackBar.open('Image deleted', 'Close', { duration: 3000 });
              this.loadSalonDetails(salon.id);
            },
            error: () => this.snackBar.open('Failed to delete image', 'Close', { duration: 3000 })
          });
        } else {
          console.error('Image object missing URL', img);
          this.snackBar.open('Cannot delete image: Missing URL', 'Close', { duration: 3000 });
        }
      }
    });
  }

  openImagePreview(imageUrl: string) {
    if (!imageUrl) return;
    this.dialog.open(ImagePreviewDialogComponent, {
      data: { imageUrl },
      maxWidth: '95vw',
      maxHeight: '95vh',
      panelClass: 'image-preview-dialog-container',
      backdropClass: 'image-preview-backdrop'
    });
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
