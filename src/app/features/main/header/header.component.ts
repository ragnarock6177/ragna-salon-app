import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarService } from '../../../services/sidebar.service';
import { ThemeService } from '../../../services/theme.service';
import { Subscription, filter, map, mergeMap, tap } from 'rxjs';
import { LucideAngularModule } from 'lucide-angular';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
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
    private activatedRoute: ActivatedRoute
  ) {
    // Get initial theme state
    this.isDarkMode = this.themeService.getCurrentTheme();

    // Subscribe to theme changes
    this.themeSubscription = this.themeService.theme$.subscribe(isDark => {
      this.isDarkMode = isDark;
    });
  }

  ngOnInit() {
    console.log(this.activatedRoute)
    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.activatedRoute),
      tap(route => console.log(route)),
      map(route => {
        while (route.firstChild) route = route.firstChild;
        return route;
      }),
      mergeMap(route => route.data)
    ).subscribe(data => {
      console.log(data)
      this.title = data['title'] || 'Salon Dashboard';
      this.subtitle = data['subtitle'] || 'Manage your salon operations';
    });
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
