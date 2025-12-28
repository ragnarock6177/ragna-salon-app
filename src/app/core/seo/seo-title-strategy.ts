import { Injectable, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';

/**
 * Custom TitleStrategy that appends brand suffix to all page titles
 * Format: {Page Title} | Ragna Salon
 */
@Injectable({ providedIn: 'root' })
export class SeoTitleStrategy extends TitleStrategy {
    private readonly title = inject(Title);
    private readonly brandName = 'Ragna Salon';

    override updateTitle(routerState: RouterStateSnapshot): void {
        const title = this.buildTitle(routerState);

        if (title) {
            // If title already contains brand name, use as-is
            if (title.includes(this.brandName)) {
                this.title.setTitle(title);
            } else {
                this.title.setTitle(`${title} | ${this.brandName}`);
            }
        } else {
            // Default title when no route title is set
            this.title.setTitle(this.brandName);
        }
    }
}
