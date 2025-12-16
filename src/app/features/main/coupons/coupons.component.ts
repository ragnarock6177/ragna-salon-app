import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

interface Coupon {
  code: string;
  description: string;
  discount: number;
  expiryDate: string;
  active: boolean;
  usedCount: number;
  maxUses: number;
}

@Component({
  selector: 'app-coupons',
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './coupons.component.html',
  styleUrl: './coupons.component.scss',
})
export class CouponsComponent implements OnInit {
  coupons: Coupon[] = [
    {
      code: 'WELCOME20',
      description: 'New customer welcome discount',
      discount: 20,
      expiryDate: '2025-12-31',
      active: true,
      usedCount: 45,
      maxUses: 100
    },
    {
      code: 'SUMMER25',
      description: 'Summer special offer',
      discount: 25,
      expiryDate: '2025-08-31',
      active: true,
      usedCount: 23,
      maxUses: 50
    },
    {
      code: 'NEWYEAR30',
      description: 'New Year celebration discount',
      discount: 30,
      expiryDate: '2025-01-15',
      active: false,
      usedCount: 50,
      maxUses: 50
    },
    {
      code: 'WELCOME20',
      description: 'New customer welcome discount',
      discount: 20,
      expiryDate: '2025-12-31',
      active: true,
      usedCount: 45,
      maxUses: 100
    },
    {
      code: 'SUMMER25',
      description: 'Summer special offer',
      discount: 25,
      expiryDate: '2025-08-31',
      active: true,
      usedCount: 23,
      maxUses: 50
    },
    {
      code: 'NEWYEAR30',
      description: 'New Year celebration discount',
      discount: 30,
      expiryDate: '2025-01-15',
      active: false,
      usedCount: 50,
      maxUses: 50
    },
    {
      code: 'WELCOME20',
      description: 'New customer welcome discount',
      discount: 20,
      expiryDate: '2025-12-31',
      active: true,
      usedCount: 45,
      maxUses: 100
    },
    {
      code: 'SUMMER25',
      description: 'Summer special offer',
      discount: 25,
      expiryDate: '2025-08-31',
      active: true,
      usedCount: 23,
      maxUses: 50
    },
    {
      code: 'NEWYEAR30',
      description: 'New Year celebration discount',
      discount: 30,
      expiryDate: '2025-01-15',
      active: false,
      usedCount: 50,
      maxUses: 50
    },
    {
      code: 'WELCOME20',
      description: 'New customer welcome discount',
      discount: 20,
      expiryDate: '2025-12-31',
      active: true,
      usedCount: 45,
      maxUses: 100
    },
    {
      code: 'SUMMER25',
      description: 'Summer special offer',
      discount: 25,
      expiryDate: '2025-08-31',
      active: true,
      usedCount: 23,
      maxUses: 50
    },
    {
      code: 'NEWYEAR30',
      description: 'New Year celebration discount',
      discount: 30,
      expiryDate: '2025-01-15',
      active: false,
      usedCount: 50,
      maxUses: 50
    },
    {
      code: 'WELCOME20',
      description: 'New customer welcome discount',
      discount: 20,
      expiryDate: '2025-12-31',
      active: true,
      usedCount: 45,
      maxUses: 100
    },
    {
      code: 'SUMMER25',
      description: 'Summer special offer',
      discount: 25,
      expiryDate: '2025-08-31',
      active: true,
      usedCount: 23,
      maxUses: 50
    },
    {
      code: 'NEWYEAR30',
      description: 'New Year celebration discount',
      discount: 30,
      expiryDate: '2025-01-15',
      active: false,
      usedCount: 50,
      maxUses: 50
    },
    {
      code: 'WELCOME20',
      description: 'New customer welcome discount',
      discount: 20,
      expiryDate: '2025-12-31',
      active: true,
      usedCount: 45,
      maxUses: 100
    },
    {
      code: 'SUMMER25',
      description: 'Summer special offer',
      discount: 25,
      expiryDate: '2025-08-31',
      active: true,
      usedCount: 23,
      maxUses: 50
    },
    {
      code: 'NEWYEAR30',
      description: 'New Year celebration discount',
      discount: 30,
      expiryDate: '2025-01-15',
      active: false,
      usedCount: 50,
      maxUses: 50
    },
    {
      code: 'WELCOME20',
      description: 'New customer welcome discount',
      discount: 20,
      expiryDate: '2025-12-31',
      active: true,
      usedCount: 45,
      maxUses: 100
    },
    {
      code: 'SUMMER25',
      description: 'Summer special offer',
      discount: 25,
      expiryDate: '2025-08-31',
      active: true,
      usedCount: 23,
      maxUses: 50
    },
    {
      code: 'NEWYEAR30',
      description: 'New Year celebration discount',
      discount: 30,
      expiryDate: '2025-01-15',
      active: false,
      usedCount: 50,
      maxUses: 50
    }
  ];

  ngOnInit() {
  }
}
