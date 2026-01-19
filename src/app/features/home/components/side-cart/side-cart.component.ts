import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../../../core/services/cart.service';
import { AuthService } from '../../../../core/auth/auth.service';
import { LucideAngularModule } from 'lucide-angular';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { LoginDialogComponent } from '../../../../features/auth/components/login-dialog/login-dialog.component';

@Component({
    selector: 'app-side-cart',
    standalone: true,
    imports: [CommonModule, LucideAngularModule],
    templateUrl: './side-cart.component.html',
    styleUrl: './side-cart.component.scss'
})
export class SideCartComponent {
    cartService = inject(CartService);
    authService = inject(AuthService);
    router = inject(Router);
    dialog = inject(MatDialog);

    // isOpen is now managed by service for global access
    isOpen = this.cartService.isOpen;

    toggle() {
        this.cartService.toggleCart();
    }

    checkout() {
        if (!this.authService.isAuthenticated()) {
            this.openLoginDialog();
        } else {
            // Proceed to buy (Mocked)
            console.log('Buying items...');
            alert('Purchase Successful! (Mock)');
            this.cartService.clearCart();
            this.cartService.closeCart();
        }
    }

    openLoginDialog() {
        if (this.isOpen()) this.toggle();

        const dialogRef = this.dialog.open(LoginDialogComponent, {
            width: '400px',
            disableClose: true,
            panelClass: 'custom-dialog-container'
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result === true) {
                this.cartService.openCart(); // Re-open cart
                this.checkout(); // Retry checkout
            } else {
                this.cartService.openCart(); // User closed dialog, re-open cart
            }
        });
    }
}
