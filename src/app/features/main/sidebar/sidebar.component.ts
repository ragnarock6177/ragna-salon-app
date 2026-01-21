import { Component, inject, ChangeDetectionStrategy, signal, effect } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarService } from '../../../services/sidebar.service';
import { LucideAngularModule } from 'lucide-angular';
import { AuthService } from '../../../core/auth/auth.service';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-sidebar',
  imports: [RouterModule, CommonModule, LucideAngularModule, MatMenuModule, MatButtonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent {
  private authService = inject(AuthService);
  private sidebarService = inject(SidebarService);
  currentUser = this.authService.currentUser;

  navItems = [
    { label: 'Dashboard', link: '/admin/dashboard', icon: 'layout-dashboard' },
    { label: 'City', link: '/admin/city', icon: 'building-2' },
    { label: 'Users', link: '/admin/users', icon: 'users' },
    { label: 'Salons', link: '/admin/salons', icon: 'store' },
    { label: 'Coupons', link: '/admin/coupons', icon: 'ticket' },
    { label: 'Memberships', link: '/admin/memberships', icon: 'crown' },
    { label: 'Scanner', link: '/admin/scanner', icon: 'qr-code' },
  ];

  isOpen = signal(false);

  effectref = effect(() => {
    this.isOpen.set(this.sidebarService.isOpen());
  })

  closeSidebar(): void {
    this.sidebarService.closeSidebar();
  }

  logout(): void {
    this.authService.logout();
  }

  trackByLink = (_: number, item: typeof this.navItems[0]) => item.link;
}
