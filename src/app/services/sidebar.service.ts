import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SidebarService {
    private isSidebarOpen = new BehaviorSubject<boolean>(false);
    public sidebarOpen$: Observable<boolean> = this.isSidebarOpen.asObservable();

    constructor() {
        // Check screen size on init
        this.checkScreenSize();

        // Listen to window resize
        if (typeof window !== 'undefined') {
            window.addEventListener('resize', () => this.checkScreenSize());
        }
    }

    toggleSidebar(): void {
        this.isSidebarOpen.next(!this.isSidebarOpen.value);
    }

    openSidebar(): void {
        this.isSidebarOpen.next(true);
    }

    closeSidebar(): void {
        this.isSidebarOpen.next(false);
    }

    private checkScreenSize(): void {
        if (typeof window !== 'undefined') {
            // Auto-close on mobile, keep state on desktop
            const isMobile = window.innerWidth < 768;
            if (isMobile && this.isSidebarOpen.value) {
                this.closeSidebar();
            }
        }
    }
}
