import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  template: `
    <footer class="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 pt-10 md:pt-16 pb-6 md:pb-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-12 mb-8 md:mb-12">
          <!-- Brand -->
          <div class="col-span-2 md:col-span-2 lg:col-span-1 text-center md:text-left">
            <div class="flex items-center justify-center md:justify-start gap-2 mb-4 md:mb-6">
               <div class="bg-primary-600 p-1.5 md:p-2 rounded-lg">
                 <lucide-icon name="sparkles" class="w-5 h-5 md:w-6 md:h-6 text-white"></lucide-icon>
               </div>
               <span class="text-lg md:text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-primary-600 to-primary-400 dark:from-primary-400 dark:to-primary-200">
                 Ragna Salons
               </span>
            </div>
            <p class="text-slate-500 dark:text-slate-400 mb-4 md:mb-6 leading-relaxed text-sm md:text-base max-w-xs mx-auto md:mx-0">
              Discover the best salons and spas in your city. Book appointments, get exclusive offers, and look your best.
            </p>
            <div class="flex gap-3 md:gap-4 justify-center md:justify-start">
              <a href="#" aria-label="Instagram" class="w-9 h-9 md:w-10 md:h-10 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-500 hover:bg-primary-100 hover:text-primary-600 dark:hover:bg-primary-900/30 dark:hover:text-primary-400 transition-colors">
                <lucide-icon name="instagram" class="w-4 h-4 md:w-5 md:h-5"></lucide-icon>
              </a>
              <a href="#" aria-label="Twitter" class="w-9 h-9 md:w-10 md:h-10 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-500 hover:bg-primary-100 hover:text-primary-600 dark:hover:bg-primary-900/30 dark:hover:text-primary-400 transition-colors">
                <lucide-icon name="twitter" class="w-4 h-4 md:w-5 md:h-5"></lucide-icon>
              </a>
              <a href="#" aria-label="Facebook" class="w-9 h-9 md:w-10 md:h-10 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-500 hover:bg-primary-100 hover:text-primary-600 dark:hover:bg-primary-900/30 dark:hover:text-primary-400 transition-colors">
                <lucide-icon name="facebook" class="w-4 h-4 md:w-5 md:h-5"></lucide-icon>
              </a>
            </div>
          </div>

          <!-- Quick Links -->
          <div>
            <h3 class="text-slate-900 dark:text-white font-bold mb-3 md:mb-6 text-sm md:text-base">Quick Links</h3>
            <ul class="space-y-2 md:space-y-4">
              <li><a routerLink="/" class="text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors text-sm md:text-base">Home</a></li>
              <li><a href="#" class="text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors text-sm md:text-base">About Us</a></li>
              <li><a href="#" class="text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors text-sm md:text-base">Salons</a></li>
              <li><a href="#" class="text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors text-sm md:text-base">Blog</a></li>
            </ul>
          </div>

          <!-- Support -->
          <div>
            <h3 class="text-slate-900 dark:text-white font-bold mb-3 md:mb-6 text-sm md:text-base">Support</h3>
            <ul class="space-y-2 md:space-y-4">
              <li><a href="#" class="text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors text-sm md:text-base">Help Center</a></li>
              <li><a href="#" class="text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors text-sm md:text-base">Terms</a></li>
              <li><a href="#" class="text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors text-sm md:text-base">Privacy</a></li>
              <li><a href="#" class="text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors text-sm md:text-base">Contact</a></li>
            </ul>
          </div>

          <!-- Newsletter -->
          <div class="col-span-2 md:col-span-1">
            <h3 class="text-slate-900 dark:text-white font-bold mb-3 md:mb-6 text-sm md:text-base">Stay Updated</h3>
            <p class="text-slate-500 dark:text-slate-400 mb-3 md:mb-4 text-sm md:text-base">Subscribe for the latest updates and offers.</p>
            <div class="flex gap-2">
              <input type="email" placeholder="Enter your email" class="flex-1 min-w-0 px-3 md:px-4 py-2 text-sm md:text-base rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-900 dark:text-white placeholder:text-slate-400">
              <button aria-label="Subscribe" class="bg-primary-600 hover:bg-primary-700 text-white p-2 rounded-lg transition-colors shrink-0">
                <lucide-icon name="arrow-right" class="w-4 h-4 md:w-5 md:h-5"></lucide-icon>
              </button>
            </div>
          </div>
        </div>

        <div class="border-t border-slate-200 dark:border-slate-800 pt-6 md:pt-8 flex flex-col md:flex-row justify-between items-center gap-3 md:gap-4">
          <p class="text-slate-500 dark:text-slate-400 text-xs md:text-sm text-center md:text-left">
            © 2024 Ragna Salons. All rights reserved.
          </p>
          <div class="flex gap-4 md:gap-6 text-xs md:text-sm text-slate-500 dark:text-slate-400">
            <a href="#" class="hover:text-slate-900 dark:hover:text-white transition-colors">Privacy</a>
            <a href="#" class="hover:text-slate-900 dark:hover:text-white transition-colors">Terms</a>
            <a href="#" class="hover:text-slate-900 dark:hover:text-white transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent { }
