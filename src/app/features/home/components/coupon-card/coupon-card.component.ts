import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-coupon-card',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './coupon-card.component.html',
  styleUrl: './coupon-card.component.scss'
})
export class CouponCardComponent {
  // Input for coupon data
  coupon = input.required<any>();

  // Output event when redeem is clicked
  onRedeem = output<any>();

  redeemCoupon() {
    this.onRedeem.emit(this.coupon());
  }
}
