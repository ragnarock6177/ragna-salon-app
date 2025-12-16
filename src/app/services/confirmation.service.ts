import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ConfirmationDialogComponent, ConfirmationDialogData } from '../shared/components/confirmation-dialog/confirmation-dialog.component';

@Injectable({
    providedIn: 'root'
})
export class ConfirmationService {

    constructor(private dialog: MatDialog) { }

    confirm(data: ConfirmationDialogData): Observable<boolean> {
        return this.dialog.open(ConfirmationDialogComponent, {
            data: data,
            width: '400px',
            panelClass: 'confirmation-dialog-container',
            autoFocus: false
        }).afterClosed();
    }
}
