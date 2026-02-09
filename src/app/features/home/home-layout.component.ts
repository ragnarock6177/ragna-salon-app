import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './components/footer/footer.component';
import { BottomNavComponent } from './components/bottom-nav/bottom-nav.component';

@Component({
  selector: 'app-home-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FooterComponent, BottomNavComponent],
  template: `
    <div class="min-h-screen flex flex-col font-fancy">
      <div class="flex-1 pb-16 md:pb-0"> <!-- Add padding for bottom nav on mobile -->
        <router-outlet></router-outlet>
      </div>
      <app-footer></app-footer>
      <app-bottom-nav></app-bottom-nav>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeLayoutComponent { }
