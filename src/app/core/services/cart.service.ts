import { Injectable, computed, signal, inject } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../auth/auth.service';
import { finalize } from 'rxjs';

export interface CartItem {
    id: number;
    description: string;
    price: number; // calculated from discount/base price if needed, or raw amount
    discount: number;
    quantity: number;
    salonId: number;
    salonName: string;
}

@Injectable({
    providedIn: 'root'
})
export class CartService {
    private apiService = inject(ApiService);
    private authService = inject(AuthService);

    // Use a map or array. Array is easier for iteration.
    private cartItems = signal<CartItem[]>([]);

    // Global cart visibility state
    private isOpenSignal = signal(false);
    isOpen = computed(() => this.isOpenSignal());

    // Checkout loading state
    isCheckingOut = signal(false);

    openCart() {
        this.isOpenSignal.set(true);
    }

    closeCart() {
        this.isOpenSignal.set(false);
    }

    toggleCart() {
        this.isOpenSignal.update(v => !v);
    }

    items = computed(() => this.cartItems());

    totalCount = computed(() => {
        return this.cartItems().reduce((acc, item) => acc + item.quantity, 0);
    });

    addItem(coupon: any, salon: any) {
        const currentItems = this.cartItems();

        // Check if we are adding from a different salon
        if (currentItems.length > 0 && currentItems[0].salonId !== salon.id) {
            // For now, auto-clear. In future, we could confirm.
            this.clearCart();
        }

        // Re-fetch potentially cleared items (though it will be empty if cleared above)
        // But if we just cleared, we started fresh. 
        // Logic: if cleared, currentItems is technically stale in this scope, but next set call fixes it.
        // Better:
        let updatedItems = currentItems.length > 0 && currentItems[0].salonId !== salon.id ? [] : currentItems;

        const existingItem = updatedItems.find(i => i.id === coupon.id);

        if (existingItem) {
            this.updateQuantity(coupon.id, existingItem.quantity + 1);
        } else {
            this.cartItems.set([...updatedItems, {
                id: coupon.id,
                description: coupon.description,
                price: 0, // Placeholder
                discount: coupon.discount,
                quantity: 1,
                salonId: salon.id,
                salonName: salon.name
            }]);
        }
        this.openCart(); // Auto open
    }

    removeItem(itemId: number) {
        this.cartItems.set(this.cartItems().filter(i => i.id !== itemId));
    }

    updateQuantity(itemId: number, quantity: number) {
        if (quantity <= 0) {
            this.removeItem(itemId);
            return;
        }

        this.cartItems.update(items =>
            items.map(item => item.id === itemId ? { ...item, quantity } : item)
        );
    }

    clearCart() {
        this.cartItems.set([]);
    }

    checkout() {
        if (this.cartItems().length === 0) return;

        const user = this.authService.currentUser();
        if (!user) return; // Should be handled by UI guard or check

        // Assume all items from same salon
        const salonId = this.cartItems()[0].salonId;

        const payload = {
            customerId: user.id, // Assuming user object has id
            items: this.cartItems().map(item => ({
                couponId: item.id,
                quantity: item.quantity
            }))
        };

        this.isCheckingOut.set(true);
        this.apiService.purchaseCoupons(salonId, payload)
            .pipe(finalize(() => this.isCheckingOut.set(false)))
            .subscribe({
                next: (res) => {
                    alert('Purchase Successful!');
                    this.clearCart();
                    this.closeCart();
                },
                error: (err) => {
                    alert('Purchase Failed: ' + (err.error?.message || 'Unknown error'));
                    console.error(err);
                }
            });
    }
}
