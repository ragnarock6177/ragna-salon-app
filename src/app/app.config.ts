import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { PreloadAllModules, provideRouter, withPreloading } from '@angular/router';
import {
  LucideAngularModule,
  // Sidebar navigation icons
  LayoutDashboard, Building2, Users, Store, Ticket, Crown,
  // UI action icons
  X, EllipsisVertical, LogOut, Plus, Funnel, Loader,
  Menu, Bell, Search, Pencil, Trash2, ImagePlus, Phone,
  // Theme icons
  Sun, Moon,
  // Stats icons
  TrendingUp, Cpu, Activity, Shield,
  // User/form icons
  User, Mail, Star, Sparkles,
  Ban, Eye
} from 'lucide-angular';
import { routes } from './app.routes';
import { authInterceptor } from './core/auth/auth.interceptor';

const usedIcons = {
  LayoutDashboard, Building2, Users, Store, Ticket, Crown,
  X, EllipsisVertical, LogOut, Plus, Funnel, Loader,
  Menu, Bell, Search, Pencil, Trash2, ImagePlus, Phone,
  Sun, Moon, TrendingUp, Cpu, Activity, Shield,
  User, Mail, Star, Sparkles, Ban, Eye
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(withInterceptors([authInterceptor])),
    importProvidersFrom(LucideAngularModule.pick(usedIcons))
  ]
};
