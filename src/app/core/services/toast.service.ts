import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
    id: number;
    message: string;
    type: ToastType;
    duration: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
    private _toasts = signal<Toast[]>([]);
    readonly toasts = this._toasts.asReadonly();

    private nextId = 0;

    show(message: string, type: ToastType = 'info', duration = 3500) {
        const id = ++this.nextId;
        this._toasts.update(list => [...list, { id, message, type, duration }]);

        setTimeout(() => this.dismiss(id), duration);
    }

    success(message: string, duration = 3500) {
        this.show(message, 'success', duration);
    }

    error(message: string, duration = 4000) {
        this.show(message, 'error', duration);
    }

    warning(message: string, duration = 3500) {
        this.show(message, 'warning', duration);
    }

    info(message: string, duration = 3500) {
        this.show(message, 'info', duration);
    }

    dismiss(id: number) {
        this._toasts.update(list => list.filter(t => t.id !== id));
    }
}
