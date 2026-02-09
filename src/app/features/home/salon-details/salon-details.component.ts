import { Component, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { ApiService } from '../../../services/api.service'; // Adjust path
import { CartService } from '../../../core/services/cart.service';
import { MatDialog } from '@angular/material/dialog';
import { ImagePreviewDialogComponent } from '../../main/salons/components/image-preview-dialog/image-preview-dialog.component';
import { SideCartComponent } from '../components/side-cart/side-cart.component';

@Component({
    selector: 'app-salon-details',
    standalone: true,
    imports: [CommonModule, LucideAngularModule, SideCartComponent],
    templateUrl: './salon-details.component.html',
    styleUrl: './salon-details.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SalonDetailsComponent {
    private route = inject(ActivatedRoute);
    private apiService = inject(ApiService);
    private location = inject(Location);
    private cartService = inject(CartService);
    private dialog = inject(MatDialog);

    salonId = this.route.snapshot.paramMap.get('id');

    salon = signal<any>(null);
    coupons = signal<any[]>([]);
    isLoading = signal(true);

    // Computed signal to check if salon is currently open
    isOpen = computed(() => {
        const s = this.salon();
        if (!s || !s.opening_time || !s.closing_time) return false;

        const now = new Date();
        const currentTime = now.getHours() * 60 + now.getMinutes();

        const [openH, openM] = s.opening_time.split(':').map(Number);
        const [closeH, closeM] = s.closing_time.split(':').map(Number);

        const openTime = openH * 60 + openM;
        const closeTime = closeH * 60 + closeM;

        return currentTime >= openTime && currentTime <= closeTime;
    });

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
}

