import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { ConfirmationService } from '../../../services/confirmation.service';
import { UserServiceService } from '../../../services/user-service.service';
import { User } from '../../../shared/models/user';
import { UserDialogComponent } from '../users/user-dialog/user-dialog.component';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-city',
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './city.component.html',
  styleUrl: './city.component.scss',
})
export class CityComponent {
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
    this.refreshUsers();

    // Subscribe to modal open events from user service
    this.modalSubscription = this.userSrv.onOpenModal.subscribe((data) => {
      if (data !== null) {
        this.openDialog(data);
      }
    });
  }

  refreshUsers() {
    this.loading = true;
    this.userSrv.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.loading = false;
        this.loadInitialUsers();
      },
      error: (err) => {
        console.error('Failed to load users', err);
        this.loading = false;
      }
    });
  }

  ngOnDestroy() {
    this.modalSubscription?.unsubscribe();
  }

  loadInitialUsers(): void {
    const filteredList = this.filtered;
    this.currentLoadedCount = Math.min(this.itemsPerLoad, filteredList.length);
    this.displayedUsers = filteredList.slice(0, this.currentLoadedCount);
  }

  loadMoreUsers(): void {
    if (this.currentLoadedCount >= this.filtered.length) {
      return;
    }

    const nextCount = Math.min(
      this.currentLoadedCount + this.itemsPerLoad,
      this.filtered.length
    );
    this.displayedUsers = this.filtered.slice(0, nextCount);
    this.currentLoadedCount = nextCount;
  }

  onScroll(event: any): void {
    const element = event.target;
    const atBottom = element.scrollHeight - element.scrollTop <= element.clientHeight + 50;

    if (atBottom) {
      this.loadMoreUsers();
    }
  }

  openDialog(data: { user?: User }): void {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '600px',
      maxWidth: '90vw',
      data: data,
      panelClass: 'custom-dialog-container',
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.refreshUsers();
      }
    });
  }


  get filtered() {
    let list = [...this.users];
    if (this.filter === 'active') list = list.filter(u => u.active === 'Active');
    if (this.search) {
      const kw = this.search.toLowerCase();
      list = list.filter(u => u.name.toLowerCase().includes(kw) || u.email.toLowerCase().includes(kw) || (u.role && u.role.toLowerCase().includes(kw)));
    }
    return list;
  }


  openAdd() {
    this.userSrv.openAdd();
  }


  edit(user: User) {
    if (user) {
      this.userSrv.openEdit(user);
    }
  }


  delete(user: User) {
    if (!user) return;
    this.confirmationService.confirm({
      title: 'Delete User',
      message: `Are you sure you want to delete ${user.name}? This action cannot be undone.`,
      confirmText: 'Delete',
      type: 'danger'
    }).subscribe(confirmed => {
      if (confirmed && user._id) {
        this.userSrv.remove(user._id).subscribe(() => {
          this.refreshUsers();
        });
      }
    });
  }


  toggleStatus(user: User) {
    if (!user || !user._id) return;

    const order = ['Active', 'Pending', 'Inactive'];
    const cur = user.active || 'Active'; // Default to Active
    const next = order[(order.indexOf(cur) + 1) % order.length];

    // Optimistic update
    const previousStatus = user.active;
    user.active = next as any;

    this.userSrv.update(user._id, { active: next as any }).subscribe({
      error: () => {
        // Revert on error
        user.active = previousStatus;
      }
    });
  }

  getOriginalIndex(displayedIndex: number): number {
    const user = this.displayedUsers[displayedIndex];
    return this.users.findIndex(u => u === user);
  }

  getName(u: any): any {
    return u.name.split(' ').map((n: any) => n[0]).slice(0, 2).join('').toUpperCase()
  }
}
