import { Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class SidebarService {
    // Signal for sidebar state
    private readonly _isOpen = signal(false);

    // Public readonly signal
    readonly isOpen = this._isOpen.asReadonly();

    // Keep observable for backward compatibility (can remove later)
    // readonly sidebarOpen$ is no longer needed with signals

    constructor() {
        // Check screen size on init
        this.checkScreenSize();

        // Listen to globalThis resize
        if (typeof globalThis !== 'undefined') {
            globalThis.addEventListener('resize', () => this.checkScreenSize());
        }
    }

    toggleSidebar(): void {
        console.log('ok')
        this._isOpen.update(value => !value);
        console.log(this.isOpen())
    }

    openSidebar(): void {
        this._isOpen.set(true);
    }

    closeSidebar(): void {
        this._isOpen.set(false);
    }

    private checkScreenSize(): void {
        if (typeof globalThis !== 'undefined') {
            // Auto-close on mobile, keep state on desktop
            const isMobile = globalThis.innerWidth < 768;
            if (isMobile && this._isOpen()) {
                this.closeSidebar();
            }
        }
    }
}
