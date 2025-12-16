import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    private isDarkMode = new BehaviorSubject<boolean>(false);
    public theme$: Observable<boolean> = this.isDarkMode.asObservable();

    toggleTheme(): void {
        const newTheme = !this.isDarkMode.value;
        this.isDarkMode.next(newTheme);
        this.applyTheme(newTheme);
        this.saveTheme(newTheme);
    }

    setTheme(isDark: boolean): void {
        this.isDarkMode.next(isDark);
        this.applyTheme(isDark);
        this.saveTheme(isDark);
    }

    getCurrentTheme(): boolean {
        return this.isDarkMode.value;
    }

    private saveTheme(isDark: boolean): void {
        if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        }
    }

    private applyTheme(isDark: boolean): void {
        if (typeof document !== 'undefined') {
            if (isDark) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        }
    }
}
