import { Component, inject, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService, User } from '../../../core/auth/auth.service';
import { LucideAngularModule } from 'lucide-angular';
import { ApiService } from '../../../services/api.service';

import { MatDialog } from '@angular/material/dialog';
import { ScannerDialogComponent } from '../components/scanner-dialog/scanner-dialog.component';
import { RedemptionSuccessDialogComponent } from '../components/redemption-success-dialog/redemption-success-dialog.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent {
  authService = inject(AuthService);
  private apiService = inject(ApiService);
  private dialog = inject(MatDialog);

  user = computed(() => this.authService.currentUser() as User | null);

  purchasedCoupons = signal<any[]>([]);

  constructor() {
    const userId = this.authService.currentUser()?.id;
    if (userId) {
      this.loadPurchases(userId);
    }
  }

  loadPurchases(userId: string) {
    this.apiService.getCustomerPurchases(userId).subscribe({
      next: (res: any) => {
        this.purchasedCoupons.set(res.data);
      }
    });
  }

  // Mock bookings
  bookings = [
    {
      id: 'BK-7829',
      salonName: 'Lux Salon & Spa',
      service: 'Haircut & Styling',
      date: new Date('2024-03-15'),
      status: 'Upcoming',
      price: 45
    },
    {
      id: 'BK-1102',
      salonName: 'Urban Oasis',
      service: 'Facial Treatment',
      date: new Date('2024-02-20'),
      status: 'Completed',
      price: 80
    }
  ];

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
          // The scanned result purely needs to be parsed. 
          // However, zxing sometimes returns the string directly.
          const data = JSON.parse(result);

          if (data.type === 'salon' && data.id && data.name) {
            this.processRedemption(coupon, data);
          } else {
            alert('Invalid QR Code. Please scan a valid Salon QR.');
          }
        } catch (e) {
          console.error(e);
          alert('Invalid QR Code format.');
        }
      }
    });
  }

  processRedemption(coupon: any, salonData: any) {
    console.log(coupon, salonData);
    // Optional: Check if coupon.salon_id matches salonData.id
    // Assuming user wants strict check:
    if (String(coupon.salon_id) !== String(salonData.id)) {
      alert(`This coupon is only valid for ${coupon.salon_name || 'a different salon'}. You scanned ${salonData.name}.`);
      return;
    }
    const userId = this.authService.currentUser()?.id;
    this.apiService.redeemCoupon(salonData.id, userId, coupon.code).subscribe({
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
        const userId = this.authService.currentUser()?.id;
        if (userId) this.loadPurchases(userId);
      },
      error: (err) => {
        alert(err.error?.message || 'Redemption failed. Please try again.');
      }
    });
  }
}
