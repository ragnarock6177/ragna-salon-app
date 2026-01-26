import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { LucideAngularModule } from 'lucide-angular';

@Component({
    selector: 'app-redemption-processing-dialog',
    standalone: true,
    imports: [CommonModule, MatDialogModule, LucideAngularModule],
    template: `
    <div class="bg-white dark:bg-zinc-900 rounded-3xl p-8 text-center max-w-sm mx-auto shadow-2xl border border-gray-100 dark:border-zinc-800">
      <div class="relative w-24 h-24 mx-auto mb-6">
        <!-- Spinning border -->
        <div class="absolute inset-0 rounded-full border-4 border-violet-100 dark:border-violet-900/30"></div>
        <div class="absolute inset-0 rounded-full border-4 border-violet-600 border-t-transparent animate-spin"></div>
        
        <!-- Icon in center -->
        <div class="absolute inset-0 flex items-center justify-center">
            <lucide-icon name="loader-2" class="w-8 h-8 text-violet-600 animate-pulse"></lucide-icon>
        </div>
      </div>

      <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-2">Verifying...</h3>
      <p class="text-slate-500 dark:text-slate-400">
        Please wait while we verify your coupon with the salon system.
      </p>
    </div>
  `,
    styles: [],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RedemptionProcessingDialogComponent { }
