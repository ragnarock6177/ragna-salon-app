import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SeoService } from './core/seo/seo.service';
import { ToastComponent } from './shared/components/toast/toast.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  private readonly seoService = inject(SeoService);

  ngOnInit(): void {
    const loader = document.getElementById('ragnaLoader');
    if (!loader) {
      return;
    }
    queueMicrotask(() => requestAnimationFrame(() => loader.remove()));
    this.seoService.init();
  }
}
