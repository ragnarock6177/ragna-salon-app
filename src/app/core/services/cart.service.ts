import { Injectable, computed, signal } from '@angular/core';

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
    // Use a map or array. Array is easier for iteration.
    private cartItems = signal<CartItem[]>([]);

    // Global cart visibility state
    private isOpenSignal = signal(false);
    isOpen = computed(() => this.isOpenSignal());

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

    // Calculate total price - purely hypothetical since we only have discount %
    // Assuming we might have a price later or just summing up discount value
    // For now let's assume each coupon has a "cost" or we just count them.
    // The user requirement says "increasing value and buy option".
    // If coupon doesn't have price, maybe we are buying "access" or "booking fee"?
    // Let's assume a generic price for now or strict quantity.

    // Re-reading user request: "click then show side cart with increasing value"
    // Maybe "value" means quantity? 
    // Coupon model has: code, description, type, discount, min_order_amount... 
    // It doesn't seem to have a "price". 
    // Maybe the "value" is the "min_order_amount"? Or simple quantity?
    // Let's implement quantity management.

    addItem(coupon: any, salon: any) {
        const currentItems = this.cartItems();
        const existingItem = currentItems.find(i => i.id === coupon.id);

        if (existingItem) {
            this.updateQuantity(coupon.id, existingItem.quantity + 1);
        } else {
            this.cartItems.set([...currentItems, {
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
}
