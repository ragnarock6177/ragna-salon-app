import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { LucideAngularModule, AlertTriangle, Info, HelpCircle } from 'lucide-angular';

export interface ConfirmationDialogData {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'warning' | 'info';
}

@Component({
    selector: 'app-confirmation-dialog',
    standalone: true,
    imports: [CommonModule, MatDialogModule, MatButtonModule, LucideAngularModule],
    templateUrl: './confirmation-dialog.component.html',
    styles: []
})
export class ConfirmationDialogComponent {
    readonly AlertTriangle = AlertTriangle;
    readonly Info = Info;
    readonly HelpCircle = HelpCircle;

    constructor(
        public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: ConfirmationDialogData
    ) {
        // Set defaults
        this.data.confirmText = this.data.confirmText || 'Confirm';
        this.data.cancelText = this.data.cancelText || 'Cancel';
        this.data.type = this.data.type || 'warning';
    }

    onConfirm(): void {
        this.dialogRef.close(true);
    }

    onCancel(): void {
        this.dialogRef.close(false);
    }
}
