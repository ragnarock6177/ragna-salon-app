import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-home-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FooterComponent],
  template: `
    <div class="min-h-screen flex flex-col">
      <div class="flex-1">
        <router-outlet></router-outlet>
      </div>
      @defer (on viewport) {
        <app-footer></app-footer>
      } @placeholder {
        <div style="min-height: 50px"></div>
      }
    </div>
  `
})
export class HomeLayoutComponent { }
