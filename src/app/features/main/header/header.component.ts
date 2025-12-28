import { Component, OnDestroy, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarService } from '../../../services/sidebar.service';
import { ThemeService } from '../../../services/theme.service';
import { Subscription, filter } from 'rxjs';
import { LucideAngularModule } from 'lucide-angular';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit, OnDestroy {
  search = '';
  showNotif = false;
  isDarkMode = false;
  title = 'Salon Dashboard';
  subtitle = 'Manage your salon operations';
  private themeSubscription?: Subscription;
  private routerSubscription?: Subscription;

  constructor(
    private sidebarService: SidebarService,
    private themeService: ThemeService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
    // Get initial theme state
    this.isDarkMode = this.themeService.getCurrentTheme();

    // Subscribe to theme changes
    this.themeSubscription = this.themeService.theme$.subscribe(isDark => {
      this.isDarkMode = isDark;
    });
  }

  ngOnInit() {
    this.updateTitleFromRoute();
    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateTitleFromRoute();
    });
  }

  private updateTitleFromRoute(): void {
    let route = this.activatedRoute;
    while (route.firstChild) {
      route = route.firstChild;
    }
    const data = route.snapshot.data;
    this.title = data['title'] || 'Salon Dashboard';
    this.subtitle = data['subtitle'] || 'Manage your salon operations';
  }

  ngOnDestroy(): void {
    this.themeSubscription?.unsubscribe();
    this.routerSubscription?.unsubscribe();
  }

  toggleSidebar(): void {
    this.sidebarService.toggleSidebar();
  }

  toggleNotif(): void {
    this.showNotif = !this.showNotif;
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
