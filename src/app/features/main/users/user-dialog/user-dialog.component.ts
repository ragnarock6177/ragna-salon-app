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
        @Inject(MAT_DIALOG_DATA) public data: { index?: number },
        private userService: UserServiceService
    ) {
        this.isEditMode = data?.index !== undefined;

        // Initialize form
        this.userForm = this.fb.group({
            name: ['', [Validators.required, Validators.minLength(2)]],
            email: ['', [Validators.required, Validators.email]],
            role: ['Editor', Validators.required],
            active: ['Active' as 'Active' | 'Pending' | 'Inactive', Validators.required],
            last: ['just now']
        });

        // If edit mode, populate form with existing data
        if (this.isEditMode && data.index !== undefined) {
            const user = this.userService.get(data.index);
            if (user) {
                this.userForm.patchValue(user);
            }
        }
    }

    ngAfterViewInit(): void {

    }

    onSubmit(): void {
        if (this.userForm.valid) {
            const userData: User = this.userForm.value;

            if (this.isEditMode && this.data.index !== undefined) {
                this.userService.update(this.data.index, userData);
            } else {
                this.userService.add(userData);
            }

            this.dialogRef.close(userData);
        }
    }

    onCancel(): void {
        this.dialogRef.close();
    }
}
