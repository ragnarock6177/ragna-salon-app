import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService, User } from '../../../core/auth/auth.service';
import { LucideAngularModule } from 'lucide-angular';
import { computed } from '@angular/core';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent {
  authService = inject(AuthService);
  user = computed(() => this.authService.currentUser() as User | null);

  // Mock bookings
  bookings = [
    {
      id: 'BK-7829',
      salonName: 'Lux Salon & Spa',
      service: 'Haircut & Styling',
      date: new Date('2024-03-15'),
      status: 'Upcoming',
      price: 45
    },
    {
      id: 'BK-1102',
      salonName: 'Urban Oasis',
      service: 'Facial Treatment',
      date: new Date('2024-02-20'),
      status: 'Completed',
      price: 80
    }
  ];
}
