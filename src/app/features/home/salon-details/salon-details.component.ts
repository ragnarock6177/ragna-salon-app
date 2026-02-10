import { Component, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { ApiService } from '../../../services/api.service'; // Adjust path
import { CartService } from '../../../core/services/cart.service';
import { MatDialog } from '@angular/material/dialog';
import { ImagePreviewDialogComponent } from '../../main/salons/components/image-preview-dialog/image-preview-dialog.component';
import { SideCartComponent } from '../components/side-cart/side-cart.component';
import { AuthService } from '../../../core/auth/auth.service';
import { LoginDialogComponent } from '../../auth/components/login-dialog/login-dialog.component';

@Component({
    selector: 'app-salon-details',
    standalone: true,
    imports: [CommonModule, LucideAngularModule, SideCartComponent, FormsModule],
    templateUrl: './salon-details.component.html',
    styleUrl: './salon-details.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SalonDetailsComponent {
    private route = inject(ActivatedRoute);
    private apiService = inject(ApiService);
    private location = inject(Location);
    private cartService = inject(CartService);
    private dialog = inject(MatDialog);
    private authService = inject(AuthService);

    salonId = this.route.snapshot.paramMap.get('id');

    salon = signal<any>(null);
    coupons = signal<any[]>([]);
    reviews = signal<any[]>([]);
    reviewStats = signal<any>(null);
    userReview = signal<any>(null); // To store current user's review if any
    isLoading = signal(true);

    // New Review Form Signals
    showReviewForm = signal(false);
    newReviewRating = signal(0);
    newReviewComment = signal('');
    isSubmittingReview = signal(false);

    // Computed signal to check if salon is currently open
    isOpen = computed(() => {
        const s = this.salon();
        if (!s || !s.opening_time || !s.closing_time) return false;

        const now = new Date();
        const currentTime = now.getHours() * 60 + now.getMinutes();

        const [openH, openM] = s.opening_time.split(':').map(Number);
        const [closeH, closeM] = s.closing_time.split(':').map(Number);

        const openTime = openH * 60 + openM;
        const closeTime = closeH * 60 + closeM;

        return currentTime >= openTime && currentTime <= closeTime;
    });

    constructor() {
        if (this.salonId) {
            this.loadData(this.salonId);
            this.loadReviews(this.salonId);
            this.loadReviewStats(this.salonId);
            this.checkUserReview();
        }
    }

    loadData(id: string) {
        this.isLoading.set(true);
        // Fetch salon details
        this.apiService.getSalon(id).subscribe({
            next: (res: any) => {
                if (res.data) {
                    // Parse stringified services if needed
                    const salonData = {
                        ...res.data,
                        services: typeof res.data.services === 'string'
                            ? JSON.parse(res.data.services)
                            : (res.data.services || [])
                    };
                    this.salon.set(salonData);
                }
                this.isLoading.set(false);
            },
            error: () => this.isLoading.set(false)
        });

        // Fetch coupons
        this.apiService.getCoupons(id).subscribe({
            next: (res: any) => {
                this.coupons.set(res.data || []);
            }
        });
    }

    // Helper method to get services array
    getServices(): string[] {
        const s = this.salon();
        if (!s || !s.services) return [];
        if (Array.isArray(s.services)) return s.services;
        try {
            return JSON.parse(s.services);
        } catch {
            return [];
        }
    }

    // Map service names to icons
    getServiceIcon(service: string): string {
        const serviceLower = service.toLowerCase();
        if (serviceLower.includes('hair') || serviceLower.includes('cut')) return 'scissors';
        if (serviceLower.includes('spa') || serviceLower.includes('massage')) return 'sparkles';
        if (serviceLower.includes('makeup') || serviceLower.includes('cosmetic')) return 'palette';
        if (serviceLower.includes('nail') || serviceLower.includes('manicure') || serviceLower.includes('pedicure')) return 'hand';
        if (serviceLower.includes('skin') || serviceLower.includes('facial')) return 'droplet';
        if (serviceLower.includes('wax')) return 'zap';
        if (serviceLower.includes('color') || serviceLower.includes('dye')) return 'paintbrush';
        return 'sparkles'; // default icon
    }

    // Get color class for service icon
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

    goBack() {
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

    addToCart(coupon: any) {
        if (!coupon || !this.salon()) return;
        this.cartService.addItem(coupon, this.salon());
    }

    openImagePreview(imageUrl: string) {
        if (!imageUrl) return;
        this.dialog.open(ImagePreviewDialogComponent, {
            data: { imageUrl },
            maxWidth: '95vw',
            maxHeight: '95vh',
            panelClass: 'image-preview-dialog-container',
            backdropClass: 'image-preview-backdrop'
        });
    }

    loadReviews(id: string) {
        this.apiService.getReviews(id).subscribe({
            next: (res: any) => {
                // API returns { data: { reviews: [], pagination: {...} } }
                this.reviews.set(res.data?.reviews || []);
            },
            error: () => this.reviews.set([])
        });
    }

    loadReviewStats(id: string) {
        this.apiService.getReviewStats(id).subscribe({
            next: (res: any) => {
                const data = res.data;
                if (!data) return;

                // Map snake_case response to the structure expected by the template
                this.reviewStats.set({
                    totalReviews: data.total_reviews,
                    averageRating: parseFloat(data.average_rating),
                    distribution: {
                        5: data.rating_distribution?.five_star?.count || 0,
                        4: data.rating_distribution?.four_star?.count || 0,
                        3: data.rating_distribution?.three_star?.count || 0,
                        2: data.rating_distribution?.two_star?.count || 0,
                        1: data.rating_distribution?.one_star?.count || 0
                    }
                });
            },
            error: () => this.reviewStats.set(null)
        });
    }

    checkUserReview() {
        this.apiService.getUserReviews().subscribe({
            next: (res: any) => {
                // Filter specifically for this salon's review
                const myReviews = res.data || [];
                const review = myReviews.find((r: any) => r.salon_id == this.salonId);
                if (review) {
                    this.userReview.set(review);
                    this.newReviewRating.set(review.rating);
                    this.newReviewComment.set(review.comment);
                }
            },
            error: () => {
                // User likely not logged in or no reviews
                this.userReview.set(null);
            }
        });
    }

    submitReview() {
        if (!this.newReviewRating() || !this.newReviewComment().trim()) return;

        if (!this.authService.isAuthenticated()) {
            this.dialog.open(LoginDialogComponent, {
                width: 'auto',
                maxWidth: '95vw',
                maxHeight: '95vh',
                panelClass: 'custom-dialog-container'
            }).afterClosed().subscribe(result => {
                if (result) {
                    this.submitReview();
                }
            });
            return;
        }

        this.isSubmittingReview.set(true);
        const data = {
            salon_id: this.salonId,
            rating: this.newReviewRating(),
            comment: this.newReviewComment()
        };

        if (this.userReview()) {
            // Update existing review
            this.apiService.updateReview(this.userReview().id, data).subscribe({
                next: (res: any) => {
                    this.isSubmittingReview.set(false);
                    this.showReviewForm.set(false);
                    this.loadReviews(this.salonId!);
                    this.loadReviewStats(this.salonId!);
                    this.checkUserReview();
                },
                error: () => this.isSubmittingReview.set(false)
            });
        } else {
            // Create new review
            this.apiService.createReview(data).subscribe({
                next: (res: any) => {
                    this.isSubmittingReview.set(false);
                    this.showReviewForm.set(false);
                    this.loadReviews(this.salonId!);
                    this.loadReviewStats(this.salonId!);
                    this.checkUserReview();
                },
                error: () => this.isSubmittingReview.set(false)
            });
        }
    }

    deleteReview() {
        if (!this.userReview()) return;

        if (confirm('Are you sure you want to delete your review?')) {
            this.apiService.deleteReview(this.userReview().id).subscribe({
                next: () => {
                    this.userReview.set(null);
                    this.newReviewRating.set(0);
                    this.newReviewComment.set('');
                    this.loadReviews(this.salonId!);
                    this.loadReviewStats(this.salonId!);
                }
            });
        }
    }

    toggleLike(review: any) {
        this.apiService.toggleLikeReview(review.id).subscribe({
            next: (res: any) => {
                // Update specific review in the list
                const currentReviews = this.reviews();
                const index = currentReviews.findIndex(r => r.id === review.id);
                if (index !== -1) {
                    // Optimistic update or reload could work, usually backend returns updated counts
                    // For now, let's just create a shallow clone and update stats if we had them
                    /* 
                    // Ideally we reload reviews or update locally from response
                    */
                    this.loadReviews(this.salonId!);
                }
            }
        });
    }

    setRating(rating: number) {
        this.newReviewRating.set(rating);
    }
}

