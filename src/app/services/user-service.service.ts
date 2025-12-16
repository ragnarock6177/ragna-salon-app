import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { User } from '../shared/models/user';

@Injectable({
  providedIn: 'root',
})
export class UserServiceService {
  private _users: User[] = [
    { name: 'Alex Lee', email: 'alex.lee@example.com', role: 'Owner', active: 'Active', last: '2 minutes ago' },
    { name: 'Marina Stone', email: 'marina.stone@example.com', role: 'Editor', active: 'Pending', last: '47 minutes ago' },
    { name: 'Tom Keller', email: 'tom.keller@example.com', role: 'Viewer', active: 'Inactive', last: '2 hours ago' },
    { name: 'Sam Park', email: 'sam.park@example.com', role: 'Editor', active: 'Active', last: 'yesterday' },
    { name: 'Lina Rose', email: 'lina.rose@example.com', role: 'Viewer', active: 'Active', last: '3 days ago' },
    { name: 'Alex Lee', email: 'alex.lee@example.com', role: 'Owner', active: 'Active', last: '2 minutes ago' },
    { name: 'Marina Stone', email: 'marina.stone@example.com', role: 'Editor', active: 'Pending', last: '47 minutes ago' },
    { name: 'Tom Keller', email: 'tom.keller@example.com', role: 'Viewer', active: 'Inactive', last: '2 hours ago' },
    { name: 'Sam Park', email: 'sam.park@example.com', role: 'Editor', active: 'Active', last: 'yesterday' },
    { name: 'Lina Rose', email: 'lina.rose@example.com', role: 'Viewer', active: 'Active', last: '3 days ago' },
    { name: 'Alex Lee', email: 'alex.lee@example.com', role: 'Owner', active: 'Active', last: '2 minutes ago' },
    { name: 'Marina Stone', email: 'marina.stone@example.com', role: 'Editor', active: 'Pending', last: '47 minutes ago' },
    { name: 'Tom Keller', email: 'tom.keller@example.com', role: 'Viewer', active: 'Inactive', last: '2 hours ago' },
    { name: 'Sam Park', email: 'sam.park@example.com', role: 'Editor', active: 'Active', last: 'yesterday' },
    { name: 'Lina Rose', email: 'lina.rose@example.com', role: 'Viewer', active: 'Active', last: '3 days ago' },
    { name: 'Alex Lee', email: 'alex.lee@example.com', role: 'Owner', active: 'Active', last: '2 minutes ago' },
    { name: 'Marina Stone', email: 'marina.stone@example.com', role: 'Editor', active: 'Pending', last: '47 minutes ago' },
    { name: 'Tom Keller', email: 'tom.keller@example.com', role: 'Viewer', active: 'Inactive', last: '2 hours ago' },
    { name: 'Sam Park', email: 'sam.park@example.com', role: 'Editor', active: 'Active', last: 'yesterday' },
    { name: 'Lina Rose', email: 'lina.rose@example.com', role: 'Viewer', active: 'Active', last: '3 days ago' },
    { name: 'Alex Lee', email: 'alex.lee@example.com', role: 'Owner', active: 'Active', last: '2 minutes ago' },
    { name: 'Marina Stone', email: 'marina.stone@example.com', role: 'Editor', active: 'Pending', last: '47 minutes ago' },
    { name: 'Tom Keller', email: 'tom.keller@example.com', role: 'Viewer', active: 'Inactive', last: '2 hours ago' },
    { name: 'Sam Park', email: 'sam.park@example.com', role: 'Editor', active: 'Active', last: 'yesterday' },
    { name: 'Lina Rose', email: 'lina.rose@example.com', role: 'Viewer', active: 'Active', last: '3 days ago' },
    { name: 'Alex Lee', email: 'alex.lee@example.com', role: 'Owner', active: 'Active', last: '2 minutes ago' },
    { name: 'Marina Stone', email: 'marina.stone@example.com', role: 'Editor', active: 'Pending', last: '47 minutes ago' },
    { name: 'Tom Keller', email: 'tom.keller@example.com', role: 'Viewer', active: 'Inactive', last: '2 hours ago' },
    { name: 'Sam Park', email: 'sam.park@example.com', role: 'Editor', active: 'Active', last: 'yesterday' },
    { name: 'Lina Rose', email: 'lina.rose@example.com', role: 'Viewer', active: 'Active', last: '3 days ago' },
    { name: 'Alex Lee', email: 'alex.lee@example.com', role: 'Owner', active: 'Active', last: '2 minutes ago' },
    { name: 'Marina Stone', email: 'marina.stone@example.com', role: 'Editor', active: 'Pending', last: '47 minutes ago' },
    { name: 'Tom Keller', email: 'tom.keller@example.com', role: 'Viewer', active: 'Inactive', last: '2 hours ago' },
    { name: 'Sam Park', email: 'sam.park@example.com', role: 'Editor', active: 'Active', last: 'yesterday' },
    { name: 'Lina Rose', email: 'lina.rose@example.com', role: 'Viewer', active: 'Active', last: '3 days ago' },
    { name: 'Alex Lee', email: 'alex.lee@example.com', role: 'Owner', active: 'Active', last: '2 minutes ago' },
    { name: 'Marina Stone', email: 'marina.stone@example.com', role: 'Editor', active: 'Pending', last: '47 minutes ago' },
    { name: 'Tom Keller', email: 'tom.keller@example.com', role: 'Viewer', active: 'Inactive', last: '2 hours ago' },
    { name: 'Sam Park', email: 'sam.park@example.com', role: 'Editor', active: 'Active', last: 'yesterday' },
    { name: 'Lina Rose', email: 'lina.rose@example.com', role: 'Viewer', active: 'Active', last: '3 days ago' }
  ];


  onOpenModal = new Subject<any | null>();
  onConfirm = new Subject<any | null>();
  onConfirmAction: (() => void) | null = null;

  list() { return [...this._users]; }
  get(i: number) { return this._users[i]; }
  add(u: User) { this._users.unshift(u); }
  update(i: number, u: Partial<User>) { this._users[i] = { ...this._users[i], ...u }; }
  remove(i: number) { this._users.splice(i, 1); }
  toggleStatus(i: number) {
    const order = ['Active', 'Pending', 'Inactive'];
    const cur = this._users[i].active;
    const next = order[(order.indexOf(cur) + 1) % order.length];
    this._users[i].active = next as any;
  }

  openAdd() { this.onOpenModal.next({}); }
  openEdit(i: number) { this.onOpenModal.next({ index: i }); }
  closeModal() { this.onOpenModal.next(null); }

  requestDelete(i: number) {
    this.onConfirm.next({ text: `Delete user ${this._users[i].name}?`, action: () => this.remove(i) });
  }
}
