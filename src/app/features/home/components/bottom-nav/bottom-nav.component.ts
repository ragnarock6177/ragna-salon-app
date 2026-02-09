import { Component, inject, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { CartService } from '../../../../core/services/cart.service';
import { AuthService } from '../../../../core/auth/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { LoginDialogComponent } from '../../../../features/auth/components/login-dialog/login-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-bottom-nav',
    standalone: true,
    imports: [CommonModule, RouterLink, RouterLinkActive, LucideAngularModule],
    template: `
    <nav class="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pb-safe z-40 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] h-[60px] flex flex-col justify-center">
      <div class="grid grid-cols-5 h-full relative">
        
        <!-- Home -->
        <a routerLink="/" routerLinkActive="text-primary-600 dark:text-primary-400" [routerLinkActiveOptions]="{exact: true}"
           class="flex flex-col items-center justify-center space-y-1 text-slate-400 dark:text-slate-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors group">
          <lucide-icon name="home" class="w-5 h-5 group-[.text-primary-600]:fill-current transition-colors"></lucide-icon>
          <span class="text-[10px] font-medium">Home</span>
        </a>

        <!-- Saved (Placeholder) -->
        <button (click)="comingSoon('Saved items')"
           class="flex flex-col items-center justify-center space-y-1 text-slate-400 dark:text-slate-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
          <lucide-icon name="heart" class="w-5 h-5"></lucide-icon>
          <span class="text-[10px] font-medium">Saved</span>
        </button>

        <!-- Cart (Floating Center) -->
        <div class="relative -top-6 flex justify-center pointer-events-none">
          <button (click)="openCart()" 
             class="pointer-events-auto w-14 h-14 bg-primary-600 rounded-full shadow-lg shadow-primary-600/40 text-white flex items-center justify-center border-4 border-slate-50 dark:border-slate-900 hover:scale-105 transition-transform active:scale-95">
            <div class="relative">
              <lucide-icon name="shopping-bag" class="w-6 h-6"></lucide-icon>
              @if (cartCount() > 0) {
                <span class="absolute -top-2 -right-2 w-5 h-5 bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-primary-600">
                  {{ cartCount() }}
                </span>
              }
            </div>
          </button>
        </div>

        <!-- Offers (Placeholder) -->
        <button (click)="comingSoon('Exclusive offers')"
           class="flex flex-col items-center justify-center space-y-1 text-slate-400 dark:text-slate-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
          <lucide-icon name="tag" class="w-5 h-5"></lucide-icon>
          <span class="text-[10px] font-medium">Offers</span>
        </button>

        <!-- Profile -->
        <button (click)="handleProfile()" 
           [class.text-primary-600]="isProfileActive()"
           [class.dark:text-primary-400]="isProfileActive()"
           class="flex flex-col items-center justify-center space-y-1 text-slate-400 dark:text-slate-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors group">
          <lucide-icon name="user" class="w-5 h-5 group-[.text-primary-600]:fill-current transition-colors"></lucide-icon>
          <span class="text-[10px] font-medium">{{ isAuthenticated() ? 'Profile' : 'Login' }}</span>
        </button>

      </div>
    </nav>
  `,
    styles: [`
    :host {
      display: block;
    }
    .pb-safe {
      padding-bottom: env(safe-area-inset-bottom);
    }
  `],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BottomNavComponent {
    private cartService = inject(CartService);
    private authService = inject(AuthService);
    private dialog = inject(MatDialog);
    private router = inject(Router);
    private snackBar = inject(MatSnackBar);

    cartCount = this.cartService.totalCount;
    isAuthenticated = computed(() => !!this.authService.currentUser());

    // Use signal or computed for router state if we want true reactivity,
    // but for simple active class, standard RouterLinkActive works for links.
    // For buttons engaging navigation, we can check router url.
    isProfileActive = computed(() => this.router.url.includes('/profile'));

    openCart() {
        this.cartService.openCart();
    }

    handleProfile() {
        if (this.isAuthenticated()) {
            this.router.navigate(['/profile']);
        } else {
            this.openLoginDialog();
        }
    }

    openLoginDialog() {
        this.dialog.open(LoginDialogComponent, {
            maxWidth: '95vw',
            width: 'auto',
            disableClose: false,
            panelClass: 'login-dialog-container'
        });
    }

    comingSoon(feature: string) {
        this.snackBar.open(`${feature} coming soon!`, 'Close', {
            duration: 2000,
            verticalPosition: 'bottom',
            horizontalPosition: 'center',
            panelClass: 'mb-16' // Add margin bottom to avoid covering nav
        });
    }
}
