import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from '../../../shared/models/user';
import { UserServiceService } from '../../../services/user-service.service';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { UserDialogComponent } from './user-dialog/user-dialog.component';
import { Subscription } from 'rxjs';
import { LucideAngularModule } from 'lucide-angular';
import { ConfirmationService } from '../../../services/confirmation.service';

@Component({
  selector: 'app-users',
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})


export class UsersComponent implements OnInit, OnDestroy {
  users: User[] = [];
  displayedUsers: User[] = [];
  filter: 'all' | 'active' = 'all';
  search = '';
  loading = false;

  private itemsPerLoad = 10;
  private currentLoadedCount = 0;
  private modalSubscription?: Subscription;


  constructor(
    private userSrv: UserServiceService,
    private dialog: MatDialog,
    private confirmationService: ConfirmationService
  ) { }


  ngOnInit() {
    this.users = this.userSrv.list();
    this.loadInitialUsers();

    // Subscribe to modal open events from user service
    this.modalSubscription = this.userSrv.onOpenModal.subscribe((data) => {
      if (data !== null) {
        this.openDialog(data);
      }
    });
  }

  ngOnDestroy() {
    this.modalSubscription?.unsubscribe();
  }

  loadInitialUsers(): void {
    this.currentLoadedCount = Math.min(this.itemsPerLoad, this.filtered.length);
    this.displayedUsers = this.filtered.slice(0, this.currentLoadedCount);
  }

  loadMoreUsers(): void {
    if (this.loading || this.currentLoadedCount >= this.filtered.length) {
      return;
    }

    this.loading = true;

    // Simulate loading delay
    setTimeout(() => {
      const nextCount = Math.min(
        this.currentLoadedCount + this.itemsPerLoad,
        this.filtered.length
      );
      this.displayedUsers = this.filtered.slice(0, nextCount);
      this.currentLoadedCount = nextCount;
      this.loading = false;
    }, 300);
  }

  onScroll(event: any): void {
    const element = event.target;
    const atBottom = element.scrollHeight - element.scrollTop <= element.clientHeight + 50;

    if (atBottom) {
      this.loadMoreUsers();
    }
  }

  openDialog(data: { index?: number }): void {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '600px',
      maxWidth: '90vw',
      data: data,
      panelClass: 'custom-dialog-container',
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Refresh users list and reload
        this.users = this.userSrv.list();
        this.loadInitialUsers();
      }
    });
  }


  get filtered() {
    let list = [...this.users];
    if (this.filter === 'active') list = list.filter(u => u.active === 'Active');
    if (this.search) {
      const kw = this.search.toLowerCase();
      list = list.filter(u => u.name.toLowerCase().includes(kw) || u.email.toLowerCase().includes(kw) || u.role.toLowerCase().includes(kw));
    }
    return list;
  }


  openAdd() {
    this.userSrv.openAdd();
  }


  edit(idx: number) {
    this.userSrv.openEdit(idx);
  }


  delete(idx: number) {
    const user = this.users[idx];
    this.confirmationService.confirm({
      title: 'Delete User',
      message: `Are you sure you want to delete ${user.name}? This action cannot be undone.`,
      confirmText: 'Delete',
      type: 'danger'
    }).subscribe(confirmed => {
      if (confirmed) {
        this.userSrv.remove(idx);
        this.users = this.userSrv.list();
        this.loadInitialUsers();
      }
    });
  }


  toggleStatus(idx: number) {
    this.userSrv.toggleStatus(idx);
    // Refresh displayed users to reflect status change
    this.displayedUsers = this.filtered.slice(0, this.currentLoadedCount);
  }

  getOriginalIndex(displayedIndex: number): number {
    const user = this.displayedUsers[displayedIndex];
    return this.users.findIndex(u => u === user);
  }

  getName(u: any): any {
    return u.name.split(' ').map((n: any) => n[0]).slice(0, 2).join('').toUpperCase()
  }

}
