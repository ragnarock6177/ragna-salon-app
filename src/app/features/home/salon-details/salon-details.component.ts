import { Component, computed, DestroyRef, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, filter, map, of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../../../services/api.service';
import { CartService } from '../../../core/services/cart.service';
import { AuthService } from '../../../core/auth/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { SalonDetailCacheService } from '../../../core/services/salon-detail-cache.service';
import { ImagePreviewDialogComponent } from '../../main/salons/components/image-preview-dialog/image-preview-dialog.component';
import { SideCartComponent } from '../components/side-cart/side-cart.component';

@Component({
    selector: 'app-salon-details',
    standalone: true,
    imports: [CommonModule, LucideAngularModule, SideCartComponent, FormsModule],
    templateUrl: './salon-details.component.html',
    styleUrl: './salon-details.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SalonDetailsComponent {
    private readonly destroyRef = inject(DestroyRef);
    private readonly route = inject(ActivatedRoute);
    private readonly apiService = inject(ApiService);
    private readonly location = inject(Location);
    private readonly cartService = inject(CartService);
    private readonly dialog = inject(MatDialog);
    private readonly authService = inject(AuthService);
    private readonly toast = inject(ToastService);
    private readonly salonDetailCacheService = inject(SalonDetailCacheService);

    salonId = signal<string | null>(null);
    salon = signal<any>(null);
    coupons = signal<any[]>([]);
    reviews = signal<any[]>([]);
    reviewStats = signal<any>(null);
    userReview = signal<any>(null);
    isLoading = signal(false);

    showReviewForm = signal(false);
    newReviewRating = signal(0);
    newReviewComment = signal('');
    isSubmittingReview = signal(false);

    constructor() {
        this.route.paramMap.pipe(
            map(params => params.get('id')),
            filter((id): id is string => !!id),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe((id) => this.loadSalonDetails(id));
    }

    isOpen = computed(() => {
        const salon = this.salon();
        if (!salon || !salon.opening_time || !salon.closing_time) return false;

        const now = new Date();
        const currentTime = now.getHours() * 60 + now.getMinutes();
        const [openH, openM] = salon.opening_time.split(':').map(Number);
        const [closeH, closeM] = salon.closing_time.split(':').map(Number);

        const openTime = openH * 60 + openM;
        const closeTime = closeH * 60 + closeM;

        return currentTime >= openTime && currentTime <= closeTime;
    });

    getServices(): string[] {
        const salon = this.salon();
        if (!salon || !salon.services) return [];
        if (Array.isArray(salon.services)) return salon.services;

        try {
            return JSON.parse(salon.services);
        } catch {
            return [];
        }
    }

    getServiceIcon(service: string): string {
        const serviceLower = service.toLowerCase();
        if (serviceLower.includes('hair') || serviceLower.includes('cut')) return 'scissors';
        if (serviceLower.includes('spa') || serviceLower.includes('massage')) return 'sparkles';
        if (serviceLower.includes('makeup') || serviceLower.includes('cosmetic')) return 'palette';
        if (serviceLower.includes('nail') || serviceLower.includes('manicure') || serviceLower.includes('pedicure')) return 'hand';
        if (serviceLower.includes('skin') || serviceLower.includes('facial')) return 'droplet';
        if (serviceLower.includes('wax')) return 'zap';
        if (serviceLower.includes('color') || serviceLower.includes('dye')) return 'paintbrush';
        return 'sparkles';
    }

    getServiceColorClass(index: number): string {
        const colors = [
            'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400',
            'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
            'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400',
            'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
            'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400',
            'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
        ];

        return colors[index % colors.length];
    }

    goBack(): void {
        this.location.back();
    }

    parseTime(time: string): Date | null {
        if (!time) return null;

        const [hours, minutes, seconds] = time.split(':').map(Number);
        const date = new Date();
        date.setHours(hours || 0);
        date.setMinutes(minutes || 0);
        date.setSeconds(seconds || 0);
        return date;
    }

    addToCart(coupon: any): void {
        if (!coupon || !this.salon()) return;
        this.cartService.addItem(coupon, this.salon());
    }

    openImagePreview(imageUrl: string): void {
        if (!imageUrl) return;

        this.dialog.open(ImagePreviewDialogComponent, {
            data: { imageUrl },
            maxWidth: '95vw',
            maxHeight: '95vh',
            panelClass: 'image-preview-dialog-container',
            backdropClass: 'image-preview-backdrop'
        });
    }

    loadReviews(id: string): void {
        this.fetchReviews(id);
    }

    loadReviewStats(id: string): void {
        this.fetchReviewStats(id);
    }

    checkUserReview(): void {
        const id = this.salonId();

        if (!id || !this.authService.isAuthenticated()) {
            this.userReview.set(null);
            return;
        }

        this.fetchUserReview(id);
    }

    submitReview(): void {
        if (!this.newReviewRating() || !this.newReviewComment().trim()) return;

        if (!this.authService.isAuthenticated()) {
            this.toast.error('Please log in to submit a review.');
            return;
        }

        this.isSubmittingReview.set(true);
        const data = {
            salon_id: this.salonId(),
            rating: this.newReviewRating(),
            comment: this.newReviewComment()
        };

        if (this.userReview()) {
            this.apiService.updateReview(this.userReview().id, data).subscribe({
                next: () => {
                    this.isSubmittingReview.set(false);
                    this.showReviewForm.set(false);
                    this.loadReviews(this.salonId()!);
                    this.loadReviewStats(this.salonId()!);
                    this.checkUserReview();
                    this.toast.success('Review updated successfully!');
                },
                error: () => {
                    this.isSubmittingReview.set(false);
                    this.toast.error('Failed to update review. Please try again.');
                }
            });
        } else {
            this.apiService.createReview(data).subscribe({
                next: () => {
                    this.isSubmittingReview.set(false);
                    this.showReviewForm.set(false);
                    this.loadReviews(this.salonId()!);
                    this.loadReviewStats(this.salonId()!);
                    this.checkUserReview();
                    this.toast.success('Review submitted successfully!');
                },
                error: () => {
                    this.isSubmittingReview.set(false);
                    this.toast.error('Failed to submit review. Please try again.');
                }
            });
        }
    }

    deleteReview(): void {
        if (!this.userReview()) return;

        if (confirm('Are you sure you want to delete your review?')) {
            this.apiService.deleteReview(this.userReview().id).subscribe({
                next: () => {
                    this.userReview.set(null);
                    this.newReviewRating.set(0);
                    this.newReviewComment.set('');
                    this.loadReviews(this.salonId()!);
                    this.loadReviewStats(this.salonId()!);
                }
            });
        }
    }

    toggleLike(review: any): void {
        if (!this.authService.isAuthenticated()) {
            this.toast.error('Please log in to like reviews.');
            return;
        }

        this.reviews.update(list =>
            list.map(r => r.id === review.id
                ? { ...r, is_liked: !r.is_liked, likes_count: (r.likes_count || 0) + (r.is_liked ? -1 : 1) }
                : r
            )
        );

        this.apiService.toggleLikeReview(review.id).subscribe({
            error: () => {
                this.reviews.update(list =>
                    list.map(r => r.id === review.id
                        ? { ...r, is_liked: !r.is_liked, likes_count: (r.likes_count || 0) + (r.is_liked ? -1 : 1) }
                        : r
                    )
                );
                this.toast.error('Failed to update. Please try again.');
            }
        });
    }

    setRating(rating: number): void {
        this.newReviewRating.set(rating);
    }

    private loadSalonDetails(id: string): void {
        this.salonId.set(id);

        const cachedSalon = this.salonDetailCacheService.getSalon(id);
        const cachedCoupons = this.salonDetailCacheService.getCoupons(id);

        if (this.salonDetailCacheService.hasSalon(id)) {
            this.salon.set(cachedSalon);
            this.isLoading.set(false);
        } else {
            this.salon.set(null);
            this.isLoading.set(true);
        }

        this.coupons.set(this.salonDetailCacheService.hasCoupons(id) ? cachedCoupons : []);
        this.reviews.set([]);
        this.reviewStats.set(null);
        this.userReview.set(null);

        this.fetchSalon(id);
        this.fetchCoupons(id);
        this.fetchReviews(id);
        this.fetchReviewStats(id);

        if (this.authService.isAuthenticated()) {
            this.fetchUserReview(id);
        }
    }

    private fetchSalon(id: string): void {
        this.apiService.getSalon(id).pipe(
            map((res: any) => this.normalizeSalon(res.data)),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe({
            next: (salon: any) => {
                this.salonDetailCacheService.setSalon(id, salon);
                this.salon.set(salon);
                this.isLoading.set(false);
            },
            error: (err) => {
                console.error('Salon Error:', err);
                this.salon.set(null);
                this.isLoading.set(false);
            }
        });
    }

    private fetchCoupons(id: string): void {
        this.apiService.getCoupons(id).pipe(
            map((res: any) => res.data || []),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe({
            next: (coupons: any[]) => {
                this.salonDetailCacheService.setCoupons(id, coupons);
                this.coupons.set(coupons);
            },
            error: (err) => {
                console.error('Coupons Error:', err);
                this.coupons.set(this.salonDetailCacheService.getCoupons(id));
            }
        });
    }

    private fetchReviews(id: string): void {
        this.apiService.getReviews(id).pipe(
            map((res: any) => res.data?.reviews || []),
            catchError((err) => {
                console.error('Reviews Error:', err);
                return of([] as any[]);
            }),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe((reviews: any[]) => this.reviews.set(reviews));
    }

    private fetchReviewStats(id: string): void {
        this.apiService.getReviewStats(id).pipe(
            map((res: any) => res.data),
            catchError((err) => {
                console.error('Stats Error:', err);
                return of(null as any);
            }),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe((stats: any) => {
            if (!stats) {
                this.reviewStats.set(null);
                return;
            }

            this.reviewStats.set({
                totalReviews: stats?.total_reviews ?? 0,
                averageRating: parseFloat(stats?.average_rating ?? 0),
                distribution: {
                    5: stats?.rating_distribution?.five_star?.count || 0,
                    4: stats?.rating_distribution?.four_star?.count || 0,
                    3: stats?.rating_distribution?.three_star?.count || 0,
                    2: stats?.rating_distribution?.two_star?.count || 0,
                    1: stats?.rating_distribution?.one_star?.count || 0
                }
            });
        });
    }

    private fetchUserReview(id: string): void {
        this.apiService.getUserReviews().pipe(
            map((res: any) => res.data || []),
            catchError((err) => {
                console.error('User Review Error:', err);
                return of([] as any[]);
            }),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe((userReviews: any[]) => {
            const found = userReviews.find(
                (review: any) => String(review.salon_id) === String(id)
            );

            if (found) {
                this.userReview.set(found);
                this.newReviewRating.set(found.rating);
                this.newReviewComment.set(found.comment);
            } else {
                this.userReview.set(null);
            }
        });
    }

    private normalizeSalon(salon: any): any {
        return {
            ...salon,
            services: typeof salon?.services === 'string'
                ? JSON.parse(salon.services)
                : (salon?.services || [])
        };
    }
}
