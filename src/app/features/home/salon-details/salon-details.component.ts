import { Component, inject, signal } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { ApiService } from '../../../services/api.service'; // Adjust path
import { CartService } from '../../../core/services/cart.service';

@Component({
    selector: 'app-salon-details',
    standalone: true,
    imports: [CommonModule, LucideAngularModule],
    templateUrl: './salon-details.component.html',
    styleUrl: './salon-details.component.scss'
})
export class SalonDetailsComponent {
    private route = inject(ActivatedRoute);
    private apiService = inject(ApiService);
    private location = inject(Location);
    private cartService = inject(CartService);

    salonId = this.route.snapshot.paramMap.get('id');

    // Should fetch logic be signal based or standard rx?
    // Using signals for consistency

    salon = signal<any>(null);
    coupons = signal<any[]>([]);
    isLoading = signal(true);

    constructor() {
        if (this.salonId) {
            this.loadData(this.salonId);
        }
    }

    loadData(id: string) {
        this.isLoading.set(true);
        // Fetch salon details
        this.apiService.getSalon(id).subscribe({
            next: (res: any) => {
                if (res.data) {
                    this.salon.set(res.data);
                }
                this.isLoading.set(false);
            },
            error: () => this.isLoading.set(false)
        });

        // Fetch coupons
        this.apiService.getCoupons(id).subscribe({
            next: (res: any) => {
                this.coupons.set(res.data || []);
            }
        });
    }

    goBack() {
        this.location.back();
    }

    parseTime(time: string): Date | null {
        if (!time) return null;
        const [hours, minutes, seconds] = time.split(':').map(Number);
        const date = new Date();
        date.setHours(hours || 0);
        date.setMinutes(minutes || 0);
        date.setSeconds(seconds || 0);
        return date;
    }

    addToCart(coupon: any) {
        if (!coupon || !this.salon()) return;
        this.cartService.addItem(coupon, this.salon());
        // Feedback to user (optional: simple alert or snackbar, but cart update is reactive)
    }
}
