import { Component, Inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { LucideAngularModule, Check } from 'lucide-angular';

@Component({
    selector: 'app-redemption-success-dialog',
    standalone: true,
    imports: [CommonModule, MatDialogModule, LucideAngularModule],
    template: `
    <div class="relative bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden max-w-sm w-full mx-auto shadow-2xl p-8 text-center">
      <!-- Confetti Background (Simulated with simple dots for now, or CSS animation) -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
         <div class="absolute top-10 left-10 w-2 h-2 rounded-full bg-green-400 animate-ping"></div>
         <div class="absolute top-20 right-20 w-3 h-3 rounded-full bg-emerald-300 animate-pulse"></div>
         <div class="absolute bottom-10 left-1/2 w-2 h-2 rounded-full bg-violet-400 animate-bounce"></div>
      </div>

      <!-- Icon -->
      <div class="relative mb-6">
        <div class="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto animate-scale-in">
             <div class="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <lucide-icon [name]="'check'" class="w-8 h-8 text-white stroke-[3]"></lucide-icon>
             </div>
        </div>
      </div>

      <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-2">Redemption Successful!</h2>
      <p class="text-slate-500 dark:text-slate-400 mb-6">
        Your coupon has been successfully redeemed at <br>
        <span class="font-semibold text-slate-900 dark:text-gray-200">{{ data.salonName }}</span>
      </p>

      <div class="bg-gray-50 dark:bg-zinc-800/50 rounded-xl p-4 mb-6 border border-gray-100 dark:border-zinc-800">
        <p class="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">Transaction ID</p>
        <p class="font-mono text-slate-700 dark:text-slate-300">{{ data.transactionId || 'N/A' }}</p>
      </div>

      <button (click)="close()" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 rounded-xl transition-transform active:scale-95 shadow-lg shadow-emerald-600/20">
        Done
      </button>
    </div>
  `,
    styles: [`
    @keyframes scale-in {
      0% { transform: scale(0); opacity: 0; }
      100% { transform: scale(1); opacity: 1; }
    }
    .animate-scale-in {
      animation: scale-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
    }
  `],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RedemptionSuccessDialogComponent {
    constructor(
        public dialogRef: MatDialogRef<RedemptionSuccessDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { salonName: string, transactionId?: string }
    ) { }

    close() {
        this.dialogRef.close();
    }
}
