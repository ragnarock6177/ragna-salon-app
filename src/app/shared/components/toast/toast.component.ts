import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from '../../../core/services/toast.service';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!--
      Mobile  : full-width strip pinned to the bottom, centered
      Desktop : floating panel pinned to bottom-right
    -->
    <div
      class="
        fixed z-9999 flex flex-col gap-2 pointer-events-none
        bottom-0 left-0 right-0 px-3 pb-4 pt-2
        sm:bottom-5 sm:right-5 sm:left-auto sm:px-0 sm:pb-0 sm:pt-0 sm:w-auto
      "
      aria-live="polite"
      aria-atomic="false"
    >
      @for (toast of toastService.toasts(); track toast.id) {
        <div
          class="
            pointer-events-auto flex items-center gap-3
            w-full sm:min-w-[300px] sm:max-w-[380px]
            pl-3 pr-3 py-3 rounded-lg shadow-lg border
            backdrop-blur-sm animate-toast-in
          "
          [class]="getToastClasses(toast)"
          [style.--toast-accent]="getAccentColor(toast)"
          role="alert"
        >
          <!-- Icon -->
          <div class="shrink-0">
            <div
              class="w-8 h-8 rounded-full flex items-center justify-center"
              [class]="getIconBgClass(toast)"
            >
              <lucide-icon [name]="getIcon(toast)" [size]="15" class="text-white"></lucide-icon>
            </div>
          </div>

          <!-- Message -->
          <p
            class="flex-1 text-sm font-medium leading-snug"
            [class]="getTextClass(toast)"
          >
            {{ toast.message }}
          </p>

          <!-- Dismiss -->
          <button
            (click)="toastService.dismiss(toast.id)"
            class="shrink-0 p-1.5 rounded-md opacity-50 hover:opacity-100 transition-opacity touch-manipulation"
            [class]="getDismissClass(toast)"
            aria-label="Dismiss notification"
          >
            <lucide-icon name="x" [size]="13"></lucide-icon>
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    @keyframes toast-in {
      from {
        opacity: 0;
        transform: translateY(12px) scale(0.97);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    /* On sm+ screens slide in from the right */
    @media (min-width: 640px) {
      @keyframes toast-in {
        from {
          opacity: 0;
          transform: translateX(100%) scale(0.95);
        }
        to {
          opacity: 1;
          transform: translateX(0) scale(1);
        }
      }
    }

    .animate-toast-in {
      animation: toast-in 0.28s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
    }
  `]
})
export class ToastComponent {
  toastService = inject(ToastService);

  getToastClasses(toast: Toast): string {
    return 'bg-white/97 dark:bg-slate-900/97 border-slate-200/80 dark:border-slate-700/80';
  }

  getAccentColor(toast: Toast): string {
    const map: Record<Toast['type'], string> = {
      success: '#10b981',
      error: '#f43f5e',
      warning: '#f59e0b',
      info: '#0ea5e9',
    };
    return map[toast.type];
  }

  getIconBgClass(toast: Toast): string {
    const map: Record<Toast['type'], string> = {
      success: 'bg-emerald-500',
      error: 'bg-rose-500',
      warning: 'bg-amber-500',
      info: 'bg-sky-500',
    };
    return map[toast.type];
  }

  getTextClass(toast: Toast): string {
    const map: Record<Toast['type'], string> = {
      success: 'text-emerald-900 dark:text-emerald-100',
      error: 'text-rose-900 dark:text-rose-100',
      warning: 'text-amber-900 dark:text-amber-100',
      info: 'text-sky-900 dark:text-sky-100',
    };
    return map[toast.type];
  }

  getDismissClass(toast: Toast): string {
    const map: Record<Toast['type'], string> = {
      success: 'text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/40',
      error: 'text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/40',
      warning: 'text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/40',
      info: 'text-sky-600 dark:text-sky-400 hover:bg-sky-100 dark:hover:bg-sky-900/40',
    };
    return map[toast.type];
  }

  getIcon(toast: Toast): string {
    const map: Record<Toast['type'], string> = {
      success: 'check',
      error: 'x',
      warning: 'alert-circle',
      info: 'info',
    };
    return map[toast.type];
  }
}
