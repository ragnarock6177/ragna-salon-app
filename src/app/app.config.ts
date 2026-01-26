import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { PreloadAllModules, provideRouter, TitleStrategy, withPreloading } from '@angular/router';
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
  Ban, Eye,
  MapPin, CheckCircle, EyeOff, ArrowLeft, Camera, Upload, Image, Download, QrCode, SearchX, ArrowRight, ChevronDown, Facebook, Instagram, Twitter, Youtube, Clock, Check,
  LogIn, UserPlus, Lock, Tag
} from 'lucide-angular';
import { routes } from './app.routes';
import { authInterceptor } from './core/auth/auth.interceptor';
import { SeoTitleStrategy } from './core/seo/seo-title-strategy';
import { MatSnackBarModule } from '@angular/material/snack-bar';

const usedIcons = {
  LayoutDashboard, Building2, Users, Store, Ticket, Crown,
  X, EllipsisVertical, LogOut, Plus, Funnel, Loader,
  Menu, Bell, Search, Pencil, Trash2, ImagePlus, Phone,
  Sun, Moon, TrendingUp, Cpu, Activity, Shield,
  User, Mail, Star, Sparkles, Ban, Eye, MapPin, CheckCircle, EyeOff, ArrowLeft, Camera, Upload, Image, Download, QrCode, SearchX, ArrowRight, ChevronDown, Facebook, Instagram, Twitter, Youtube, Clock, Check,
  LogIn, UserPlus, Lock, Tag
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(withInterceptors([authInterceptor])),
    importProvidersFrom(LucideAngularModule.pick(usedIcons), MatSnackBarModule),
    // SEO: Custom title strategy for consistent page titles
    { provide: TitleStrategy, useClass: SeoTitleStrategy },
    // Global Form Field Config
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' } }
  ]
};
