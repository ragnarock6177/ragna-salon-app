import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-home-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FooterComponent],
  template: `
    <div class="min-h-screen flex flex-col font-fancy">
      <div class="flex-1 pb-16 md:pb-0"> <!-- Add padding for bottom nav on mobile -->
        <router-outlet></router-outlet>
      </div>
      <app-footer></app-footer>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeLayoutComponent { }
