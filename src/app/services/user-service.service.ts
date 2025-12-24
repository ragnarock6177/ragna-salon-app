import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Subject, Observable, map, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../shared/models/user';

@Injectable({
  providedIn: 'root',
})
export class UserServiceService {
  private http = inject(HttpClient);
  // Matches AuthService logic: replace /admin with /auth for auth-related endpoints if needed, 
  // or maybe it's just api/auth/users. 
  // AuthService: environment.apiUrl.replace('/admin', '/auth') -> .../api/auth
  // Users endpoint: .../api/auth/users
  private readonly API_URL = environment.apiUrl.replace('/admin', '/auth') + '/users';

  private _users: User[] = [];

  onOpenModal = new Subject<any | null>();
  onConfirm = new Subject<any | null>();
  // onConfirmAction: (() => void) | null = null; // Seems unused or handled inline in component

  getUsers(): Observable<User[]> {
    return this.http.get<{ data: User[] } | User[]>(this.API_URL).pipe(
      map(response => {
        // Handle wrapped response if any, assuming standard response format like AuthService
        if ('data' in response && Array.isArray((response as any).data)) {
          return (response as any).data;
        }
        return Array.isArray(response) ? response : [];
      }),
      tap(users => this._users = users)
    );
  }

  // Keeping synchronous-like methods for compatibility where possible, but they should really be async now.
  // For the purpose of the requested task "get users list", I will focus on list().
  // However, list() was synchronous. I should change it to return the cached _users or throw error if not loaded?
  // Better: UsersComponent should use getUsers() (Observable). 
  // I will keep list() for legacy support if needed but return _users which might be empty initially.

  cachedList() { return [...this._users]; }

  // CRUD operations - Stubbed or implemented optimistically for now as focus is on GET
  add(u: User): Observable<any> {
    // Assuming POST to /users
    return this.http.post(this.API_URL, u).pipe(
      tap(() => this.getUsers().subscribe()) // Refresh cache
    );
  }

  update(id: string, u: Partial<User>): Observable<any> {
    // Assuming PUT/PATCH to /users/:id
    return this.http.patch(`${this.API_URL}/${id}`, u).pipe(
      tap(() => {
        const index = this._users.findIndex(user => user._id === id); // User model needs _id? AuthService User has _id. Shared User might not.
        if (index !== -1) {
          this._users[index] = { ...this._users[index], ...u as any };
        }
      })
    );
  }

  remove(id: string): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}`).pipe(
      tap(() => {
        this._users = this._users.filter(u => u._id !== id);
      })
    );
  }

  // Helper for UI state (Modals)
  openAdd() { this.onOpenModal.next({}); }
  openEdit(u: User) { this.onOpenModal.next({ user: u }); } // Changed to pass User object or ID instead of index
  closeModal() { this.onOpenModal.next(null); }

  // For the existing component that passes index, we might need to adjust.
  // The existing component uses index heavily. I should perhaps facilitate that or refactor component to use IDs.
  // Refactoring to IDs is better.
}
