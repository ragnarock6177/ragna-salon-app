import { Component, inject, ChangeDetectionStrategy, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { Coupon } from '../../../../../shared/models/coupon';

export interface CouponDialogData {
    coupon?: Coupon; // If provided, dialog is in edit mode
}

@Component({
    selector: 'app-coupon-dialog',
    standalone: true,
    providers: [provideNativeDateAdapter()],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatSelectModule,
        MatDatepickerModule
    ],
    templateUrl: './coupon-dialog.component.html',
    styles: [`
    mat-form-field {
      width: 100%;
    }
  `],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CouponDialogComponent {
    private fb = inject(FormBuilder);
    private dialogRef = inject(MatDialogRef<CouponDialogComponent>);

    isEditMode = false;

    form: FormGroup;

    constructor(@Inject(MAT_DIALOG_DATA) public data: CouponDialogData | null) {
        this.isEditMode = !!(data?.coupon);
        const coupon = data?.coupon;

        this.form = this.fb.group({
            code: [coupon?.code || '', Validators.required],
            description: [coupon?.description || ''],
            discount: [coupon?.discount ?? null, [Validators.required, Validators.min(0)]],
            max_usage: [coupon?.max_usage ?? null],
            valid_from: [coupon?.valid_from ? new Date(coupon.valid_from) : '', Validators.required],
            valid_to: [coupon?.valid_to ? new Date(coupon.valid_to) : '', Validators.required],
            status: [coupon ? coupon.status : 'active', Validators.required]
        });
    }

    save() {
        if (this.form.valid) {
            this.dialogRef.close(this.form.value);
        }
    }

    close() {
        this.dialogRef.close();
    }
}
