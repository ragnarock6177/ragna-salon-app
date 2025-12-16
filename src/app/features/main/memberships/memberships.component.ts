import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

interface MembershipPlan {
  name: string;
  description: string;
  price: number;
  duration: string;
  icon: string;
  benefits: string[];
  activeMembers: number;
}

@Component({
  selector: 'app-memberships',
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './memberships.component.html',
  styleUrl: './memberships.component.scss',
})
export class MembershipsComponent implements OnInit {
  plans: MembershipPlan[] = [
    {
      name: 'Basic',
      description: 'Perfect for occasional visits',
      price: 999,
      duration: 'month',
      icon: 'sparkles',
      benefits: [
        '2 haircuts per month',
        '10% discount on products',
        'Basic hair wash included',
        'Email support'
      ],
      activeMembers: 45
    },
    {
      name: 'Standard',
      description: 'Most popular choice',
      price: 1999,
      duration: 'month',
      icon: 'star',
      benefits: [
        '4 haircuts per month',
        '20% discount on products',
        'Hair wash & conditioning',
        'Free beard trim',
        'Priority booking',
        'Phone support'
      ],
      activeMembers: 128
    },
    {
      name: 'Premium',
      description: 'Ultimate salon experience',
      price: 3999,
      duration: 'month',
      icon: 'crown',
      benefits: [
        'Unlimited haircuts',
        '30% discount on products',
        'Premium hair treatments',
        'Free styling sessions',
        'Complimentary head massage',
        'Priority 24/7 support',
        'Exclusive member events'
      ],
      activeMembers: 67
    }
  ];

  ngOnInit() {
  }
}
