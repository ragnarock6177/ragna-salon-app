import { Component, inject, ChangeDetectionStrategy, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService, User } from '../../../core/auth/auth.service';
import { LucideAngularModule } from 'lucide-angular';
import { ApiService } from '../../../services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { ScannerDialogComponent } from '../components/scanner-dialog/scanner-dialog.component';
import { RedemptionSuccessDialogComponent } from '../components/redemption-success-dialog/redemption-success-dialog.component';
import { RedemptionProcessingDialogComponent } from '../components/redemption-processing-dialog/redemption-processing-dialog.component';
import { finalize } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent {
  authService = inject(AuthService);
  private apiService = inject(ApiService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  user = computed(() => this.authService.currentUser() as User | null);

  purchasedCoupons = signal<any[]>([]);

  // Computed signals for filtering coupons by status
  activeCoupons = computed(() =>
    this.purchasedCoupons().filter(c => c.purchase_status === 'active')
  );

  usedCoupons = computed(() =>
    this.purchasedCoupons().filter(c => c.purchase_status === 'redeemed')
  );

  effectRef = effect(() => {
    const userId = this.authService.currentUser()?.id;
    if (userId) {
      this.loadPurchases(userId);
    }
  });

  loadPurchases(userId: string) {
    this.apiService.getCustomerPurchases(userId).subscribe({
      next: (res: any) => {
        this.purchasedCoupons.set(res.data);
      }
    });
  }

  redeemCoupon(coupon: any) {
    const dialogRef = this.dialog.open(ScannerDialogComponent, {
      width: '100%',
      maxWidth: '480px',
      panelClass: 'custom-dialog-container',
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        try {
          // Expected format: { "type": "salon", "id": 12, "name": "Salon Name" }
          const data = JSON.parse(result);

          if (data.type === 'salon' && data.id && data.name) {
            this.processRedemption(coupon, data);
          } else {
            this.snackBar.open('Invalid QR Code. Please scan a valid Salon QR.', 'Close', { duration: 3000 });
          }
        } catch (e) {
          console.error(e);
          this.snackBar.open('Invalid QR Code format.', 'Close', { duration: 3000 });
        }
      }
    });
  }

  processRedemption(coupon: any, salonData: any) {
    console.log(coupon, salonData);
    // Optional: Check if coupon.salon_id matches salonData.id
    // Assuming user wants strict check:
    if (String(coupon.salon_id) !== String(salonData.id)) {
      this.snackBar.open(`This coupon is only valid for ${coupon.salon_name || 'a different salon'}. You scanned ${salonData.name}.`, 'Close', { duration: 5000 });
      return;
    }
    const userId = this.authService.currentUser()?.id;

    // Open Processing Dialog
    const processingDialogRef = this.dialog.open(RedemptionProcessingDialogComponent, {
      width: '90%',
      maxWidth: '320px',
      disableClose: true,
      panelClass: 'processing-dialog-container'
    });

    this.apiService.redeemCoupon(salonData.id, userId, coupon.code)
      .pipe(finalize(() => processingDialogRef.close()))
      .subscribe({
        next: () => {
          // Show Success Dialog
          this.dialog.open(RedemptionSuccessDialogComponent, {
            width: '90%',
            maxWidth: '400px',
            disableClose: true,
            data: {
              salonName: salonData.name,
              transactionId: `TXN-${Date.now()}` // Mock or from response
            }
          });

          // Helper to refresh list
          if (userId) this.loadPurchases(userId);
        },
        error: (err) => {
          this.snackBar.open(err.error?.message || 'Redemption failed. Please try again.', 'Close', { duration: 3000 });
        }
      });
  }
}
