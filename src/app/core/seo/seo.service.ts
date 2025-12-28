import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter, map, mergeMap } from 'rxjs/operators';

export interface SeoData {
    title?: string;
    description?: string;
    keywords?: string;
    image?: string;
    url?: string;
    type?: string;
}

@Injectable({
    providedIn: 'root'
})
export class SeoService {
    private readonly meta = inject(Meta);
    private readonly title = inject(Title);
    private readonly router = inject(Router);
    private readonly activatedRoute = inject(ActivatedRoute);

    private readonly defaultSeo: SeoData = {
        title: 'Ragna Salon',
        description: 'Professional salon management platform. Manage your salons, staff, appointments, and customers with ease.',
        keywords: 'salon management, beauty salon, spa management, appointment booking, salon software',
        image: '/assets/og-image.png',
        url: 'https://ragna-salon.com',
        type: 'website'
    };

    /**
     * Initialize SEO service - call this in app root
     * Automatically updates meta tags on route changes
     */
    init(): void {
        this.router.events.pipe(
            filter(event => event instanceof NavigationEnd),
            map(() => this.activatedRoute),
            map(route => {
                while (route.firstChild) {
                    route = route.firstChild;
                }
                return route;
            }),
            filter(route => route.outlet === 'primary'),
            mergeMap(route => route.data)
        ).subscribe(data => {
            this.updateMetaTags({
                title: data['title'],
                description: data['description'] || data['subtitle'],
                keywords: data['keywords']
            });
        });
    }

    /**
     * Update all SEO meta tags
     */
    updateMetaTags(seo: SeoData): void {
        const mergedSeo = { ...this.defaultSeo, ...seo };

        // Update meta description
        this.updateTag('description', mergedSeo.description!);

        // Update keywords
        this.updateTag('keywords', mergedSeo.keywords!);

        // Open Graph tags
        this.updateTag('og:title', mergedSeo.title!, 'property');
        this.updateTag('og:description', mergedSeo.description!, 'property');
        this.updateTag('og:image', mergedSeo.image!, 'property');
        this.updateTag('og:url', mergedSeo.url!, 'property');
        this.updateTag('og:type', mergedSeo.type!, 'property');
        this.updateTag('og:site_name', 'Ragna Salon', 'property');

        // Twitter Card tags
        this.updateTag('twitter:card', 'summary_large_image');
        this.updateTag('twitter:title', mergedSeo.title!);
        this.updateTag('twitter:description', mergedSeo.description!);
        this.updateTag('twitter:image', mergedSeo.image!);
    }

    /**
     * Set page-specific title
     */
    setTitle(title: string): void {
        this.title.setTitle(`${title} | Ragna Salon`);
    }

    /**
     * Set page-specific description
     */
    setDescription(description: string): void {
        this.updateTag('description', description);
        this.updateTag('og:description', description, 'property');
        this.updateTag('twitter:description', description);
    }

    /**
     * Set canonical URL
     */
    setCanonicalUrl(url?: string): void {
        const canonicalUrl = url || this.router.url;
        const fullUrl = `${this.defaultSeo.url}${canonicalUrl}`;

        // Remove existing canonical link if present
        const existingLink = document.querySelector('link[rel="canonical"]');
        if (existingLink) {
            existingLink.remove();
        }

        // Add new canonical link
        const link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        link.setAttribute('href', fullUrl);
        document.head.appendChild(link);
    }

    private updateTag(name: string, content: string, attribute: 'name' | 'property' = 'name'): void {
        const selector = attribute === 'property' ? `property="${name}"` : `name="${name}"`;

        if (this.meta.getTag(selector)) {
            this.meta.updateTag({ [attribute]: name, content });
        } else {
            this.meta.addTag({ [attribute]: name, content });
        }
    }
}
