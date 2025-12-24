import { Component, Inject, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { UserServiceService } from '../../../../services/user-service.service';
import { User } from '../../../../shared/models/user';
import { LucideAngularModule } from 'lucide-angular';

@Component({
    selector: 'app-user-dialog',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        LucideAngularModule
    ],
    templateUrl: './user-dialog.component.html',
    styleUrl: './user-dialog.component.scss',
})
export class UserDialogComponent implements AfterViewInit {
    userForm: FormGroup;
    isEditMode: boolean = false;

    roles = ['Owner', 'Editor', 'Viewer', 'Admin'];
    statuses: Array<'Active' | 'Pending' | 'Inactive'> = ['Active', 'Pending', 'Inactive'];

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<UserDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { user?: User },
        private userService: UserServiceService
    ) {
        this.isEditMode = !!data?.user;

        // Initialize form
        this.userForm = this.fb.group({
            name: ['', [Validators.required, Validators.minLength(2)]],
            email: ['', [Validators.required, Validators.email]],
            role: ['Editor', Validators.required],
            active: ['Active' as 'Active' | 'Pending' | 'Inactive', Validators.required],
            last: ['just now']
        });

        // If edit mode, populate form with existing data
        if (this.isEditMode && data.user) {
            this.userForm.patchValue(data.user);
        }
    }

    ngAfterViewInit(): void {

    }

    onSubmit(): void {
        if (this.userForm.valid) {
            const userData: User = this.userForm.value;

            if (this.isEditMode && this.data.user && this.data.user._id) {
                this.userService.update(this.data.user._id, userData).subscribe({
                    next: () => this.dialogRef.close(userData),
                    error: (err) => console.error('Update failed', err)
                });
            } else {
                this.userService.add(userData).subscribe({
                    next: () => this.dialogRef.close(userData),
                    error: (err) => console.error('Add failed', err)
                });
            }
        }
    }

    onCancel(): void {
        this.dialogRef.close();
    }
}
