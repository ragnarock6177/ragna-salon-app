import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarService } from '../../../services/sidebar.service';
import { Subscription } from 'rxjs';
import { LucideAngularModule } from 'lucide-angular';
import { AuthService } from '../../../core/auth/auth.service';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-sidebar',
  imports: [RouterModule, CommonModule, LucideAngularModule, MatMenuModule, MatButtonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements OnInit, OnDestroy {
  isOpen = false;
  private subscription?: Subscription;
  private authService = inject(AuthService);
  currentUser = this.authService.currentUser;

  navItems = [
    { label: 'Dashboard', link: '/dashboard', icon: 'layout-dashboard' },
    { label: 'City', link: '/city', icon: 'building-2' },
    { label: 'Users', link: '/users', icon: 'users' },
    { label: 'Salons', link: '/salons', icon: 'store' },
    { label: 'Coupons', link: '/coupons', icon: 'ticket' },
    { label: 'Memberships', link: '/memberships', icon: 'crown' },
  ];

  constructor(private sidebarService: SidebarService) { }

  ngOnInit(): void {
    this.subscription = this.sidebarService.sidebarOpen$.subscribe(
      isOpen => this.isOpen = isOpen
    );
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  closeSidebar(): void {
    this.sidebarService.closeSidebar();
  }

  logout(): void {
    this.authService.logout();
  }
}
