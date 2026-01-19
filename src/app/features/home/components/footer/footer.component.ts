import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  template: `
    <footer class="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 pt-16 pb-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <!-- Brand -->
          <div>
            <div class="flex items-center gap-2 mb-6">
               <div class="bg-violet-600 p-2 rounded-lg">
                 <lucide-icon name="sparkles" class="w-6 h-6 text-white"></lucide-icon>
               </div>
               <span class="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400">
                 Ragna Salons
               </span>
            </div>
            <p class="text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
              Discover the best salons and spas in your city. Book appointments, get exclusive offers, and look your best.
            </p>
            <div class="flex gap-4">
              <a href="#" aria-label="Instagram" class="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-500 hover:bg-violet-100 hover:text-violet-600 dark:hover:bg-violet-900/30 dark:hover:text-violet-400 transition-colors">
                <lucide-icon name="instagram" class="w-5 h-5"></lucide-icon>
              </a>
              <a href="#" aria-label="Twitter" class="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-500 hover:bg-violet-100 hover:text-violet-600 dark:hover:bg-violet-900/30 dark:hover:text-violet-400 transition-colors">
                <lucide-icon name="twitter" class="w-5 h-5"></lucide-icon>
              </a>
              <a href="#" aria-label="Facebook" class="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-500 hover:bg-violet-100 hover:text-violet-600 dark:hover:bg-violet-900/30 dark:hover:text-violet-400 transition-colors">
                <lucide-icon name="facebook" class="w-5 h-5"></lucide-icon>
              </a>
            </div>
          </div>

          <!-- Quick Links -->
          <div>
            <h3 class="text-slate-900 dark:text-white font-bold mb-6">Quick Links</h3>
            <ul class="space-y-4">
              <li><a routerLink="/" class="text-slate-500 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">Home</a></li>
              <li><a href="#" class="text-slate-500 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">About Us</a></li>
              <li><a href="#" class="text-slate-500 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">Salons</a></li>
              <li><a href="#" class="text-slate-500 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">Blog</a></li>
            </ul>
          </div>

          <!-- Support -->
          <div>
            <h3 class="text-slate-900 dark:text-white font-bold mb-6">Support</h3>
            <ul class="space-y-4">
              <li><a href="#" class="text-slate-500 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">Help Center</a></li>
              <li><a href="#" class="text-slate-500 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">Terms of Service</a></li>
              <li><a href="#" class="text-slate-500 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" class="text-slate-500 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">Contact Us</a></li>
            </ul>
          </div>

          <!-- Newsletter -->
          <div>
            <h3 class="text-slate-900 dark:text-white font-bold mb-6">Stay Updated</h3>
            <p class="text-slate-500 dark:text-slate-400 mb-4">Subscribe to our newsletter for the latest updates and offers.</p>
            <div class="flex gap-2">
              <input type="email" placeholder="Enter your email" class="flex-1 px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-900 dark:text-white">
              <button aria-label="Subscribe" class="bg-violet-600 hover:bg-violet-700 text-white p-2 rounded-lg transition-colors">
                <lucide-icon name="arrow-right" class="w-5 h-5"></lucide-icon>
              </button>
            </div>
          </div>
        </div>

        <div class="border-t border-slate-200 dark:border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p class="text-slate-500 dark:text-slate-400 text-sm">
            © 2024 Ragna Salons. All rights reserved.
          </p>
          <div class="flex gap-6 text-sm text-slate-500 dark:text-slate-400">
            <a href="#" class="hover:text-slate-900 dark:hover:text-white transition-colors">Privacy</a>
            <a href="#" class="hover:text-slate-900 dark:hover:text-white transition-colors">Terms</a>
            <a href="#" class="hover:text-slate-900 dark:hover:text-white transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent { }
