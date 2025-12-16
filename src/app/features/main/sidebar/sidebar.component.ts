import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarService } from '../../../services/sidebar.service';
import { Subscription } from 'rxjs';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-sidebar',
  imports: [RouterModule, CommonModule, LucideAngularModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements OnInit, OnDestroy {
  isOpen = false;
  private subscription?: Subscription;

  constructor(private sidebarService: SidebarService) { }

  ngOnInit(): void {
    this.subscription = this.sidebarService.sidebarOpen$.subscribe(
      isOpen => this.isOpen = isOpen
    );
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  closeSidebar(): void {
    this.sidebarService.closeSidebar();
  }
}
